import { Link } from "react-router-dom"

const Login = () => {
  return (
    <div className="m-5">
      <Link to={'/'} className="bg-primary text-white px-2 py-1 rounded-xl m-5">
        Volver al Inicio
      </Link>

      <div className="Fondo"></div>
      <div className="formulario" style={{
        position: 'absolute',
        background: 'white',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '400px',
        height: '500px',
        borderRadius: '25px',
        border: '2px solid gainsboro',
        boxShadow: '0px 0px 25px #222',
      }}>
        <h1 style={{
          color: '#1C50CB',
          textAlign: 'center',
          padding: '0 0 20px 0',
          borderBottom: '1px solid gainsboro',
        }}>Inicio de Sesion</h1>
        <form style={{
          padding: '0 40px',
          boxSizing: 'border-box',
        }} method="post">
          <div className="UserData" style={{
            position: 'relative',
            borderBottom: '2px solid gainsboro',
            margin: '30px 0',
          }}>
            <input type="text" required style={{
              width: '100%',
              fontWeight: 'normal',
              padding: '0 5px',
              height: '60px',
              fontSize: '14px',
              color: 'gray',
              border: 'none',
              background: 'none',
              outline: 'none',
            }} />
            <label style={{
              position: 'absolute',
              top: '-15%',
              left: '5px',
              color: 'gainsboro',
              transform: 'translate(0%)',
              fontSize: '16px',
            }}>Nombre de Usuario</label>
            <span style={{
              position: 'absolute',
              top: '40%',
              left: '0',
              width: '100%',
              height: '2px',
              background: '#251D4E',
            }}></span>
          </div>
          <div className="UserData" style={{
            position: 'relative',
            borderBottom: '2px solid gainsboro',
            margin: '30px 0',
          }}>
            <input type="password" required style={{
              width: '100%',
              fontWeight: 'normal',
              padding: '0 5px',
              height: '60px',
              fontSize: '14px',
              color: 'gray',
              border: 'none',
              background: 'none',
              outline: 'none',
            }} />
            <label style={{
              position: 'absolute',
              top: '-15%',
              left: '5px',
              color: 'gainsboro',
              transform: 'translate(0%)',
              fontSize: '16px',
            }}>Contraseña</label>
            <span style={{
              position: 'absolute',
              top: '40%',
              left: '0',
              width: '100%',
              height: '2px',
              background: '#251D4E',
            }}></span>
          </div>
          <div style={{
            fontSize: '12px',
            position: 'relative',
            color: 'gray',
            margin: '30px 0',
          }}>
            <a href="#">¿Olvidaste tu contraseña?</a>
          </div>
          <input type="submit" value="Iniciar" style={{
            fontFamily: 'Lexend',
            fontSize: '20px',
            fontWeight: 'bold',
            color: 'white',
            backgroundColor: '#1C50CB',
            border: 'none',
            width: '320px',
            height: '50px',
            borderRadius: '15px',
          }} />
          No tienes una cuenta? &nbsp;
          <Link to={'/register'} className="text-primary hover:border-b hover:border-primary">
            Quiero registrarme
          </Link>
        </form>
      </div>
    </div>
  )
}

export default Login