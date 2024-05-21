import Title from '../components/Title'
import Navbar from '../components/Navbar'
import ProductCard from '../components/ProductCard'
import supabase from '../supabase/client'
import { useEffect, useState } from 'react'
import { useAuth } from './auth';
import { IconArrowUp, IconBackground } from '@tabler/icons-react';
import { IconArrowDown } from '@tabler/icons-react';
import { IconSortAZ } from '@tabler/icons-react';
import { IconClock } from '@tabler/icons-react';
import { IconCoin } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom'
import React from 'react';

import { IconUser, IconUserCircle } from '@tabler/icons-react';
import logo from '../assets/logos/Hero-Shop-logo.webp';
import { IconSearch } from '@tabler/icons-react';
import { Link } from "react-router-dom";
import { IconBrandMeta } from '@tabler/icons-react';
import { IconBrandXdeep } from '@tabler/icons-react';
import { IconBrandInstagram } from '@tabler/icons-react';
import { IconLetterJSmall } from '@tabler/icons-react';
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
	}, [isAuthenticated]);

	const [fetchError, setFetchError] = useState(null)
	const [productos, setProductos] = useState(null)
	const [orderBy, setOrderBy] = useState('created_at')
	const [asc, setAsc] = useState(true)

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
<body >
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
					<a className='text-[#1C50CB] text-[15px]'>Bienvenido, {`${userData.user_metadata.name} ${userData.user_metadata.apellido_P} ${userData.user_metadata.apellido_M}`} </a>
					<br />
					<a className='text-[#e10c0c] text-[15px]'  onClick={handleLogOut}>Cerrar sesion</a>
				</p>
			)}
              <IconUserCircle stroke={1.5} size={65} style={{ color: 'var(--primary-color)',margin: '-.9rem -.1rem', paddingRight: '2rem', paddingLeft: '.7rem' }} />
              
			  </div>
            </div>
          </div>

          <div>
            <div className="bg-[color:var(--primary-color)] mr-0 justify-between flex">
              <nav className="justify-between flex ml-[2.5%] px-4 lg:px-6 py-2.5 border-gray-200 px-4 lg:px-6 py-2.5">
                <i className="fa-solid hidden"></i>
                <ul className="flex gap-8 mr-[10%] mt-[1.2%]">
                  <li className='list-style: none'><a className='no-underline text-[1.3rem] text-[color:var(--background-color)] font-semibold uppercase relative after:w-6 after:h-px after:bg-[color:var(--Blue-label-de-jonny-walker)] after:absolute after:bottom-[-3px] after:-translate-x-2/4 after:translate-y-2/4 after:opacity-0 after:transition-all after:duration-[0.3s] after:ease-[ease] after:left-2/4 hover:after:opacity-100 hover:text-[color:var(--Blue-label-de-jonny-walker)]' href="/dashboard">Inicio</a></li>
                  <li className='list-style: none'><a className='no-underline text-[1.3rem] text-[color:var(--background-color)] font-semibold uppercase relative after:w-6 after:h-px after:bg-[color:var(--Blue-label-de-jonny-walker)] after:absolute after:bottom-[-3px] after:-translate-x-2/4 after:translate-y-2/4 after:opacity-0 after:transition-all after:duration-[0.3s] after:ease-[ease] after:left-2/4 hover:after:opacity-100 hover:text-[color:var(--Blue-label-de-jonny-walker)]' href="#">Pedidos <span className='absolute bottom-[-3px] left-2/4 transform -translate-x-2/4 -translate-y-2/4 bg-[color:var(--Blue-label-de-jonny-walker)] w-6 h-[1px] opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-100'></span></a></li>
                  <li className='list-style: none'><a className='no-underline text-[1.3rem] text-[color:var(--background-color)] font-semibold uppercase relative after:w-6 after:h-px after:bg-[color:var(--Blue-label-de-jonny-walker)] after:absolute after:bottom-[-3px] after:-translate-x-2/4 after:translate-y-2/4 after:opacity-0 after:transition-all after:duration-[0.3s] after:ease-[ease] after:left-2/4 hover:after:opacity-100 hover:text-[color:var(--Blue-label-de-jonny-walker)]' href="/create-category">Agregar Categoria</a></li>
                  <li className='list-style: none'><a className='no-underline text-[1.3rem] text-[color:var(--background-color)] font-semibold uppercase relative after:w-6 after:h-px after:bg-[color:var(--Blue-label-de-jonny-walker)] after:absolute after:bottom-[-3px] after:-translate-x-2/4 after:translate-y-2/4 after:opacity-0 after:transition-all after:duration-[0.3s] after:ease-[ease] after:left-2/4 hover:after:opacity-100 hover:text-[color:var(--Blue-label-de-jonny-walker)]' href="#">Venta</a></li>
                  <li className='list-style: none'><a className='no-underline text-[1.3rem] text-[color:var(--background-color)] font-semibold uppercase relative after:w-6 after:h-px after:bg-[color:var(--Blue-label-de-jonny-walker)] after:absolute after:bottom-[-3px] after:-translate-x-2/4 after:translate-y-2/4 after:opacity-0 after:transition-all after:duration-[0.3s] after:ease-[ease] after:left-2/4 hover:after:opacity-100 hover:text-[color:var(--Blue-label-de-jonny-walker)]' href="#">Devoluciones</a></li>
                  <li className='list-style: none'><a className='no-underline text-[1.3rem] text-[color:var(--background-color)] font-semibold uppercase relative after:w-6 after:h-px after:bg-[color:var(--Blue-label-de-jonny-walker)] after:absolute after:bottom-[-3px] after:-translate-x-2/4 after:translate-y-2/4 after:opacity-0 after:transition-all after:duration-[0.3s] after:ease-[ease] after:left-2/4 hover:after:opacity-100 hover:text-[color:var(--Blue-label-de-jonny-walker)]' href="#">Quejas/sugerencias</a></li>
                  <li className='list-style: none'><a className='no-underline text-[1.3rem] text-[color:var(--background-color)] font-semibold uppercase relative after:w-6 after:h-px after:bg-[color:var(--Blue-label-de-jonny-walker)] after:absolute after:bottom-[-3px] after:-translate-x-2/4 after:translate-y-2/4 after:opacity-0 after:transition-all after:duration-[0.3s] after:ease-[ease] after:left-2/4 hover:after:opacity-100 hover:text-[color:var(--Blue-label-de-jonny-walker)]' href="#">Usuarios</a></li>
                </ul>
				

              </nav>
            </div>
          </div>
        </header>
		{/*h-[60rem] flex justify-center items-center bg-cover bg-center bg-[linear-gradient(100deg,#000000,#00000020),url("https://elviajerofeliz.com/wp-content/uploads/2020/05/Por-qu%C3%A9-Tokio-es-una-de-las-ciudades-m%C3%A1s-sorprendentes.jpg")]*/}

			{/*w-[40rem] h-[24rem] ml-auto mr-[5rem] bg-slate-800 border border-slate-400 rounded-md p-10 shadow-lg backdrop-filter backdrop-blur-sm bg-opacity-30 relative*/}
            {/*text-4xl text-white font-bold text-center mb-6 font-[Poppins]*/}
				{/*my-5 block w-full py-2.3 px-0 text-4xl text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:text-white focus:border-blue-600 peer*/}

