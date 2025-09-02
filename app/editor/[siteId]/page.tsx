"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function EditorPage() {
  const params = useParams();
  const siteId = params?.siteId; // ✅ usa optional chaining

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!siteId) return; // 🔹 evita correr la API si no hay siteId
    fetch(`/api/sites/${siteId}`)
      .then(res => res.json())
      .then(data => {
        setContent(data.content || "");
        setLoading(false);
      });
  }, [siteId]);

  if (!siteId) return <div>Site no encontrado</div>;

  return (
    <div>
      {loading ? <p>Cargando...</p> : <textarea value={content} onChange={e => setContent(e.target.value)} />}
    </div>
  );
}
