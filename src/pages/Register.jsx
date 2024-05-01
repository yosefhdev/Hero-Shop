const Register = () => {
    return (
      <div>
        <title>Registro</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
        <div className="container flex justify-center items-center h-screen w-screen bg-gradient-to-br from-purple-900 to-blue-500">
          <div className="login-container bg-white rounded-lg shadow-md w-96">
            <div className="register p-10">
              <h2 className="text-2xl font-semibold text-center text-blue-600 mb-8">Registrarse</h2>
              <form action>
                <input type="text" placeholder="Nombre" className="input-field mb-4 block w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-600" />
                <input type="text" placeholder="Apellido Paterno" className="input-field mb-4 block w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-600" />
                <input type="text" placeholder="Apellido Materno" className="input-field mb-4 block w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-600" />
                <input type="text" placeholder="Correo" className="input-field mb-4 block w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-600" />
                <input type="password" placeholder="Contraseña" className="input-field mb-4 block w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-600" />
                <input type="password" placeholder="Confirma contraseña" className="input-field mb-6 block w-full border-b-2 border-gray-300 focus:outline-none focus:border-blue-600" />
                <input type="submit" className="submit-btn bg-blue-600 text-white font-semibold py-2 px-4 rounded-full w-full" />
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  export default Register