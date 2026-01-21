import { CreditTransactionStatus, CreditTransactionType } from "@prisma/client";
import { prisma } from "./db";
import { isStaticAdmin } from "./auth";

export const CREDIT_PACKAGES = [
  { id: "10", credits: 10, amountBRL: 3900, label: "Starter" },
  { id: "30", credits: 30, amountBRL: 9900, label: "Pro" },
  { id: "100", credits: 100, amountBRL: 24900, label: "Elite" }
];

export const ANALYSIS_COST = Number(process.env.ANALYSIS_COST_CREDITS || "5");

export async function getCreditBalance(userId: string, email?: string | null) {
  if (isStaticAdmin(email)) {
    return Number.POSITIVE_INFINITY;
  }
  const result = await prisma.creditTransaction.aggregate({
    where: { userId },
    _sum: { amount: true }
  });
  return result._sum.amount ?? 0;
}

export async function reserveCredits(userId: string, cost: number) {
  return prisma.$transaction(async (tx) => {
    const balance = await tx.creditTransaction.aggregate({
      where: { userId },
      _sum: { amount: true }
    });
    const current = balance._sum.amount ?? 0;
    if (current < cost) {
      return { ok: false, balance: current } as const;
    }

    const transaction = await tx.creditTransaction.create({
      data: {
        userId,
        type: CreditTransactionType.CONSUME,
        status: CreditTransactionStatus.RESERVED,
        amount: -cost,
        metadata: { etapa: "reserva" }
      }
    });

    return { ok: true, transaction } as const;
  });
}

export async function consumeReserved(transactionId: string) {
  return prisma.creditTransaction.update({
    where: { id: transactionId },
    data: { status: CreditTransactionStatus.CONSUMED }
  });
}

export async function refundReserved(transactionId: string) {
  return prisma.creditTransaction.update({
    where: { id: transactionId },
    data: { status: CreditTransactionStatus.REFUNDED }
  });
}
