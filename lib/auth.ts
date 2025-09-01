// Ruta: lib/auth.ts
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import { type NextAuthOptions } from "next-auth";
import prisma from "@/lib/prisma"; // Cambio: Importamos el cliente centralizado

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma), // Cambio: Usamos el cliente importado
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
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
