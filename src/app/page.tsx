'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getProductos } from '../lib/getData'
import ProductGrid from '../components/ProductGrid'

export default function Home(){
  const [productos, setProductos] = useState([])
  useEffect(()=>{getProductos().then((d)=>setProductos(d))},[])

  return (
    <div>
      <section className="container py-12 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-white">Delicias con Humo</h1>
          <p className="mt-4 text-gray-300 max-w-lg">Productos ahumados artesanales, elaborados con técnicas tradicionales y maderas seleccionadas. Pide para tu evento o disfruta en casa.</p>
          <div className="mt-6 flex gap-4">
            <Link href="/productos" className="btn-brand">Ver catálogo</Link>
            <Link href="/contacto" className="btn-outline">Contacto</Link>
          </div>
        </div>
        <div className="flex-1">
          <div className="card h-64 flex items-center justify-center">
            <img src="/images/product1.jpg" alt="hero" className="h-full object-cover rounded-md" />
          </div>
        </div>
      </section>

      <section className="container py-8">
        <h2 className="text-2xl font-semibold mb-4">Productos destacados</h2>
        <ProductGrid products={productos.slice(0,3)} />
      </section>
    </div>
  )
}
