import "../styles/globals.css";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Delicias con Humo",
  description: "Productos ahumados premium",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <header className="border-b border-gray-800">
          <div className="container flex items-center justify-between py-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="h-16 flex items-center">
                <Image
                  src="/images/logo2.svg"
                  alt="logo"
                  width={0}
                  height={0}
                  className="h-full w-auto object-contain"
                />
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-gray-200">
              <Link href="/">Inicio</Link>
              <Link href="/productos">Catálogo</Link>
              <Link href="/rastreo">Rastreo</Link>
              <Link href="/contacto">Contacto</Link>
              <Link href="/admin/productos" className="ml-4">
                <button className="btn-outline">Panel</button>
              </Link>
            </nav>
            <div className="md:hidden">{/* mobile menu placeholder */}</div>
          </div>
        </header>
        <main style={{ minHeight: "70vh" }}>{children}</main>
        <footer className="border-t border-gray-800 mt-8">
          <div className="container py-8 flex flex-col md:flex-row justify-between">
            <div>
              <h4 className="text-lg font-semibold">Delicias con Humo</h4>
              <p className="text-sm text-gray-400">
                Ahumados artesanales — Panamá
              </p>
            </div>
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} Delicias con Humo
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
