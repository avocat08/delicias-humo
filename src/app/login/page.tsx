"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loginAdmin } from '../../lib/getData'

export default function AdminLogin(){
  const router = useRouter()
  const [form, setForm] = useState({usuario:'', password:''})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e:any){
    e.preventDefault()
    setError(null)
    if(!form.usuario || !form.password){
      setError('Usuario y contraseña son obligatorios')
      return
    }
    setLoading(true)
    const res = await loginAdmin(form.usuario, form.password)
    setLoading(false)
    if(res && res.success){
      // redirect to admin productos
      router.push('/admin/productos')
    } else {
      // Show a generic message so we don't leak backend details
      setError('Usuario incorrecto')
    }
  }

  return (
    <div className="container py-8 max-w-md">
      <h1 className="text-2xl font-semibold mb-4">Ingresar al panel</h1>
      <form onSubmit={handleSubmit} className="card p-4">
        {error && <div className="mb-3 text-red-400">{error}</div>}
        <label className="block">Usuario</label>
        <input value={form.usuario} onChange={(e)=>setForm({...form, usuario: e.target.value})} className="w-full p-2 mt-1 mb-3 bg-black border border-gray-800 rounded" />

        <label className="block">Contraseña</label>
        <input type="password" value={form.password} onChange={(e)=>setForm({...form, password: e.target.value})} className="w-full p-2 mt-1 mb-3 bg-black border border-gray-800 rounded" />

        <div className="flex gap-3">
          <button type="submit" className="btn-brand" disabled={loading}>{loading ? 'Ingresando...' : 'Ingresar'}</button>
          <a href="/" className="btn-outline">Volver</a>
        </div>
      </form>
    </div>
  )
}
