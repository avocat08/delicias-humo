'use client'
import { useEffect, useState } from 'react'
import { getProductos } from '../../lib/getData'
import ProductGrid from '../../components/ProductGrid'

export default function Catalogo(){
  const [productos, setProductos] = useState([])
  useEffect(()=>{getProductos().then(d=>setProductos(d))},[])

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-semibold mb-6">Catálogo</h1>
      <ProductGrid products={productos} />
    </div>
  )
}
