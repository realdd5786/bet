"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "../../../../components/ui/Button";
import { Card } from "../../../../components/ui/Card";

export default function AnalysisDetailPage() {
  const params = useParams<{ id: string }>();
  const [analysis, setAnalysis] = useState<any>(null);

  useEffect(() => {
    if (!params?.id) return;
    fetch(`/api/analysis/${params.id}`)
      .then((res) => res.json())
      .then((data) => setAnalysis(data.analysis));
  }, [params]);

  if (!analysis) {
    return <Card>Carregando análise...</Card>;
  }

  const json = analysis.resultJson || {};
  const pros = Array.isArray(json.pros) ? json.pros : [];
  const contras = Array.isArray(json.contras) ? json.contras : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{analysis.teamA} x {analysis.teamB}</h1>
        <p className="text-sm text-white/70">{analysis.competition}</p>
      </div>

      <Card className="space-y-3">
        <h2 className="text-lg font-semibold">Resumo humano</h2>
        <p className="text-sm text-white/80">{analysis.resultText}</p>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold text-cyan-300">Prós</h3>
            <ul className="list-disc pl-5 text-sm text-white/70">
              {pros.map((item: string) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-fuchsia-300">Contras</h3>
            <ul className="list-disc pl-5 text-sm text-white/70">
              {contras.map((item: string) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      <Card className="space-y-3">
        <details>
          <summary className="cursor-pointer text-sm font-semibold">Ver JSON estruturado</summary>
          <pre className="mt-3 whitespace-pre-wrap text-xs text-white/70">
            {JSON.stringify(json, null, 2)}
          </pre>
        </details>
      </Card>

      <Button onClick={() => window.open(`/api/analysis/${analysis.id}/pdf`, "_blank")}>
        Exportar PDF
      </Button>
    </div>
  );
}
