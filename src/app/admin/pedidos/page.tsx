'use client'

export default function AdminPedidos(){
  const pedidos = [
    {id:1,codigo:'DEMO123',estado:'Pendiente de contacto',cliente:'Juan'},
    {id:2,codigo:'DEMO124',estado:'En preparación',cliente:'Maria'}
  ]
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-semibold mb-4">Panel - Pedidos (mock)</h1>
      <div className="grid gap-4">
        {pedidos.map(p=> (
          <div key={p.id} className="card p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{p.codigo} — {p.cliente}</div>
              <div className="text-sm text-gray-400">{p.estado}</div>
            </div>
            <div className="flex gap-2">
              <button className="btn-outline">Ver</button>
              <button className="btn-outline">Cambiar estado</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
