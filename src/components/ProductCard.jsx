import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import supabase from '../supabase/client';
import { useState, useRef } from 'react';
import { IconTrash } from '@tabler/icons-react';
import { IconX } from '@tabler/icons-react';
import { IconChartInfographic } from '@tabler/icons-react';
import { IconEdit } from '@tabler/icons-react';

const ProductCard = ({ id, tipo, imagen, nombre, precio, descripccion, onDelete }) => {
    const [hovered, setHovered] = useState(false);
    const [hovered2, setHovered2] = useState(false);
    const [hovered3, setHovered3] = useState(false);

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
            <div className="relative bg-[color:var(--primary-color)] cursor-pointer shadow-[0_0_2px_rgba(0,0,0,0.1)] px-12 py-8 rounded-lg group" onClick={handleClickOutside} >
                {/* Imagen del producto */}
                <img alt={descripccion} className="object-cover object-center w-full block h-80 " src={imagen} />
                {/* Descuento si está disponible */}
                {/*discount && <span className="absolute bg-[color:var(--red-color)] text-white text-[1.2rem] px-[1.2rem] py-0.5 rounded-2xl left-0 hover:bg-[color:var(--Blue-label-de-jonny-walker)]">{discount}</span>*/}
                {/* Botón de acción */}
                <div className="flex flex-col gap-4 absolute right-[-3rem] z-0 transition-all duration-[0.4s] ease-[ease] top-5 opacity-0 group-hover:opacity-100 group-hover:right-5">
                    <span className='border border-[color:var(--background-color)] flex items-center justify-center cursor-pointer transition-all duration-[0.4s] ease-[ease] p-[0.8rem] rounded-[50%] border-solid hover:bg-[color:var(--background-color)]' onMouseLeave={() => setHovered3(false)} onMouseEnter={() => setHovered3(true)}>
                        <IconChartInfographic style={{ color: hovered3 ? 'var(--Blue-label-de-jonny-walker)' : 'var(--background-color)' }} stroke={3} size={'2.3rem'} />
                    </span>
                </div>



                {/*   <div className="card-product" onClick={handleClickOutside} >
                        <div className="container-img">
                            <img alt={descripccion} className="object-cover object-center w-full block" src={imagen} />
		                    <div className="button-group">
                            <span>
                            <IconChartInfographic className='Icon1' stroke={3} size={'2.3rem'} />
                        </span>
                    </div>

                        </div>
*/}




                {/*justify-items-center grid-cols-[1fr_1fr] grid-rows-[repeat(4,main-content)] gap-y-4*/}
                <div className="bg-[color:var(--primary-color)] cursor-pointer shadow-[0_0_2px_rgba(0,0,0,0.1)] px-3 py-3 rounded-lg">
                    {/*<div className="stars">
			                 {stars.map((star, index) => (
                             <span key={index} onMouseEnter={() => handleMouseEnter(index)} onMouseLeave={() => handleMouseLeave(index)}>
                             {star ? <IconStarFilled size='1.7rem' className='SLlena'/> : <IconStar size='1.7rem' className='Ssin'/>}
                             </span>
			                 ))}
		                </div>*/}

                    {/* Nombre del producto */}
                    {/*flex items-center justify-between w-full*/}
                    {/* <div className="w-full">*/}
                    <h2 className='row-[2/3] col-[1/-1] font-semibold text-[1.2rem] cursor-pointer text-[color:var(--background-color)] text-center w-full'>{tipo}</h2>
                    <div className='grow'>

                        <h3 className='row-[2/3] col-[1/-1] font-normal text-[1.6rem] cursor-pointer text-[color:var(--background-color)] text-center mb-4 hover:text-[color:var(--Blue-label-de-jonny-walker)] hover:text-center'>{nombre}</h3>
                    </div>
                    <div className="flex items-center">
                        {/* Icono de edición y precio */}
                        <span className="border-[color:var(--background-color)] cursor-pointer transition-all duration-[0.4s] ease-[ease] flex items-center justify-center mr-[15%] p-4 rounded-[50%] border-2 border-solid hover:bg-[color:var(--background-color)]" onMouseEnter={() => setHovered(true)}
                            onMouseLeave={() => setHovered(false)}>
                            <Link to={'/create-product/' + id}>
                                <IconEdit className="transition-colors duration-300"
                                    style={{ color: hovered ? 'var(--Blue-label-de-jonny-walker)' : 'var(--background-color)' }} stroke={2} size={'2rem'}>
                                </IconEdit>
                            </Link>
                        </span>

                        {/* Borrar */}

                        <span className="border-[color:var(--background-color)] cursor-pointer transition-all duration-[0.4s] ease-[ease] flex items-center justify-center mr-[15%] p-4 rounded-[50%] border-2 border-solid hover:bg-[color:var(--background-color)]" id="deleteButton" onMouseEnter={() => setHovered2(true)}
                            onClick={openModal} onMouseLeave={() => setHovered2(false)}>
                            <IconTrash className="transition-colors duration-300"
                                style={{ color: hovered2 ? 'var(--Blue-label-de-jonny-walker)' : 'var(--background-color)' }} stroke={2.4} size={'2rem'} />

                        </span>
                        <span className='flex items-center justify-center mr-[15%]'><p className="text-[color:var(--Orange-color)] mr-[0%] justify-self-end self-center text-[1.7rem] font-semibold ">${precio}</p></span>
                        {/*Pare poner linea al precio text-[1.5_rem] font-normal line-through*/}
                    </div>
                    {/*</div>*/}
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