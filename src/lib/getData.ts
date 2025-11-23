export async function getProductos() {
  try{
    const res = await fetch('/data/productos.json');
    if(!res.ok) throw new Error('No se pudieron cargar los productos');
    return res.json();
  }catch(e){
    console.error(e);
    return [];
  }
}
