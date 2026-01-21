import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, isStaticAdmin } from "../../../lib/auth";
import { prisma } from "../../../lib/db";
import { analysisSchema } from "../../../lib/validators";
import { ANALYSIS_COST, consumeReserved, refundReserved, reserveCredits } from "../../../lib/credits";
import { rateLimit } from "../../../lib/rateLimit";
import { openai } from "../../../lib/openai";

function buildPrompt(input: {
  teamA: string;
  teamB: string;
  competition: string;
  matchDate?: string;
}) {
  return `Você é um analista esportivo responsável. Compare ${input.teamA} e ${input.teamB} no campeonato ${input.competition}.

Regras:
- Não invente fatos. Use linguagem condicional e ressalvas.
- Informe confiança de 0 a 100.
- Sugira mercados com risco (baixo, médio, alto).
- Inclua aviso de responsabilidade.

Retorne JSON com campos: confianca_0_100, pros, contras, mercados_sugeridos (lista de {mercado, risco}), aviso.
Depois, gere um texto humano resumindo.`;
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
  }

  const limiter = rateLimit(session.user.id, 5, 60_000);
  if (!limiter.ok) {
    return NextResponse.json({ message: "Muitas requisições. Aguarde." }, { status: 429 });
  }

  const body = await request.json();
  const parsed = analysisSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Dados inválidos" }, { status: 400 });
  }

  const isAdmin = isStaticAdmin(session.user.email);
  let reservedId: string | null = null;

  if (!isAdmin) {
    const reservation = await reserveCredits(session.user.id, ANALYSIS_COST);
    if (!reservation.ok) {
      return NextResponse.json({ message: "Créditos insuficientes" }, { status: 402 });
    }
    reservedId = reservation.transaction.id;
  }

  if (!process.env.OPENAI_API_KEY) {
    if (reservedId) {
      await refundReserved(reservedId);
    }
    return NextResponse.json({ message: "OpenAI não configurado." }, { status: 500 });
  }

  try {
    const prompt = buildPrompt(parsed.data);
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Responda em PT-BR." },
        { role: "user", content: prompt }
      ],
      temperature: 0.4
    });

    const content = completion.choices[0]?.message?.content || "";
    const [jsonPart, ...textPart] = content.split("\n\n");
    let resultJson: Record<string, unknown> = {};
    let resultText = content;

    try {
      resultJson = JSON.parse(jsonPart);
      resultText = textPart.join("\n\n").trim() || content;
    } catch {
      resultJson = { aviso: "Resposta fora do formato esperado." };
      resultText = content;
    }

    const analysis = await prisma.analysis.create({
      data: {
        userId: session.user.id,
        teamA: parsed.data.teamA,
        teamB: parsed.data.teamB,
        competition: parsed.data.competition,
        matchDate: parsed.data.matchDate ? new Date(parsed.data.matchDate) : null,
        prompt,
        resultJson,
        resultText,
        costCredits: isAdmin ? 0 : ANALYSIS_COST
      }
    });

    if (reservedId) {
      await consumeReserved(reservedId);
    }

    return NextResponse.json({ id: analysis.id });
  } catch (error) {
    if (reservedId) {
      await refundReserved(reservedId);
    }
    return NextResponse.json({ message: "Falha na análise." }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
  }

  const analyses = await prisma.analysis.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 10
  });

  return NextResponse.json({ analyses });
}
