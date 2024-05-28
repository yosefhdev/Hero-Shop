import { Link, useNavigate, useLocation } from "react-router-dom"
import supabase from '../supabase/client'
import { useState } from "react"
import { IconHome } from '@tabler/icons-react';

// eslint-disable-next-line react/prop-types
const Login = () => {

	let navigate = useNavigate();
	const location = useLocation();

	const [formData, setFormData] = useState({
		email: '', password: ''
	})

	function handleChange(event) {
		setFormData((prevFormData) => {
			return {
				...prevFormData,
				[event.target.name]: event.target.value
			}
		})
	}

	async function handleSubmit(e) {
		e.preventDefault()

		try {
			const { error } = await supabase.auth.signInWithPassword({
				email: formData.email,
				password: formData.password,
			})
			if (error) {
				console.error('Error al iniciar sesión:', error.message);
			} else {
				// navigate('/dashboard')
				// Redirigir al usuario a la página anterior o a la ruta deseada
				const from = location.state?.from?.pathname || '/';
				navigate(from, { replace: true });
			}


		} catch (error) {
			console.error('Error al iniciar sesión:', error.message);
		}
	}

	return (
		<div className="m-5">
			<button
				onClick={() => navigate('/')}
				className={`bg-primary text-white font-bold py-2 px-4 rounded-full cursor-pointer border-2
							hover:bg-blue-900 flex
							active:bg-white active:text-primary active:border-2 active:border-primary`}>
				<IconHome stroke={2} className="text-white mr-2" /> <p>Volver al Inicio</p>
			</button>

			<div className="Fondo"></div>
			<div className="formulario absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-400px h-500px bg-white p-10 rounded-lg border-2 border-gray-300 shadow-md " >
				<h1 className="text-blue-600 text-2xl font-bold text-center pb-5 mb-8 border-b-2 border-gray-400">
					Inicio de Sesion
				</h1>
				<form className="px-50" onSubmit={handleSubmit}>
					<div className="relative mb-8">
						<input type="email" required className="w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-600 px-2 py-2"
							name="email"
							onChange={handleChange} />
						<label className="absolute top-2 left-2 -mt-6 text-gray-400 text-sm">
							Correo electronico
						</label>
					</div>
					<div className="relative mb-8">
						<input type="password" required className="w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-600 px-2 py-2"
							name="password"
							onChange={handleChange} />
						<label className="absolute top-2 left-2 -mt-6 text-gray-400 text-sm">
							Contraseña
						</label>
					</div>
					<div className="text-gray-600 text-sm mb-6">
						<a href="#">¿Olvidaste tu contraseña?</a>
					</div>
					<input type="submit" value="Iniciar" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-full w-full" />
					<div>
						No tienes una cuenta? &nbsp;
						<Link to={'/register'} className="text-primary hover:border-b hover:border-primary">
							Quiero registrarme
						</Link>
					</div>
				</form>
			</div>
		</div>
	)
}

export default Login