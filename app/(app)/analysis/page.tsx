"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { useToast } from "../../../components/ToastProvider";

export default function AnalysisPage() {
  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");
  const [competition, setCompetition] = useState("");
  const [matchDate, setMatchDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyses, setAnalyses] = useState<Array<{ id: string; teamA: string; teamB: string }>>(
    []
  );
  const router = useRouter();
  const { pushToast } = useToast();

  useEffect(() => {
    fetch("/api/analysis")
      .then((res) => res.json())
      .then((data) => setAnalyses(data.analyses || []));
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    const response = await fetch("/api/analysis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamA, teamB, competition, matchDate })
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      pushToast({
        title: "Erro",
        description: data?.message || "Não foi possível gerar a análise",
        variant: "error"
      });
      return;
    }

    router.push(`/analysis/${data.id}`);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Nova análise</h1>
        <p className="text-sm text-white/70">Compare clubes usando seus créditos.</p>
      </div>

      <Card>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              placeholder="Time A"
              value={teamA}
              onChange={(event) => setTeamA(event.target.value)}
              required
            />
            <Input
              placeholder="Time B"
              value={teamB}
              onChange={(event) => setTeamB(event.target.value)}
              required
            />
          </div>
          <Input
            placeholder="Campeonato"
            value={competition}
            onChange={(event) => setCompetition(event.target.value)}
            required
          />
          <Input
            type="date"
            value={matchDate}
            onChange={(event) => setMatchDate(event.target.value)}
          />
          <Button className="w-full" disabled={loading}>
            {loading ? "Gerando..." : "Gerar análise"}
          </Button>
        </form>
      </Card>

      <Card className="space-y-3">
        <h2 className="text-lg font-semibold">Últimas análises</h2>
        <ul className="space-y-2 text-sm text-white/70">
          {analyses.map((analysis) => (
            <li key={analysis.id} className="flex justify-between">
              <span>
                {analysis.teamA} x {analysis.teamB}
              </span>
              <button
                className="text-cyan-300"
                onClick={() => router.push(`/analysis/${analysis.id}`)}
              >
                Ver
              </button>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
