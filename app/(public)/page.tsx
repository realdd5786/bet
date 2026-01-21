import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";

export const metadata: Metadata = {
  title: "FutMax | Análises esportivas inteligentes",
  description:
    "Compare clubes, compre créditos via PIX e exporte relatórios em PDF com o FutMax.",
  openGraph: {
    title: "FutMax | Análises esportivas inteligentes",
    description:
      "Compare clubes, compre créditos via PIX e exporte relatórios em PDF com o FutMax.",
    type: "website"
  }
};

const packages = [
  { id: "10", credits: 10, amount: "R$ 39" },
  { id: "30", credits: 30, amount: "R$ 99" },
  { id: "100", credits: 100, amount: "R$ 249" }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-hero-gradient">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <Badge className="w-fit">Nova geração de análise esportiva</Badge>
            <h1 className="text-4xl font-semibold text-white md:text-5xl">
              FutMax: análises comparativas para apostas mais conscientes
            </h1>
            <p className="text-lg text-white/70">
              Feito para homens 50+ que querem clareza, transparência e controle de
              crédito. Compare clubes, entenda riscos e exporte relatórios em PDF.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/auth/register">
                <Button>Criar conta</Button>
              </Link>
              <Link href="/auth/login" className="self-center text-sm text-white/70">
                Entrar
              </Link>
              <Link href="/credits" className="self-center text-sm text-white/70">
                Comprar créditos
              </Link>
              <Link href="/analysis" className="self-center text-sm text-white/70">
                Fazer análise
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                "Dados claros e linguagem acessível",
                "PIX sandbox imediato",
                "Análises com ressalvas e risco"
              ].map((item) => (
                <div key={item} className="glass p-4 text-sm text-white/70">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <Card className="space-y-4">
            <div className="flex items-center gap-3">
              <Image src="/logo.svg" alt="FutMax" width={40} height={40} />
              <div>
                <p className="text-sm text-white/60">Exemplo de análise</p>
                <p className="text-lg font-semibold">Flamengo x Palmeiras</p>
              </div>
            </div>
            <p className="text-sm text-white/70">
              <strong>Resumo:</strong> equilíbrio alto, vantagem leve para o mandante.
              Mercado sugerido: dupla chance. Risco: médio.
            </p>
            <ul className="space-y-2 text-xs text-white/60">
              <li>• Confiança 62/100</li>
              <li>• Pró: histórico positivo recente</li>
              <li>• Contra: calendário apertado</li>
            </ul>
            <Button className="w-full">Exportar PDF</Button>
          </Card>
        </section>

        <section className="mt-16 grid gap-6">
          <h2 className="text-2xl font-semibold">Como funciona</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { step: "1", text: "Crie sua conta em minutos" },
              { step: "2", text: "Compre créditos via PIX sandbox" },
              { step: "3", text: "Gere análises comparativas e PDF" }
            ].map((item) => (
              <Card key={item.step} className="space-y-3">
                <Badge>Passo {item.step}</Badge>
                <p className="text-lg text-white">{item.text}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-semibold">Pacotes de crédito</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {packages.map((pkg) => (
              <Card key={pkg.id} className="space-y-3">
                <p className="text-lg font-semibold">{pkg.credits} créditos</p>
                <p className="text-3xl font-semibold text-cyan-300">{pkg.amount}</p>
                <p className="text-sm text-white/60">Ideal para até {pkg.credits / 5} análises</p>
                <Button className="w-full">Comprar</Button>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-semibold">FAQ rápido</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              {
                q: "O FutMax garante resultados?",
                a: "Não. As análises são informativas, com linguagem condicional e sem promessas."
              },
              {
                q: "Como os créditos funcionam?",
                a: "Você compra pacotes fixos via PIX e cada análise consome créditos do saldo."
              },
              {
                q: "Posso exportar as análises?",
                a: "Sim. Cada análise tem PDF para guardar ou compartilhar."
              },
              {
                q: "O que é o modo sandbox?",
                a: "É uma simulação de PIX para testes. Em produção, usamos um provedor real."
              }
            ].map((item) => (
              <Card key={item.q} className="space-y-2">
                <p className="text-sm font-semibold">{item.q}</p>
                <p className="text-sm text-white/70">{item.a}</p>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <Footer />

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "FutMax",
            url: "https://futmax.local",
            logo: "https://futmax.local/logo.svg"
          })
        }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "FutMax",
            url: "https://futmax.local"
          })
        }}
      />
    </div>
  );
}
