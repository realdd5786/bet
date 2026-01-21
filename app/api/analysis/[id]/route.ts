import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { prisma } from "../../../../lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
  }

  const analysis = await prisma.analysis.findFirst({
    where: { id: params.id, userId: session.user.id }
  });

  if (!analysis) {
    return NextResponse.json({ message: "Não encontrado" }, { status: 404 });
  }

  return NextResponse.json({ analysis });
}
