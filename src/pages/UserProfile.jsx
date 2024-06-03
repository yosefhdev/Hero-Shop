import { useNavigate } from "react-router-dom"
import supabase from '../supabase/client'
import { useAuth } from './auth';
import { useState, useEffect } from "react"
import { IconEdit, IconCircleLetterX, IconDeviceFloppy } from '@tabler/icons-react';
import Loader from '../components/Loader';

const UserProfile = () => {
	const navigate = useNavigate();
	const { isAuthenticated } = useAuth();
	const [image, setImage] = useState(null)
	const [formError, setFormError] = useState('')
	const [userData, setUserData] = useState({
		nombre: '',
		apellido_paterno: '',
		apellido_materno: '',
		telefono: '',
		img_user: '',
		calle: '',
		num_ext: '',
		num_int: '',
		colonia: '',
		ciudad: '',
		codigo_postal: '',
		estado: '',
		pais: ''
	});
	// Estado que controla si los inputs están deshabilitados
	const [isDisabled, setIsDisabled] = useState(true);
	const [isLoadingInfo, setIsLoadingInfo] = useState(false);

	useEffect(() => {
		const fetchUserData = async () => {

			setIsLoadingInfo(true);
			const { data: { user }, error: authError } = await supabase.auth.getUser();

			if (authError) {
				console.error('Error al obtener el usuario:', authError.message);
				return;
			}

			if (user) {
				const { data, error } = await supabase
					.from('usuarios')
					.select("*")
					.eq('id', user.id);


				if (error) {
					console.error('Error al cargar el usuario:', error.message);
					return;
				}

				if (data) {
					console.log('data', data);
					setUserData({
						nombre: data[0].nombre,
						apellido_paterno: data[0].apellido_paterno,
						apellido_materno: data[0].apellido_materno,
						telefono: data[0].telefono,
						img_user: data[0].img_user,
						calle: data[0].calle,
						num_ext: data[0].num_ext,
						num_int: data[0].num_int,
						colonia: data[0].colonia,
						ciudad: data[0].ciudad,
						codigo_postal: data[0].codigo_postal,
						estado: data[0].estado,
						pais: data[0].pais
					});

					setIsLoading(false);
					setIsLoadingInfo(false);
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


	// Función para manejar el clic en el botón
	const toggleDisabled = () => {
		if (isDisabled === false) {
			setIsDisabled(!isDisabled);
			window.location.reload();
		}
		setIsDisabled(!isDisabled);
	}

	// Función para actualizar los datos del usuario
	const updateUser = async () => {
		setIsLoadingInfo(true);
		const { data: { user }, error: authError } = await supabase.auth.getUser();

		if (authError) {
			console.error('Error al obtener el usuario:', authError.message);
			return;
		}

		if (user) {
			// console.log('user', user);
			let imagen_url = '';
			if (image) {
				const timestamp = new Date().getTime();
				const extension = image.name.split('.').pop();
				const uniqueName = `${timestamp}_${image.name.replace(`.${extension}`, '')}`;

				const { data, error } = await supabase.storage
					.from('imagenes_user')
					.upload(`${uniqueName}`, image);

				if (error) {
					setFormError('Error al subir la imagen');
					console.error('Error al subir la imagen:', error);
					return
				} else {
					// console.log('data', data.fullPath);
					//            https://qcuiowxnmiamysnjtwto.supabase.co/storage/v1/object/public/imagenes_user/1717394004618_Yo
					imagen_url = `https://qcuiowxnmiamysnjtwto.supabase.co/storage/v1/object/public/${data.fullPath}`;
					// console.log('imagen_url', imagen_url);
				}
			}

			if (imagen_url === '') {
				imagen_url = userData.img_user;
			}
			const { data, error } = await supabase
				.from('usuarios')
				.update({
					nombre: userData.nombre,
					apellido_paterno: userData.apellido_paterno,
					apellido_materno: userData.apellido_materno,
					telefono: userData.telefono,
					img_user: imagen_url,
					calle: userData.calle,
					num_ext: userData.num_ext,
					num_int: userData.num_int,
					colonia: userData.colonia,
					ciudad: userData.ciudad,
					codigo_postal: userData.codigo_postal,
					estado: userData.estado,
					pais: userData.pais
				})
				.eq('id', user.id)
				.select();

			if (error) {
				console.error('Error al actualizar el usuario:', error.message);
				return;
			}

			if (data) {
				setIsDisabled(true);
				setIsLoadingInfo(false);
				alert('Usuario actualizado correctamente');
				window.location.reload();
			}
		}

	}

	const [isLoading, setIsLoading] = useState(false);
	if (isLoading) {
		return <Loader />
	}

	return (
		<div className=" flex items-center justify-center">
			<div className="flex flex-col lg:flex-row  md:justify-center m-5 gap-5 max-w-7xl">

				<div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full" data-v0-t="card">
					<div className="flex flex-col space-y-1.5 p-6">
						<div className="space-y-2">
							<h3 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">Información personal</h3>
							<p className="text-sm text-muted-foreground">Completa tus datos personales.</p>
						</div>
					</div>
					<div className="p-6 grid gap-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<label
									className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
									htmlFor="name"
								>
									Nombre
								</label>
								<input
									className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
									id="name"
									placeholder="Ingresa tu nombre"
									disabled={isDisabled}
									value={userData?.nombre || ''}
									onChange={(e) => setUserData({ ...userData, nombre: e.target.value })}
								/>
							</div>
							<div className="space-y-2">
								<label
									className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
									htmlFor="paternal-surname"
								>
									Apellido Paterno
								</label>
								<input
									className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
									id="paternal-surname"
									placeholder="Ingresa tu apellido paterno"
									disabled={isDisabled}
									value={userData?.apellido_paterno || ''}
									onChange={(e) => setUserData({ ...userData, apellido_paterno: e.target.value })}
								/>
							</div>
							<div className="space-y-2">
								<label
									className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
									htmlFor="maternal-surname"
								>
									Apellido Materno
								</label>
								<input
									className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
									id="maternal-surname"
									placeholder="Ingresa tu apellido materno"
									disabled={isDisabled}
									value={userData?.apellido_materno || ''}
									onChange={(e) => setUserData({ ...userData, apellido_materno: e.target.value })}
								/>
							</div>
							<div className="space-y-2">
								<label
									className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
									htmlFor="phone"
								>
									Teléfono
								</label>
								<input
									className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
									id="phone"
									placeholder="Ingresa tu número de teléfono"
									disabled={isDisabled}
									type="tel"
									value={userData?.telefono || ''}
									onChange={(e) => setUserData({ ...userData, telefono: e.target.value })}
								/>
							</div>
						</div>
						<div className="flex items-center gap-4">
							<div className="space-y-2">
								<label
									className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
									htmlFor="profile-picture"
								>
									Foto de perfil
								</label>
								<input
									className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
									id="profile-picture"
									type="file"
									disabled={isDisabled}
									onChange={(e) => setImage(e.target.files[0])}

								/>
								{formError && <p className="text-red-500">{formError}</p>}
							</div>
							<span className="relative flex shrink-0 overflow-hidden rounded-full w-20 h-20 border">
								<img className="aspect-square h-full w-full"
									alt="User Profile"
									// src={'src/assets/logos/user_placeholder.jpg'}
									src={userData.img_user !== '' ? userData.img_user : 'src/assets/logos/user_placeholder.jpg'}
								/>
							</span>
						</div>
					</div>
					<div className="flex flex-col space-y-1.5 p-6">
						<div className="space-y-2">
							<h3 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">Dirección</h3>
							<p className="text-sm text-muted-foreground">Completa tus datos de dirección.</p>
						</div>
					</div>
					<div className="p-6 grid gap-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<label
									className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
									htmlFor="street"
								>
									Calle
								</label>
								<input
									className="flex capitalize h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
									id="street"
									placeholder="Ingresa tu calle"
									disabled={isDisabled}
									value={userData?.calle}
									onChange={(e) => setUserData({ ...userData, calle: e.target.value })}
								/>
							</div>
							<div className="space-y-2">
								<label
									className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
									htmlFor="interior-number"
								>
									Número Interior
								</label>
								<input
									className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
									id="interior-number"
									placeholder="Ingresa tu número interior"
									disabled={isDisabled}
									value={userData?.num_int || ''}
									onChange={(e) => setUserData({ ...userData, num_int: e.target.value })}
								/>
							</div>
							<div className="space-y-2">
								<label
									className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
									htmlFor="exterior-number"
								>
									Número Exterior
								</label>
								<input
									className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
									id="exterior-number"
									placeholder="Ingresa tu número exterior"
									disabled={isDisabled}
									value={userData?.num_ext || ''}
									onChange={(e) => setUserData({ ...userData, num_ext: e.target.value })}
								/>
							</div>
							<div className="space-y-2">
								<label
									className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
									htmlFor="neighborhood"
								>
									Colonia
								</label>
								<input
									className="flex capitalize h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
									id="neighborhood"
									placeholder="Ingresa tu colonia"
									disabled={isDisabled}
									value={userData?.colonia || ''}
									onChange={(e) => setUserData({ ...userData, colonia: e.target.value })}
								/>
							</div>
							<div className="space-y-2">
								<label
									className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
									htmlFor="city"
								>
									Ciudad
								</label>
								<input
									className="flex capitalize h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
									id="city"
									placeholder="Ingresa tu ciudad"
									disabled={isDisabled}
									value={userData?.ciudad || ''}
									onChange={(e) => setUserData({ ...userData, ciudad: e.target.value })}
								/>
							</div>
							<div className="space-y-2">
								<label
									className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
									htmlFor="postal-code"
								>
									Código Postal
								</label>
								<input
									className="flex capitalize h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
									id="postal-code"
									placeholder="Ingresa tu código postal"
									type="number"
									disabled={isDisabled}
									value={userData?.codigo_postal || ''}
									onChange={(e) => setUserData({ ...userData, codigo_postal: e.target.value })}
								/>
							</div>
							<div className="space-y-2">
								<label
									className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
									htmlFor="state"
								>
									Estado
								</label>
								<input
									className="flex capitalize h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
									id="state"
									placeholder="Ingresa tu estado"
									disabled={isDisabled}
									value={userData?.estado || ''}
									onChange={(e) => setUserData({ ...userData, estado: e.target.value })}
								/>
							</div>
							<div className="space-y-2">
								<label
									className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
									htmlFor="country"
								>
									País
								</label>
								<input
									className="flex capitalize h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
									id="country"
									placeholder="Ingresa tu Pais"
									disabled={isDisabled}
									value={userData?.pais || ''}
									onChange={(e) => setUserData({ ...userData, pais: e.target.value })}
								/>
							</div>
						</div>
						<div className="flex gap-5 ml-auto">
							<button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium text-white ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
								onClick={toggleDisabled}>
								{isDisabled ?
									<div className="flex gap-1 justify-center items-center">
										<IconEdit stroke={2} /> Editar
									</div>
									:
									<div className="flex gap-1 justify-center items-center">
										<IconCircleLetterX stroke={2} /> Cancelar
									</div>}
							</button>
							<button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium text-white ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
								disabled={isDisabled}
								onClick={updateUser}
							>
								<IconDeviceFloppy stroke={2} /> Guardar
							</button>
						</div>
					</div>
				</div>
				<div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full">
					<div className="bg-white rounded-lg ">
						<h1 className="text-2xl text-center font-bold text-blue-700 py-4 border-b border-gray-200">Últimas Compras</h1>
						<div className="container mx-auto mt-4">
							<table className="w-full">
								<thead className="bg-gray-200">
									<tr>
										<th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">N°</th>
										<th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Producto</th>
										<th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Cantidad</th>
										<th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Precio</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200">
									<tr className="hover:bg-blue-700 text-center hover:text-white">
										<td className="px-6 py-4 whitespace-nowrap">01</td>
										<td className="px-6 py-4 whitespace-nowrap">Pin de Goku</td>
										<td className="px-6 py-4 whitespace-nowrap">01</td>
										<td className="px-6 py-4 whitespace-nowrap">30</td>
									</tr>
									<tr className="hover:bg-blue-700 text-center hover:text-white">
										<td className="px-6 py-4 whitespace-nowrap">02</td>
										<td className="px-6 py-4 whitespace-nowrap">Cuadro CSM</td>
										<td className="px-6 py-4 whitespace-nowrap">02</td>
										<td className="px-6 py-4 whitespace-nowrap">280</td>
									</tr>
									<tr className="hover:bg-blue-700 text-center hover:text-white">
										<td className="px-6 py-4 whitespace-nowrap">03</td>
										<td className="px-6 py-4 whitespace-nowrap">Pin de Zelda (escudo)</td>
										<td className="px-6 py-4 whitespace-nowrap">01</td>
										<td className="px-6 py-4 whitespace-nowrap">70</td>
									</tr>
									<tr className="hover:bg-blue-700 text-center hover:text-white">
										<td className="px-6 py-4 whitespace-nowrap">04</td>
										<td className="px-6 py-4 whitespace-nowrap">Cuadro de lol</td>
										<td className="px-6 py-4 whitespace-nowrap">01</td>
										<td className="px-6 py-4 whitespace-nowrap">140</td>
									</tr>
									<tr className="hover:bg-blue-700 text-center hover:text-white">
										<td className="px-6 py-4 whitespace-nowrap">05</td>
										<td className="px-6 py-4 whitespace-nowrap">Playera Luffy Gear 5 v2</td>
										<td className="px-6 py-4 whitespace-nowrap">04</td>
										<td className="px-6 py-4 whitespace-nowrap">680</td>
									</tr>
									<tr className="hover:bg-blue-700 text-center hover:text-white">
										<td className="px-6 py-4 whitespace-nowrap">06</td>
										<td className="px-6 py-4 whitespace-nowrap">Playera Luffy Gear</td>
										<td className="px-6 py-4 whitespace-nowrap">02</td>
										<td className="px-6 py-4 whitespace-nowrap">400</td>
									</tr>
									<tr className="hover:bg-blue-700 text-center hover:text-white">
										<td className="px-6 py-4 whitespace-nowrap">07</td>
										<td className="px-6 py-4 whitespace-nowrap">Cuadro Adventure Time</td>
										<td className="px-6 py-4 whitespace-nowrap">01</td>
										<td className="px-6 py-4 whitespace-nowrap">100</td>
									</tr>
									<tr className="hover:bg-blue-700 text-center hover:text-white">
										<td className="px-6 py-4 whitespace-nowrap">08</td>
										<td className="px-6 py-4 whitespace-nowrap">Test</td>
										<td className="px-6 py-4 whitespace-nowrap">03</td>
										<td className="px-6 py-4 whitespace-nowrap">3</td>
									</tr>
									<tr className="hover:bg-blue-700 text-center hover:text-white">
										<td className="px-6 py-4 whitespace-nowrap">09</td>
										<td className="px-6 py-4 whitespace-nowrap">Test</td>
										<td className="px-6 py-4 whitespace-nowrap">01</td>
										<td className="px-6 py-4 whitespace-nowrap">1</td>
									</tr>
									<tr className="hover:bg-blue-700 text-center hover:text-white">
										<td className="px-6 py-4 whitespace-nowrap">10</td>
										<td className="px-6 py-4 whitespace-nowrap">Test</td>
										<td className="px-6 py-4 whitespace-nowrap">02</td>
										<td className="px-6 py-4 whitespace-nowrap">2</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
			{/* Loader */}
			{isLoadingInfo && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
					<div role="status">
						<svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
							<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
						</svg>
						<span className="sr-only">Cargando...</span>
					</div>
				</div>
			)}
		</div>
	)
}

export default UserProfile