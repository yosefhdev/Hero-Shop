import supabase from '../supabase/client'
import { Link } from 'react-router-dom'
import { useAuth } from './auth';
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Loader from '../components/Loader';
import { IconHome } from '@tabler/icons-react';

const PayDetails = () => {

	const navigate = useNavigate();

	const { isAuthenticated } = useAuth();
	const [userData, setUserData] = useState(null);
	const [fetchCartError, setFetchCartError] = useState(null)
	const [productosCart, setProductosCart] = useState(null)
	const [isButtonDisabled, setIsButtonDisabled] = useState(true);

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
					const hasDireccion = Boolean(
						userData[0].telefono &&
						userData[0].calle &&
						userData[0].num_ext &&
						// userData[0].num_int &&
						userData[0].colonia &&
						userData[0].ciudad &&
						userData[0].codigo_postal &&
						userData[0].estado &&
						userData[0].pais
					);
					setIsButtonDisabled(!hasDireccion);
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
						console.log('Carrito cargado:', cartData);
						setFetchCartError(null);
						setIsLoading(false);
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

	let totalCart = 0;
	if (productosCart) {
		productosCart.forEach(item => {
			totalCart += item.productos.precio * item.cantidad
		})
	}

	const [isLoading, setIsLoading] = useState(false);
	if (isLoading) {
		return <Loader />
	}

	return (
		<div className="min-h-screen bg-gray-100 p-4">
			<div className="max-w-screen-lg mx-auto bg-white rounded-lg shadow-lg">
				<div className="bg-blue-700 text-white p-6 rounded-t-lg">
					<h1 className="text-3xl font-bold text-center">Información de Pago</h1>
				</div>
				<div className="flex flex-col lg:flex-row p-8 gap-5 items-center justify-start">
					<div className="flex flex-col gap-y-4 w-1/2 pl-4">
						<div>
							<button
								onClick={() => navigate('/dashboard')}
								className={`bg-primary text-white text-sm font-bold py-2 px-4 rounded-lg cursor-pointer border-2 border-primary
							hover:bg-blue-900 flex mb-5
							active:bg-white active:text-primary active:border-2 active:border-primary`}>
								<IconHome stroke={2} className="size-5 text-white mr-2" /> <p>Volver al Inicio</p>
							</button>
						</div>
						<h2 className="text-2xl font-semibold ">Información del Usuario</h2>
						<div className="">
							<label className="block text-lg font-medium">Nombre del Usuario</label>
							<p className="border border-gray-300 rounded-md px-4 py-2 capitalize">
								{userData?.nombre || '...'}
							</p>
						</div>
						<div className="">
							<label className="block text-lg font-medium">Teléfono</label>
							<p className="border border-gray-300 rounded-md px-4 py-2 capitalize">
								{userData?.telefono || '...'}
							</p>
						</div>
						<div className="flex gap-5">
							<div className="w-1/2">
								<label className="block text-lg font-medium">Calle</label>
								<p className="border border-gray-300 rounded-md px-4 py-2 capitalize">
									{userData?.calle || '...'}
								</p>
							</div>
							<div className="w-1/4">
								<label className="block text-lg font-medium">Núm. Int.</label>
								<p className="border border-gray-300 rounded-md px-4 py-2 capitalize">
									{userData?.num_int || 'S/N'}
								</p>
							</div>
							<div className="w-1/4">
								<label className="block text-lg font-medium">Núm. Ext.</label>
								<p className="border border-gray-300 rounded-md px-4 py-2 capitalize">
									{userData?.num_ext || 'S/N'}
								</p>
							</div>
						</div>
						<div className="w-full">
							<label className="block text-lg font-medium">Colonia.</label>
							<p className="border border-gray-300 rounded-md px-4 py-2 capitalize">
								{userData?.colonia || '...'}
							</p>
						</div>
						<div className="flex gap-5">
							<div className="w-full">
								<label className="block text-lg font-medium">Ciudad</label>
								<p className="border border-gray-300 rounded-md px-4 py-2 capitalize">
									{userData?.ciudad || '...'}
								</p>
							</div>
							<div className="w-full">
								<label className="block text-lg font-medium">Código Postal</label>
								<p className="border border-gray-300 rounded-md px-4 py-2 capitalize">
									{userData?.codigo_postal || '...'}
								</p>
							</div>
						</div>
						<div className="flex gap-5">
							<div className="w-full ">
								<label className="block text-lg font-medium">Estado</label>
								<p className="border border-gray-300 rounded-md px-4 py-2 capitalize">
									{userData?.estado || '...'}
								</p>
							</div>
							<div className="w-full ">
								<label className="block text-lg font-medium">País</label>
								<p className="border border-gray-300 rounded-md px-4 py-2 capitalize">
									{userData?.pais || '...'}
								</p>
							</div>
						</div>


						<div className="mt-8 gap-5 flex justify-center">
							{isButtonDisabled ? (
								<div className='gap-5 flex flex-col items-center'>
									<p className="text-red-500">
										Por favor, complete todos los campos de dirección y teléfono.
									</p>
									<Link to='/profile'>
										<button className='bg-dark-blue border-2 border-dark-blue text-white hover:bg-white hover:text-dark-blue font-bold px-5 py-2 rounded-xl'>
											Ir a completar los datos
										</button>
									</Link>
								</div>
							) : (
								<button className="bg-blue-700 text-white px-20 py-3 rounded-lg hover:bg-blue-800">
									Pagar
								</button>
							)}
						</div>
					</div>
					<div className="w-1/2 pr-4">
						<h2 className="text-2xl font-semibold ">Productos en el Carrito</h2>
						<div className="grid grid-cols-1 gap-4">
							{fetchCartError && <div className="text-red-500">{fetchCartError}</div>}
							{productosCart ? (
								productosCart.map((producto) => (
									<div
										key={producto.id}
										className="border border-gray-300 rounded-md p-4 flex"
									>
										<img
											src={producto.productos.img_url}
											alt={producto.productos.nombre}
											className="w-70 h-40 object-cover rounded-md mr-4"
										/>
										<div>
											<h3 className="text-lg font-medium">
												{producto.productos.nombre}
											</h3>
											<p className="text-gray-600">Cantidad: {producto.cantidad}</p>
											<p className="text-gray-800 font-semibold">
												${producto.productos.precio.toFixed(2)}
											</p>
										</div>
									</div>
								))
							) : (
								<p>No hay productos en el carrito.</p>
							)}
						</div>
						<div>
							<h2 className="text-2xl font-semibold mt-4">Total</h2>
							<p className="text-3xl font-semibold text-blue-700">
								${totalCart.toFixed(2)}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default PayDetails;