{/*Parte del formulario de categoria*/}
		<main className="main-content">
        <div className='h-[60rem] flex justify-center items-center bg-cover bg-center bg-[linear-gradient(100deg,#000000,#00000020),url("https://elviajerofeliz.com/wp-content/uploads/2020/05/Por-qu%C3%A9-Tokio-es-una-de-las-ciudades-m%C3%A1s-sorprendentes.jpg")]' >
    <div> 
      <div className="bg-slate-800 border border-slate-600 rounded-md p-8 shadow-lg backdrop-filter backdrop-blur-lg bg-opacity-30 relative">
        <h1 className="text-4xl text-white font-bold text-center mb-6">Administración</h1>
        <form action="">
          <div className="relative my-4">
            <input
              id="id"
              name="id"
              className="block w-72 py-2.5 px-0 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
            />
            <label htmlFor="id" className="absolute text-2xl text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">ID</label>
          </div>
          <div className="relative my-4">
            <input
              id="nombre"
              name="nombre"
              className="block w-72 py-2.5 px-0 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
            />
            <label htmlFor="nombre" className="absolute text-2xl  text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Nombre</label>
          </div>

		  <span>
          <button type="submit" className="w-full mb-4 text-[18px] mt-6 rounded-full bg-white text-emerald-800 hover:bg-emerald-600 hover:text-white py-2 transition-colors duration-300">
            <a href="">Crear</a>
          </button>

		  <button type="submit" className="w-full mb-4 text-[18px] mt-6 rounded-full bg-white text-emerald-800 hover:bg-emerald-600 hover:text-white py-2 transition-colors duration-300">
            <a href="">Borrar</a>
          </button>
		  </span>
        </form>
      </div>
    </div>
  </div>
	
	

				</main> 
	{/*Parte del Footer*/}
