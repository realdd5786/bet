"use client";

import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { useToast } from "../../../components/ToastProvider";

type Package = { id: string; credits: number; amountBRL: number; label: string };

type HistoryResponse = {
  creditTransactions: Array<{ id: string; type: string; status: string; amount: number; createdAt: string }>;
  pixPurchases: Array<{ id: string; status: string; amountBRL: number; createdAt: string; packageId: string }>;
};

export default function CreditsPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [history, setHistory] = useState<HistoryResponse | null>(null);
  const [pixPayload, setPixPayload] = useState<string | null>(null);
  const [pixQr, setPixQr] = useState<string | null>(null);
  const [purchaseId, setPurchaseId] = useState<string | null>(null);
  const { pushToast } = useToast();

  useEffect(() => {
    fetch("/api/credits/packages")
      .then((res) => res.json())
      .then((data) => setPackages(data.packages || []));
    fetch("/api/credits/history")
      .then((res) => res.json())
      .then((data) => setHistory(data));
  }, []);

  async function handleCreatePix(packageId: string) {
    const response = await fetch("/api/pix/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ packageId })
    });
    const data = await response.json();
    if (!response.ok) {
      pushToast({
        title: "Erro ao gerar PIX",
        description: data?.message || "Tente novamente",
        variant: "error"
      });
      return;
    }
    setPixPayload(data.payload);
    setPixQr(data.qrBase64);
    setPurchaseId(data.purchaseId);
  }

  async function handleConfirmPix() {
    if (!purchaseId) return;
    const response = await fetch("/api/pix/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ purchaseId })
    });
    const data = await response.json();
    if (!response.ok) {
      pushToast({
        title: "Pagamento falhou",
        description: data?.message || "Tente novamente",
        variant: "error"
      });
      return;
    }

    pushToast({
      title: "PIX confirmado",
      description: "Créditos adicionados ao saldo.",
      variant: "success"
    });

    const refreshed = await fetch("/api/credits/history").then((res) => res.json());
    setHistory(refreshed);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Créditos</h1>
        <p className="text-sm text-white/70">Compre pacotes via PIX sandbox.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {packages.map((pkg) => (
          <Card key={pkg.id} className="space-y-3">
            <p className="text-lg font-semibold">{pkg.label}</p>
            <p className="text-sm text-white/70">{pkg.credits} créditos</p>
            <p className="text-3xl font-semibold text-cyan-300">
              R$ {(pkg.amountBRL / 100).toFixed(2)}
            </p>
            <Button className="w-full" onClick={() => handleCreatePix(pkg.id)}>
              Gerar PIX
            </Button>
          </Card>
        ))}
      </div>

      {pixPayload ? (
        <Card className="space-y-4">
          <h2 className="text-lg font-semibold">PIX Sandbox</h2>
          <p className="break-all text-xs text-white/70">Payload: {pixPayload}</p>
          {pixQr ? (
            <img
              alt="QR Code PIX"
              className="h-40 w-40 rounded-2xl border border-white/10 bg-white p-2"
              src={`data:image/svg+xml;base64,${pixQr}`}
            />
          ) : null}
          <Button onClick={handleConfirmPix}>Confirmar pagamento (sandbox)</Button>
        </Card>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="space-y-3">
          <h2 className="text-lg font-semibold">Histórico de transações</h2>
          <ul className="space-y-2 text-sm text-white/70">
            {history?.creditTransactions?.map((tx) => (
              <li key={tx.id} className="flex justify-between">
                <span>{tx.type}</span>
                <span>{tx.amount} créditos</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="space-y-3">
          <h2 className="text-lg font-semibold">Compras PIX</h2>
          <ul className="space-y-2 text-sm text-white/70">
            {history?.pixPurchases?.map((pix) => (
              <li key={pix.id} className="flex justify-between">
                <span>{pix.status}</span>
                <span>R$ {(pix.amountBRL / 100).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
