import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabase/client';
import { IconHome } from '@tabler/icons-react';
import Loader from '../components/Loader';
import { useAuth } from './auth';

import { IconUserShield } from '@tabler/icons-react';
import { IconUser } from '@tabler/icons-react';
import { IconSearch } from '@tabler/icons-react';
import { IconZoomReset } from '@tabler/icons-react';

const TipoUsuario = () => {
	const navigate = useNavigate();
	const [users, setUsers] = useState([]);
	const [isLoadingRol, setIsLoadingRol] = useState(false);

	const { isAuthenticated } = useAuth();
	// eslint-disable-next-line no-unused-vars
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



	useEffect(() => {
		async function fetchUsers() {
			try {
				const { data, error } = await supabase
					.from('usuarios')
					.select('*')
					.neq('id', userData.id)

				if (error) {
					console.error('Error al obtener usuarios:', error.message);
					return;
				}

				setUsers(data);
			} catch (error) {
				console.error('Error al obtener usuarios:', error.message);
			}
		}

		fetchUsers();
	}, [userData]);

	const handleToggleRole = async (userId, currentRole) => {
		setIsLoadingRol(true);
		const newRole = currentRole === 1 ? 2 : 1;
		try {
			const { error } = await supabase
				.from('usuarios')
				.update({ rol: newRole })
				.eq('id', userId);

			if (error) {
				console.error('Error al actualizar el rol del usuario:', error.message);
				return;
			}

			// Actualiza el estado local para reflejar el cambio
			setUsers(users.map(user =>
				user.id === userId ? { ...user, rol: newRole } : user
			));
		} catch (error) {
			console.error('Error al actualizar el rol del usuario:', error.message);
		}
		setIsLoadingRol(false);
	};
	
	const [searchTerm, setSearchTerm] = useState('');
	async function handleSearch(e) {
		e.preventDefault();
		try {
			const { data, error } = await supabase
				.from('usuarios')
				.select('*')
				.neq('id', userData.id)
				.ilike('email', `%${searchTerm}%`)

			if (error) {
				console.error('Error al obtener usuarios:', error.message);
				return;
			}

			setUsers(data);
		} catch (error) {
			console.error('Error al obtener usuarios:', error.message);
		}
	}

	async function resetTabla(e) {
		e.preventDefault();

		setSearchTerm('');
		
		try {
			const { data, error } = await supabase
				.from('usuarios')
				.select('*')
				.neq('id', userData.id)

			if (error) {
				console.error('Error al obtener usuarios:', error.message);
				return;
			}

			setUsers(data);
		} catch (error) {
			console.error('Error al obtener usuarios:', error.message);
		}
	}

	const [isLoading, setIsLoading] = useState(true);
	if (isLoading) {
		return <Loader />
	}

	return (
		<div className="flex justify-center p-5">
			<div className="relative w-full max-w-4xl">
				<button
					onClick={() => navigate('/dashboard')}
					className={`bg-primary text-white text-sm font-bold py-2 px-4 rounded-lg cursor-pointer border-2 border-primary
							hover:bg-blue-900 flex mb-5
							active:bg-white active:text-primary active:border-2 active:border-primary`}>
					<IconHome stroke={2} className="size-5 text-white mr-2" /> <p>Volver al Inicio</p>
				</button>



				<div className="relative overflow-x-auto shadow-xl sm:rounded-lg">
					<div className="pb-4 bg-white ">
						<label htmlFor="table-search" className="sr-only">Search</label>
						<div className="relative mt-1">
							<form onSubmit={handleSearch} className='flex '>
								<input type="text" id="table-search"
									onChange={(e) => setSearchTerm(e.target.value)}
									className="block rounded-s-lg py-1 px-3 text-gray-900 border border-gray-300 w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 "
									placeholder="Buscar por mail"
									value={searchTerm} />
								<button type='submit' className='bg-primary rounded-e-lg px-2'>
									<IconSearch className='size-5 text-white' stroke={3} size='2rem' style={{ color: '#fff' }} />
								</button>
								<button type='button' onClick={resetTabla} className='bg-primary rounded-lg px-2 ml-auto' title='Resetear tabla'>
									<IconZoomReset  className='size-5 text-white' stroke={3} size='2rem' style={{ color: '#fff' }} />
								</button>
							</form>
						</div>
					</div>
					<table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
						<thead className="text-xs text-gray-100 uppercase bg-primary ">
							<tr>
								<th scope="col" className="px-6 py-3">
									E-Mail
								</th>
								<th scope="col" className="px-6 py-3">
									Nombre
								</th>
								<th scope="col" className="px-6 py-3">
									Rol
								</th>
								<th scope="col" className="px-6 py-3">
									Action
								</th>
							</tr>
						</thead>
						<tbody>
							{users.map(user => (
								<tr key={user.id} className="bg-white border-b  hover:bg-gray-50 ">
									<th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
										{user.email}
									</th>
									<td className="px-6 py-4">
										{user.nombre} {user.apellido_paterno} {user.apellido_materno}
									</td>
									<td className="px-6 py-4">
										{user.rol === 1 ?
											(<div className='flex gap-x-2'>
												<IconUserShield stroke={2} /> Admin
											</div>)
											:
											(<div className='flex gap-x-2'>
												<IconUser stroke={2} /> Cliente
											</div>)
										}
									</td>
									<td className="px-6 py-4">
										<button disabled={isLoadingRol} onClick={() => handleToggleRole(user.id, user.rol)} className="font-medium text-blue-600  hover:underline">
											{user.rol === 1 ? 'Cambiar a Cliente' : 'Cambiar a Admin'}
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Loader */}
				{isLoadingRol && (
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


				{/* <div className="overflow-x-auto shadow-md sm:rounded-lg">
					<table className="w-full text-xs text-left rtl:text-right text-blue-100 ">
						<thead className="text-xs text-white uppercase bg-blue-600 border-b border-blue-400 ">
							<tr>
								<th scope="col" className="px-6 py-3 min-w-[200px]">E-mail</th>
								<th scope="col" className="px-6 py-3 bg-blue-500 min-w-[150px]">Nombre</th>
								<th scope="col" className="px-6 py-3 min-w-[100px]">Rol</th>
								<th scope="col" className="px-6 py-3 bg-blue-500 min-w-[100px]">Acción</th>
							</tr>
						</thead>
						<tbody>
							{users.map(user => (
								<tr key={user.id} className="bg-blue-600 border-b border-blue-400">
									<td className="px-6 py-4 text-xs">{user.email}</td>
									<td className="px-6 py-4 bg-blue-500 text-xs">{user.nombre} {user.apellido_paterno} {user.apellido_materno}</td>
									<td className="px-6 py-4 text-xs">{user.rol === 1 ? 'Admin' : 'Cliente'}</td>
									<td className="px-6 py-4 bg-blue-500 text-xs">
										<button
											className="font-medium text-white hover:underline"
											onClick={() => handleToggleRole(user.id, user.rol)}
										>
											{user.rol === 1 ? 'Cambiar a Cliente' : 'Cambiar a Admin'}
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div> */}
			</div>
		</div>
	);
}

export default TipoUsuario;
