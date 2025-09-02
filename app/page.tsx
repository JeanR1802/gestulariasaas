import Link from "next/link";

export default function HomePage() {
  return (
    <div className="text-center mt-20">
      <h1 className="text-4xl font-bold">Bienvenido a Mi SaaS</h1>
      <p className="mt-4">Crea y administra tus sitios multitenant fácilmente</p>
      <div className="mt-6 space-x-4">
        <Link href="/register" className="px-4 py-2 bg-blue-600 text-white rounded">
          Registrarse
        </Link>
        <Link href="/login" className="px-4 py-2 bg-gray-600 text-white rounded">
          Iniciar Sesión
        </Link>
      </div>
    </div>
  );
}
