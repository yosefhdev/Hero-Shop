import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import supabase from '../supabase/client';
import { useState, useRef } from 'react';
import { IconTrash } from '@tabler/icons-react';
import { IconPencil } from '@tabler/icons-react';
import { IconX } from '@tabler/icons-react';

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
            {/* 2xl:w-1/6 xl:w-1/5 lg:w-1/4 md:w-1/3 sm:w-1/2 */}
            <div className="w-full p-2 grid" onClick={handleClickOutside} >

                <div className="p-2 flex flex-col justify-between bg-gray-100 rounded-xl">
                    <div>
                        <div className="flex h-48 overflow-hidden rounded-xl">
                            <img alt={descripccion} className="object-cover object-center w-full block" src={imagen}/>
                        </div>
                        <div className="flex flex-col mt-4 ">
                            <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">{tipo}</h3>
                            <h2 className="text-gray-900 title-font text-lg font-medium ">{nombre}</h2>
                            <p className="mt-1">${precio}</p>
                        </div>
                    </div>
                    <div className="flex justify-end gap-x-1 mt-4">
                        {/* Editar */}
                        <Link to={'/edit-product/' + id}>
                            <button className="bg-primary p-2 rounded-full h-min">
                                <IconPencil className='size-5 text-white text-xl ' stroke={2} />
                            </button>
                        </Link>
                        {/* Borrar */}
                        <button className="bg-danger p-2 rounded-full h-min" id="deleteButton"
                            onClick={openModal}>
                            <IconTrash className="size-5 text-white text-xl " stroke={2} />
                        </button>
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