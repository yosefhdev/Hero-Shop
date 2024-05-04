import { Link } from "react-router-dom"

const Login = () => {
  return (
    <div className="m-5">
    <Link to={'/'} className="bg-primary text-white px-2 py-1 rounded-xl m-5">
      Volver al Inicio
    </Link>

    <div className="Fondo"></div>
      <div className="formulario absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-400px h-500px bg-white p-10 rounded-lg border-2 border-gray-300 shadow-md " >
        <h1 className="text-blue-600 text-2xl font-bold text-center mb-8 border-b-2 border-gray-400">Inicio de Sesion</h1>
        <form className="px-50" method="post">
          <div className="relative mb-8">
            <input type="text" required className="w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-600 px-2 py-2" />
            <label className="absolute top-2 left-2 -mt-6 text-gray-400 text-sm">Nombre de Usuario</label>
          </div>
          <div className="relative mb-8">
            <input type="password" required className="w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-600 px-2 py-2" />
            <label className="absolute top-2 left-2 -mt-6 text-gray-400 text-sm">Contraseña</label>
          </div>
        <div className="text-gray-600 text-sm mb-6">
          <a href="#">¿Olvidaste tu contraseña?</a>
        </div>
        <input type="submit" value="Iniciar" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-full w-full" />
        <p className="text-gray-600 text-sm mt-6">No tienes una cuenta? <Link to={'/register'} className="text-primary hover:border-b hover:border-primary">Quiero registrarme</Link></p>
      </form>
    </div>
  </div>
  )
}

export default Login