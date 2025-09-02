import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Faltan campos" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  // Validamos que password exista
  if (!user.password) {
    return NextResponse.json({ error: "Usuario no tiene contraseña configurada" }, { status: 400 });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  }

  return NextResponse.json({
    apiKey: user.apiKey,
    email: user.email,
    name: user.name,
  });
}
