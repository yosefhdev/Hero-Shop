import supabase from "../supabase/client"
import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import Loader from "../components/Loader"
import { IconCirclePlus } from '@tabler/icons-react';
import { IconX } from "@tabler/icons-react";
import { Link } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const CreateProduct = () => {

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
    const [image, setImage] = useState(null)
    const [formError, setFormError] = useState('')

    console.log('image', image);

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
                console.log('imagen_url', imagen_url);
            }
        }


        const { data, error } = await supabase
            .from('productos')
            .insert([
                {
                    nombre: nombre,
                    descripcion: descripcion,
                    precio: precio,
                    categoria: categoria_p,
                    existencias: existencia,
                    tipo: tipo,
                    img_url: imagen_url
                }
            ]).select()

        if (error) {
            setFormError('Error al agregar el producto, verifique los campos.')
            console.log('error', error)
        }

        if (data) {
            setFormError(null)
            navigate('/dashboard')
        }
    }

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
				}
			}
		};

		if (isAuthenticated) {
			fetchUserData();

		}
	}, [isAuthenticated, navigate]);

    const [isLoading, setIsLoading] = useState(true);
	if (isLoading) {
		return <Loader />
	}

    return (
        <>
		<div className="bg-cover bg-center" style={{ backgroundImage: 'url("/src/assets/logos/efecto.png")' }}>
        <div className="flex justify-center items-center h-screen">
                  <div className="max-w-screen-xl mx-4"> 
                  <section className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-lg">
                  <div className="flex items-center mb-5 mt-3">
                  <img src="/src/assets/logos/Hero-Shop-logo.webp" alt="Logo de la empresa" className="w-12 h-12 rounded-full mr-4" />
                  <h2 className="text-3xl font-bold">Crear producto nuevo</h2>
                  </div>
                    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                            <div className="w-full">
                                <h1 className="text-lg font-semibold">Subir Imagen</h1>
                                <input
                                    type="file"
                                    accept=".png, .jpg, .jpeg .webp"
                                    name="file"
                                    id="file"
                                    className="border border-gray-300 rounded-md px-4 py-2 w-full"
                                    onChange={(e) => setImage(e.target.files[0])}
                                />
                            </div>
                            <div className="w-full">
                                <label htmlFor="name" className="text-lg font-semibold">Nombre del producto</label>
                                <input type="text" name="name" id="name" className="border border-gray-300 rounded-md px-4 py-2 w-full"
                                    placeholder="Escribe el nombre del producto" required=""
                                    value={nombre} onChange={(e) => setNombre(e.target.value)} />
                            </div>
                            <div className="w-full">
                                <label htmlFor="tipo" className="text-lg font-semibold">Variaciones</label>
                                <input type="text" name="tipo" id="tipo" className="border border-gray-300 rounded-md px-4 py-2 w-full"
                                    placeholder="Tallas, colores, etc." required=""
                                    value={tipo} onChange={(e) => setTipo(e.target.value)} />
                            </div>
                            <div className="">
                                <label htmlFor="price" className="text-lg font-semibold">Precio</label>
                                <input type="number" name="price" id="price" className="border border-gray-300 rounded-md px-4 py-2 w-full"
                                    placeholder="$100" required=""
                                    value={precio} onChange={(e) => setPrecio(e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="category" className="text-lg font-semibold">Categoria</label>
                                <select id="category" className="border border-gray-300 rounded-md px-4 py-2 w-full"
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
                                <label htmlFor="item-weight" className="text-lg font-semibold">Existencias</label>
                                <input type="number" name="item-weight" id="item-weight" className="border border-gray-300 rounded-md px-4 py-2 w-full"
                                    placeholder="12" required=""
                                    value={existencia} onChange={(e) => setExistencia(e.target.value)} />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="description" className="text-lg font-semibold">Descripcion</label>
                                <textarea id="description" rows="3" className="border border-gray-300 rounded-md px-4 py-2 w-full"
                                    placeholder="Escribe aqui tu descripción"
                                    value={descripcion} onChange={(e) => setDescripcion(e.target.value)}></textarea>
                            </div>
                        <div className="flex justify-between">
                        <button type="submit" className="flex items-center px-4 py-2 border-2 border-black rounded bg-blue-500 text-white hover:bg-red-600 transition-colors duration-200" >
                            <IconCirclePlus stroke={2} className="mr-1" />
                            Agregar
                        </button>
                         <Link to="/dashboard">
									<button type="button" className="flex items-center px-4 py-2 border-2 border-black rounded bg-red-500 text-white hover:bg-red-600 transition-colors duration-200">
										<IconX stroke={2} className="mr-1" />
										Cancelar
									</button>
								</Link>
                        </div>
                        {formError && <p className="">{formError}</p>}
                    </form>
                    
                    </section>
                </div>
                </div>
            </div>
        </>
    )
}

export default CreateProduct