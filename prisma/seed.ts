import { PrismaClient, CreditTransactionStatus, CreditTransactionType, PixPurchaseStatus } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("senha123", 10);

  const user1 = await prisma.user.upsert({
    where: { email: "joao@futmax.com" },
    update: {},
    create: {
      email: "joao@futmax.com",
      passwordHash
    }
  });

  const user2 = await prisma.user.upsert({
    where: { email: "maria@futmax.com" },
    update: {},
    create: {
      email: "maria@futmax.com",
      passwordHash
    }
  });

  await prisma.pixPurchase.create({
    data: {
      userId: user1.id,
      packageId: "30",
      amountBRL: 9900,
      status: PixPurchaseStatus.PAID,
      pixKey: "futmax-sandbox",
      pixPayload: "00020126580014BR.GOV.BCB.PIX0136sandbox-1234567890",
      qrCodeBase64: "",
      expiresAt: new Date(Date.now() + 1000 * 60 * 30),
      paidAt: new Date()
    }
  });

  await prisma.creditTransaction.create({
    data: {
      userId: user1.id,
      type: CreditTransactionType.PURCHASE,
      status: CreditTransactionStatus.PAID,
      amount: 30,
      metadata: { pacote: "30", origem: "seed" }
    }
  });

  await prisma.creditTransaction.create({
    data: {
      userId: user1.id,
      type: CreditTransactionType.CONSUME,
      status: CreditTransactionStatus.CONSUMED,
      amount: -5,
      metadata: { motivo: "analise" }
    }
  });

  await prisma.analysis.create({
    data: {
      userId: user1.id,
      teamA: "Flamengo",
      teamB: "Palmeiras",
      competition: "Brasileirão",
      matchDate: new Date(),
      prompt: "Comparar Flamengo x Palmeiras",
      resultJson: {
        confianca_0_100: 62,
        pros: ["Boa fase recente"],
        contras: ["Desgaste de elenco"],
        mercados_sugeridos: [
          { mercado: "Dupla chance", risco: "baixo" }
        ],
        aviso: "Análise baseada em informações públicas e pode conter incertezas."
      },
      resultText: "Flamengo e Palmeiras têm forças similares, com leve vantagem de mando para o time da casa. Aposte com cautela.",
      costCredits: 5
    }
  });

  await prisma.creditTransaction.create({
    data: {
      userId: user2.id,
      type: CreditTransactionType.ADJUST,
      status: CreditTransactionStatus.PAID,
      amount: 10,
      metadata: { origem: "seed" }
    }
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
