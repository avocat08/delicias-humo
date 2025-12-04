const API_BASE = (process.env.NEXT_PUBLIC_API_BASE as string) || 'https://uncomparable-margie-uglily.ngrok-free.dev/backend/api'

const fetchHeaders = {
  'ngrok-skip-browser-warning': 'true'
}

// Base URL to use for images. Prefer explicit env var if provided,
// otherwise derive from `API_BASE` by removing the trailing `/api` segment.
const BACKEND_BASE = (process.env.NEXT_PUBLIC_BACKEND_BASE as string) || API_BASE.replace(/\/api\/?$/, '')

function resolveImagePath(img: string | null | undefined) {
  if (!img) return img
  // already absolute
  if (/^https?:\/\//i.test(img)) return img
  // build URL using BACKEND_BASE
  return `${BACKEND_BASE.replace(/\/$/, '')}/${String(img).replace(/^\/+/, '')}`
}

export async function getProductos() {
  try{
    const res = await fetch(`${API_BASE}/products/get_products.php`, {
      headers: fetchHeaders
    })
    if(!res.ok) throw new Error('No se pudieron cargar los productos')
    const data = await res.json()
    if (Array.isArray(data)) {
      return data.map((p:any) => ({ ...p, imagen: resolveImagePath(p.imagen) }))
    }
    return data
  }catch(e){
    console.error('getProductos error', e)
    return []
  }
}

export async function getProducto(id: string | number) {
  try{
    if (!id) return null
    const res = await fetch(`${API_BASE}/products/get_product.php?id=${encodeURIComponent(id)}`, {
      headers: fetchHeaders
    })
    if (!res.ok) return null
    const data = await res.json()
    if (data) {
      if (data.imagen) data.imagen = resolveImagePath(data.imagen)
      if (Array.isArray(data.items)) {
        data.items = data.items.map((it:any) => ({ ...it, imagen: resolveImagePath(it.imagen) }))
      }
    }
    return data
  }catch(e){
    console.error('getProducto error', e)
    return null
  }
}

export async function buscarPedidoPorCodigo(codigo: string){
  try{
    if (!codigo || !codigo.trim()) return null
    const res = await fetch(`${API_BASE}/orders/get_order_by_code.php?codigo=${encodeURIComponent(codigo.trim())}`, {
      headers: fetchHeaders
    })
    if (!res.ok) return null
    const data = await res.json()
    return data
  }catch(e){
    console.error('buscarPedidoPorCodigo error', e)
    return null
  }
}

export async function getOrders() {
  try{
    const res = await fetch(`${API_BASE}/orders/get_orders.php`, {
      headers: fetchHeaders
    })
    if(!res.ok) throw new Error('No se pudieron cargar los pedidos')
    const data = await res.json()
    if (Array.isArray(data)) {
      return data.map((o:any) => {
        if (Array.isArray(o.items)) {
          o.items = o.items.map((it:any) => ({ ...it, imagen: resolveImagePath(it.imagen) }))
        }
        // if the order itself has an image field
        if (o.imagen) o.imagen = resolveImagePath(o.imagen)
        return o
      })
    }
    return data
  }catch(e){
    console.error('getOrders error', e)
    return []
  }
}
export async function crearPedido(pedidoData: {
  nombre: string
  correo: string
  telefono?: string
  direccion?: string
  comentarios?: string
  items: Array<{ producto_id: number; cantidad: number }>
}) {
  try{
    const res = await fetch(`${API_BASE}/orders/create_order.php`, {
      method: 'POST',
      headers: {
        ...fetchHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pedidoData)
    })
    if (!res.ok) {
      // try to parse json error
      let body
      try { body = await res.json() } catch(_) { body = null }
      throw new Error((body && body.error) ? body.error : 'Error al crear pedido')
    }
    return await res.json()
  }catch(e){
    console.error('crearPedido error', e)
    return null
  }
}

export async function loginAdmin(usuario: string, password: string) {
  try{
    const res = await fetch(`${API_BASE}/admin/login.php`, {
      method: 'POST',
      headers: {
        ...fetchHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ usuario, password })
    })
    // Try to parse JSON safely. If the response is HTML (ngrok warning, PHP error, etc.)
    // parsing will fail and we return a generic failure to avoid the JSON.parse exception.
    let data: any = null
    try {
      data = await res.json()
    } catch (err) {
      console.error('loginAdmin: response not JSON', err)
      return { success: false, error: 'Usuario incorrecto' }
    }

    if (!res.ok) {
      return { success: false, error: data?.error || 'Usuario incorrecto' }
    }

    // Normalize success response
    if (data && data.success) return data
    return { success: false, error: 'Usuario incorrecto' }
  }catch(e){
    console.error('loginAdmin error', e)
    return { success: false, error: String(e) }
  }
}
