"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Site {
  id: string;
  name: string;
  subdomain: string;
}

export default function DashboardPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const router = useRouter();

  useEffect(() => {
    const apiKey = localStorage.getItem("apiKey");
    if (!apiKey) return router.push("/login");

    fetch("/api/sites", { headers: { Authorization: `Bearer ${apiKey}` } })
      .then(res => res.json())
      .then(data => setSites(data));
  }, [router]);

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">Tus sitios</h2>
      <Link href="/dashboard/new" className="bg-green-600 text-white px-4 py-2 rounded mb-4 inline-block">Crear nuevo</Link>
      <ul className="space-y-2">
        {sites.map(site => (
          <li key={site.id} className="border p-3 rounded flex justify-between items-center">
            <span>{site.name || site.subdomain}</span>
            <Link href={`/editor/${site.id}`} className="text-blue-600">Editar</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
