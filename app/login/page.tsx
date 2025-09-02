"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export const runtime = "node"; 
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) return setError(data.error || "Error desconocido");

    localStorage.setItem("apiKey", data.apiKey);
    router.push("/dashboard");
  }

  return (
    <div className="max-w-md mx-auto mt-20">
      <h2 className="text-2xl font-bold mb-4">Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input placeholder="Correo" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 rounded"/>
        <input placeholder="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border p-2 rounded"/>
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">Entrar</button>
        {error && <p className="text-red-600">{error}</p>}
      </form>
    </div>
  );
}
