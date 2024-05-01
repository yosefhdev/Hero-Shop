import Title from '../components/Title'
import ProductCard from '../components/ProductCard'
import supabase from '../supabase/client'
import { useEffect, useState } from 'react'
import { IconArrowUp } from '@tabler/icons-react';
import { IconArrowDown } from '@tabler/icons-react';
import { IconSortAZ } from '@tabler/icons-react';
import { IconClock } from '@tabler/icons-react';
import { IconCoin } from '@tabler/icons-react';

const Dashboard = () => {

	const [fetchError, setFetchError] = useState(null)
	const [productos, setProductos] = useState(null)
	const [orderBy, setOrderBy] = useState('created_at')
	const [asc, setAsc] = useState(true)
	// const [lastAsc, setLastAsc] = useState(true)

	const handleDelete = (id) => {
		setProductos(productoAnterior => {
			return productoAnterior.filter(producto => producto.id !== id)
		})
	}

	const handleOrder = (order) => {
		if (orderBy === order) {
			setAsc(!asc)
		} else {
			setOrderBy(order)
			setAsc(true)
		}
	}

	useEffect(() => {
		const fetchProducts = async () => {
			const { data, error } = await supabase
				.from('productos')
				.select()
				.order(orderBy, { ascending: asc })

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

	}, [orderBy, asc])

	return (
		<div className="m-5 flex flex-col">


			<section className=''>
				{/* <div className='flex flex-wrap w-full'> */}
				<Title title={"Productos"} />
				<div className='flex px-5 gap-x-5 w-full justify-end'>
					<p className='p-2'>Ordenar por:</p>
					<div className='p-2'>
						{!asc ? <IconArrowUp stroke={2} />
							: <IconArrowDown stroke={2} />}

					</div>
					<button onClick={() => handleOrder('created_at')} className={`flex items-center gap-1 p-2 border-b-2 ${orderBy === 'created_at' ? 'text-primary border-primary' : ''} hover:border-primary hover:text-primary`}>
						<IconClock stroke={2} />
						Creacion
					</button>
					<button onClick={() => handleOrder('nombre')} className={`flex items-center gap-1 p-2 border-b-2 ${orderBy === 'nombre' ? 'text-primary border-primary' : ''} hover:border-primary hover:text-primary`}>
						<IconSortAZ stroke={2} />
						Nombre
					</button>
					<button onClick={() => handleOrder('precio')} className={`flex items-center gap-1 p-2 border-b-2 ${orderBy === 'precio' ? 'text-primary border-primary' : ''} hover:border-primary hover:text-primary`}>
						<IconCoin stroke={2} />
						Precio
						{/* {!asc ? <svg xmlns="http://www.w3.org/2000/svg" className='size-5' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><polyline points="6 9 12 15 18 9" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" className='size-5' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><polyline points="6 15 12 9 18 15" /></svg>} */}
					</button>
				</div>
				<div>
					{fetchError && <p>{fetchError}</p>}
					{productos && productos.map(producto => (
						<ProductCard
							key={producto.id}
							id={producto.id}
							tipo={producto.tipo}
							nombre={producto.nombre}
							precio={producto.precio}
							onDelete={handleDelete}
						/>
					))}

				</div>
			</section>

		</div>
	)
}

export default Dashboard