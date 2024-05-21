import ProductCard from '../components/ProductCard'
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
import '../Dashboard.css';
import logo from '../assets/logos/Hero-Shop-logo.webp';
import { IconSearch } from '@tabler/icons-react';
import { Link } from "react-router-dom";
import { IconBrandMeta } from '@tabler/icons-react';
import { IconBrandXdeep } from '@tabler/icons-react';
import { IconBrandInstagram } from '@tabler/icons-react';
import { IconLetterJSmall } from '@tabler/icons-react';
import { IconLogout } from '@tabler/icons-react';

// eslint-disable-next-line react/prop-types
const Dashboard = () => {
	const navigate = useNavigate();

	const { isAuthenticated } = useAuth();
	const [userData, setUserData] = useState(null);

	useEffect(() => {
		const fetchUserData = async () => {
			const { data: { user } } = await supabase.auth.getUser();
			setUserData(user);
		};

		if (isAuthenticated) {
			fetchUserData();
		}
	}, [isAuthenticated, userData]);

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

	/*Prueba categoria elementos*/

	return (
		<>
			<div >
				<header>
					<div className="container-hero">
						<div className="hero">
							<div className="container-logo" >
								<Link to="/" className="flex items-center">
									<img src={logo} className="rounded-full mr-3 h-6 sm:h-9" alt="Flowbite Logo" /></Link>
								<h1 className="logo"><a href="/">Hero-shop Admin</a></h1>
							</div>
							<div className="container-user">

								{isAuthenticated && userData && (
									<div className='grid grid-flow-col gap-1'>
										<p>
											<a>Bienvenido, {`${userData.user_metadata.name} `} </a>
										</p>
										<button onClick={handleLogOut}>
											<IconLogout stroke={2} className='text-primary' />
										</button>
									</div>

								)}
								<IconUserCircle stroke={1.5} size={65} style={{ color: 'var(--primary-color)', margin: '-.9rem -.1rem', paddingRight: '2rem', paddingLeft: '.7rem' }} />

							</div>
						</div>
					</div>

					<div>
						<div className="container-navbar">
							<nav className="navbar container border-gray-200 px-4 lg:px-6 py-2.5">
								<i className="fa-solid fa-bars"></i>
								<ul className="menu">
									<li><a href="#">Inicio</a></li>
									<li><a href="#">Pedidos</a></li>
									<li><a href="#">Agregar Categoria</a></li>
									<li><a href="#">Venta</a></li>
									<li><a href="#">Devoluciones</a></li>
									<li><a href="#">Quejas/sugerencias</a></li>
									<li><a href="#">Usuarios</a></li>
								</ul>

								<form className="search-form">
									<input type="text" id="simple-search" placeholder="Buscar..."
										required
										onChange={(e) => setArticulo(e.target.value)} />
									<button type="submit" className="btn-search" onClick={handleArticulo}>
										<IconSearch stroke={3} size='2rem' style={{ color: '#fff' }} />
									</button>

								</form>
							</nav>
						</div>
					</div>
				</header>
				<main className="main-content">
					<section className="container top-categories">
						<h1 className="heading-1">Categorias disponibles</h1>
						<div className="container-categories">
							<div className="card-category category-playeras" onClick={() => handleFilterByCategory(1)}>
								<p onClick={() => handleFilterByCategory(1)}>Playeras</p>
								<span onClick={() => handleFilterByCategory(1)}>Ver</span>
							</div>
							<div className="card-category category-pines" onClick={() => handleFilterByCategory(3)}>
								<p onClick={() => handleFilterByCategory(3)}>Pines Metalicos</p>
								<span onClick={() => handleFilterByCategory(3)}>Ver</span>
							</div>
							<div className="card-category category-cuadros" onClick={() => handleFilterByCategory(4)}>
								<p onClick={() => handleFilterByCategory(4)}>Cuadros</p>
								<span onClick={() => handleFilterByCategory(4)}>Ver</span>
							</div>
							<div className="card-category category-Otros" onClick={() => handleFilterByCategory(2)}>
								<p onClick={() => handleFilterByCategory(2)}>Otros</p>
								<span onClick={() => handleFilterByCategory(2)}>Ver</span>
							</div>
						</div>
					</section>

					<section className='container top-products'>
						<div className='container-options'>
							<p className='p-2'><a>Ordenar por:</a></p>
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
							<Link to="/create-product">
								<button className={`bg-primary px-5 py-3 rounded-3xl font-bold text-white text-xl border-2 border-white
													hover:bg-white hover:text-primary hover:border-primary`}>
									Crear producto
								</button>
							</Link>

						</div>





						{/* Contenedor de productos */}
						<div className='container-products'>
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
						<h1 className="pages">Página</h1>
						<div className="container-paginas">
							<span className="active">Anterior</span>
							<span>Siguiente</span>
						</div>
					</section>
					<br />
				</main>
				<div className='footer'>
					<div className='sb__footer section__padding'>
						<div className='sb__footer-links'>
							<div className='sb__footer-links_div'>
								<h4>Negocios</h4>
								<a href="/employer">
									<p>Empleadora</p>
								</a>
								<a href="/healthplan">
									<p>Patrocinadores</p>
								</a>
								<a href="/individual">
									<p>Vendedores</p>
								</a>
							</div>


							<div className='sb__footer-links_div'>
								<h4>Recursos</h4>
								<a href="/resource">
									<p>Control de calidad</p>
								</a>
								<a href="/resource">
									<p>Materiales</p>
								</a>
								<a href="/resource">
									<p>Diseños</p>
								</a>
							</div>



							<div className='sb__footer-links_div'>
								<h4>Socios</h4>
								<a href="/employer">
									<p>Neko-beads</p>
								</a>
								<a href="/employer">
									<p>Calceto&aposs shop</p>
								</a>
							</div>

							<div className='sb__footer-links_div'>
								<h4>Hero-shop</h4>
								<a href="/about">
									<p>Sobre Nosotros</p>
								</a>
								<a href="/press">
									<p>Politica de devoluciones</p>
								</a>
								<a href="/career">
									<p>Politica de reembolsos</p>
								</a>
								<a href="/contact">
									<p>Politica de promociones</p>
								</a>
							</div>


							<div className='sb__footer-links_div'>
								<h4>Más</h4>
								<a href="/about">
									<p>Metodos de pago</p>
								</a>
								<a href="/press">
									<p>Tipos de envios</p>
								</a>
								<a href="/career">
									<p>Información de pago seguro</p>
								</a>
								<a href="/contact">
									<p>Contactos</p>
								</a>
							</div>

							<div className='sb__footer-links_div'>
								<h4>Encuentranos en:</h4>
								<div className='socialmedia'>
									<p><a href="https://facebook.com/HeroShop.15" target="_blank" rel="noopener noreferrer">
										<IconBrandMeta stroke={2} />
									</a>
									</p>
									<p><a href="https://twitter.com/home?lang=es" target="_blank" rel="noopener noreferrer">
										<IconBrandXdeep stroke={2} />
									</a>
									</p>
									<p><a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
										<IconBrandInstagram stroke={2} />
									</a>
									</p>
									<p><a href="https://www.tiktok.com/" target="_blank" rel="noopener noreferrer">
										<IconLetterJSmall stroke={3} />
									</a>
									</p>
								</div>
							</div>
						</div>
						<hr />
						<br />
						<br />
						<div className='sb__footer-below'>
							<div className='sb__footer-copyright'>
								<p>
									{new Date().getFullYear()} Hero-shop. Todos los derechos reservados.
								</p>
							</div>
							<div className='sb__footer-below-links'>
								<a href="/terms"><div><p>Terminos & Condiciones</p></div></a>
								<a href="/privacy"><div><p>Privacidad</p></div></a>
								<a href="/security"><div><p>Securidad</p></div></a>
								<a href="/cookie"><div><p>Cookie Declarations</p></div></a>
							</div>
						</div>



					</div>
				</div>

			</div>

		</>
	)
}

export default Dashboard 
