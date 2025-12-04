// @ts-nocheck
'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { getProducto, crearPedido } from '../../lib/getData'

export default function CheckoutPage(){
  const searchParams = useSearchParams()
  const producto_id = searchParams?.get('producto_id')
  const cantidadParam = searchParams?.get('cantidad') || '1'

  const [cantidad, setCantidad] = useState(Number(cantidadParam))
  const [producto, setProducto] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [form, setForm] = useState({nombre:'', correo:'', telefono:'', direccion:'', comentarios:''})

  useEffect(()=>{
    if(!producto_id){
      setLoading(false)
      return
    }
    getProducto(producto_id).then((p:any)=>{
      setProducto(p)
      setLoading(false)
    })
  },[producto_id])

  async function handleSubmit(e:any){
    e.preventDefault()
    if(!form.nombre || !form.correo){
      alert('Nombre y correo son obligatorios')
      return
    }
    if(!producto){
      alert('Producto inválido')
      return
    }
    setSubmitting(true)
    const payload = {
      nombre: form.nombre,
      correo: form.correo,
      telefono: form.telefono,
      direccion: form.direccion,
      comentarios: form.comentarios,
      items: [ { producto_id: Number(producto.id), cantidad: Number(cantidad) } ]
    }

    const res = await crearPedido(payload)
    setSubmitting(false)
    if(res && res.success){
      setResult(res)
    } else {
      alert('Error al crear pedido')
    }
  }

  if(loading) return <div className="container py-8">Cargando...</div>
  if(result) return (
    <div className="container py-8">
      <h2 className="text-2xl font-semibold mb-4">Pedido creado</h2>
      <p className="mb-2">Código: <strong>{result.codigo}</strong></p>
      <p>Guarda este código para rastrear tu pedido.</p>
    </div>
  )

  return (
    <div className="container py-8 max-w-xl">
      <h1 className="text-2xl font-semibold mb-4">Finalizar pedido</h1>

      {producto ? (
        <div className="card p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">{producto.nombre}</div>
              <div className="text-sm text-gray-400">Cantidad: {cantidad}</div>
            </div>
            <div className="font-bold text-brand">${Number(producto.precio).toFixed(2)}</div>
          </div>
        </div>
      ) : <div className="text-gray-400 mb-4">Producto no especificado</div>}

      <form onSubmit={handleSubmit} className="card p-4">
        <label className="block">Nombre*</label>
        <input className="w-full p-2 mt-1 mb-3 bg-black border border-gray-800 rounded" value={form.nombre} onChange={(e)=>setForm({...form, nombre: e.target.value})} />

        <label className="block">Correo*</label>
        <input className="w-full p-2 mt-1 mb-3 bg-black border border-gray-800 rounded" value={form.correo} onChange={(e)=>setForm({...form, correo: e.target.value})} />

        <label className="block">Teléfono</label>
        <input className="w-full p-2 mt-1 mb-3 bg-black border border-gray-800 rounded" value={form.telefono} onChange={(e)=>setForm({...form, telefono: e.target.value})} />

        <label className="block">Dirección</label>
        <input className="w-full p-2 mt-1 mb-3 bg-black border border-gray-800 rounded" value={form.direccion} onChange={(e)=>setForm({...form, direccion: e.target.value})} />

        <label className="block">Comentarios</label>
        <textarea className="w-full p-2 mt-1 mb-3 bg-black border border-gray-800 rounded" value={form.comentarios} onChange={(e)=>setForm({...form, comentarios: e.target.value})} />

        <div className="flex gap-3">
          <button type="submit" className="btn-brand" disabled={submitting}>{submitting ? 'Enviando...' : 'Enviar pedido'}</button>
          <a href="/" className="btn-outline">Cancelar</a>
        </div>
      </form>
    </div>
  )
}
