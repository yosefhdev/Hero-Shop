import { Link, useNavigate, useLocation } from "react-router-dom"
import supabase from '../supabase/client'
import { useState } from "react"
import { IconHome } from '@tabler/icons-react';

// eslint-disable-next-line react/prop-types
const UserProfile = () => {
    return(
<div className="font-lexend bg-gradient-to-b from-blue-700 to-purple-900 h-screen">
      <div className="container mx-auto flex justify-center items-center h-screen">
        <div className="formulario bg-white rounded-lg border-2 border-gray-200 shadow-md w-96">
          <h1 className="text-2xl text-center font-bold text-blue-700 py-4 border-b border-gray-200">Perfil</h1>
          <img src="Perfil-Default.jpeg" alt="" className="mx-auto mt-4 w-40 h-40 rounded-full" />
          <form className="px-8 py-6" method="post">
            <div className="UserData mb-6">
            <label className="text-gray-400">Nombre</label>
              <h2 className="text-gray-500 border-b-2 border-gray-300">$(username)</h2>
            </div>
            <div className="UserData mb-6">
              <label className="text-gray-400">Apellido Paterno</label>
              <h2 className="text-gray-500 border-b-2 border-gray-300">$(apellido_paterno)</h2>
            </div>
            <div className="UserData mb-6">
            <label className="text-gray-400">Apellido Materno</label>
              <h2 className="text-gray-500 border-b-2 border-gray-300">$(apellido_materno)</h2>
            </div>
            <div className="UserData mb-6">
            <label className="text-gray-400">Correo</label>
              <h2 className="text-gray-500 border-b-2 border-gray-300">$(correo)</h2>
            </div>
            <input type="submit" value="Iniciar" className=" text-center flex bg-blue-700 text-white px-5 py-3 rounded hover:bg-blue-600 cursor-pointer" />
          </form>
        </div>
      </div>

      <div className="container mx-auto h-900 w-600 py-8">
        <div className="compras bg-white rounded-lg border-2 border-gray-200 shadow-md w-200">
          <h1 className="text-2xl text-center font-bold text-blue-700 py-4 border-b border-gray-200">Últimas Compras</h1>
          <div className="container mx-auto mt-4">
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">N°</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Producto</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Cantidad</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Precio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-blue-700 text-center hover:text-white">
                  <td className="px-6 py-4 whitespace-nowrap">01</td>
                  <td className="px-6 py-4 whitespace-nowrap">Pin de Goku</td>
                  <td className="px-6 py-4 whitespace-nowrap">01</td>
                  <td className="px-6 py-4 whitespace-nowrap">30</td>
                </tr>
                <tr className="hover:bg-blue-700 text-center hover:text-white">
                  <td className="px-6 py-4 whitespace-nowrap">02</td>
                  <td className="px-6 py-4 whitespace-nowrap">Cuadro CSM</td>
                  <td className="px-6 py-4 whitespace-nowrap">02</td>
                  <td className="px-6 py-4 whitespace-nowrap">280</td>
                </tr>
                <tr className="hover:bg-blue-700 text-center hover:text-white">
                  <td className="px-6 py-4 whitespace-nowrap">03</td>
                  <td className="px-6 py-4 whitespace-nowrap">Pin de Zelda (escudo)</td>
                  <td className="px-6 py-4 whitespace-nowrap">01</td>
                  <td className="px-6 py-4 whitespace-nowrap">70</td>
                </tr>
                <tr className="hover:bg-blue-700 text-center hover:text-white">
                  <td className="px-6 py-4 whitespace-nowrap">04</td>
                  <td className="px-6 py-4 whitespace-nowrap">Cuadro de lol</td>
                  <td className="px-6 py-4 whitespace-nowrap">01</td>
                  <td className="px-6 py-4 whitespace-nowrap">140</td>
                </tr>
                <tr className="hover:bg-blue-700 text-center hover:text-white">
                  <td className="px-6 py-4 whitespace-nowrap">05</td>
                  <td className="px-6 py-4 whitespace-nowrap">Playera Luffy Gear 5 v2</td>
                  <td className="px-6 py-4 whitespace-nowrap">04</td>
                  <td className="px-6 py-4 whitespace-nowrap">680</td>
                </tr>
                <tr className="hover:bg-blue-700 text-center hover:text-white">
                  <td className="px-6 py-4 whitespace-nowrap">06</td>
                  <td className="px-6 py-4 whitespace-nowrap">Playera Luffy Gear</td>
                  <td className="px-6 py-4 whitespace-nowrap">02</td>
                  <td className="px-6 py-4 whitespace-nowrap">400</td>
                </tr>
                <tr className="hover:bg-blue-700 text-center hover:text-white">
                  <td className="px-6 py-4 whitespace-nowrap">07</td>
                  <td className="px-6 py-4 whitespace-nowrap">Cuadro Adventure Time</td>
                  <td className="px-6 py-4 whitespace-nowrap">01</td>
                  <td className="px-6 py-4 whitespace-nowrap">100</td>
                </tr>
                <tr className="hover:bg-blue-700 text-center hover:text-white">
                  <td className="px-6 py-4 whitespace-nowrap">08</td>
                  <td className="px-6 py-4 whitespace-nowrap">Test</td>
                  <td className="px-6 py-4 whitespace-nowrap">03</td>
                  <td className="px-6 py-4 whitespace-nowrap">3</td>
                </tr>
                <tr className="hover:bg-blue-700 text-center hover:text-white">
                  <td className="px-6 py-4 whitespace-nowrap">09</td>
                  <td className="px-6 py-4 whitespace-nowrap">Test</td>
                  <td className="px-6 py-4 whitespace-nowrap">01</td>
                  <td className="px-6 py-4 whitespace-nowrap">1</td>
                </tr>
                <tr className="hover:bg-blue-700 text-center hover:text-white">
                  <td className="px-6 py-4 whitespace-nowrap">10</td>
                  <td className="px-6 py-4 whitespace-nowrap">Test</td>
                  <td className="px-6 py-4 whitespace-nowrap">02</td>
                  <td className="px-6 py-4 whitespace-nowrap">2</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    )
}

export default UserProfile