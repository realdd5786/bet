import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "../../../../lib/db";
import { forgotPasswordSchema } from "../../../../lib/validators";

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = forgotPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Email inválido." }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json({ ok: true });
  }

  const token = crypto.randomBytes(20).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetPasswordTokenHash: tokenHash,
      resetPasswordExpiresAt: expiresAt
    }
  });

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const resetLink = `${baseUrl}/auth/reset-password?token=${token}`;
  console.log("Reset link (sandbox):", resetLink);

  return NextResponse.json({ ok: true, resetLink });
}
