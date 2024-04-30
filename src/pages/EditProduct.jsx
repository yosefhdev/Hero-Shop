import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import supabase from "../supabase/client"

const EditProduct = () => {

	const { id } = useParams()
	const navigate = useNavigate()

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
			<section className="">
					<h2 className="">Agregar productos nuevos</h2>
					<form action="#" onSubmit={handleSubmit} >
							<div className="sm:col-span-2">
								<label htmlFor="name" className="">Nombre del producto</label>
								<input type="text" name="name" id="name" className=" "
									placeholder="Escribe el nombre del producto" required="" 
									value={nombre} onChange={(e)=> setNombre(e.target.value)}/>
							</div>
							<div className="w-full">
								<label htmlFor="tipo" className="">Variaciones</label>
								<input type="text" name="tipo" id="tipo" className=" "
									placeholder="Tallas, colores, etc." required="" 
									value={tipo} onChange={(e)=> setTipo(e.target.value)} />
							</div>
							<div className="w-full">
								<label htmlFor="price" className="">Precio</label>
								<input type="number" name="price" id="price" className=" "
									placeholder="$100" required="" 
									value={precio} onChange={(e)=> setPrecio(e.target.value)} />
							</div>
							<div>
								<label htmlFor="category" className="">Categoria</label>
								<select id="category" className=""
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
								<input type="number" name="item-weight" id="item-weight" className=""
									placeholder="12" required="" 
									value={existencia} onChange={(e)=> setExistencia(e.target.value)}/>
							</div>
							<div className="">
								<label htmlFor="description" className="">Descripcion</label>
								<textarea id="description" rows="3" className=""
									placeholder="Your description here"
									value={descripcion} onChange={(e)=> setDescripcion(e.target.value)}>
								</textarea>
							</div>
						<div className="">
							<button type="submit" className="" >
								<svg className="size-5 mr-1 -ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" /><path d="M13.5 6.5l4 4" /></svg>
								Actualizar
							</button>
							<Link to="/dashboard" >
								<button type="button" className="">
									<svg className="size-5 mr-1 -ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
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