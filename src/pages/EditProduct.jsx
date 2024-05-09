import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import supabase from "../supabase/client"
import { IconX } from '@tabler/icons-react';
import { IconPencil } from '@tabler/icons-react';

// eslint-disable-next-line react/prop-types
const EditProduct = () => {


	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		const checkAuth = async () => {
			const { data: { session } } = await supabase.auth.getSession();
			setIsAuthenticated(!!session);
		};
		checkAuth();

		const { data: { subscription } } = supabase.auth.onAuthStateChange(
			(event, session) => {
				setIsAuthenticated(!!session);
			}
		);

		return () => {
			subscription?.unsubscribe();
		};
	}, []);

	const navigate = useNavigate()
	const { id } = useParams()

	const [fetchError, setFetchError] = useState(null)
	const [categorias, setCategorias] = useState(null)

	useEffect(() => {
		const fetchProducts = async () => {
			const { data, error } = await supabase
				.from('categoria_productos')
				.select()

			if (error) {
				setFetchError("Error al cargar las categorias de productos")
				console.log('error', error)
				setCategorias(null)
			}

			if (data) {
				setCategorias(data)
				setFetchError(null


				)
			}
		}

		fetchProducts()

	}, [])

	const [nombre, setNombre] = useState('')
	const [descripcion, setDescripcion] = useState('')
	const [precio, setPrecio] = useState(0)
	const [categoria_p, setCategoria_p] = useState(0)
	const [existencia, setExistencia] = useState(0)
	const [tipo, setTipo] = useState('')
	const [image, setImage] = useState(null)
	const [formError, setFormError] = useState('')

	useEffect(() => {
		const fetchProduct = async () => {
			const { data, error } = await supabase
				.from('productos')
				.select()
				.eq('id', id)
				.single()

			if (error) {
				navigate('/dashboard', { replace: true })
				console.log('error', error)
			}
			if (data) {
				setNombre(data.nombre)
				setDescripcion(data.descripcion)
				setPrecio(data.precio)
				setCategoria_p(data.categoria)
				setExistencia(data.existencias)
				setTipo(data.tipo)
			}
		}
		fetchProduct()
	}, [id, navigate])

	const handleSubmit = async (e) => {
		e.preventDefault()

		if (!nombre || !descripcion || !precio || !categoria_p || !existencia || !tipo || !image || !isAuthenticated) {
			setFormError('Por favor llena todos los campos')
			return
		}

		let imagen_url = null;
		if (image) {
			const timestamp = new Date().getTime();
			const extension = image.name.split('.').pop();
			const uniqueName = `${timestamp}_${image.name.replace(`.${extension}`, '')}`;

			const { data, error } = await supabase.storage
				.from('imagenes_productos')
				.upload(`${uniqueName}`, image);

			if (error) {
				setFormError('Error al subir la imagen');
				console.error('Error al subir la imagen:', error.message);
			} else {
				console.log('data', data);
				imagen_url = `https://qcuiowxnmiamysnjtwto.supabase.co/storage/v1/object/public/${data.fullPath}`;

			}
		}
		console.log('imagen_url', imagen_url);
		const { data, error } = await supabase
			.from('productos')
			.update({
				nombre: nombre,
				descripcion: descripcion,
				precio: precio,
				categoria: categoria_p,
				existencias: existencia,
				tipo: tipo,
				img_url: imagen_url
			})
			.eq('id', id)
			.select()

		if (error) {
			setFormError('Error al actualizar el producto, verifique los campos.')
			console.log('error', error)
		}

		if (data) {
			setFormError(null)
			navigate('/dashboard')
		}

	}

	// Subir imagenes a supabase




	return (
		<>
			<section className="m-5">
				<h2 className="">Agregar productos nuevos</h2>
				<form action="#" onSubmit={handleSubmit} className="flex flex-col gap-5">
					<div className="w-full">
						<h1 className="">Subir Imagen</h1>
						<input
							type="file"
							accept=".png, .jpg, .jpeg"
							name="file"
							id="file"
							className="border-2 border-black"
							onChange={(e) => setImage(e.target.files[0])}
						/>
					</div>
					<div className="w-full">
						<label htmlFor="name" className="">Nombre del producto</label>
						<input type="text" name="name" id="name" className="border-2 border-black"
							placeholder="Escribe el nombre del producto" required=""
							value={nombre} onChange={(e) => setNombre(e.target.value)} />
					</div>
					<div className="w-full">
						<label htmlFor="tipo" className="">Variaciones</label>
						<input type="text" name="tipo" id="tipo" className="border-2 border-black"
							placeholder="Tallas, colores, etc." required=""
							value={tipo} onChange={(e) => setTipo(e.target.value)} />
					</div>
					<div className="w-full">
						<label htmlFor="price" className="">Precio</label>
						<input type="number" name="price" id="price" className="border-2 border-black"
							placeholder="$100" required=""
							value={precio} onChange={(e) => setPrecio(e.target.value)} />
					</div>
					<div>
						<label htmlFor="category" className="">Categoria</label>
						<select id="category" className="border-2 border-black"
							value={categoria_p} onChange={(e) => setCategoria_p(e.target.value)} >
							{fetchError && <option value="">{fetchError}</option>}
							{categorias && categorias.map(categoria => (
								<option
									key={categoria.id}
									value={categoria.id}>
									{categoria.categoria}
								</option>
							))}
						</select>
					</div>
					<div>
						<label htmlFor="item-weight" className="">Existencias</label>
						<input type="number" name="item-weight" id="item-weight" className="border-2 border-black"
							placeholder="12" required=""
							value={existencia} onChange={(e) => setExistencia(e.target.value)} />
					</div>
					<div className="">
						<label htmlFor="description" className="">Descripcion</label>
						<textarea id="description" rows="3" className="border-2 border-black"
							placeholder="Your description here"
							value={descripcion} onChange={(e) => setDescripcion(e.target.value)}>
						</textarea>
					</div>
					<div className="">
						<button type="submit" className="flex border-2 border-black" >
							<IconPencil stroke={2} className="mr-1 -ml-1" />
							Actualizar
						</button>
						<Link to="/dashboard" >
							<button type="button" className="flex border-2 border-black">
								<IconX stroke={2} className="mr-1 -ml-1" />
								Cancelar
							</button>
						</Link>
					</div>
					{formError && <p className="">{formError}</p>}
				</form>
			</section >
		</>
	)
}

export default EditProduct