<div className='bg-[#1C50CB]'>
	<div className='flex flex-col p-16'>
		<div className='flex justify-between items-start flex-row flex-wrap w-full text-left mb-8'>
			<div className= 'w-[150px] flex justify-start flex-col text-[white] m-4 mx-0 my-4'>
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


			<div className= 'w-[150px] flex justify-start flex-col text-[white] m-4 mx-0 my-4'>
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
		


			<div className= 'w-[150px] flex justify-start flex-col text-[white] m-4 mx-0 my-4'>
				<h4 className='text-2xl leading-[19px] mb-[0.9rem]'>Socios</h4>
				<a href="/dashboard">
					<p className='text-xl leading-[15px] cursor-pointer mx-0 my-2 hover:text-[var(--Blue-label-de-jonny-walker)]'>Neko-beads</p>
				</a>
				<a href="/dashboard">
					<p className='text-xl leading-[15px] cursor-pointer mx-0 my-2 hover:text-[var(--Blue-label-de-jonny-walker)]'>Calceto's shop</p>
				</a>
			</div>
			
			<div className= 'w-[150px] flex justify-start flex-col text-[white] m-4 mx-0 my-4'>
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


			<div className= 'w-[150px] flex justify-start flex-col text-[white] m-4 mx-0 my-4'>
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

			<div className= 'w-[150px] flex justify-start flex-col text-[white] m-4 mx-0 my-4'>
				<h4 className='text-2xl leading-[19px] mb-[0.9rem]'>Encuentranos en:</h4>
				<div className='flex flex-row'>
	            <p className='text-xs leading-[15px] cursor-pointer mx-0 my-2'><a href="https://facebook.com/HeroShop.15" target="_blank" rel="noopener noreferrer">
                   <IconBrandMeta className='w-4/5' stroke={2}/>
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
			<hr className='text-[white] w-full'/>
			<br />
			<br />
			<div  className='flex flex-row justify-between mt-[0.2rem]'>
			<div  className=''>
				<p className='text-[13px] leading-[15px] text-white font-semibold'>
                 {new Date().getFullYear()} Hero-shop. Todos los derechos reservados.
				</p>
		    </div>
              <div  className='flex flex-row ' >
                <a href="/dashboard"><div><p className='text-[13px] leading-[15px] text-white font-semibold ml-8 hover:text-[var(--Blue-label-de-jonny-walker)]'>Terminos & Condiciones</p></div></a>
				<a href="/dashboard"><div><p className='text-[13px] leading-[15px] text-white font-semibold ml-8 hover:text-[var(--Blue-label-de-jonny-walker)]'>Privacidad</p></div></a>
                <a href="/dashboard"><div><p className='text-[13px] leading-[15px] text-white font-semibold ml-8 hover:text-[var(--Blue-label-de-jonny-walker)]'>Securidad</p></div></a>
                <a href="/dashboard"><div><p className='text-[13px] leading-[15px] text-white font-semibold ml-8 hover:text-[var(--Blue-label-de-jonny-walker)]'>Cookie Declarations</p></div></a>
			  </div>
            </div>
			

			
		</div>
	</div>

</body>

		</>
	)
}

  export default Dashboard 
