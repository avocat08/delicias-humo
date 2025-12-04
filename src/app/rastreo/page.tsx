'use client'
import { useState } from 'react'
import { buscarPedidoPorCodigo } from '../../lib/getData'

export default function Rastreo(){
  const [codigo, setCodigo] = useState('')
  const [resultado, setResultado] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)

  async function buscar(){
    const c = codigo.trim()
    if (!c) { alert('Ingresa un código'); return }
    setLoading(true)
    setResultado(null)
    try{
      const data = await buscarPedidoPorCodigo(c)
      if (!data){
        alert('Pedido no encontrado')
        setResultado(null)
        setLoading(false)
        return
      }
      setResultado(data)
    }catch(e){
      console.error(e)
      alert('Error consultando el pedido')
      setResultado(null)
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-semibold mb-4">Rastreo de pedido</h1>
      <div className="max-w-md">
        <input id="codigo_rastreo" type="text" placeholder="Ingresa tu código" value={codigo} onChange={(e)=>setCodigo(e.target.value)} className="w-full p-3 rounded-md bg-black border border-gray-800 text-white" />
        <button onClick={buscar} className="mt-4 btn-brand" disabled={loading}>{loading ? 'Buscando...' : 'Buscar'}</button>
      </div>

      {resultado && (
        <div className="mt-8 card p-4">
          <h3 className="font-semibold">Pedido {resultado.codigo}</h3>
          {resultado.nombre_cliente && <div className="text-sm text-gray-400">Cliente: {resultado.nombre_cliente} — {resultado.correo}</div>}

          {resultado.items && resultado.items.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Items</h4>
              <ul className="text-sm text-gray-300">
                {resultado.items.map((it:any, i:number)=> (
                  <li key={i} className="py-1">{it.nombre} — {it.cantidad} x ${parseFloat(it.precio||0).toFixed(2)}</li>
                ))}
              </ul>
            </div>
          )}

          <ol className="mt-4">
            {resultado.historial && resultado.historial.map((h:any,i:number)=>(
              <li key={i} className="py-2 border-b border-gray-800">
                <div className="text-sm text-gray-400">{h.fecha}</div>
                <div className="font-medium">{h.estado}</div>
                {h.comentario && <div className="text-sm text-gray-300">{h.comentario}</div>}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}
