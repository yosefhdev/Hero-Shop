
import { BrowserRouter, Routes, Route } from "react-router-dom"
// pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateProduct from './pages/CreateProduct';
import EditProduct from './pages/EditProduct';
import { useEffect, useState } from "react";
// import Navbar from "./components/Navbar";

function App() {

  const [token, setToken] = useState(false)

  if (token) {
    sessionStorage.setItem('token', JSON.stringify(token))
  }

  useEffect(() => {
    if (sessionStorage.getItem('token')) {
      let data = JSON.parse(sessionStorage.getItem('token'))
      setToken(data)
    }
  }, [])


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/register" element={<Register />} />
          {token ?
            <>
              <Route path="/dashboard" element={<Dashboard token={token} />} />
              <Route path="/create-product" element={<CreateProduct token={token} />} />
              <Route path="/edit-product/:id" element={<EditProduct token={token} />} />
            </>
            : ''}

        </Routes>
      </BrowserRouter>
    </>
  )
}


export default App
