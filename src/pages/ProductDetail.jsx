import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../supabase/client";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import { useAuth } from './auth';
import { useNavigate } from 'react-router-dom'

const ProductDetail = () => {
	const { productId } = useParams();
	const [product, setProduct] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const { isAuthenticated } = useAuth();
	const navigate = useNavigate();

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

	useEffect(() => {
		const fetchProduct = async () => {
			const { data, error } = await supabase
				.from('productos')
				.select('*')
				.eq('id', productId)
				.single();

			if (error) {
				console.error('Error fetching product:', error);
			} else {
				setProduct(data);
			}

			setIsLoading(false);
		};

		fetchProduct();
	}, [productId]);

	if (isLoading) {
		return <Loader />
	}

	if (!product) {
		return <p className="text-center">Producto no encontrado</p>;
	}

	return (
		<div className="bg-cover bg-center min-h-screen" style={{ backgroundImage: 'url("/src/assets/logos/efecto.png")' }}>
			<div className="flex justify-center items-center h-screen">
				<div className="max-w-screen-lg mx-4 w-full">
					<section className="w-full max-w-4x1 p-8 bg-white rounded-lg shadow-lg flex">
						<img src={product.img_url} alt={product.nombre} className="w-1/2 h-auto rounded-lg mr-8" />
						<div className="flex flex-col gap-5 w-1/2">
							<div className="w-full">
								<h1 className="text-3xl font-bold mb-5">Detalle del producto</h1>
								<h2 className="text-lg font-semibold">Nombre del producto</h2>
								<p className="border border-gray-300 rounded-md px-4 py-2 w-full">{product.nombre}</p>
							</div>
							<div className="w-full">
								<h2 className="text-lg font-semibold">Variaciones</h2>
								<p className="border border-gray-300 rounded-md px-4 py-2 w-full">{product.tipo}</p>
							</div>
							<div className="w-full">
								<h2 className="text-lg font-semibold">Precio</h2>
								<p className="border border-gray-300 rounded-md px-4 py-2 w-full">${product.precio}</p>
							</div>
							<div className="w-full">
								<h2 className="text-lg font-semibold">Categoria</h2>
								<p className="border border-gray-300 rounded-md px-4 py-2 w-full">{product.categoria}</p>
							</div>
							<div className="w-full">
								<h2 className="text-lg font-semibold">Descripcion</h2>
								<p className="border border-gray-300 rounded-md px-4 py-2 w-full">{product.descripcion}</p>
							</div>
							<div className="flex flex-row gap-x-5">
								<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
									Agregar al carrito
								</button>
								<Link to="/">
									<button className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
										Volver
									</button>
								</Link>
							</div>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
}

export default ProductDetail;
