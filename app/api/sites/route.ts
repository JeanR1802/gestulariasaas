import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

// GET /api/sites - Obtiene los sitios del usuario autenticado
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const sites = await prisma.site.findMany({
    where: {
      userId: session.user.id,
    },
  });

  return NextResponse.json(sites);
}

// POST /api/sites - Crea un nuevo sitio
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { subdomain } = await request.json();

  if (!subdomain || !/^[a-z0-9-]+$/.test(subdomain)) {
      return NextResponse.json({ error: "Subdominio inválido." }, { status: 400 });
  }

  try {
    const newSite = await prisma.site.create({
      data: {
        subdomain: subdomain,
        userId: session.user.id,
      },
    });
    return NextResponse.json(newSite, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
        return NextResponse.json({ error: "Este subdominio ya está en uso." }, { status: 409 });
    }
    return NextResponse.json({ error: "Ocurrió un error al crear el sitio." }, { status: 500 });
  }
}
