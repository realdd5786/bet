"use client";

import { useEffect, useState } from "react";
import { Card } from "../../../components/ui/Card";
import { LoadingSkeleton } from "../../../components/ui/LoadingSkeleton";

type SummaryResponse = {
  balance: number | string;
  creditTransactions: Array<{ id: string; type: string; amount: number; createdAt: string }>;
  pixPurchases: Array<{ id: string; status: string; amountBRL: number; createdAt: string }>;
};

export default function DashboardPage() {
  const [summary, setSummary] = useState<SummaryResponse | null>(null);

  useEffect(() => {
    fetch("/api/credits/summary")
      .then((res) => res.json())
      .then((data) => setSummary(data));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-white/70">Visão rápida das suas movimentações.</p>
      </div>

      <Card className="space-y-2">
        <p className="text-sm text-white/60">Saldo atual</p>
        {summary ? (
          <p className="text-3xl font-semibold text-cyan-300">{summary.balance}</p>
        ) : (
          <LoadingSkeleton className="h-8 w-40" />
        )}
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="space-y-3">
          <h2 className="text-lg font-semibold">Últimas transações</h2>
          {summary ? (
            <ul className="space-y-2 text-sm text-white/70">
              {summary.creditTransactions.map((tx) => (
                <li key={tx.id} className="flex justify-between">
                  <span>{tx.type}</span>
                  <span>{tx.amount} créditos</span>
                </li>
              ))}
            </ul>
          ) : (
            <LoadingSkeleton />
          )}
        </Card>
        <Card className="space-y-3">
          <h2 className="text-lg font-semibold">Últimos PIX</h2>
          {summary ? (
            <ul className="space-y-2 text-sm text-white/70">
              {summary.pixPurchases.map((pix) => (
                <li key={pix.id} className="flex justify-between">
                  <span>{pix.status}</span>
                  <span>R$ {(pix.amountBRL / 100).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <LoadingSkeleton />
          )}
        </Card>
      </div>
    </div>
  );
}
