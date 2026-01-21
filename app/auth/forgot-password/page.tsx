"use client";

import { useState } from "react";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { useToast } from "../../../components/ToastProvider";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [resetLink, setResetLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { pushToast } = useToast();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      pushToast({
        title: "Erro",
        description: data?.message || "Não foi possível enviar.",
        variant: "error"
      });
      return;
    }

    setResetLink(data.resetLink || null);
    pushToast({
      title: "Verifique o email",
      description: "Se existir, enviamos um link de reset.",
      variant: "success"
    });
  }

  return (
    <div className="min-h-screen bg-hero-gradient px-6 py-12">
      <Card className="mx-auto max-w-md space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Esqueci minha senha</h1>
          <p className="text-sm text-white/70">Vamos gerar um link de reset.</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <Button className="w-full" disabled={loading}>
            {loading ? "Enviando..." : "Gerar link"}
          </Button>
        </form>
        {resetLink ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/70">
            <p className="font-semibold">Link sandbox (dev):</p>
            <p className="break-all text-cyan-300">{resetLink}</p>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
