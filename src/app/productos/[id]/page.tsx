'use client'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { getProductos } from '../../../lib/getData'
import ProductDetail from '../../../components/ProductDetail'

export default function ProductoPage({ params }: any){
  const { id } = params
  const [producto, setProducto] = useState(null)

  useEffect(()=>{
    getProductos().then((list:any)=>{
      const p = list.find((x:any)=>String(x.id) === String(id))
      setProducto(p)
    })
  },[id])

  if(!producto) return <div className="container py-8">Producto no encontrado</div>

  return (
    <div className="container py-8">
      <ProductDetail product={producto} />
    </div>
  )
}
