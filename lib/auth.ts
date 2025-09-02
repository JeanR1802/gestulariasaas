// Ruta: lib/auth.ts
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import { type NextAuthOptions } from "next-auth";
import prisma from "@/lib/prisma"; // Cambio: Importamos el cliente centralizado

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    maxAge: 24 * 60 * 60, // La sesión dura 1 día
    updateAge: 60 * 60,   // Solo refresca la sesión cada 1 hora
  },
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
};
