import { NextResponse } from "next/server";
import prisma from '@/lib/prisma'

async function getUserFromApiKey(request: Request) {
  const apiKey = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!apiKey) return null;
  return await prisma.user.findUnique({ where: { apiKey } });
}

// Obtener todos los sitios del usuario
export async function GET(request: Request) {
  const user = await getUserFromApiKey(request);
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const sites = await prisma.site.findMany({ where: { userId: user.id } });
  return NextResponse.json(sites);
}

// Crear nuevo sitio
export async function POST(request: Request) {
  const user = await getUserFromApiKey(request);
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { name, subdomain } = await request.json();
  if (!subdomain) return NextResponse.json({ error: "Faltan datos" }, { status: 400 });

  try {
    const site = await prisma.site.create({ data: { name, subdomain, userId: user.id } });
    return NextResponse.json(site, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Subdominio ya existe" }, { status: 409 });
  }
}
