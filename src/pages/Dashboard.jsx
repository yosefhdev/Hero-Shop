import React from 'react';
import { IconUser, IconUserCircle } from '@tabler/icons-react';
//import ProductCard from '../components/ProductCard'
import '../Dashboard.css';
import logo from '../assets/logos/Hero-Shop-logo.webp';
import { IconSearch } from '@tabler/icons-react';
import { IconChartInfographic } from '@tabler/icons-react';
import { IconEdit } from '@tabler/icons-react';
import { IconStar } from '@tabler/icons-react';
import { IconStarFilled } from '@tabler/icons-react';
import { Link } from "react-router-dom";


import supabase from '../supabase/client'
import { useEffect, useState } from 'react'

// Componente reutilizable para representar un producto
const ProductCard = ({ imgSrc, name, discount, stars, price }) => {
	return (
	  <div className="card-product">
		<div className="container-img">
		  {/* Imagen del producto */}
		  <img src={imgSrc} alt="Edicion limitada" />
		  {/* Descuento si está disponible */}
		  {discount && <span className="discount">{discount}</span>}
		  {/* Botón de acción */}
		  <div className="button-group">
			<span>
        <IconChartInfographic className='Icon1' stroke={3} size={'2.3rem'} />
			</span>
		  </div>
		</div>
		<div className="content-card-product">
		  {/* Calificación del producto */}
		  <div className="stars">
			{stars.map((star, index) => (
        <span key={index} onMouseEnter={() => handleMouseEnter(index)} onMouseLeave={() => handleMouseLeave(index)}>
        {star ? <IconStarFilled size='1.7rem' className='SLlena'/> : <IconStar size='1.7rem' className='Ssin'/>}
      </span>
			))}
		  </div>
		  {/* Nombre del producto */}
		  <h3>{name}</h3>
		  {/* Icono de edición y precio */}
		  <span className="editar-producto">
      <IconEdit className='Editar' stroke={2.4} size={'2rem'}/>
		  </span>
		  <p className="price">{price}</p>
		</div>
	  </div>
	);
  };
  
const Dashboard = () => {
	  // Datos de los productos
	  const products = [
		{ imgSrc: 'src/assets/logos/Pin_1_Luffy_Chibi.png', name: 'Pin Luffy Happy', discount: '-10%', stars: [true, true, true, true, false], price: '$63.00' },
		{ imgSrc: 'src/assets/logos/CuadroCSM_3.png', name: 'Cuadro Chainsam Man', discount: '-5%', stars: [true, true, true, true, true], price: '$114.00' },
		{ imgSrc: 'src/assets/logos/PlayeraLuffyG5_1-Photoroom.png', name: 'Playera Luffy G5', discount: '', stars: [true, true, true, false, false], price: '$220.00' },
		{ imgSrc: 'src/assets/logos/Pin_Mario_Clasicopixel-Photoroom.png', name: 'Pin Mario Bros Pixeles', discount: '-20%', stars: [true, true, true, true, false], price: '$48.00' },
		// Agregar los datos de los otros productos aquí
	  ];

	const handleLogOut = async () => {
		sessionStorage.removeItem('token')
		navigate('/landing')
	}

	return (
		<body>
        <header>
          <div className="container-hero">
            <div className="container hero">
              <div className="container-logo" >
                <Link to="/" className="flex items-center">
                <img src={logo} className="rounded-full mr-3 h-6 sm:h-9" alt="Flowbite Logo" /></Link>
                <h1 className="logo"><a href="/">Hero-shop Administrador</a></h1>
              </div>
              <div className="container-user">
              
              <IconUserCircle stroke={1.5} size={65} style={{ color: 'var(--primary-color)',margin: '-.9rem -.9rem', paddingRight: '2rem', paddingLeft: '.7rem' }} />
              </div>
            </div>
          </div>

          <div>
            <div className="container-navbar">
              <nav className="navbar container">
                <i className="fa-solid fa-bars"></i>
                <ul className="menu">
                  <li><a href="#">Inicio</a></li>
                  <li><a href="#">Pedidos</a></li>
                  <li><a href="#">Agregar Categoria</a></li>
                  <li><a href="#">Venta</a></li>
                  <li><a href="#">Devoluciones</a></li>
                  <li><a href="#">Quejas/sugerencias</a></li>
                  <li><a href="#">Usuarios</a></li>
                </ul>
                <form className="search-form">
                  <input type="search" placeholder="Buscar..." />
                  <button className="btn-search">
	
                    <IconSearch stroke={3} size='2rem' style={{color: '#fff'}}/>
                  </button>
                </form>
              </nav>
            </div>
          </div>
        </header>

        <main className="main-content">
          <section className="container top-categories">
            <h1 className="heading-1">Categorias disponibles</h1>
            <div className="container-categories">
              <div className="card-category category-playeras">
                <p>Playeras</p>
                <span>Ver más</span>
              </div>
              <div className="card-category category-pines">
                <p>Pines Metalicos</p>
                <span>Ver más</span>
              </div>
              <div className="card-category category-cuadros">
                <p>Cuadros</p>
                <span>Ver más</span>
              </div>
              <div className="card-category category-Otros">
                <p>Otros</p>
                <span>Ver más</span>
              </div>
            </div>
          </section>
		  <section className="container top-products">
      {/* Opciones de filtrado de productos */}
      <div className="container-options">
        <span className="active">Mas vendidos</span>
        <span>Mas antiguos</span>
        <span>En promocion</span>
        <span>Agregados recientemente</span>
      </div>

      {/* Contenedor de productos */}
      <div className="container-products">
        {/* Representar cada producto utilizando el componente ProductCard */}
        {products.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </div>
      
      <div className="container-products">
        {/* Representar cada producto utilizando el componente ProductCard */}
        {products.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </div>

      <div className="container-products">
        {/* Representar cada producto utilizando el componente ProductCard */}
        {products.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </div>
      {/* Controles de paginación */}
      <h1 className="pages">Pagina</h1>
      <div className="container-paginas">
        <span className="active">Anterior</span>
        <span>Siguiente</span>
      </div>
    </section>
 
        </main>
      </body>
	  
	);
  }
  
  export default Dashboard 
