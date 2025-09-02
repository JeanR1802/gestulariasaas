import { NextResponse } from "next/server";
import prisma from '@/lib/prisma'


async function getUser(request: Request) {
  const apiKey = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!apiKey) return null;
  return await prisma.user.findUnique({ where: { apiKey } });
}

export async function GET(request: Request, { params }: { params: { siteId: string } }) {
  const user = await getUser(request);
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const site = await prisma.site.findFirst({ where: { id: params.siteId, userId: user.id } });
  if (!site) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  return NextResponse.json(site);
}

export async function PUT(request: Request, { params }: { params: { siteId: string } }) {
  const user = await getUser(request);
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { content } = await request.json();
  const site = await prisma.site.updateMany({
    where: { id: params.siteId, userId: user.id },
    data: { content },
  });

  if (site.count === 0) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json({ message: "Sitio actualizado" });
}
