import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    // Todas las rutas excepto API, _next, _static, archivos públicos
    "/((?!api/|_next/|_static/|[\\w-]+\\.\\w+).*)",
  ],
};

export default function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const hostname = req.headers.get("host");

  if (!hostname) return NextResponse.next();

  // Dominio principal
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";

  // Si hostname es exactamente el rootDomain, no hacemos nada
  if (hostname === rootDomain) {
    return NextResponse.next();
  }

  // Extraemos el subdominio (todo antes del rootDomain)
  const subdomain = hostname.replace(`.${rootDomain}`, "");

  // Ignoramos subdominios vacíos o especiales como www
  if (!subdomain || subdomain === "www") {
    return NextResponse.next();
  }

  // Reescribimos la ruta para que Next.js la maneje como /<subdominio>/ruta
  url.pathname = `/${subdomain}${url.pathname}`;
  return NextResponse.rewrite(url);
}
