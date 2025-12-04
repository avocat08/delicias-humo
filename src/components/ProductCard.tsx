'use client'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

// Fix de typing para Next + Framer Motion v11+
const MotionDiv = motion.div as any

export default function ProductCard({ product }: { product: any }) {
  return (
    <MotionDiv 
      whileHover={{ y: -6 }}
      className={`card p-4 ${!product.disponible ? 'opacity-60' : ''}`}
    >
      <div className="relative h-44 w-full rounded-lg overflow-hidden">
        <img 
          src={product.imagen} 
          alt={product.nombre} 
          className="w-full h-full object-cover" 
        />
      </div>

      <h3 className="mt-3 text-white font-semibold">{product.nombre}</h3>

      <p className="text-gray-300 text-sm mt-1 h-12 overflow-hidden">
        {product.descripcion}
      </p>

      <div className="mt-4 flex items-center justify-between">
        <span className="font-bold text-brand">
          ${Number(product.precio).toFixed(2)}
        </span>

        <Link 
          href={`/productos/${product.id}`} 
          className="px-3 py-1 rounded-md bg-brand text-dark font-medium"
        >
          Ver
        </Link>
      </div>
    </MotionDiv>
  )
}
