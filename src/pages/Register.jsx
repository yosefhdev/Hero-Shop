import { Link } from "react-router-dom"
import { useState } from "react"
import supabase from "../supabase/client"

const Register = () => {

	const [formData, setFormData] = useState({
		nombre: '',
		apellido_paterno: '',
		apellido_materno: '',
		correo: '',
		password: '',
		password_confirmation: ''
	})

	console.log(formData)
	
	function handleChange(event) {
		setFormData((prevFormData) => {
			return {
				...prevFormData,
				[event.target.name]: event.target.value
			}
		})
		console.log(formData)
	}

	async function handleSubmit(e) {
		e.preventDefault()
		try {
			const { data, error } = await supabase.auth.signUp(
				{
					email: formData.correo,
					password: formData.password,
					options: {
						data: {
							name: formData.nombre,
							apellido_P: formData.apellido_paterno,
							apellido_M: formData.apellido_materno
						}
					}
				}
			)
			if (error) throw error 
			console.log(data)

		} catch (error) {
			console.log('error', error)
		}
	}

	return (
		<div className="m-5">
			<Link to={'/'} className="bg-primary text-white px-2 py-1 rounded-xl">
				Volver al Inicio
			</Link>
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
				<div className="flex">
					<div className="bg-white rounded-lg shadow-md p-10">
						<h2 className="text-2xl font-semibold text-center text-blue-600 mb-8">Registrarse</h2>
						<form className="w-72" onSubmit={handleSubmit}>
							<input type="text" placeholder="Nombre" className="px-2 py-1 mb-4 block w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
								name="nombre"
								onChange={handleChange} />
							<input type="text" placeholder="Apellido Paterno" className="px-2 py-1 mb-4 block w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
								name="apellido_paterno"
								onChange={handleChange} />
							<input type="text" placeholder="Apellido Materno" className="px-2 py-1 mb-4 block w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
								name="apellido_materno"
								onChange={handleChange} />
							<input type="email" placeholder="Correo" className="px-2 py-1 mb-4 block w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
								name="correo"
								onChange={handleChange} />
							<input type="password" placeholder="Contraseña" className="px-2 py-1 mb-4 block w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
								name="password"
								onChange={handleChange} />
							<input type="password" placeholder="Confirma contraseña" className="px-2 py-1 mb-6 block w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
								name="password_confirmation"
								onChange={handleChange} />
							<input type="submit" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-full w-full" />
							Ya tienes una cuenta? &nbsp;
							<Link to={'/login'} className="text-primary hover:border-b hover:border-primary">
								Iniciar Sesion
							</Link>
						</form>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Register