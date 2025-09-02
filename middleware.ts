import { NextRequest, NextResponse } from "next/server";
import { getSiteBySubdomain } from "./lib/getSite";

export const config = {
  matcher: [
    "/((?!api/|_next/|_static/|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const hostname = req.headers.get("host");
  if (!hostname) return NextResponse.next();

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";

  if (hostname === rootDomain || hostname === `www.${rootDomain}`) {
    return NextResponse.next();
  }

  const subdomain = hostname.replace(`.${rootDomain}`, "");

  if (!subdomain) return NextResponse.next();

  // Buscar si existe en BD
  const site = await getSiteBySubdomain(subdomain);
  if (!site) {
    // Opcional: redirigir a página de error o al root
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Reescribir la ruta
  url.pathname = `/${subdomain}${url.pathname}`;
  return NextResponse.rewrite(url);
}
