
import supabase from '../supabase/client'
import { useEffect, useState } from 'react'
import { useAuth } from './auth';
import { useNavigate } from 'react-router-dom'
import { IconUserCircle } from '@tabler/icons-react';
import Loader from '../components/Loader';
import logo from '../assets/logos/Hero-Shop-logo.webp';
import { Link } from "react-router-dom";
import { IconBrandMeta } from '@tabler/icons-react';
import { IconBrandXdeep } from '@tabler/icons-react';
import { IconBrandInstagram } from '@tabler/icons-react';
import { IconLetterJSmall } from '@tabler/icons-react';
import { IconZoomReset } from '@tabler/icons-react';

// eslint-disable-next-line react/prop-types
const Dashboard = () => {

	const navigate = useNavigate();

	const { isAuthenticated } = useAuth();
	const [userData, setUserData] = useState(null);

	useEffect(() => {
		const fetchUserData = async () => {
			const { data: { user } } = await supabase.auth.getUser();
			if (user) {
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

	const [categoria, setCategoria] = useState('')
	const [image, setImage] = useState(null)
	const categoriaNormalized = categoria.toLowerCase().trim();

	const [formError, setFormError] = useState('')
	const [imageU, setImageU] = useState(null);

	const handleSubmit = async (e) => {
		e.preventDefault()

		if (!categoria) {
			setFormError('Por favor llena todos los campos')
			return
		}

		let imagen_url = null;
		if (image) {
			const timestamp = new Date().getTime();
			const extension = image.name.split('.').pop();
			const uniqueName = `${timestamp}_${image.name.replace(`.${extension}`, '')}`;

			const { data, error } = await supabase.storage
				.from('imagenes_category')
				.upload(`${uniqueName}`, image);

			if (error) {
				setFormError('Error al subir la imagen');
				console.error('Error al subir la imagen:', error.message);
			} else {
				imagen_url = `https://qcuiowxnmiamysnjtwto.supabase.co/storage/v1/object/public/${data.fullPath}`;

			}
		}

		// Verificar si la categoría ya existe
		const { data: existingCategory, error: fetchError } = await supabase
			.from('categoria_productos')
			.select('id')
			.ilike('categoria', categoriaNormalized)
			.single();

		if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 es un error de single() cuando no se encuentra
			console.log('Error al verificar la categoría:', fetchError.message);
			setFormError('Error al verificar la categoría.');
			return;
		}

		if (existingCategory) {
			setFormError('La categoría ya existe.');
			return;
		}
		//Insertar categorias
		const { data, error } = await supabase
			.from('categoria_productos')
			.insert([
				{
					categoria: categoria,
					img_url: imagen_url
				}
			]).select()
		fetchCategories()
		if (error) {
			setFormError('Error al agregar la nueva categoria, verifique los campos.')
			console.log('error', error)
		}

		if (data) {
			setFormError(null)
			navigate('/create-category')
		}

	}
	//Mostrar los datos
	useEffect(() => {
		fetchCategories()
	}, [])

	async function fetchCategories() {
		const { data } = await supabase
			.from('categoria_productos')
			.select('*')
			.order('id', { ascending: true });
		setCategoriaImp(data)

	}
	const [categoriaImp, setCategoriaImp] = useState([]);
	//Borrar los datos
	async function deleteCategory(CategoriaID) {
		const { data, error } = await supabase
			.from('categoria_productos')
			.delete()
			.eq('id', CategoriaID)

		fetchCategories()
		if (error) {
			console.log(error)
		}

		if (data) {
			console.log(data)
		}
	}
	//Cerrar sesion
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


	//Actualizar categoria
	const [categoriaU, setCategoriaU] = useState('');
	const [imageNameU, setImageNameU] = useState('');
	const [selectedIdU, setSelectedIdU] = useState(0);
	const [formErrorU, setFormErrorU] = useState('');

	// Función para mostrar la categoría en el formulario
	const displayCategoryU = (categoria) => {
		setSelectedIdU(categoria.id);
		setCategoriaU(categoria.categoria);
		setImageNameU(categoria.img_url ? categoria.img_url.split('/').pop() : '');
	};


	// Función para manejar el envío del formulario
	const handleUpdateU = async (e) => {
		e.preventDefault();

		// Verificar que se haya seleccionado una categoría para actualizar
		if (selectedIdU == null) {
			setFormErrorU('No se ha seleccionado ninguna categoría para actualizar');
			return;
		}

		let imageUrl = '';

		// Subir la nueva imagen si se seleccionó una
		if (imageU) {
			const timestamp = new Date().getTime();
			const extension = imageU.name.split('.').pop();
			const uniqueName = `${timestamp}_${imageU.name.replace(`.${extension}`, '')}`;

			const { data: uploadData, error: uploadError } = await supabase.storage
				.from('imagenes_category')
				.upload(`${uniqueName}`, imageU);

			if (uploadError) {
				setFormErrorU('Error al subir la imagen');
				console.error('Error al subir la imagen:', uploadError.message);
				return;
			} else {
				imageUrl = `https://qcuiowxnmiamysnjtwto.supabase.co/storage/v1/object/public/${uploadData.fullPath}`;
			}



			try {


				// Actualizar la categoría en Supabase
				const { data: updatedData, error: updateError } = await supabase
					.from('categoria_productos')
					.update({ categoria: categoriaU, img_url: imageUrl })
					.eq('id', selectedIdU);

				fetchCategories()
				if (updateError) {
					setFormErrorU('Error al actualizar la categoría');
					console.error('Error al actualizar la categoría:', updateError);
					return;
				}

				// Resetear el formulario después de la actualización
				setSelectedIdU(null);
				setCategoriaU('');
				setImageU(null);
				setImageNameU('');
				setFormErrorU('');

				// Realizar alguna acción adicional con los datos actualizados
				console.log('Categoría actualizada con éxito:', updatedData);
			} catch (error) {
				console.error('Error al actualizar la categoría:', error);
				setFormErrorU('Error al actualizar la categoría');
			}




		} else {



			// Si no se seleccionó una nueva imagen solo se actualizara el nombre
			try {

				// Actualizar la categoría en Supabase
				const { data: updatedData, error: updateError } = await supabase
					.from('categoria_productos')
					.update({ categoria: categoriaU })
					.eq('id', selectedIdU);

				fetchCategories()
				if (updateError) {
					setFormErrorU('Error al actualizar la categoría');
					console.error('Error al actualizar la categoría:', updateError);
					return;
				}

				// Resetear el formulario después de la actualización
				setSelectedIdU(null);
				setCategoriaU('');
				setImageU(null);
				setImageNameU('');
				setFormErrorU('');

				// Realizar alguna acción adicional con los datos actualizados
				console.log('Categoría actualizada con éxito:', updatedData);
			} catch (error) {
				console.error('Error al actualizar la categoría:', error);
				setFormErrorU('Error al actualizar la categoría');
			}

		}
	};

	const [search, setSearch] = useState('')

	const handleSearch = async (e) => {
		e.preventDefault()
		const { data, error } = await supabase

			.from('categoria_productos')
			.select('*')
			.ilike('categoria', `%${search}%`)
		if (error) {
			console.error('Error al buscar la categoria:', error.message);
			return;
		}
		setCategoriaImp(data)
	}

	const [showPopover, setShowPopover] = useState(null);
	const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });

	const handleMouseEnter = (index) => {
		const { clientX, clientY } = event;
		setPopoverPosition({ x: clientX - 150, y: clientY });
		setShowPopover(index);
	};

	const handleMouseLeave = () => {
		setShowPopover(null);
	};

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
									<a className='text-[#1C50CB] text-[15px]'>Bienvenido,  {`${userData.nombre}`} </a>
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
								<li className='list-style: none'><a className='no-underline text-[1.3rem] text-[color:var(--background-color)] font-semibold uppercase relative after:w-6 after:h-px after:bg-[color:var(--Blue-label-de-jonny-walker)] after:absolute after:bottom-[-3px] after:-translate-x-2/4 after:translate-y-2/4 after:opacity-0 after:transition-all after:duration-[0.3s] after:ease-[ease] after:left-2/4 hover:after:opacity-100 hover:text-[color:var(--Blue-label-de-jonny-walker)]' href="/dashboard">Inicio</a></li>
								<li className='list-style: none'><a className='no-underline text-[1.3rem] text-[color:var(--background-color)] font-semibold uppercase relative after:w-6 after:h-px after:bg-[color:var(--Blue-label-de-jonny-walker)] after:absolute after:bottom-[-3px] after:-translate-x-2/4 after:translate-y-2/4 after:opacity-0 after:transition-all after:duration-[0.3s] after:ease-[ease] after:left-2/4 hover:after:opacity-100 hover:text-[color:var(--Blue-label-de-jonny-walker)]' href="#">Pedidos <span className='absolute bottom-[-3px] left-2/4 transform -translate-x-2/4 -translate-y-2/4 bg-[color:var(--Blue-label-de-jonny-walker)] w-6 h-[1px] opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-100'></span></a></li>
								<li className='list-style: none'><a className='no-underline text-[1.3rem] text-[color:var(--background-color)] font-semibold uppercase relative after:w-6 after:h-px after:bg-[color:var(--Blue-label-de-jonny-walker)] after:absolute after:bottom-[-3px] after:-translate-x-2/4 after:translate-y-2/4 after:opacity-0 after:transition-all after:duration-[0.3s] after:ease-[ease] after:left-2/4 hover:after:opacity-100 hover:text-[color:var(--Blue-label-de-jonny-walker)]' href="/create-category">Agregar Categoria</a></li>
								<li className='list-style: none'><a className='no-underline text-[1.3rem] text-[color:var(--background-color)] font-semibold uppercase relative after:w-6 after:h-px after:bg-[color:var(--Blue-label-de-jonny-walker)] after:absolute after:bottom-[-3px] after:-translate-x-2/4 after:translate-y-2/4 after:opacity-0 after:transition-all after:duration-[0.3s] after:ease-[ease] after:left-2/4 hover:after:opacity-100 hover:text-[color:var(--Blue-label-de-jonny-walker)]' href="#">Venta</a></li>
								<li className='list-style: none'><a className='no-underline text-[1.3rem] text-[color:var(--background-color)] font-semibold uppercase relative after:w-6 after:h-px after:bg-[color:var(--Blue-label-de-jonny-walker)] after:absolute after:bottom-[-3px] after:-translate-x-2/4 after:translate-y-2/4 after:opacity-0 after:transition-all after:duration-[0.3s] after:ease-[ease] after:left-2/4 hover:after:opacity-100 hover:text-[color:var(--Blue-label-de-jonny-walker)]' href="#">Devoluciones</a></li>
								<li className='list-style: none'><a className='no-underline text-[1.3rem] text-[color:var(--background-color)] font-semibold uppercase relative after:w-6 after:h-px after:bg-[color:var(--Blue-label-de-jonny-walker)] after:absolute after:bottom-[-3px] after:-translate-x-2/4 after:translate-y-2/4 after:opacity-0 after:transition-all after:duration-[0.3s] after:ease-[ease] after:left-2/4 hover:after:opacity-100 hover:text-[color:var(--Blue-label-de-jonny-walker)]' href="#">Quejas/sugerencias</a></li>
								<li className='list-style: none'><a className='no-underline text-[1.3rem] text-[color:var(--background-color)] font-semibold uppercase relative after:w-6 after:h-px after:bg-[color:var(--Blue-label-de-jonny-walker)] after:absolute after:bottom-[-3px] after:-translate-x-2/4 after:translate-y-2/4 after:opacity-0 after:transition-all after:duration-[0.3s] after:ease-[ease] after:left-2/4 hover:after:opacity-100 hover:text-[color:var(--Blue-label-de-jonny-walker)]' href="/user-roles">Usuarios</a></li>
							</ul>
						</nav>
					</div>
				</div>
			</header>

			<main className="flex flex-col justify-center items-center">
				<h1 className="text-center my-10 font-medium text-5xl ">Categorias disponibles</h1>
				<div className='px-20'>
					<div className='flex justify-end'>
						<form onSubmit={handleSearch} className=''>
							<div className='flex items-center justify-center text-xl gap-5'>
								<input
									placeholder='Buscar por nombre'
									className="bg-slate-100 border-2 border-white border-b-black px-5 py-2"
									onChange={(e) => setSearch(e.target.value)}
								/>
								<button type='submit' className="bg-primary px-4 py-2 rounded-full text-white font-medium">
									Buscar
								</button>
								<button type='submit' className="bg-primary px-4 py-2 rounded-full text-white font-medium">
									<IconZoomReset className='size-7 text-white' stroke={3} size='2rem' style={{ color: '#fff' }} />
								</button>
							</div>
						</form>
					</div>

					<div className='my-7 flex justify-center bg-cover bg-center ' >

						<div className='flex flex-col gap-16 w-full'>
							<div className=" flex flex-col text-xl bg-gray-100 shadow-xl items-center w-90 rounded-xl px-6 py-5 mr-16 backdrop-blur-lg relative">
								<h1 className="text-4xl text-center mb-6">Crear categoria</h1>
								<form className='flex flex-col gap-5' onSubmit={handleSubmit}>
									<div className="relative my-4">
										<input
											id="categoria"
											name="categoria"
											className="block w-full py-1 px-0 text-lg bg-transparent border-0 border-b-2 border-black appearance-none focus:outline-none focus:ring-0 focus:border-primary peer"
											placeholder=" "
											value={categoria} onChange={(e) => setCategoria(e.target.value)}
										/>
										<label htmlFor="categoria" className="absolute text-2xl duration-300 transform -translate-y-6 scale-75 top-0 -z-10 origin-[0] peer-focus:left-0 peer-focus:-blue peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Nombre</label>
									</div>
									<div className="w-full flex flex-col gap-4">
										<h1 className="text-2xl ">Subir Imagen</h1>
										<input
											type="file"
											accept=".png, .jpg, .jpeg"
											name="file"
											id="file"
											className="block w-full text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none "
											onChange={(e) => setImage(e.target.files[0])}
										/>
									</div>
									<div className='flex justify-center'>
										<button type="submit" className="bg-secondary font-bold text-white py-2 px-5 rounded-full">
											Confirmar
										</button>
									</div>
									{formError && <p className="">{formError}</p>}
								</form>
							</div>
							<div className=" flex flex-col text-xl bg-gray-100 shadow-xl items-center w-90 rounded-xl px-6 py-5 mr-16 backdrop-blur-lg relative">
								<h1 className="text-4xl text-center mb-6">Actualizar</h1>
								<form className='flex flex-col gap-5' onSubmit={handleUpdateU}>
									<div className="relative my-4">
										<input
											id="categoria2"
											name="categoria2"
											className="block w-full py-1 px-0 text-lg bg-transparent border-0 border-b-2 border-black appearance-none focus:outline-none focus:ring-0 focus:border-primary peer"
											placeholder=" "
											value={categoriaU}
											onChange={(e) => setCategoriaU(e.target.value)}
										/>{/*value={categoria} onChange={(e) => setCategoria3(e.target.value)} */}
										{/*defaultValue={categoria.categoria}  */}
										<label htmlFor="categoria2" className="absolute text-2xl duration-300 transform -translate-y-6 scale-75 top-0 -z-10 origin-[0] peer-focus:left-0 peer-focus:-blue peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Nombre</label>
									</div>
									<div className="w-full">
										<h1 className="text-2xl ">Subir Imagen</h1>
										<input
											type="file"
											accept=".png, .jpg, .jpeg .webp"
											name="file"
											id="file"
											className="block w-full text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none "
											onChange={(e) => {
												setImageU(e.target.files[0]);
												setImageNameU(e.target.files[0]?.name || '');
											}}
										/>
									</div>
									<div className='flex justify-center'>
										<button type="submit" className="bg-danger font-bold text-white py-2 px-5 rounded-full">
											Confirmar
										</button>
									</div>
									{formErrorU && <p className="text-red-500">{formErrorU}</p>}

								</form>
							</div>
						</div>

						<div className='flex flex-col items-center w-full'   >
							<table className=' text-xl '>
								<thead>
									<tr>
										<th className='text-white bg-primary py-2 px-5'>ID</th>
										<th className='text-white bg-primary py-2 px-5'>Nombre</th>
										{/* <th className='text-white bg-primary py-2 px-5'>Imagen</th> */}
										<th className='text-white bg-primary py-2 px-5'>Acciones</th>
									</tr>
								</thead>
								<tbody>
									{categoriaImp.map((categoria, index) =>
										<tr key={index}>
											<td className='bg-gray-200/50 border-b-2 px-5'>{categoria.id}</td>
											<td className='bg-gray-200/50 border-b-2 px-5'
												onMouseEnter={() => handleMouseEnter(index)}
												onMouseLeave={handleMouseLeave}>
												{categoria.categoria}
												{showPopover === index && (
													<div className="absolute z-10 w-48 p-2 bg-white border rounded shadow-lg"
														style={{ top: popoverPosition.y, left: popoverPosition.x }}>
														{categoria.img_url ? (
															<img
																src={categoria.img_url}
																className="w-full h-auto"
																alt={categoria.categoria}
															/>
														) : (
															'No Image'
														)}
													</div>
												)}
											</td>
											<td className='bg-gray-200/50 border-b-2 px-5'>
												<div className='flex my-5'>
													<button className="mx-1 bg-danger text-white py-2 px-5 rounded-full" onClick={() => { deleteCategory(categoria.id) }}>Borrar</button>
													<button className="mx-1 bg-primary text-white py-2 px-5 rounded-full" onClick={() => displayCategoryU(categoria)}>Actualizar</button>
												</div>
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>

					</div>
				</div>
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



				</div>
			</div>

		</>
	)
}
export default Dashboard 
