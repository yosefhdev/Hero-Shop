import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import supabase from '../supabase/client';

const TipoUsuario = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const { data, error } = await supabase
          .from('usuarios')
          .select('*');

        if (error) {
          console.error('Error al obtener usuarios:', error.message);
          return;
        }

        setUsers(data);
      } catch (error) {
        console.error('Error al obtener usuarios:', error.message);
      }
    }

    fetchUsers();
  }, []);

  const handleToggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'Administrador' ? 'Cliente' : 'Administrador';
    try {
      const { error } = await supabase
        .from('usuarios')
        .update({ rol: newRole })
        .eq('id', userId);

      if (error) {
        console.error('Error al actualizar el rol del usuario:', error.message);
        return;
      }

      // Actualiza el estado local para reflejar el cambio
      setUsers(users.map(user => 
        user.id === userId ? { ...user, rol: newRole } : user
      ));
    } catch (error) {
      console.error('Error al actualizar el rol del usuario:', error.message);
    }
  };

  return (
    <div className="flex justify-center py-8">
      <div className="relative w-full max-w-4xl">
        <div className="absolute top-0 left-0 mt-4 mr-4">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            <Link to="/">Regresar</Link>
          </button>
        </div>
        <br />
        <br />
        <br />
        <br />

        <div className="overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-xs text-left rtl:text-right text-blue-100 dark:text-blue-100">
            <thead className="text-xs text-white uppercase bg-blue-600 border-b border-blue-400 dark:text-white">
              <tr>
                <th scope="col" className="px-6 py-3 min-w-[200px]">E-mail</th>
                <th scope="col" className="px-6 py-3 bg-blue-500 min-w-[150px]">Nombre</th>
                <th scope="col" className="px-6 py-3 min-w-[150px]">Apellido Paterno</th>
                <th scope="col" className="px-6 py-3 bg-blue-500 min-w-[150px]">Apellido Materno</th>
                <th scope="col" className="px-6 py-3 min-w-[100px]">Rol</th>
                <th scope="col" className="px-6 py-3 bg-blue-500 min-w-[100px]">Acción</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="bg-blue-600 border-b border-blue-400">
                  <td className="px-6 py-4 text-xs">{user.email}</td>
                  <td className="px-6 py-4 bg-blue-500 text-xs">{user.nombre}</td>
                  <td className="px-6 py-4 text-xs">{user.apellido_paterno}</td>
                  <td className="px-6 py-4 bg-blue-500 text-xs">{user.apellido_materno}</td>
                  <td className="px-6 py-4 text-xs">{user.rol}</td>
                  <td className="px-6 py-4 bg-blue-500 text-xs">
                    <button 
                      className="font-medium text-white hover:underline" 
                      onClick={() => handleToggleRole(user.id, user.rol)}
                    >
                      {user.rol === 'Administrador' ? 'Cambiar a Cliente' : 'Cambiar a Administrador'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TipoUsuario;
