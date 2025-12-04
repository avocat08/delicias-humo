'use client'
import { use, useEffect, useState } from 'react'
import { getProducto } from '../../../lib/getData'
import ProductDetail from '../../../components/ProductDetail'

export default function ProductoPage({ params }: any){
  const { id } = use(params)
  const [producto, setProducto] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    if(!id) return
    getProducto(id).then((p:any)=>{
      setProducto(p)
      setLoading(false)
    })
  },[id])

  if(loading) return <div className="container py-8">Cargando...</div>
  if(!producto) return <div className="container py-8">Producto no encontrado</div>

  return (
    <div className="container py-8">
      <ProductDetail product={producto} />
    </div>
  )
}
