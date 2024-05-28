import ProductCard from '../components/ProductCard'
import Loader from '../components/Loader'
import supabase from '../supabase/client'
import { useEffect, useState } from 'react'
import { useAuth } from './auth';
import { IconArrowUp } from '@tabler/icons-react';
import { IconArrowDown } from '@tabler/icons-react';
import { IconSortAZ } from '@tabler/icons-react';
import { IconClock } from '@tabler/icons-react';
import { IconCoin } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom'
import { IconUserCircle } from '@tabler/icons-react';
import logo from '../assets/logos/Hero-Shop-logo.webp';
import { IconSearch } from '@tabler/icons-react';
import { Link } from "react-router-dom";
import { IconBrandMeta } from '@tabler/icons-react';
import { IconBrandXdeep } from '@tabler/icons-react';
import { IconBrandInstagram } from '@tabler/icons-react';
import { IconLetterJSmall } from '@tabler/icons-react';
// import { IconLogout } from '@tabler/icons-react';

// eslint-disable-next-line react/prop-types
const Dashboard = () => {
	const navigate = useNavigate();

	const { isAuthenticated } = useAuth();
	const [userData, setUserData] = useState(null);

	useEffect(() => {
		const fetchUserData = async () => {
			const { data: { user } } = await supabase.auth.getUser();
			if (user) {
				console.log('user.id', user.id)
				let { data, error } = await supabase
					.from('usuarios')
					.select("*")
					.eq('id', user.id)

				if (error) {
					console.error('Error al cargar el usuario:', error.message);
					return;
				}

				if (data) {
					let rol = data[0].rol;
					if (rol === 2) {
						navigate('/access-denied')
					}
					setIsLoading(false);
					setUserData(data[0]);
				}
			}
		};

		if (isAuthenticated) {
			fetchUserData();
		}
	}, [isAuthenticated, navigate]);

	const [fetchError, setFetchError] = useState(null)
	const [productos, setProductos] = useState(null)
	const [orderBy, setOrderBy] = useState('created_at')
	const [asc, setAsc] = useState(true)
	const [articulo, setArticulo] = useState('')

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

	// eslint-disable-next-line no-unused-vars
	const handleLogOut = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error('Error al cerrar sesión:', error.message);
		} else {
			// Redirigir al usuario a la página de inicio o realizar otras acciones
			console.log('Sesión cerrada correctamente');
		}
		navigate('/')
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
	/* SELECCIONAR SOLO POR CATEGORIA*/
	const handleFilterByCategory = async (category) => {
		// Aquí debes adaptar la lógica para obtener los productos de una categoría específica
		const { data, error } = await supabase
			.from('productos')
			.select()
			.eq('categoria', category)
			.order(orderBy, { ascending: asc });

		if (error) {
			setFetchError("Error al cargar los productos");
			console.error('error', error);
			setProductos(null);
		}

		if (data.length <= 0) {
			setFetchError("No se encontraron productos en esa categoría");
			setProductos(null);
		}

		if (data && data.length > 0) {
			setProductos(data);
			setFetchError(null);
		}
	}

	const [isLoading, setIsLoading] = useState(true);
	if (isLoading) {
		return <Loader />
	}

	return (
		<>
			<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
			<style>
				{`
        :root {
          --primary-color: #1c50cb;
          --background-color: #fff;
		  --dark-color: #151515;
		  --red-color: #e10c0c;
		  --Orange-color: #f5af36;
		  --Blue-label-de-jonny-walker: #21bfe2;
		  --dark-blue: #251d4e;
		  --Color-Paleta-2: #3bb273;
		  --background-color-rojito: #dd9519;
        }
        html {
          font-size: 62.5%;
          overflow-x: hidden;
          font-family: "Poppins", sans-serif;
        }
        /* Define otros estilos globales */
      `}
			</style>
			<div>
				<header>
					<div className="bg-[color:var(--background-color)]">
						<div className="flex justify-between items-center ml-20 px-0 py-[0.3rem]">
							<div className="flex items-center gap-2" >
								<Link to="/" className="flex items-center">
									<img src={logo} className="rounded-full mr-3 h-6 sm:h-9" alt="Flowbite Logo" /></Link>
								<h1 className="no-underline text-[color:var(--red-color)] text-5xl uppercase tracking-[-1px] font-[Poppins] font-bold"><a href="/">Hero-shop Administrador</a></h1>
							</div>
							<div className="flex gap-4 cursor-pointer">

								{isAuthenticated && userData && (
									<p className='mt-[2%] text-right'>
										<a className='text-[#1C50CB] text-[15px]'>Bienvenido, {`${userData.nombre}`} </a>
										<br />
										<a className='text-[#e10c0c] text-[15px]' onClick={handleLogOut}>Cerrar sesion</a>
									</p>
								)}
								<IconUserCircle stroke={1.5} size={65} style={{ color: 'var(--primary-color)', margin: '-.9rem -.1rem', paddingRight: '2rem', paddingLeft: '.7rem' }} />

							</div>
						</div>
					</div>

					<div>
						<div className="bg-[color:var(--primary-color)] mr-0 justify-between flex">
							<nav className="justify-between flex ml-[2.5%] px-4 lg:px-6 py-2.5 border-gray-200">
								<i className="fa-solid hidden"></i>
								<ul className="flex gap-8 mr-[10%] mt-[1.2%]">
									<li className='list-style: none'><Link className='no-underline text-[1.3rem] text-[color:var(--background-color)] font-semibold uppercase relative after:w-6 after:h-px after:bg-[color:var(--Blue-label-de-jonny-walker)] after:absolute after:bottom-[-3px] after:-translate-x-2/4 after:translate-y-2/4 after:opacity-0 after:transition-all after:duration-[0.3s] after:ease-[ease] after:left-2/4 hover:after:opacity-100 hover:text-[color:var(--Blue-label-de-jonny-walker)]' to="/dashboard">Pedidos <span className='absolute bottom-[-3px] left-2/4 transform -translate-x-2/4 -translate-y-2/4 bg-[color:var(--Blue-label-de-jonny-walker)] w-6 h-[1px] opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-100'></span></Link></li>
									<li className='list-style: none'><Link className='no-underline text-[1.3rem] text-[color:var(--background-color)] font-semibold uppercase relative after:w-6 after:h-px after:bg-[color:var(--Blue-label-de-jonny-walker)] after:absolute after:bottom-[-3px] after:-translate-x-2/4 after:translate-y-2/4 after:opacity-0 after:transition-all after:duration-[0.3s] after:ease-[ease] after:left-2/4 hover:after:opacity-100 hover:text-[color:var(--Blue-label-de-jonny-walker)]' to="/create-category">Agregar Categoria</Link></li>
									<li className='list-style: none'><Link className='no-underline text-[1.3rem] text-[color:var(--background-color)] font-semibold uppercase relative after:w-6 after:h-px after:bg-[color:var(--Blue-label-de-jonny-walker)] after:absolute after:bottom-[-3px] after:-translate-x-2/4 after:translate-y-2/4 after:opacity-0 after:transition-all after:duration-[0.3s] after:ease-[ease] after:left-2/4 hover:after:opacity-100 hover:text-[color:var(--Blue-label-de-jonny-walker)]' to="/dashboard">Inicio</Link></li>
									<li className='list-style: none'><Link className='no-underline text-[1.3rem] text-[color:var(--background-color)] font-semibold uppercase relative after:w-6 after:h-px after:bg-[color:var(--Blue-label-de-jonny-walker)] after:absolute after:bottom-[-3px] after:-translate-x-2/4 after:translate-y-2/4 after:opacity-0 after:transition-all after:duration-[0.3s] after:ease-[ease] after:left-2/4 hover:after:opacity-100 hover:text-[color:var(--Blue-label-de-jonny-walker)]' to="/dashboard">Venta</Link></li>
									<li className='list-style: none'><Link className='no-underline text-[1.3rem] text-[color:var(--background-color)] font-semibold uppercase relative after:w-6 after:h-px after:bg-[color:var(--Blue-label-de-jonny-walker)] after:absolute after:bottom-[-3px] after:-translate-x-2/4 after:translate-y-2/4 after:opacity-0 after:transition-all after:duration-[0.3s] after:ease-[ease] after:left-2/4 hover:after:opacity-100 hover:text-[color:var(--Blue-label-de-jonny-walker)]' to="/dashboard">Devoluciones</Link></li>
									<li className='list-style: none'><Link className='no-underline text-[1.3rem] text-[color:var(--background-color)] font-semibold uppercase relative after:w-6 after:h-px after:bg-[color:var(--Blue-label-de-jonny-walker)] after:absolute after:bottom-[-3px] after:-translate-x-2/4 after:translate-y-2/4 after:opacity-0 after:transition-all after:duration-[0.3s] after:ease-[ease] after:left-2/4 hover:after:opacity-100 hover:text-[color:var(--Blue-label-de-jonny-walker)]' to="/dashboard">Quejas/sugerencias</Link></li>
									<li className='list-style: none'><Link className='no-underline text-[1.3rem] text-[color:var(--background-color)] font-semibold uppercase relative after:w-6 after:h-px after:bg-[color:var(--Blue-label-de-jonny-walker)] after:absolute after:bottom-[-3px] after:-translate-x-2/4 after:translate-y-2/4 after:opacity-0 after:transition-all after:duration-[0.3s] after:ease-[ease] after:left-2/4 hover:after:opacity-100 hover:text-[color:var(--Blue-label-de-jonny-walker)]' to="/dashboard">Usuarios</Link></li>
								</ul>

								<form className="relative flex bg-white h-[4.4rem] overflow-hidden mr-[-18%] rounded-[2rem] border-2 border-solid border-white" style={{ alignItems: 'right' }}>
									<input className='w-[25rem] text-[1.4rem] text-[#777] cursor-pointer px-8 py-0 border-[none]' style={{ outline: 'none', WebkitAppearance: 'none' }} type="text" id="simple-search" placeholder="Buscar..."
										required
										onChange={(e) => setArticulo(e.target.value)} />
									<button type="submit" className="bg-[color:var(--primary-color)] flex items-center justify-center h-full p-4 border-[none];" onClick={handleArticulo}>
										<IconSearch className='text-[2rem] text-white' stroke={3} size='2rem' style={{ color: '#fff' }} />
									</button>

								</form>
							</nav>
						</div>
					</div>
				</header>
				<main className="main-content">
					{/*Poner flex flex-col para elemento dinamico insertado abajo*/}
					<section className="max-w-[110rem] mx-auto my-0 gap-8 mb-12">
						<br />
						<h1 className="text-center font-medium text-5xl">Categorias disponibles</h1>
						<br />
						<div className=" max-w-[120rem] mx-auto my-0 grid grid-cols-[repeat(4,1fr)] gap-12 ">
							<div className="h-80 flex flex-col items-center justify-center gap-8 rounded-[2rem] bg-[linear-gradient(#0000,#000000),url('https://i.ibb.co/4ZpQ4HZ/Playeras.webp')] bg-cover bg-center bg-no-repeat" onClick={() => handleFilterByCategory(1)}>
								<p className='text-[2.5rem] text-white capitalize relative after:w-10 after:h-0.5 after:bg-white after:absolute after:bottom-[-1rem] after:-translate-x-2/4 after:translate-y-2/4 after:left-2/4' onClick={() => handleFilterByCategory(1)}>Playeras</p>
								<span className='text-[1.6rem] text-white cursor-pointer hover:text-[color:var(--Blue-label-de-jonny-walker)]' onClick={() => handleFilterByCategory(1)}>Ver</span>
							</div>
							<div className="h-80 flex flex-col items-center justify-center gap-8 rounded-[2rem] bg-[linear-gradient(#0000,#000000),url('https://i.ibb.co/LCH6MXv/Pines.webp')] bg-cover bg-center bg-no-repeat" onClick={() => handleFilterByCategory(3)}>
								<p className='text-[2.5rem] text-white capitalize relative after:w-10 after:h-0.5 after:bg-white after:absolute after:bottom-[-1rem] after:-translate-x-2/4 after:translate-y-2/4 after:left-2/4' onClick={() => handleFilterByCategory(3)}>Pines Metalicos</p>
								<span className='text-[1.6rem] text-white cursor-pointer hover:text-[color:var(--Blue-label-de-jonny-walker)]' onClick={() => handleFilterByCategory(3)}>Ver</span>
							</div>
							<div className="h-80 flex flex-col items-center justify-center gap-8 rounded-[2rem] bg-[linear-gradient(#0000,#000000),url('https://img.fantaskycdn.com/d89f20eaba6182c83b81b32cdf29e799\_900x.jpg')] bg-cover bg-center bg-no-repeat" onClick={() => handleFilterByCategory(4)}>
								<p className='text-[2.5rem] text-white capitalize relative after:w-10 after:h-0.5 after:bg-white after:absolute after:bottom-[-1rem] after:-translate-x-2/4 after:translate-y-2/4 after:left-2/4' onClick={() => handleFilterByCategory(4)}>Cuadros</p>
								<span className='text-[1.6rem] text-white cursor-pointer hover:text-[color:var(--Blue-label-de-jonny-walker)]' onClick={() => handleFilterByCategory(4)}>Ver</span>
							</div>
							<div className="h-80 flex flex-col items-center justify-center gap-8 rounded-[2rem] bg-[linear-gradient(#0000,#000000),url('https://i.ibb.co/GT3sQbF/Otros.jpg')] bg-cover bg-center bg-no-repeat" onClick={() => handleFilterByCategory(2)}>
								<p className='text-[2.5rem] text-white capitalize relative after:w-10 after:h-0.5 after:bg-white after:absolute after:bottom-[-1rem] after:-translate-x-2/4 after:translate-y-2/4 after:left-2/4' onClick={() => handleFilterByCategory(2)}>Otros</p>
								<span className='text-[1.6rem] text-white cursor-pointer hover:text-[color:var(--Blue-label-de-jonny-walker)]' onClick={() => handleFilterByCategory(2)}>Ver</span>
							</div>
						</div>
					</section>

					<section className='max-w-[110rem] mx-auto my-0 flex flex-col gap-8 mb-4'>
						<div className='flex justify-center gap-8 mb-4'>
							<p className='text-[#1C50CB] text-[15px] font-[Poppins] font-bold'><a>Ordenar por:</a></p>
							<div className='text-[#1C50CB] text-[15px] font-[bold]'>
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
							<span className="text-[var(--background-color)] bg-[var(--red-color)] text-[1.4rem] capitalize cursor-pointer ml-[3%] px-12 py-[0.7rem] rounded-[2rem] hover:bg-[var(--red-color)] hover:text-[var(--background-color-rojito)] active:bg-[var(--primary-color)] active:text-[var(--Blue-label-de-jonny-walker)]"><a href="/Create-product">Crear producto</a></span>

						</div>





						{/* Contenedor de productos */}
						<div className='grid gap-12 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4'>
							{fetchError && <p>{fetchError}</p>}
							{productos && productos.map(producto => (
								<ProductCard
									key={producto.id}
									id={producto.id}
									imagen={producto.img_url}
									tipo={producto.tipo}
									nombre={producto.nombre}
									precio={producto.precio}
									onDelete={handleDelete}
								/>
							))}
						</div>
						{/* Controles de paginación */}
						<h1 className="text-center font-medium text-5xl">Página</h1>
						<div className="flex justify-center gap-8 mb-4">
							<span className="text-[var(--background-color)] bg-[var(--primary-color)] text-[1.4rem] capitalize cursor-pointer px-12 py-[0.7rem] rounded-[2rem] hover:bg-[var(--primary-color)] hover:text-[var(--Blue-label-de-jonny-walker)] active:bg-[var(--primary-color)] active:text-[var(--Blue-label-de-jonny-walker)]">Anterior</span>
							<span className='text-[var(--background-color)] bg-[var(--primary-color)] text-[1.4rem] capitalize cursor-pointer px-12 py-[0.7rem] rounded-[2rem] hover:bg-[var(--primary-color)] hover:text-[var(--Blue-label-de-jonny-walker)] active:bg-[var(--primary-color)] active:text-[var(--Blue-label-de-jonny-walker)]'>Siguiente</span>
						</div>
					</section>
					<br />
				</main>
				{/*Parte del Footer*/}
				<div className='bg-[#1C50CB]'>
					<div className='flex flex-col p-16'>
						<div className='flex justify-between items-start flex-row flex-wrap w-full text-left mb-8'>
							<div className='w-[150px] flex justify-start flex-col text-[white] m-4 mx-0 my-4'>
								<h4 className='text-2xl leading-[19px] mb-[0.9rem] '>Negocios</h4>
								<a href="/dashboard">
									<p className='text-xl leading-[15px] cursor-pointer mx-0 my-2 hover:text-[var(--Blue-label-de-jonny-walker)]'>Empleadora</p>
								</a>
								<a href="/dashboard">
									<p className='text-xl leading-[15px] cursor-pointer mx-0 my-2 hover:text-[var(--Blue-label-de-jonny-walker)]'>Patrocinadores</p>
								</a>
								<a href="/dashboard">
									<p className='text-xl leading-[15px] cursor-pointer mx-0 my-2 hover:text-[var(--Blue-label-de-jonny-walker)]'>Vendedores</p>
								</a>
							</div>


							<div className='w-[150px] flex justify-start flex-col text-[white] m-4 mx-0 my-4'>
								<h4 className='text-2xl leading-[19px] mb-[0.9rem]'>Recursos</h4>
								<a href="/dashboard">
									<p className='text-xl leading-[15px] cursor-pointer mx-0 my-2 hover:text-[var(--Blue-label-de-jonny-walker)]'>Control de calidad</p>
								</a>
								<a href="/dashboard">
									<p className='text-xl leading-[15px] cursor-pointer mx-0 my-2 hover:text-[var(--Blue-label-de-jonny-walker)]'>Materiales</p>
								</a>
								<a href="/dashboard">
									<p className='text-xl leading-[15px] cursor-pointer mx-0 my-2 hover:text-[var(--Blue-label-de-jonny-walker)]'>Diseños</p>
								</a>
							</div>



							<div className='w-[150px] flex justify-start flex-col text-[white] m-4 mx-0 my-4'>
								<h4 className='text-2xl leading-[19px] mb-[0.9rem]'>Socios</h4>
								<a href="/dashboard">
									<p className='text-xl leading-[15px] cursor-pointer mx-0 my-2 hover:text-[var(--Blue-label-de-jonny-walker)]'>Neko-beads</p>
								</a>
								<a href="/dashboard">
									<p className='text-xl leading-[15px] cursor-pointer mx-0 my-2 hover:text-[var(--Blue-label-de-jonny-walker)]'>Calcetos shop</p>
								</a>
							</div>

							<div className='w-[150px] flex justify-start flex-col text-[white] m-4 mx-0 my-4'>
								<h4 className='text-2xl leading-[19px] mb-[0.9rem]'>Hero-shop</h4>
								<a href="/dashboard">
									<p className='text-xl leading-[15px] cursor-pointer mx-0 my-2 hover:text-[var(--Blue-label-de-jonny-walker)]'>Sobre Nosotros</p>
								</a>
								<a href="/dashboard">
									<p className='text-xl leading-[15px] cursor-pointer mx-0 my-2 hover:text-[var(--Blue-label-de-jonny-walker)]'>Politica de devoluciones</p>
								</a>
								<a href="/dashboard">
									<p className='text-xl leading-[15px] cursor-pointer mx-0 my-2 hover:text-[var(--Blue-label-de-jonny-walker)]'>Politica de reembolsos</p>
								</a>
								<a href="/dashboard">
									<p className='text-xl leading-[15px] cursor-pointer mx-0 my-2 hover:text-[var(--Blue-label-de-jonny-walker)]'>Politica de promociones</p>
								</a>
							</div>


							<div className='w-[150px] flex justify-start flex-col text-[white] m-4 mx-0 my-4'>
								<h4 className='text-2xl leading-[19px] mb-[0.9rem]'>Más</h4>
								<a href="/dashboard">
									<p className='text-xl leading-[15px] cursor-pointer mx-0 my-2 hover:text-[var(--Blue-label-de-jonny-walker)]'>Metodos de pago</p>
								</a>
								<a href="/dashboard">
									<p className='text-xl leading-[15px] cursor-pointer mx-0 my-2 hover:text-[var(--Blue-label-de-jonny-walker)]'>Tipos de envios</p>
								</a>
								<a href="/dashboard">
									<p className='text-xl leading-[15px] cursor-pointer mx-0 my-2 hover:text-[var(--Blue-label-de-jonny-walker)]'>Información de pago seguro</p>
								</a>
								<a href="/dashboard">
									<p className='text-xl leading-[15px] cursor-pointer mx-0 my-2 hover:text-[var(--Blue-label-de-jonny-walker)]'>Contactos</p>
								</a>
							</div>

							<div className='w-[150px] flex justify-start flex-col text-[white] m-4 mx-0 my-4'>
								<h4 className='text-2xl leading-[19px] mb-[0.9rem]'>Encuentranos en:</h4>
								<div className='flex flex-row'>
									<p className='text-xs leading-[15px] cursor-pointer mx-0 my-2'><a href="https://facebook.com/HeroShop.15" target="_blank" rel="noopener noreferrer">
										<IconBrandMeta className='w-4/5' stroke={2} />
									</a>
									</p>
									<p className='text-xs leading-[15px] cursor-pointer mx-0 my-2'><a href="https://twitter.com/home?lang=es" target="_blank" rel="noopener noreferrer">
										<IconBrandXdeep className='w-4/5' stroke={2} />
									</a>
									</p>
									<p className='text-xs leading-[15px] cursor-pointer mx-0 my-2'><a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
										<IconBrandInstagram className='w-4/5' stroke={2} />
									</a>
									</p>
									<p className='text-xs leading-[15px] cursor-pointer mx-0 my-2'><a href="https://www.tiktok.com/" target="_blank" rel="noopener noreferrer">
										<IconLetterJSmall className='w-4/5' stroke={3} />
									</a>
									</p>
								</div>
							</div>
						</div>
						<hr className='text-[white] w-full' />
						<br />
						<br />
						<div className='flex flex-row justify-between mt-[0.2rem]'>
							<div className=''>
								<p className='text-[13px] leading-[15px] text-white font-semibold'>
									{new Date().getFullYear()} Hero-shop. Todos los derechos reservados.
								</p>
							</div>
							<div className='flex flex-row ' >
								<a href="/dashboard"><div><p className='text-[13px] leading-[15px] text-white font-semibold ml-8 hover:text-[var(--Blue-label-de-jonny-walker)]'>Terminos & Condiciones</p></div></a>
								<a href="/dashboard"><div><p className='text-[13px] leading-[15px] text-white font-semibold ml-8 hover:text-[var(--Blue-label-de-jonny-walker)]'>Privacidad</p></div></a>
								<a href="/dashboard"><div><p className='text-[13px] leading-[15px] text-white font-semibold ml-8 hover:text-[var(--Blue-label-de-jonny-walker)]'>Securidad</p></div></a>
								<a href="/dashboard"><div><p className='text-[13px] leading-[15px] text-white font-semibold ml-8 hover:text-[var(--Blue-label-de-jonny-walker)]'>Cookie Declarations</p></div></a>
							</div>
						</div>


					</div></div>

			</div>
		</>
	)
}

export default Dashboard 
