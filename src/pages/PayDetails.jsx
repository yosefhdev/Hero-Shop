

const PayDetails = () => {
  const user = {
    nombre: "Christian",
    direccion: {
      calle: "sabe",
      numero: "742",
      colonia: "Jacarandas",
      ciudad: "Tepic",
      codigoPostal: "63011",
      estado: "Nayarit",
      pais: "MEX",
    },
    telefono: "311-111-1111"
  };

  const cartProducts = [
    { id: 1, nombre: "Producto 1", categoria: "Categoría 1", precio: 10.00, img_url: "/src/assets/logos/efecto.png"  },
    { id: 2, nombre: "Producto 2", categoria: "Categoría 2", precio: 15.00, img_url: "/src/assets/logos/Hero-Shop-logo.webp" },
    { id: 3, nombre: "Producto 3", categoria: "Categoría 3", precio: 20.00, img_url: "/src/assets/logos/efecto.png" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-screen-lg mx-auto bg-white rounded-lg shadow-lg">
        <div className="bg-blue-700 text-white p-6 rounded-t-lg">
          <h1 className="text-3xl font-bold text-center">Información de Pago</h1>
        </div>
        <div className="flex p-8">
          <div className="w-1/2 pr-4">
            <h2 className="text-2xl font-semibold mb-4">Productos en el Carrito</h2>
            <div className="grid grid-cols-1 gap-4">
              {cartProducts.map(product => (
                <div key={product.id} className="border border-gray-300 rounded-md p-4 flex">
                  <img src={product.img_url} alt={product.nombre} className="w-70 h-40 object-cover rounded-md mr-4" />
                  <div>
                    <h3 className="text-lg font-medium">{product.nombre}</h3>
                    <p className="text-gray-600">{product.categoria}</p>
                    <p className="text-gray-800 font-semibold">${product.precio.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-1/2 pl-4">
            <h2 className="text-2xl font-semibold mb-4">Información del Usuario</h2>
            <div className="mb-4">
              <label className="block text-lg font-medium">Nombre del Usuario</label>
              <p className="border border-gray-300 rounded-md px-4 py-2">{user.nombre}</p>
            </div>
            <div className="mb-4">
              <label className="block text-lg font-medium">Teléfono</label>
              <p className="border border-gray-300 rounded-md px-4 py-2">{user.telefono}</p>
            </div>
            <div className="mb-4">
              <label className="block text-lg font-medium">Calle y Número</label>
              <p className="border border-gray-300 rounded-md px-4 py-2">{user.direccion.calle} {user.direccion.numero}</p>
            </div>
            <div className="mb-4">
              <label className="block text-lg font-medium">Colonia</label>
              <p className="border border-gray-300 rounded-md px-4 py-2">{user.direccion.colonia}</p>
            </div>
            <div className="mb-4">
              <label className="block text-lg font-medium">Ciudad</label>
              <p className="border border-gray-300 rounded-md px-4 py-2">{user.direccion.ciudad}</p>
            </div>
            <div className="mb-4">
              <label className="block text-lg font-medium">Código Postal</label>
              <p className="border border-gray-300 rounded-md px-4 py-2">{user.direccion.codigoPostal}</p>
            </div>
            <div className="mb-4">
              <label className="block text-lg font-medium">Estado</label>
              <p className="border border-gray-300 rounded-md px-4 py-2">{user.direccion.estado}</p>
            </div>
            <div className="mb-4">
              <label className="block text-lg font-medium">País</label>
              <p className="border border-gray-300 rounded-md px-4 py-2">{user.direccion.pais}</p>
            </div>
          </div>
        </div>
        <div className="mt-8 flex justify-center">
          <button className="bg-blue-700 text-white px-20 py-3 rounded-lg hover:bg-blue-800">Pagar</button>
        </div>
      </div>
    </div>
  );
}

export default PayDetails;
