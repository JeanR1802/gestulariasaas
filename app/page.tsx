import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-800">Bienvenido a tu Nuevo SaaS</h1>
        <p className="mt-4 text-xl text-gray-600">
          Crea y gestiona tus sitios web con un solo click.
        </p>
        <Link href="/dashboard" className="mt-8 inline-block bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition-colors">
          Ir al Dashboard
        </Link>
      </div>
    </div>
  );
}
