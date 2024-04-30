import Title from '../components/Title'
import ProductCard from '../components/ProductCard'
import supabase from '../supabase/client'
import { useEffect, useState } from 'react'

const Dashboard = () => {

  const [fetchError, setFetchError] = useState(null)
  const [productos, setProductos] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('productos')
        .select()

      if (error) {
        setFetchError("Error al cargar los productos")
        console.log('error', error)
        setProductos(null)
      }

      if (data) {
        setProductos(data)
        setFetchError(null)
      }
    }

    fetchProducts()

  }, [])

  return (
    <div className="m-5 flex flex-col">
      

      <section className=''>
        {/* <div className='flex flex-wrap w-full'> */}
        <Title title={"Productos"} />
        <div className=''>

          {fetchError && <p>{fetchError}</p>}
          {productos && productos.map(producto => (
            <ProductCard 
            key={producto.id} 
            id={producto.id}
            tipo={producto.tipo} 
            nombre={producto.nombre} 
            precio={producto.precio} />
          ))}

        </div>
      </section>

    </div>
  )
}

export default Dashboard