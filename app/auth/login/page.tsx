"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Card } from "../../../components/ui/Card";
import { useToast } from "../../../components/ToastProvider";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { pushToast } = useToast();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password
    });
    setLoading(false);

    if (result?.error) {
      pushToast({
        title: "Login falhou",
        description: "Verifique suas credenciais.",
        variant: "error"
      });
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-hero-gradient px-6 py-12">
      <Card className="mx-auto max-w-md space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Bem-vindo de volta</h1>
          <p className="text-sm text-white/70">Entre para acessar suas análises.</p>
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
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
        <div className="flex justify-between text-xs text-white/60">
          <Link href="/auth/forgot-password">Esqueci senha</Link>
          <Link href="/auth/register">Criar conta</Link>
        </div>
      </Card>
    </div>
  );
}
