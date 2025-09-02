"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface SiteData {
  id: string;
  subdomain: string;
  content: string | null;
}

export default function EditorPage() {
  const { data: session, status } = useSession({ required: true }); // obligamos auth
  const router = useRouter();
  const params = useParams();
  const siteId = params.siteId as string;

  const [site, setSite] = useState<SiteData | null>(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Cargar sitio solo si está autenticado
  useEffect(() => {
    if (!siteId || status !== "authenticated") return;

    const fetchSiteData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/sites/${siteId}`);
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "No se pudo cargar el sitio.");
        }
        const data: SiteData = await res.json();
        setSite(data);
        if (data.content) {
          const parsed = JSON.parse(data.content);
          setTitle(parsed.title || "");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSiteData();
  }, [siteId, status]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteId) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(`/api/sites/${siteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: JSON.stringify({ title }) }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "No se pudo guardar el sitio.");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Cargando editor...</div>;
  if (!site) return <div className="flex flex-col items-center justify-center min-h-screen text-red-500">
    <p>{error || "No se encontró el sitio."}</p>
    <Link href="/dashboard" className="mt-4 text-blue-600 hover:underline">Volver al Dashboard</Link>
  </div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Editando: {site.subdomain}</h1>
            <Link href="/dashboard" className="text-sm text-blue-600 hover:underline">Volver al Dashboard</Link>
          </div>
          <button onClick={handleSave} disabled={saving} className="bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-green-300 transition-colors">
            {saving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-lg shadow">
          <form onSubmit={handleSave}>
            <label htmlFor="title" className="block text-lg font-medium text-gray-700">Título Principal (H1)</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="El increíble título de mi web"
              className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
            />
          </form>
          {success && <p className="text-green-600 mt-4">¡Cambios guardados con éxito!</p>}
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      </main>
    </div>
  );
}
