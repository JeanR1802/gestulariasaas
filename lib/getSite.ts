import prisma from "./prisma";

export async function getSiteBySubdomain(subdomain: string) {
  return await prisma.site.findUnique({
    where: { subdomain },
    include: { user: true }, // si quieres saber el dueño
  });
}
