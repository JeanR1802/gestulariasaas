"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface SiteData {
  id: string;
  subdomain: string;
  content: string | null;
}

export default function SubdomainPage({ params }: { params: { subdomain: string } }) {
  const [site, setSite] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const subdomain = params.subdomain;

  useEffect(() => {
    const fetchSite = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/sites/by-subdomain/${subdomain}`);
        if (!res.ok) throw new Error("No se pudo cargar el sitio.");
        const data: SiteData = await res.json();
        setSite(data);
      } catch (err) {
        setSite(null);
      } finally {
        setLoading(false);
      }
    };
    fetchSite();
  }, [subdomain]);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  if (!site) return <div className="flex items-center justify-center min-h-screen text-red-500">
    Sitio no encontrado.
  </div>;

  const content = site.content ? JSON.parse(site.content) : {};

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">{content.title || "Bienvenido a tu sitio"}</h1>
      <p>Subdominio: {site.subdomain}</p>
      <Link href={`/dashboard`} className="mt-4 inline-block text-blue-600 hover:underline">
        Volver al Dashboard
      </Link>
    </div>
  );
}
