import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "../../../../lib/db";
import { registerSchema } from "../../../../lib/validators";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Dados inválidos." }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ message: "Email já cadastrado." }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  await prisma.user.create({
    data: { email, passwordHash }
  });

  return NextResponse.json({ ok: true });
}
