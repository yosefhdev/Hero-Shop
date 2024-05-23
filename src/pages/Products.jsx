import supabase from '../supabase/client'
import { Link } from 'react-router-dom';
import logo from '../assets/logos/Hero-Shop-logo.webp';
import { useEffect, useState } from 'react'
import PropTypes from 'prop-types';

const Header = () => {
  return (
    <header className="bg-blue-700 text-white flex items-center justify-center p-4 relative">
      <img src={logo} alt="Logo" className="w-16 h-auto absolute left-4 rounded-full " />
      <h1 className="text-4xl text-center w-full">Productos</h1>
    </header>
  );
};

const Product = ({ id, nombre, categoria, precio, img_url }) => {
  return (
    <Link to={`/products/${id}`} className="block">
      <article className="bg-white border border-black rounded-xl p-4 shadow-md text-left">
        <img src={img_url} alt={nombre} className="max-w-full border-b border-gray-200 pb-3 mb-2 w-auto h-52 mx-auto block" />
        <p className="text-sm text-gray-500 mb-2">{categoria}</p>
        <h2 className="text-xl mb-2">{nombre}</h2>
        <p className="text-lg text-gray-700">${precio}</p>
      </article>
    </Link>
  );
};

Product.propTypes = {
  id: PropTypes.number.isRequired,
  nombre: PropTypes.string.isRequired,
  categoria: PropTypes.string.isRequired,
  precio: PropTypes.number.isRequired,
  img_url: PropTypes.string.isRequired,
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('productos')
        .select('id, nombre, categoria, precio, img_url');

      if (error) {
        console.error('Error fetching products:', error);
      } else {
        setProducts(data);
      }

      setLoading(false);
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <p className="text-center">Cargando productos...</p>;
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 p-8">
      {products.map(product => (
        <Product key={product.id} {...product} />
      ))}
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-blue-700 text-white text-center p-4">
      <p>&copy; 2024 Hero-Shop. Todos los derechos reservados.</p>
    </footer>
  );
};

const ProductsPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-1">
        <Products />
      </main>
      <Footer />
    </div>
  );
};

export default ProductsPage;
