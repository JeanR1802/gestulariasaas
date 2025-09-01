// Ruta: app/editor/[siteId]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface SiteData {
    id: string;
    subdomain: string;
    content: string | null;
}

export default function EditorPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const params = useParams();
    const siteId = params.siteId as string;

    const [site, setSite] = useState<SiteData | null>(null);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);
    
    useEffect(() => {
        if (siteId && status === 'authenticated') {
            const fetchSiteData = async () => {
                setLoading(true);
                try {
                    const res = await fetch(`/api/sites/${siteId}`);
                    if (!res.ok) {
                        const errorData = await res.json();
                        throw new Error(errorData.error || 'No se pudo cargar la información del sitio.');
                    }
                    const data = await res.json();
                    setSite(data);
                    if (data.content) {
                        const parsedContent = JSON.parse(data.content);
                        setTitle(parsedContent.title || '');
                    }
                } catch (err: any) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchSiteData();
        }
    }, [siteId, status]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(false);

        const contentToSave = JSON.stringify({ title });

        try {
            const res = await fetch(`/api/sites/${siteId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: contentToSave }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'No se pudo guardar la información.');
            }
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000); // Hide success message after 3s
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Cargando editor...</div>;
    }

    if (error && !site) {
        return <div className="flex flex-col items-center justify-center min-h-screen text-red-500">
            <p>{error}</p>
            <Link href="/dashboard" className="mt-4 text-blue-600 hover:underline">Volver al Dashboard</Link>
        </div>;
    }
    
    if (!site) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm">
                 <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                     <div className="flex justify-between items-center h-16">
                        <div>
                           <h1 className="text-xl font-bold text-gray-800">Editando: {site.subdomain}</h1>
                           <Link href="/dashboard" className="text-sm text-blue-600 hover:underline">Volver al Dashboard</Link>
                        </div>
                        <button onClick={handleSave} disabled={saving} className="bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-green-300 transition-colors">
                            {saving ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                     </div>
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