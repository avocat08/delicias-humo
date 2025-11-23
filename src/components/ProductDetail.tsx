'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

export default function ProductDetail({ product }: { product: any }){
  const [cantidad, setCantidad] = useState(1)
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <div className="card p-6">
          <img src={product.imagen} alt={product.nombre} className="w-full h-96 object-cover rounded-md" />
          <h2 className="text-2xl font-semibold mt-4">{product.nombre}</h2>
          <p className="text-gray-300 mt-2">{product.descripcion}</p>
        </div>
      </div>
      <aside className="card p-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">Precio</div>
          <div className="text-xl font-bold text-brand">${product.precio.toFixed(2)}</div>
        </div>
        <div className="mt-4">
          <label className="text-gray-300">Cantidad</label>
          <input type="number" min={1} value={cantidad} onChange={(e)=>setCantidad(Number(e.target.value))} className="w-full mt-2 p-2 rounded-md bg-black border border-gray-800" />
        </div>
        <div className="mt-6 flex gap-3">
          <button className="btn-brand">Pedir (simular)</button>
          <button className="btn-outline">Agregar al carrito</button>
        </div>
      </aside>
    </div>
  )
}
