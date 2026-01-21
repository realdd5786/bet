import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, isStaticAdmin } from "../../../../lib/auth";
import { prisma } from "../../../../lib/db";
import { getCreditBalance } from "../../../../lib/credits";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
  }

  const balance = await getCreditBalance(session.user.id, session.user.email);
  const creditTransactions = await prisma.creditTransaction.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 5
  });
  const pixPurchases = await prisma.pixPurchase.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 5
  });

  return NextResponse.json({
    balance: isStaticAdmin(session.user.email) ? "ilimitado" : balance,
    creditTransactions,
    pixPurchases
  });
}
