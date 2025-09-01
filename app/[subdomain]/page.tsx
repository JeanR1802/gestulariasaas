import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function SitePage({ params }: { params: { subdomain: string } }) {
  // Busca el sitio en la base de datos usando directamente params.subdomain
  const site = await prisma.site.findUnique({
    where: {
      subdomain: params.subdomain,
    },
  });

  if (!site) {
    return notFound();
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">Bienvenido al sitio de {site.subdomain}</h1>
      <p className="mt-4 text-lg">
        {site.content || "Este es un sitio generado por nuestro SaaS."}
      </p>
    </div>
  );
}