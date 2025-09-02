import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });

  const { name, email, password } = req.body;

  if (!name || !email || !password) return res.status(400).json({ error: "Faltan datos" });

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(400).json({ error: "Usuario ya existe" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const apiKey = randomUUID();

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword, apiKey },
  });

  res.status(201).json({ id: user.id, email: user.email, name: user.name });
}
