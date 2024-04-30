
import { BrowserRouter, Routes, Route } from "react-router-dom"

// pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateProduct from './pages/CreateProduct';
import EditProduct from './pages/EditProduct';
import EditUser from './pages/EditUser';
import Navbar from "./components/Navbar";



function App() {

  return (
    <>
      <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/editar-producto/:id" element={<EditProduct />} />
        <Route path="/create-product" element={<CreateProduct />} />
        <Route path="/edit-user:id" element={<EditUser />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
