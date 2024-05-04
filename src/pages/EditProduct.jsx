import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import supabase from "../supabase/client"
import { IconX } from '@tabler/icons-react';
import { IconPencil } from '@tabler/icons-react';

// eslint-disable-next-line react/prop-types
const EditProduct = ({token}) => {

	const navigate = useNavigate()
	if (!token || token == null || token == []) {
        navigate('/login')
    }

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
				setFetchError(null)
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

		if (!nombre || !descripcion || !precio || !categoria_p || !existencia || !tipo) {
			setFormError('Por favor llena todos los campos')
			return
		}

		const { data, error } = await supabase
			.from('productos')
			.update({
				nombre: nombre,
				descripcion: descripcion,
				precio: precio,
				categoria: categoria_p,
				existencias: existencia,
				tipo: tipo
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

	return (
		<>
			<section className="m-5">
				<h2 className="">Agregar productos nuevos</h2>
				<form action="#" onSubmit={handleSubmit} className="flex flex-col gap-5">
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