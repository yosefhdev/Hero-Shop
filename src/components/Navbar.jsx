/* eslint-disable react/prop-types */
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from '../assets/logos/Hero-Shop-logo.webp';
import { IconBaselineDensityMedium } from '@tabler/icons-react';

const Navbar = ({ token }) => {

    const navigate = useNavigate();
    let user = null;

    useEffect(() => {
        if (token) {
            if (token.user.user_metadata.full_name) {
                user = token.user.user_metadata.full_name;
            } else {
                user = token.user.email;
            }
        } else {
            navigate('/dashboard')
        }
    }, [token, navigate])



    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    // Escucha los cambios en el tamaño de la ventana
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 640) {
                setIsOpen(false);
            }
        };

        // Agrega el evento al cargar el componente
        window.addEventListener('resize', handleResize);

        // Limpia el evento al desmontar el componente
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <>
            <header className="min-w-56">
                <nav className="bg-primary border-gray-200 px-4 lg:px-6 py-2.5">
                    <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                        <Link to="/" className="flex items-center">
                            <img src={logo} className="rounded-full mr-3 h-6 sm:h-9" alt="Flowbite Logo" />
                            <span className="self-center text-xl font-semibold whitespace-nowrap text-white">Hero-Shop</span>
                        </Link>

                        <div className="mx-auto">
                            {user && <span className="text-white text-sm">Bienvenido {user}</span>}
                        </div>

                        <div className="flex items-end  md:order-2 lg:order-2">
                            <button onClick={toggleMenu} data-collapse-toggle="mobile-menu-2" type="button"
                                className={`inline-flex items-center p-2 ml-1 text-sm text-white hover:text-primary rounded-lg  
                                 md:hidden lg:md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 
                                transition-colors duration-300`} aria-controls="mobile-menu-2" aria-expanded="false">
                                <span className="sr-only">Open main menu</span>
                                <IconBaselineDensityMedium stroke={2} />
                            </button>
                        </div>
                        <div className={`
                                ${isOpen ? 'flex' : 'hidden'} justify-between items-center w-full
                                md:flex md:w-auto md:order-1
                                lg:flex lg:w-auto lg:order-1
                            `} id="mobile-menu-2">
                            <ul className={`flex flex-col mt-4 font-medium w-full
                                    lg:flex-row lg:space-x-8 lg:mt-0  
                                    md:flex-row md:space-x-8 md:mt-0
                                `}>
                                <li>
                                    <Link to="/"
                                        className="block py-2 pr-4 pl-3 text-white  hover:bg-gray-50 hover:text-primary rounded-lg transition-colors duration-300 bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:px-2 lg:py-1 dark:text-white" aria-current="page">
                                        Inicio
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/dashboard"
                                        className="block py-2 pr-4 pl-3 text-white  hover:bg-gray-50 hover:text-primary rounded-lg transition-colors duration-300 bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:px-2 lg:py-1 dark:text-white" aria-current="page">
                                        Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/create-product"
                                        className="block py-2 pr-4 pl-3 text-white  hover:bg-gray-50 hover:text-primary rounded-lg transition-colors duration-300 bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:px-2 lg:py-1 dark:text-white" aria-current="page">
                                        Crear Producto
                                    </Link>
                                </li>
                            </ul>

                        </div>
                    </div>
                </nav>

            </header>
        </>

    );
}

export default Navbar;