
import { BrowserRouter, Routes, Route } from "react-router-dom"
// pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateProduct from './pages/CreateProduct';
import CreateCategory from './pages/CreateCategory';
import EditProduct from './pages/EditProduct';
import NotFoundPage from './pages/NotFoundPage';
import { useAuth } from './pages/auth';
import ProtectedRoute from './components/ProtectedRoute';
// import Navbar from "./components/Navbar";

function App() {

  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-product"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <CreateProduct />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-category"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <CreateCategory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit-product/:id"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <EditProduct />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}


export default App
