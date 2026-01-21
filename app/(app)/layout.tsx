import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-hero-gradient">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
      <Footer />
    </div>
  );
}
