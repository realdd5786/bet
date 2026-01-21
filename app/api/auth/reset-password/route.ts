import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { prisma } from "../../../../lib/db";
import { resetPasswordSchema } from "../../../../lib/validators";

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = resetPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Dados inválidos." }, { status: 400 });
  }

  const tokenHash = hashToken(parsed.data.token);
  const user = await prisma.user.findFirst({
    where: {
      resetPasswordTokenHash: tokenHash,
      resetPasswordExpiresAt: { gt: new Date() }
    }
  });

  if (!user) {
    return NextResponse.json({ message: "Token inválido." }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      resetPasswordTokenHash: null,
      resetPasswordExpiresAt: null
    }
  });

  return NextResponse.json({ ok: true });
}
