import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import supabase from '../supabase/client';
import { useState, useRef } from 'react';
import { IconTrash } from '@tabler/icons-react';
import { IconX } from '@tabler/icons-react';
import '../Dashboard.css';
import { IconChartInfographic } from '@tabler/icons-react';
import { IconEdit } from '@tabler/icons-react';

const ProductCard = ({ id, tipo, imagen, nombre, precio, descripccion, onDelete }) => {

    const handleDelete = async () => {
        const { data, error } = await supabase
            .from('productos')
            .delete()
            .eq('id', id)
            .select()

        if (error) {
            console.log('error', error)
        }
        if (data) {
            console.log('data', data)
            onDelete(id);
        }

    }

    // Crear un estado para controlar la visibilidad del modal
    const [showModal, setShowModal] = useState(false);
    const modalRef = useRef(null);

    // Función para abrir el modal
    const openModal = () => {
        setShowModal(true);
    };

    // Función para cerrar el modal
    const closeModal = () => {
        setShowModal(false);
    };

    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            closeModal();
        }
    };

    return (
        <>
            <div className="card-product" onClick={handleClickOutside} >
                <div className="container-img">
                    {/* Imagen del producto */}
                    <img alt={descripccion} className="object-cover object-center w-full block" src={imagen} />
                    {/* Descuento si está disponible */}
                    {/*discount && <span className="discount">{discount}</span>*/}
                    {/* Botón de acción */}
                    <div className="button-group">
                        <span>
                            <IconChartInfographic className='Icon1' stroke={3} size={'2.3rem'} />
                        </span>
                    </div>

                </div>
                <div className="content-card-product">
                    {/*<div className="stars">
			                 {stars.map((star, index) => (
                             <span key={index} onMouseEnter={() => handleMouseEnter(index)} onMouseLeave={() => handleMouseLeave(index)}>
                             {star ? <IconStarFilled size='1.7rem' className='SLlena'/> : <IconStar size='1.7rem' className='Ssin'/>}
                             </span>
			                 ))}
		                </div>*/}

                    {/* Nombre del producto */}
                    <div className="producto info-container">
                        <h2>{tipo}</h2>
                        <div className='info-container'>

                            <h3 className='name'>{nombre}</h3>
                        </div>
                        <div className="actions-container">
                            {/* Icono de edición y precio */}
                            <span className="editar-producto">
                                <Link to={'/edit-product/' + id}>
                                    <IconEdit className='Editar' stroke={2.4} size={'2rem'}>
                                    </IconEdit>
                                </Link>
                            </span>

                            {/* Borrar */}

                            <span className="borrar-producto" id="deleteButton"
                                onClick={openModal}>
                                <IconTrash className="Borrar" stroke={2.4} size={'2rem'} />

                            </span>
                            <span><p className="price">${precio}</p></span>

                        </div>
                    </div>
                </div>








                {/* <!-- Main modal --> */}
                {showModal && (
                    <div id="deleteModal" tabIndex="-1" aria-hidden="true" className="bg-black/50 fixed inset-0 flex z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full">
                        <div className="relative p-4 w-full max-w-md h-full md:h-auto">
                            {/* <!-- Modal content --> */}
                            <div className="relative p-4 text-center bg-white rounded-lg shadow sm:p-5" ref={modalRef}>
                                <button onClick={closeModal} type="button" className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" data-modal-toggle="deleteModal">
                                    <IconX stroke={2} />
                                    <span className="sr-only">Cerrar</span>
                                </button>
                                <IconTrash className="text-danger w-11 h-11 mb-3.5 mx-auto" stroke={2} />
                                <p className="mb-4 text-gray-500 font-semibold">Seguro que quieres eliminar este producto?</p>
                                <div className="flex justify-center items-center space-x-4">
                                    <button onClick={closeModal} data-modal-toggle="deleteModal" type="button" className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10">
                                        No, cancelar
                                    </button>
                                    <button type="submit" className="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300"
                                        onClick={handleDelete}>
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
ProductCard.propTypes = {
    tipo: PropTypes.string.isRequired,
    imagen: PropTypes.string.isRequired,
    nombre: PropTypes.string.isRequired,
    precio: PropTypes.number.isRequired,
    descripccion: PropTypes.string,
    id: PropTypes.number.isRequired,
    onDelete: PropTypes.func.isRequired,
};
export default ProductCard;