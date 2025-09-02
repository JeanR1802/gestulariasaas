"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
 
export default function EditorPage() {
  const params = useParams();
  const siteId = params.siteId;
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiKey = localStorage.getItem("apiKey");
    if (!apiKey) return;

    fetch(`/api/sites/${siteId}`, { headers: { Authorization: `Bearer ${apiKey}` } })
      .then(res => res.json())
      .then(data => {
        setContent(data.content || "");
        setLoading(false);
      });
  }, [siteId]);

  async function save() {
    const apiKey = localStorage.getItem("apiKey");
    if (!apiKey) return;

    await fetch(`/api/sites/${siteId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ content }),
    });
    alert("Guardado!");
  }

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">Editor de sitio</h2>
      <textarea
        className="w-full h-96 border p-2 rounded"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button onClick={save} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Guardar</button>
    </div>
  );
}
