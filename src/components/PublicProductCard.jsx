import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const PublicProductCard = ({ id, tipo, nombre, precio, descripccion, imagen }) => {

    return (
        <>
            {/* 2xl:w-1/6 xl:w-1/5 lg:w-1/4 md:w-1/3 sm:w-1/2 */}
            <Link to={'/products/' + id}>
                <div className="w-full h-full p-2 grid">
                    <div className="p-2 flex flex-col justify-between bg-gray-100 rounded-xl">
                        <div>
                            <div className="flex h-48 overflow-hidden rounded-xl">
                                <img alt={descripccion} className="object-cover object-center w-full block" src={imagen} />
                            </div>
                            <div className="flex flex-col mt-4 ">
                                <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">{tipo}</h3>
                                <h2 className="text-gray-900 title-font text-lg font-medium ">{nombre}</h2>
                                <p className="mt-1">${precio}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </>
    );
}
PublicProductCard.propTypes = {
    tipo: PropTypes.string.isRequired,
    nombre: PropTypes.string.isRequired,
    imagen: PropTypes.string,
    precio: PropTypes.number.isRequired,
    descripccion: PropTypes.string,
    id: PropTypes.number.isRequired,
};
export default PublicProductCard;