// Ruta: app/api/sites/[siteId]/route.ts
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma"; // Cambio: Importamos el cliente centralizado

// GET /api/sites/[siteId] - Obtiene la información de un sitio específico
export async function GET(request: Request, { params }: { params: { siteId: string } }) {
    const session = await getServerSession(authOptions);
    const siteId = params.siteId;

    if (!session?.user?.id) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const site = await prisma.site.findFirst({
        where: {
            id: siteId,
            userId: session.user.id, // Security check: Only the owner can get the site data
        },
    });

    if (!site) {
        return NextResponse.json({ error: "Sitio no encontrado o sin permiso para acceder." }, { status: 404 });
    }

    return NextResponse.json(site);
}


// PUT /api/sites/[siteId] - Actualiza un sitio
export async function PUT(request: Request, { params }: { params: { siteId: string } }) {
  const session = await getServerSession(authOptions);
  const siteId = params.siteId;

  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { content } = await request.json();

  if (typeof content !== 'string') {
      return NextResponse.json({ error: "El contenido es inválido." }, { status: 400 });
  }

  try {
    const updateResult = await prisma.site.updateMany({
      where: {
        id: siteId,
        userId: session.user.id, // Security check!
      },
      data: {
        content: content,
      },
    });

    if (updateResult.count === 0) {
        return NextResponse.json({ error: "Sitio no encontrado o sin permiso para actualizar." }, { status: 404 });
    }

    return NextResponse.json({ message: "Sitio actualizado con éxito." });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Ocurrió un error al actualizar el sitio." }, { status: 500 });
  }
}