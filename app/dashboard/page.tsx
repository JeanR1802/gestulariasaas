"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Site {
  id: string;
  subdomain: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [subdomain, setSubdomain] = useState("");
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirigir si no está autenticado
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  // Obtener sitios solo si está autenticado
  useEffect(() => {
    const fetchSites = async () => {
      if (status !== "authenticated") return;
      setLoading(true);
      try {
        const res = await fetch("/api/sites");
        if (!res.ok) throw new Error("Error al cargar sitios");
        const data: Site[] = await res.json();
        setSites(data);
      } catch (err: any) {
        setError(err.message);
      }
      setLoading(false);
    };
    fetchSites();
  }, [status]);

  const handleCreateSite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subdomain) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subdomain }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al crear sitio");
      }
      const newSite = await res.json();
      setSites([...sites, newSite]);
      setSubdomain("");
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  };

  if (status === "loading") return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
            <div>
              <span className="mr-4">Hola, {session.user?.name}</span>
              <button onClick={() => signOut()} className="font-semibold text-blue-600 hover:text-blue-800">Cerrar Sesión</button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Crear un nuevo sitio</h2>
          <form onSubmit={handleCreateSite} className="flex gap-4">
            <div className="flex-grow flex items-center">
              <input
                type="text"
                value={subdomain}
                onChange={(e) => {
                  setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
                  setError(null);
                }}
                placeholder="nombre-del-subdominio"
                className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="px-3 py-2 bg-gray-100 border-t border-b border-r border-gray-300 text-gray-600 rounded-r-md">
                .{process.env.NEXT_PUBLIC_ROOT_DOMAIN?.replace(":3000", "")}
              </span>
            </div>
            <button type="submit" disabled={loading} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors">
              {loading ? "Creando..." : "Crear Sitio"}
            </button>
          </form>
          {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Tus Sitios</h2>
          {sites.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {sites.map((site) => (
                <li key={site.id} className="py-4 flex justify-between items-center">
                  <div>
                    <span className="font-medium text-gray-800">{site.subdomain}</span>
                    <a href={`http://${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 ml-2 block hover:underline">
                      {site.subdomain}.{process.env.NEXT_PUBLIC_ROOT_DOMAIN?.replace(":3000", "")}
                    </a>
                  </div>
                  <div className="flex items-center gap-4">
                    <a href={`http://${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-gray-600 hover:text-gray-900 transition-colors">
                      Visitar
                    </a>
                    <Link href={`/editor/${site.id}`} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                      Editar
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Aún no has creado ningún sitio.</p>
          )}
        </div>
      </main>
    </div>
  );
}
