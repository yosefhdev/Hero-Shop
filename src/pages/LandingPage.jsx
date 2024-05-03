import Title from '../components/Title'
import PublicProductCard from '../components/PublicProductCard'
import supabase from '../supabase/client'
import { Link } from 'react-router-dom'
import logo from '../assets/logos/Hero-Shop-logo.webp';
import { useEffect, useState } from 'react'
import { IconArrowUp } from '@tabler/icons-react';
import { IconArrowDown } from '@tabler/icons-react';
import { IconSortAZ } from '@tabler/icons-react';
import { IconClock } from '@tabler/icons-react';
import { IconCoin } from '@tabler/icons-react';
import { IconSearch } from '@tabler/icons-react';
import { IconTags } from '@tabler/icons-react';

const LandingPage = () => {
	const [fetchError, setFetchError] = useState(null)
	const [productos, setProductos] = useState(null)
	const [orderBy, setOrderBy] = useState('created_at')
	const [asc, setAsc] = useState(true)
	const [articulo, setArticulo] = useState('')

	const handleOrder = (order) => {
		if (orderBy === order) {
			setAsc(!asc)
		} else {
			setOrderBy(order)
			setAsc(true)
		}
	}

	const handleArticulo = (e) => {
		e.preventDefault()
		setArticulo(e.target.value)

		fetchSingleProducts()
	}

	const fetchSingleProducts = async () => {
		const { data, error } = await supabase
			.from('productos')
			.select()
			.order(orderBy, { ascending: asc })
			.ilike('nombre', `%${articulo}%`, {
				type: 'websearch'
			})

		if (error) {
			setFetchError("Error al cargar los productos")
			console.log('error', error)
			setProductos(null)
		}

		if (data.length <= 0) {
			setFetchError("No se encontraron productos con ese nombre")
			setProductos(null)
		}

		if (data && data.length > 0) {
			setProductos(data)
			setFetchError(null)
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
		if (articulo === '') {
			fetchProducts()
		}


	}, [orderBy, asc, articulo])

	return (
		<div>
			{/* Navbar */}
			<header className='flex justify-between w-full p-5 bg-primary'>
				<Link to="/" className="flex items-center">
					<img src={logo} className="rounded-full mr-3 h-6 sm:h-9" alt="Flowbite Logo" />
					<span className="self-center text-xl font-semibold whitespace-nowrap text-white">Hero-Shop</span>
				</Link>

				<form className="flex items-center max-w-sm mx-auto">
					<label htmlFor="simple-search" className="sr-only">Search</label>
					<div className="relative w-full">
						<div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
							<IconTags className='size-4 text-gray-500' stroke={2} />
						</div>
						<input type="text" id="simple-search"
							className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  "
							placeholder="Buscar"
							required
							onChange={(e) => setArticulo(e.target.value)} />
					</div>
					<button type="submit" onClick={handleArticulo}
						className="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 ">
						<IconSearch className='size-6' stroke={2} />
						<span className="sr-only">Buscar</span>
					</button>
				</form>

				<div className='flex items-center'>
					<Link to="/login" className="text-white border-b-2 border-primary hover:border-white ">Iniciar Sesion</Link>
				</div>
			</header>

			{/* Contenido */}
			<div className="flex flex-col justify-center items-center mx-auto max-w-[1200px] p-5">

				<section>

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
					<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
						{fetchError && <p>{fetchError}</p>}
						{productos && productos.map(producto => (
							<PublicProductCard
								key={producto.id}
								id={producto.id}
								tipo={producto.tipo}
								nombre={producto.nombre}
								precio={producto.precio}
							/>
						))}
					</div>
				</section>
			</div>
		</div>
	)
}

export default LandingPage 