"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { useToast } from "../../../components/ToastProvider";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { pushToast } = useToast();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password })
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      pushToast({
        title: "Erro",
        description: data?.message || "Token inválido.",
        variant: "error"
      });
      return;
    }

    pushToast({
      title: "Senha atualizada",
      description: "Faça login novamente.",
      variant: "success"
    });
    router.push("/auth/login");
  }

  return (
    <div className="min-h-screen bg-hero-gradient px-6 py-12">
      <Card className="mx-auto max-w-md space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Reset de senha</h1>
          <p className="text-sm text-white/70">Defina uma nova senha segura.</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            type="password"
            placeholder="Nova senha"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <Button className="w-full" disabled={loading}>
            {loading ? "Atualizando..." : "Atualizar senha"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
