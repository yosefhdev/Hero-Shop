import { useNavigate, useLocation } from 'react-router-dom';

export const NotFoundPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleGoBack = () => {
        // Verificar si la ubicación actual proviene de una ruta interna
        const isInternalPath = location.state?.from?.startsWith('/');

        if (isInternalPath) {
            navigate(-1); // Navegar a la página anterior si proviene de una ruta interna
        } else {
            navigate('/'); // Navegar a la página de inicio si proviene de una ruta externa
        }
    };

    const handleGoHome = () => {
        navigate('/'); // Navega a la página de inicio
    };

    return (
        <>
            <section className="bg-white dark:bg-gray-900 ">
                <div className="container min-h-screen px-6 py-12 mx-auto lg:flex lg:items-center lg:gap-12">
                    <div className="wf-ull lg:w-1/2">
                        <p className="text-sm font-medium text-blue-500 dark:text-blue-400">Error 404</p>
                        <h1 className="mt-3 text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl">Pagina no encontrada</h1>
                        <p className="mt-4 text-gray-500 dark:text-gray-400">Lo sentimos, la página que estás buscando no existe. Aquí hay algunos enlaces útiles:</p>

                        <div className="flex items-center mt-6 gap-x-3">
                            <button onClick={handleGoBack} className="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 rtl:rotate-180">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
                                </svg>


                                <span>Volver</span>
                            </button>

                            <button onClick={handleGoHome} className="w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto hover:bg-blue-600 dark:hover:bg-blue-500 dark:bg-blue-600">
                                LLevame al inicio
                            </button>
                        </div>
                    </div>

                    <div className="relative w-full mt-8 lg:w-1/2 lg:mt-0">
                        <img
                            className="w-full lg:h-[32rem] h-80 md:h-96 rounded-lg object-cover"
                            src="https://images.unsplash.com/photo-1613310023042-ad79320c00ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
                            alt="" />
                        {/* <img className=" w-full lg:h-[32rem] h-80 md:h-96 rounded-lg object-cover " src="" alt=""> */}
                    </div>
                </div>
            </section >
        </>
    )
}

export default NotFoundPage