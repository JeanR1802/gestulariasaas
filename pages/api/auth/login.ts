import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '@/lib/prisma'
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });

  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Faltan datos" });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password) return res.status(401).json({ error: "Usuario o contraseña incorrecta" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: "Usuario o contraseña incorrecta" });

  res.status(200).json({ apiKey: user.apiKey, email: user.email, name: user.name });
}
