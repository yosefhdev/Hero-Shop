import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../supabase/client";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import { useAuth } from './auth';
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logos/Hero-Shop-logo.webp';
import { IconLogout } from '@tabler/icons-react';
import { IconShoppingCart } from '@tabler/icons-react';
import { IconLogin } from '@tabler/icons-react';
import { IconTrash } from '@tabler/icons-react';
import { IconRosetteDiscountCheck } from '@tabler/icons-react';

const ProductDetail = () => {
	const { productId } = useParams();
	const [product, setProduct] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const { isAuthenticated } = useAuth();
	const [userData, setUserData] = useState(null);
	const navigate = useNavigate();
	const [showModal, setShowModal] = useState(false);

	const [fetchCartError, setFetchCartError] = useState(null)
	const [productosCart, setProductosCart] = useState(null)
	const [showCartConfirmation, setShowCartConfirmation] = useState(false);

	useEffect(() => {
		const fetchUserData = async () => {
			const { data: { user }, error: authError } = await supabase.auth.getUser();

			if (authError) {
				console.error('Error al obtener el usuario:', authError.message);
				return;
			}

			if (user) {
				const { data: userData, error: userError } = await supabase
					.from('usuarios')
					.select("*")
					.eq('id', user.id);

				if (userError) {
					console.error('Error al cargar el usuario:', userError.message);
					return;
				}

				if (userData) {
					setUserData(userData[0]);
					const { data: cartData, error: cartError } = await supabase
						.from('carrito')
						.select(`
							id,
							producto_id,
							cantidad,
							productos (
								id,
								nombre,
								precio,
								img_url
							)
						`)
						.eq('usuario_id', user.id);

					if (cartError) {
						setFetchCartError("Error al cargar el carrito");
						console.error('Error al cargar el carrito:', cartError.message);
						setProductosCart(null);
					} else {
						setProductosCart(cartData);
						setFetchCartError(null);
					}
				}
			} else {
				console.warn('Usuario no autenticado. Redirigiendo a la página de login.');
				navigate('/login');
			}
		};

		if (isAuthenticated) {
			fetchUserData();
		}
	}, [isAuthenticated, navigate]);

	useEffect(() => {
		const fetchProduct = async () => {
			const { data, error } = await supabase
				.from('productos')
				.select('*')
				.eq('id', productId)
				.single();

			if (error) {
				console.error('Error fetching product:', error);
			} else {
				setProduct(data);
			}

			setIsLoading(false);
		};

		fetchProduct();
	}, [productId]);

	let totalCart = 0;
	async function handleDeleteProductCart(id) {
		const { error } = await supabase
			.from('carrito')
			.delete()
			.eq('id', id)

		if (error) {
			console.log('error', error)
		} else {
			console.log('Producto eliminado del carrito')
		}

	}

	if (productosCart) {
		productosCart.forEach(item => {
			totalCart += item.productos.precio * item.cantidad
		})
	}

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

	if (isLoading) {
		return <Loader />
	}

	if (!product) {
		return <p className="text-center">Producto no encontrado</p>;
	}

	// eslint-disable-next-line no-unused-vars
	const AgregarCarritoOld = async () => {
		// eslint-disable-next-line no-unused-vars
		const { data: { user }, error: authError } = await supabase.auth.getUser();

		if (authError) {
			console.error('Error al obtener el usuario:', authError);
			alert('Inicie sesión para agregar productos al carrito');
			navigate('/login');
			return;
		}

		const { data, error } = await supabase
			.from('carrito')
			.insert([
				{
					usuario_id: userData.id,
					producto_id: product.id
				}
			]).select()

		if (error) {
			console.error('Error al agregar al carrito:', error);
			console.log('data', data);
			return;
		}

		if (data) {
			console.log('Producto agregado al carrito:', data);
			setShowCartConfirmation(true);
			// navigate('/')
		}
	}

	const AgregarCarrito = async () => {
		// eslint-disable-next-line no-unused-vars
		const { data: { user }, error: authError } = await supabase.auth.getUser();
	
		if (authError) {
			console.error('Error al obtener el usuario:', authError);
			alert('Inicie sesión para agregar productos al carrito');
			navigate('/login');
			return;
		}
	
		// Verificar si el producto ya existe en el carrito
		const { data: existingProduct, error: fetchError } = await supabase
			.from('carrito')
			.select('id, cantidad')
			.eq('usuario_id', user.id)
			.eq('producto_id', product.id)
			.single();
	
		if (fetchError) {
			console.error('Error al verificar el producto en el carrito:', fetchError);
			return;
		}
	
		if (existingProduct) {
			// Si el producto ya existe, actualizar la cantidad
			const { data: updateData, error: updateError } = await supabase
				.from('carrito')
				.update({ cantidad: existingProduct.cantidad + 1 })
				.eq('id', existingProduct.id)
				.select();
	
			if (updateError) {
				console.error('Error al actualizar la cantidad del producto en el carrito:', updateError);
				console.log('data', updateData);
				return;
			}
	
			console.log('Cantidad del producto actualizada en el carrito:', updateData);
		} else {
			// Si el producto no existe, insertarlo en el carrito
			const { data: insertData, error: insertError } = await supabase
				.from('carrito')
				.insert([
					{
						usuario_id: user.id,
						producto_id: product.id,
						cantidad: 1
					}
				])
				.select();
	
			if (insertError) {
				console.error('Error al agregar al carrito:', insertError);
				console.log('data', insertData);
				return;
			}
	
			console.log('Producto agregado al carrito:', insertData);
		}
	
		setShowCartConfirmation(true);
		// navigate('/')
	}
	
	// Función para abrir el modal

	const openModal = () => {
		setShowModal(true);
	};

	// Función para cerrar el modal
	const closeModal = () => {
		setShowModal(false);
	};

	const toggleCartConfirmation = () => {
		setShowCartConfirmation(!showCartConfirmation);
		navigate('/')
	}


	return (
		<div className="bg-cover bg-center min-h-screen" style={{ backgroundImage: 'url("/src/assets/logos/efecto.png")' }}>
			<header className='flex justify-between w-full p-5 bg-primary'>
				<Link to="/" className="flex items-center">
					<img src={logo} className="rounded-full mr-3 h-6 sm:h-9" alt="Flowbite Logo" />
					<span className="self-center text-xl font-semibold whitespace-nowrap text-white">Hero-Shop</span>
				</Link>
				<style>

				</style>

				<div className='flex items-center'>
					{isAuthenticated && userData ? (
						<>
							<div className='flex gap-x-5'>
								<p className='text-white'>
									Bienvenido, {userData.nombre}
								</p>
								<button onClick={openModal}>
									<IconShoppingCart stroke={2} className='text-white' />
								</button>
								<button onClick={handleLogOut}>
									<IconLogout stroke={2} className='text-white' />
								</button>
							</div>
						</>
					) : (
						<Link to="/login" className="text-white border-b-2 border-primary hover:border-white flex ">
							<IconLogin stroke={2} className='mr-2' /> <p>Iniciar Sesion</p>
						</Link>
					)}

				</div>


				{showModal && (
					<div id="deleteModal" tabIndex="-1" aria-hidden="true"
						className="bg-black/50 fixed inset-0 flex z-50 justify-center items-center w-full h-modal ">
						<div className="relative p-4 w-full max-w-md h-full md:h-auto">
							{/* <!-- Modal content --> */}
							<div className="relative p-4 text-center bg-white rounded-lg shadow sm:p-5" >

								<p className="text-xl font-bold border border-gray-300 rounded-md px-4 py-2 w-full">
									Carrito
								</p>

								<div className='grid gap-1 py-2'>
									{fetchCartError && <p>{fetchCartError}</p>}
									<div className='flex items-center gap-2 border-b-2 border-gray-200'>
										<table className='w-full text-left'>
											<thead>
												<tr>
													<th><p className='text-sm'>Imagen</p></th>
													<th><p className='text-sm'>Producto</p></th>
													<th><p className='text-sm'>Cantidad</p></th>
													<th><p className='text-sm'>Precio</p></th>
												</tr>
											</thead>
											<tbody>
												{productosCart && productosCart.map(item => (
													<tr key={item.id}>
														<td>
															<img
																className='size-10 rounded-lg object-cover'
																src={item.productos.img_url}
																alt="IMG"
															/>
														</td>
														<td>
															<p className='text-sm'>{item.productos.nombre}</p>
														</td>
														<td>
															<p className='text-sm'>{item.cantidad}</p>
														</td>
														<td>
															<p className='text-sm'>${item.productos.precio}</p>
														</td>
														<td>
															<button
																className='text-sm text-red-500'
																onClick={() => handleDeleteProductCart(item.id)}>
																<IconTrash stroke={2} />
															</button>
														</td>
													</tr>
												))}
												<tr className='border-t-2'>
													<td colSpan='3'>
														<p className='text-sm font-bold text-right px-2'>
															Total:
														</p>
													</td>
													<td>
														<p className='text-sm'>${totalCart}</p>
													</td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>

								<div className="flex justify-center items-center space-x-4">
									<button onClick={closeModal} type="button"
										className="py-2 px-3 text-sm font-medium text-white bg-danger rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10" data-modal-toggle="deleteModal">
										Cancelar
									</button>
									<button data-modal-toggle="deleteModal" type="button"
										className="py-2 px-3 text-sm font-medium text-white bg-primary rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10">
										Ir a pagar
									</button>

								</div>
							</div>
						</div>
					</div>
				)}


			</header>
			<div className="flex justify-center items-center h-screen">
				<div className="max-w-screen-lg mx-4 w-full">
					<section className="w-full max-w-4x1 p-8 bg-white rounded-lg shadow-lg flex">
						<img src={product.img_url} alt={product.nombre} className="w-1/2 h-auto rounded-lg mr-8" />
						<div className="flex flex-col gap-5 w-1/2">
							<div className="w-full">
								<h1 className="text-3xl font-bold mb-5">Detalle del producto</h1>
								<h2 className="text-lg font-semibold">Nombre del producto</h2>
								<p className="border border-gray-300 rounded-md px-4 py-2 w-full">{product.nombre}</p>
							</div>
							<div className="w-full">
								<h2 className="text-lg font-semibold">Variaciones</h2>
								<p className="border border-gray-300 rounded-md px-4 py-2 w-full">{product.tipo}</p>
							</div>
							<div className="w-full">
								<h2 className="text-lg font-semibold">Precio</h2>
								<p className="border border-gray-300 rounded-md px-4 py-2 w-full">${product.precio}</p>
							</div>
							<div className="w-full">
								<h2 className="text-lg font-semibold">Categoria</h2>
								<p className="border border-gray-300 rounded-md px-4 py-2 w-full">{product.categoria}</p>
							</div>
							<div className="w-full">
								<h2 className="text-lg font-semibold">Descripcion</h2>
								<p className="border border-gray-300 rounded-md px-4 py-2 w-full">{product.descripcion}</p>
							</div>
							<div className="flex flex-row gap-x-5">
								<button onClick={AgregarCarrito} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
									Agregar al carrito
								</button>
								<Link to="/">
									<button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
										Volver
									</button>
								</Link>
							</div>
						</div>
					</section>
				</div>
			</div>

			{showCartConfirmation && (
				<div id="info-popup" tabIndex="-1" className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full">
					<div className="relative p-4 w-full max-w-lg h-full md:h-auto">
						<div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 md:p-8">
							<div className="flex items-center gap-5 justify-center mb-4 text-sm font-light text-gray-500 dark:text-gray-400">
								<IconRosetteDiscountCheck stroke={2} className='text-green-500 ' />
								<h3 className="text-2xl font-bold text-gray-900 dark:text-white">Producto Agregado al carrito</h3>
							</div>
							<div className="flex items-center gap-5 justify-center pt-0 space-y-4 sm:flex sm:space-y-0">
								<div className="items-center space-y-4 sm:space-x-4 sm:flex sm:space-y-0">
									<button onClick={toggleCartConfirmation} id="confirm-button" type="button" 
									className="py-2 px-4 w-full text-sm font-medium text-center text-white rounded-lg bg-primary-700 sm:w-auto hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary dark:hover:bg-primary/75 dark:focus:ring-primary-800">
										Confirm
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default ProductDetail;
