import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)',
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname =  req.headers.get('host') || process.env.NEXT_PUBLIC_ROOT_DOMAIN;

  // Asegúrate de que hostname no sea undefined y obtén el dominio raíz
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000';
  
  // Extrae el subdominio si no es el dominio principal
  const currentHost = hostname.replace(`.${rootDomain}`, '');

  if (currentHost !== hostname) {
    // Si hay un subdominio, reescribe la URL a `/[subdominio]`
    url.pathname = `/${currentHost}${url.pathname}`;
  }
  
  return NextResponse.rewrite(url);
}
