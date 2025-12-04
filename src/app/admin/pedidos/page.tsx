'use client'
import { useEffect, useState } from 'react'
import { getOrders } from '../../../lib/getData'

type PedidoRaw = any

type Pedido = {
  id: number
  codigo: string
  estado: string
  cliente: string
  _raw?: PedidoRaw
}

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE as string) || 'https://uncomparable-margie-uglily.ngrok-free.dev/backend/api'

const fetchHeaders = {
  'ngrok-skip-browser-warning': 'true'
}

export default function AdminPedidos(){
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [listLoading, setListLoading] = useState(true)
  const [loadingId, setLoadingId] = useState<number | null>(null)

  const estados = [
    'Pendiente de contacto',
    'En preparación',
    'Listo para recoger',
    'Entregado',
    'Cancelado'
  ]

  const loadPedidos = async () => {
    try{
      setListLoading(true)
      const data = await getOrders()
      // Normalize to fields we use in the UI
      const normalized = (data || []).map((o: any) => ({
        id: o.id,
        codigo: o.codigo ?? o.code ?? `#${o.id}`,
        cliente: o.cliente ?? o.nombre ?? o.customer_name ?? '',
        estado: o.estado_actual ?? o.estado ?? 'Pendiente de contacto',
        _raw: o
      }))
      setPedidos(normalized)
    }catch(e){
      console.error('loadPedidos error', e)
      alert('Error al cargar pedidos desde el backend')
    }finally{
      setListLoading(false)
    }
  }

  useEffect(() => { loadPedidos() }, [])

  const handleEstadoChange = async (pedidoId: number, nuevoEstado: string) => {
    const prev = pedidos.find(p => p.id === pedidoId)?.estado
    setLoadingId(pedidoId)
    try{
      const res = await fetch(`${API_BASE}/orders/update_order_state.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...fetchHeaders },
        body: JSON.stringify({ pedido_id: pedidoId, nuevo_estado: nuevoEstado, comentario: '', changed_by: 'admin' })
      })

      if(!res.ok){
        const t = await res.text()
        throw new Error(t || 'Error en la petición')
      }

      const data = await res.json()
      if(data && data.success){
        setPedidos(prevList => prevList.map(p => p.id === pedidoId ? { ...p, estado: nuevoEstado } : p))
      }else{
        alert('Error al actualizar: ' + (data?.message || JSON.stringify(data)))
        setPedidos(prevList => prevList.map(p => p.id === pedidoId ? { ...p, estado: prev ?? p.estado } : p))
      }
    }catch(e){
      console.error('update_order_state error', e)
      alert('Error al actualizar el estado')
      setPedidos(prevList => prevList.map(p => p.id === pedidoId ? { ...p, estado: prev ?? p.estado } : p))
    }finally{
      setLoadingId(null)
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-semibold mb-4">Panel - Pedidos</h1>
      <div className="grid gap-4">
        {listLoading ? (
          <div className="text-sm text-gray-400">Cargando pedidos...</div>
        ) : pedidos.length === 0 ? (
          <div className="text-sm text-gray-400">No hay pedidos.</div>
        ) : (
          pedidos.map(p => (
            <div key={p.id} className="card p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">{p.codigo} — {p.cliente}</div>
                <div className="text-sm text-gray-400">{p.estado}</div>
              </div>
              <div className="flex gap-2 items-center">
                <select
                  value={p.estado}
                  onChange={(e) => handleEstadoChange(p.id, e.target.value)}
                  disabled={loadingId === p.id}
                  className="bg-white text-gray-900 border border-gray-300 rounded-md px-2 py-1 text-sm"
                  style={{minWidth: 220}}
                >
                  {estados.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {loadingId === p.id && <div className="text-sm text-gray-400 ml-2">Guardando...</div>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
