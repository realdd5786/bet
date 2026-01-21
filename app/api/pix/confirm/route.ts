import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { prisma } from "../../../../lib/db";
import { confirmPixSchema } from "../../../../lib/validators";
import { CreditTransactionStatus, CreditTransactionType, PixPurchaseStatus } from "@prisma/client";
import { getPackageById } from "../../../../lib/pix";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = confirmPixSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Dados inválidos" }, { status: 400 });
  }

  const purchase = await prisma.pixPurchase.findFirst({
    where: { id: parsed.data.purchaseId, userId: session.user.id }
  });

  if (!purchase) {
    return NextResponse.json({ message: "Compra não encontrada" }, { status: 404 });
  }

  if (purchase.status === PixPurchaseStatus.PAID) {
    return NextResponse.json({ ok: true, status: purchase.status });
  }

  if (purchase.expiresAt < new Date()) {
    await prisma.pixPurchase.update({
      where: { id: purchase.id },
      data: { status: PixPurchaseStatus.EXPIRED }
    });
    return NextResponse.json({ message: "PIX expirado" }, { status: 400 });
  }

  const pkg = getPackageById(purchase.packageId);
  if (!pkg) {
    return NextResponse.json({ message: "Pacote inválido" }, { status: 400 });
  }

  await prisma.creditTransaction.create({
    data: {
      userId: session.user.id,
      type: CreditTransactionType.PURCHASE,
      status: CreditTransactionStatus.PAID,
      amount: pkg.credits,
      metadata: { purchaseId: purchase.id, pacote: pkg.id }
    }
  });

  await prisma.pixPurchase.update({
    where: { id: purchase.id },
    data: { status: PixPurchaseStatus.PAID, paidAt: new Date() }
  });

  return NextResponse.json({ ok: true });
}
