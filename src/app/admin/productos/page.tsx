'use client'
import { useEffect, useState } from 'react'
import { getProductos } from '../../../lib/getData'

interface Producto {
  id: number
  nombre: string
  descripcion: string
  precio: number
  disponible: number
  imagen: string
  categoria: string
}

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE as string) || 'https://uncomparable-margie-uglily.ngrok-free.dev/backend/api'

const fetchHeaders = {
  'ngrok-skip-browser-warning': 'true'
}

export default function AdminProductos(){
  const [productos, setProductos] = useState<Producto[]>([])
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null)
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    disponible: 1,
    imagen: null as File | null
  })
  const [loading, setLoading] = useState(false)
  const [listLoading, setListLoading] = useState(true)

  useEffect(() => {
    loadProductos()
  }, [])

  const loadProductos = async () => {
    try{
      setListLoading(true)
      const data = await getProductos()
      setProductos(data)
    }catch(e){
      console.error('loadProductos error', e)
      alert('Error al cargar productos desde el backend')
    }finally{
      setListLoading(false)
    }
  }

  const handleEditClick = (product: Producto) => {
    setEditingProduct(product)
    setFormData({
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio.toString(),
      disponible: product.disponible,
      imagen: null
    })
    setShowEditModal(true)
  }

  const handleDeleteClick = async (productId: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      return
    }

    try {
      setLoading(true)
      const res = await fetch(`${API_BASE}/products/delete_product.php?id=${productId}`, {
        method: 'GET',
        headers: fetchHeaders
      })
      const data = await res.json()
      if (data.success) {
        setProductos(productos.filter(p => p.id !== productId))
        alert('Producto eliminado correctamente')
      } else {
        alert('Error al eliminar: ' + data.message)
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Error al eliminar el producto')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name === 'disponible') {
      setFormData({ ...formData, [name]: parseInt(value) })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, imagen: e.target.files[0] })
    }
  }

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return

    try {
      setLoading(true)
      const formDataToSend = new FormData()
      formDataToSend.append('id', editingProduct.id.toString())
      formDataToSend.append('nombre', formData.nombre)
      formDataToSend.append('descripcion', formData.descripcion)
      formDataToSend.append('precio', formData.precio)
      formDataToSend.append('disponible', formData.disponible.toString())
      if (formData.imagen) {
        formDataToSend.append('imagen', formData.imagen)
      }

      const res = await fetch(`${API_BASE}/products/update_product.php`, {
        method: 'POST',
        headers: fetchHeaders,
        body: formDataToSend
      })
      const data = await res.json()
      if (data.success) {
        await loadProductos()
        setShowEditModal(false)
        alert('Producto actualizado correctamente')
      } else {
        alert('Error al actualizar: ' + data.message)
      }
    } catch (error) {
      console.error('Error updating product:', error)
      alert('Error al actualizar el producto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-semibold mb-4">Panel - Productos</h1>
      <div className="grid grid-cols-1 gap-4">
        {listLoading ? (
          <div className="text-sm text-gray-400">Cargando productos...</div>
        ) : productos.length === 0 ? (
          <div className="text-sm text-gray-400">No hay productos disponibles.</div>
        ) : (
          productos.map((p: Producto) => (
          <div key={p.id} className="card p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={p.imagen} alt={p.nombre} className="w-16 h-16 object-cover rounded-md" />
              <div>
                <div className="font-medium">{p.nombre}</div>
                <div className="text-sm text-gray-400">
                  ${p.precio} • {p.disponible ? 'Disponible' : 'No disponible'}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => handleEditClick(p)} 
                className="btn-outline"
                disabled={loading}
              >
                Editar
              </button>
              <button 
                onClick={() => handleDeleteClick(p.id)} 
                className="btn-outline hover:bg-red-500/10 hover:text-red-500"
                disabled={loading}
              >
                Eliminar
              </button>
            </div>
          </div>
          ))
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Editar Producto</h2>
            <form onSubmit={handleUpdateProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Descripción</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:border-orange-500 resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Precio</label>
                  <input
                    type="number"
                    name="precio"
                    value={formData.precio}
                    onChange={handleInputChange}
                    step="0.01"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Disponible</label>
                  <select
                    name="disponible"
                    value={formData.disponible}
                    onChange={(e) => setFormData({ ...formData, disponible: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value={1}>Sí</option>
                    <option value={0}>No</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Imagen</label>
                <div className="mb-2">
                  <img 
                    src={editingProduct.imagen} 
                    alt={editingProduct.nombre} 
                    className="w-full h-40 object-cover rounded-md border border-gray-700"
                  />
                </div>
                <input
                  type="file"
                  name="imagen"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-orange-600 file:text-white hover:file:bg-orange-700"
                />
                <p className="text-xs text-gray-400 mt-1">Déjalo vacío para mantener la imagen actual</p>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 rounded-md disabled:opacity-50"
                >
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  disabled={loading}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 rounded-md disabled:opacity-50"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
