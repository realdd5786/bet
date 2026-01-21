"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/Button";

export function Navbar() {
  const { data } = useSession();
  const isLogged = Boolean(data?.user);

  return (
    <nav className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.svg" alt="FutMax" width={36} height={36} />
          <span className="text-lg font-semibold text-white">FutMax</span>
        </Link>
        <div className="hidden items-center gap-4 md:flex">
          <Link href="/" className="text-sm text-white/70 hover:text-white">
            Início
          </Link>
          <Link href="/credits" className="text-sm text-white/70 hover:text-white">
            Créditos
          </Link>
          <Link href="/analysis" className="text-sm text-white/70 hover:text-white">
            Análises
          </Link>
          <Link href="/dashboard" className="text-sm text-white/70 hover:text-white">
            Dashboard
          </Link>
        </div>
        <div className="flex items-center gap-3">
          {isLogged ? (
            <Button
              className="px-4 py-2 text-xs"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Sair
            </Button>
          ) : (
            <>
              <Link href="/auth/login" className="text-sm text-white/70 hover:text-white">
                Entrar
              </Link>
              <Link href="/auth/register">
                <Button className="px-4 py-2 text-xs">Criar conta</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
