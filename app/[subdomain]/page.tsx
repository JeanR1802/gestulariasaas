// Ruta: app/[subdomain]/page.tsx
import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Define un tipo para el contenido parseado para mayor seguridad
interface SiteContent {
  title?: string;
}

export default async function SitePage({ params }: { params: { subdomain: string } }) {
  const site = await prisma.site.findUnique({
    where: {
      subdomain: params.subdomain,
    },
  });

  if (!site) {
    return notFound();
  }
  
  // Parsea el contenido de forma segura
  let content: SiteContent = {};
  try {
    if (site.content) {
      content = JSON.parse(site.content);
    }
  } catch (e) {
    console.error("Failed to parse site content:", e);
    // El contenido sigue siendo un objeto vacío, por lo que se usarán los valores por defecto
  }

  // Asigna el título desde el contenido parseado, o usa un valor por defecto si no existe.
  const pageTitle = content.title || `Bienvenido a ${site.subdomain}`;
  const pageDescription = "Este es un sitio generado por nuestro SaaS."; // Esto lo haremos dinámico más adelante

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <h1 className="text-4xl md:text-6xl font-bold">{pageTitle}</h1>
      <p className="mt-4 text-lg text-gray-700">
        {pageDescription}
      </p>
    </div>
  );
}

