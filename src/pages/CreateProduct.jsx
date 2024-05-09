import supabase from "../supabase/client"
import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"

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

    return (
        <>
            <section className="m-5">
                <div className="">
                    <h2 className="">Agregar productos nuevos.</h2>
                    <form action="#" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-5">
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
                            <div className="">
                                <label htmlFor="name" className="">Nombre del producto</label>
                                <input type="text" name="name" id="name" className="border-2 border-black"
                                    placeholder="Escribe el nombre del producto" required=""
                                    value={nombre} onChange={(e) => setNombre(e.target.value)} />
                            </div>
                            <div className="">
                                <label htmlFor="tipo" className="">Variaciones</label>
                                <input type="text" name="tipo" id="tipo" className="border-2 border-black"
                                    placeholder="Tallas, colores, etc." required=""
                                    value={tipo} onChange={(e) => setTipo(e.target.value)} />
                            </div>
                            <div className="">
                                <label htmlFor="price" className="=">Precio</label>
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
                            <div className="sm:col-span-2">
                                <label htmlFor="description" className="">Descripcion</label>
                                <textarea id="description" rows="8" className="border-2 border-black"
                                    placeholder="Your description here"
                                    value={descripcion} onChange={(e) => setDescripcion(e.target.value)}></textarea>
                            </div>
                        </div>
                        <button type="submit" className="" >
                            Agregar
                        </button>
                        {formError && <p className="">{formError}</p>}
                    </form>
                </div>
            </section >
        </>
    )
}

export default CreateProduct