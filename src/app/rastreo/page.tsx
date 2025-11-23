'use client'
import { useState } from 'react'

export default function Rastreo(){
  const [codigo, setCodigo] = useState('')
  const [resultado, setResultado] = useState<any | null>(null)

  function buscar(){
    // mock
    if(codigo.trim().toLowerCase() === 'demo123'){
      setResultado({codigo:'DEMO123', historial:[
        {estado:'Pendiente de contacto', fecha:'2025-11-20 10:12'},
        {estado:'En preparación', fecha:'2025-11-21 14:00'},
        {estado:'Entregado', fecha:'2025-11-22 17:20'}
      ]})
    }else{
      setResultado(null)
      alert('Pedido no encontrado (usa DEMO123 para demo)')
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-semibold mb-4">Rastreo de pedido</h1>
      <div className="max-w-md">
        <input type="text" placeholder="Ingresa tu código" value={codigo} onChange={(e)=>setCodigo(e.target.value)} className="w-full p-3 rounded-md bg-black border border-gray-800 text-white" />
        <button onClick={buscar} className="mt-4 btn-brand">Buscar</button>
      </div>

      {resultado && (
        <div className="mt-8 card p-4">
          <h3 className="font-semibold">Pedido {resultado.codigo}</h3>
          <ol className="mt-4">
            {resultado.historial.map((h:any,i:number)=>(
              <li key={i} className="py-2 border-b border-gray-800">
                <div className="text-sm text-gray-400">{h.fecha}</div>
                <div className="font-medium">{h.estado}</div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}
