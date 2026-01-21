"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Card } from "../../../components/ui/Card";
import { useToast } from "../../../components/ToastProvider";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { pushToast } = useToast();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    setLoading(false);

    if (!response.ok) {
      const data = await response.json();
      pushToast({
        title: "Erro ao cadastrar",
        description: data?.message || "Tente novamente.",
        variant: "error"
      });
      return;
    }

    pushToast({
      title: "Conta criada",
      description: "Agora você pode entrar.",
      variant: "success"
    });
    router.push("/auth/login");
  }

  return (
    <div className="min-h-screen bg-hero-gradient px-6 py-12">
      <Card className="mx-auto max-w-md space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Criar conta</h1>
          <p className="text-sm text-white/70">Comece a usar o FutMax hoje.</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <Button className="w-full" disabled={loading}>
            {loading ? "Criando..." : "Criar conta"}
          </Button>
        </form>
        <div className="text-xs text-white/60">
          Já tem conta? <Link href="/auth/login">Entrar</Link>
        </div>
      </Card>
    </div>
  );
}
