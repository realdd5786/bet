import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { prisma } from "../../../../lib/db";
import { createPixSchema } from "../../../../lib/validators";
import { generatePixPayload, generateQrBase64, getPackageById } from "../../../../lib/pix";
import { PixPurchaseStatus } from "@prisma/client";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createPixSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Pacote inválido" }, { status: 400 });
  }

  const pkg = getPackageById(parsed.data.packageId);
  if (!pkg) {
    return NextResponse.json({ message: "Pacote inválido" }, { status: 400 });
  }

  const purchase = await prisma.pixPurchase.create({
    data: {
      userId: session.user.id,
      packageId: pkg.id,
      amountBRL: pkg.amountBRL,
      status: PixPurchaseStatus.PENDING,
      pixKey: "futmax-sandbox",
      pixPayload: "",
      qrCodeBase64: "",
      expiresAt: new Date(Date.now() + 1000 * 60 * 30)
    }
  });

  const payload = generatePixPayload(pkg.amountBRL, purchase.id);
  const qrBase64 = generateQrBase64(payload);

  const updated = await prisma.pixPurchase.update({
    where: { id: purchase.id },
    data: {
      pixPayload: payload,
      qrCodeBase64: qrBase64
    }
  });

  return NextResponse.json({
    purchaseId: updated.id,
    payload: updated.pixPayload,
    qrBase64: updated.qrCodeBase64
  });
}
