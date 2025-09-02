import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const { email, password } = await request.json();
  if (!email || !password) return NextResponse.json({ error: "Faltan datos" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });

  return NextResponse.json({ apiKey: user.apiKey, email: user.email, name: user.name });
}
