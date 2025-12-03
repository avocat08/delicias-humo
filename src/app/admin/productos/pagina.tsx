'use client'
import { useEffect, useState } from 'react'
import { getProductos } from '../../../lib/getData'

export default function AdminProductos(){
  const [productos, setProductos] = useState([])
  useEffect(()=>{getProductos().then(d=>setProductos(d))},[])

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-semibold mb-4">Panel - Productos (mock)</h1>
      <div className="grid grid-cols-1 gap-4">
        {productos.map((p:any)=> (
          <div key={p.id} className="card p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={p.imagen} alt={p.nombre} className="w-16 h-16 object-cover rounded-md" />
              <div>
                <div className="font-medium">{p.nombre}</div>
                <div className="text-sm text-gray-400">{p.categoria}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="btn-outline">Editar</button>
              <button className="btn-outline">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
