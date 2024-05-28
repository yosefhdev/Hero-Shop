import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import supabase from "../supabase/client"
import { IconHome } from '@tabler/icons-react';

const Register = () => {
	let navigate = useNavigate();
	const [formData, setFormData] = useState({
		nombre: '',
		apellido_paterno: '',
		apellido_materno: '',
		correo: '',
		password: '',
		password_confirmation: ''
	})
	const [errors, setErrors] = useState({});

	function handleChange(event) {
		setFormData((prevFormData) => {
			return {
				...prevFormData,
				[event.target.name]: event.target.value
			}
		})
	}

	const validateFields = () => {
		const newErrors = {};

		// Validar nombre
		if (!formData.nombre.trim()) {
			newErrors.nombre = 'El nombre es obligatorio';
		}

		// Validar apellido paterno
		if (!formData.apellido_paterno.trim()) {
			newErrors.apellido_paterno = 'El apellido paterno es obligatorio';
		}

		// Validar correo electrónico
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(formData.correo)) {
			newErrors.correo = 'Ingrese un correo electrónico válido';
		}

		// Validar contraseña
		if (formData.password.length < 8) {
			newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
		}

		// Validar confirmación de contraseña
		if (formData.password !== formData.password_confirmation) {
			newErrors.password_confirmation = 'Las contraseñas no coinciden';
		}

		return newErrors;
	};

	async function handleSubmit(e) {
		e.preventDefault();
		console.log('formData', formData);


		const errors = validateFields();
		setErrors(errors);

		if (Object.keys(errors).length === 0) {
			try {
				// Registrar al usuario con Supabase Auth
				const { data, error: signUpError } = await supabase.auth.signUp({
					email: formData.correo,
					password: formData.password
				});
				if (signUpError) {
					console.error('Error al registrar al usuario:', signUpError.message);
					return;
				}

				if (data) {
					console.log('Usuario registrado exitosamente.', data);
					console.log(data.user.id);

					const { dataNewUser, errorNewUser } = await supabase
						.from('usuarios')
						.insert([
							{
								id: data.user.id,
								nombre: formData.nombre,
								apellido_paterno: formData.apellido_paterno,
								apellido_materno: formData.apellido_materno,
								email: formData.correo,
								rol: 2
							}
						])
						.select()

					console.log('dataNewUser', dataNewUser);
					console.log('errorNewUser', errorNewUser);

					if (errorNewUser) {
						console.error('Error al registrar al usuario:', errorNewUser.message);
						return;
					}
					console.log('Usuario registrado exitosamente.', dataNewUser);
					navigate('/login');

				}
			} catch (error) {
				console.log('error', error);
			}
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
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
				<div className="flex">
					<div className="bg-white rounded-lg shadow-md p-10">
						<h2 className="text-2xl font-semibold text-center text-blue-600 mb-8">Registrarse</h2>

						<form className="w-72" onSubmit={handleSubmit}>
							<input type="text" placeholder="Nombre" className="px-2 py-1 mb-4 block w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
								name="nombre"
								onChange={handleChange} />
							{errors.nombre && <p className="text-red-500 text-xs">{errors.nombre}</p>}

							<input type="text" placeholder="Apellido Paterno" className="px-2 py-1 mb-4 block w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
								name="apellido_paterno"
								onChange={handleChange} />
							{errors.apellido_paterno && <p className="text-red-500 text-xs">{errors.nombre}</p>}

							<input type="text" placeholder="Apellido Materno" className="px-2 py-1 mb-4 block w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
								name="apellido_materno"
								onChange={handleChange} />
							{errors.apellido_materno && <p className="text-red-500 text-xs">{errors.nombre}</p>}

							<input type="email" placeholder="Correo" className="px-2 py-1 mb-4 block w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
								name="correo"
								onChange={handleChange} />
							{errors.correo && <p className="text-red-500 text-xs">{errors.nombre}</p>}

							<input type="password" placeholder="Contraseña" className="px-2 py-1 mb-4 block w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
								name="password"
								onChange={handleChange} />
							{errors.password && <p className="text-red-500 text-xs">{errors.nombre}</p>}

							<input type="password" placeholder="Confirma contraseña" className="px-2 py-1 mb-6 block w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
								name="password_confirmation"
								onChange={handleChange} />
							{errors.password_confirmation && <p className="text-red-500 text-xs">{errors.nombre}</p>}

							<input value="Registrarse" type="submit"
								className={`bg-primary text-white font-bold py-2 px-4 rounded-full w-full cursor-pointer border-2
										hover:bg-blue-900 active:bg-white active:text-primary active:border-2 active:border-primary`} />
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