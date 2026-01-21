"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Modal } from "../../../components/ui/Modal";
import { useToast } from "../../../components/ToastProvider";

export default function SettingsPage() {
  const [open, setOpen] = useState(false);
  const { pushToast } = useToast();
  const router = useRouter();

  async function handleDelete() {
    const response = await fetch("/api/user/delete", { method: "POST" });
    const data = await response.json();
    if (!response.ok) {
      pushToast({
        title: "Erro",
        description: data?.message || "Não foi possível apagar.",
        variant: "error"
      });
      return;
    }
    pushToast({
      title: "Conta apagada",
      description: "Esperamos ver você novamente.",
      variant: "success"
    });
    router.push("/");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Configurações</h1>
        <p className="text-sm text-white/70">Gerencie sua conta FutMax.</p>
      </div>

      <Card className="space-y-4">
        <h2 className="text-lg font-semibold">Apagar minha conta</h2>
        <p className="text-sm text-white/70">
          Esta ação é irreversível e remove suas análises e transações.
        </p>
        <Button onClick={() => setOpen(true)}>Apagar conta</Button>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Confirmar exclusão">
        <p>Tem certeza que deseja apagar sua conta FutMax?</p>
        <div className="mt-4 flex gap-3">
          <Button className="bg-rose-500 text-white" onClick={handleDelete}>
            Sim, apagar
          </Button>
          <Button className="bg-white/10 text-white" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
        </div>
      </Modal>
    </div>
  );
}
