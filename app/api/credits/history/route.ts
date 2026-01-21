import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { prisma } from "../../../../lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
  }

  const creditTransactions = await prisma.creditTransaction.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" }
  });
  const pixPurchases = await prisma.pixPurchase.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({ creditTransactions, pixPurchases });
}
