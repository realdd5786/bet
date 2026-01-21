import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, isStaticAdmin } from "../../../../lib/auth";
import { prisma } from "../../../../lib/db";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
  }

  if (isStaticAdmin(session.user.email)) {
    return NextResponse.json({ message: "Admin estático não pode ser removido." }, { status: 400 });
  }

  await prisma.user.delete({
    where: { id: session.user.id }
  });

  return NextResponse.json({ ok: true });
}
