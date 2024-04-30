import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const ProductCard = ({ id, tipo, nombre, precio, descripccion }) => {

    return (
        <>
        {/* 2xl:w-1/6 xl:w-1/5 lg:w-1/4 md:w-1/3 sm:w-1/2 */}
            <div className="w-full  p-2 grid">

                <div className="p-2 flex flex-col justify-between bg-gray-100 rounded-xl">
                    <div>
                        <div className="flex h-48 overflow-hidden rounded-xl">
                            <img alt={descripccion} className="object-cover object-center w-full block" src="https://down-mx.img.susercontent.com/file/8d3c06ee8395c0b250d739f84ef60b1e" />
                        </div>
                        <div className="flex flex-col mt-4 ">
                            <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">{tipo}</h3>
                            <h2 className="text-gray-900 title-font text-lg font-medium ">{nombre}</h2>
                            <p className="mt-1">${precio}</p>
                        </div>
                    </div>
                    <div className="flex justify-end gap-x-1 mt-4">
                        {/* Editar */}
                        <Link to={'/editar-producto/'+id}>
                            <button className="bg-primary p-2 rounded-full h-min">
                                <svg className="size-5 text-white text-xl " xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" /><path d="M13.5 6.5l4 4" /></svg>
                            </button>
                        </Link>
                        {/* Borrar */}
                        <button className="bg-danger p-2 rounded-full h-min">
                            <svg className="size-5 text-white text-xl " xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 7h16" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /><path d="M10 12l4 4m0 -4l-4 4" /></svg>
                        </button>
                    </div>
                </div>



            </div>
        </>
    );
}
ProductCard.propTypes = {
    tipo: PropTypes.string.isRequired,
    nombre: PropTypes.string.isRequired,
    precio: PropTypes.number.isRequired,
    descripccion: PropTypes.string,
    id: PropTypes.number.isRequired
};
export default ProductCard;