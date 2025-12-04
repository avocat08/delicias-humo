"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <html lang="es">
      <body suppressHydrationWarning>
        {isAdmin ? (
          // Layout Admin
          <header className="border-b border-gray-800 sticky top-0 z-50 bg-black">
            <div className="container flex items-center justify-between py-3 sm:py-4">
                <Link href="/" className="flex items-center gap-3 flex-shrink-0">
                  <div className="h-8 sm:h-10 md:h-12 lg:h-16 flex items-center">
                    <Image
                      src="/images/logo2.svg"
                      alt="logo"
                      width={0}
                      height={0}
                      className="h-full w-auto object-contain"
                    />
                  </div>
                </Link>
                <nav className="hidden sm:flex items-center gap-3 sm:gap-4 md:gap-6 text-gray-200 text-sm sm:text-base">
                  <Link href="/admin/productos" className="hover:text-amber-400">Productos</Link>
                  <Link href="/admin/pedidos" className="hover:text-amber-400">Pedidos</Link>
                  <Link href="/">
                    <button className="bg-amber-400 hover:bg-amber-500 text-black font-medium py-1 px-2 sm:px-3 rounded-md text-sm sm:text-base">Logout</button>
                  </Link>
                </nav>
                <div className="sm:hidden flex items-center">
                  <button
                    aria-label="Abrir menú"
                    onClick={() => setMobileOpen(v => !v)}
                    className="p-2 rounded-md border border-gray-700 text-gray-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                    </svg>
                  </button>
                </div>
              </div>
              {mobileOpen && (
                <div className="sm:hidden bg-black border-t border-gray-800">
                  <div className="container py-3 flex flex-col gap-3">
                    <Link href="/admin/productos" className="text-gray-200 py-2 hover:text-amber-400">Productos</Link>
                    <Link href="/admin/pedidos" className="text-gray-200 py-2 hover:text-amber-400">Pedidos</Link>
                    <Link href="/">
                      <button className="bg-amber-400 hover:bg-amber-500 text-black font-medium py-2 px-3 rounded-md w-full">Logout</button>
                    </Link>
                  </div>
                </div>
              )}
          </header>
        ) : (
          // Layout Normal
          <header className="border-b border-gray-800 sticky top-0 z-50 bg-black">
            <div className="container flex items-center justify-between py-3 sm:py-4">
              <Link href="/" className="flex items-center gap-3 flex-shrink-0">
                <div className="h-8 sm:h-10 md:h-12 lg:h-16 flex items-center">
                  <Image
                    src="/images/logo2.svg"
                    alt="logo"
                    width={0}
                    height={0}
                    className="h-full w-auto object-contain"
                  />
                </div>
              </Link>
              <nav className="hidden sm:flex items-center gap-3 sm:gap-4 md:gap-6 text-gray-200 text-sm sm:text-base">
                <Link href="/" className="hover:text-amber-400">Inicio</Link>
                <Link href="/productos" className="hover:text-amber-400">Catálogo</Link>
                <Link href="/rastreo" className="hover:text-amber-400">Rastreo</Link>
                <Link href="/contacto" className="hover:text-amber-400">Contacto</Link>
                <Link href="/login" className="ml-2 sm:ml-4">
                  <button className="bg-amber-400 hover:bg-amber-500 text-black font-medium py-1 px-2 sm:px-3 rounded-md text-sm sm:text-base">Log In</button>
                </Link>
              </nav>
              <div className="sm:hidden flex items-center">
                <button
                  aria-label="Abrir menú"
                  onClick={() => setMobileOpen(v => !v)}
                  className="p-2 rounded-md border border-gray-700 text-gray-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                  </svg>
                </button>
              </div>
            </div>
            {mobileOpen && (
              <div className="sm:hidden bg-black border-t border-gray-800">
                <div className="container py-3 flex flex-col gap-3">
                  <Link href="/" className="text-gray-200 py-2 hover:text-amber-400">Inicio</Link>
                  <Link href="/productos" className="text-gray-200 py-2 hover:text-amber-400">Catálogo</Link>
                  <Link href="/rastreo" className="text-gray-200 py-2 hover:text-amber-400">Rastreo</Link>
                  <Link href="/contacto" className="text-gray-200 py-2 hover:text-amber-400">Contacto</Link>
                  <Link href="/login">
                    <button className="bg-amber-400 hover:bg-amber-500 text-black font-medium py-2 px-3 rounded-md w-full">Log In</button>
                  </Link>
                </div>
              </div>
            )}
          </header>
        )}
        <main style={{ minHeight: "70vh" }}>{children}</main>
        <footer className="border-t border-gray-800 mt-8">
          <div className="container py-8 flex flex-col md:flex-row justify-between">
            <div>
              <h4 className="text-lg font-semibold">Delicias con Humo</h4>
              <p className="text-sm text-gray-400">Ahumados artesanales — Panamá</p>
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
