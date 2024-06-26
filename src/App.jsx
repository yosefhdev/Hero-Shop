
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
import AccessDeniedPage from './pages/AccessDeniedPage';
import { useAuth } from './pages/auth';
import ProtectedRoute from './components/ProtectedRoute';
import ProductDetail from './pages/ProductDetail';
import TipoUsuario from "./pages/TipoUsuario";
import Loader from './components/Loader';
import PayDetails from './pages/PayDetails';
import UserProfile from './pages/UserProfile';

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
					<Route path="/loader" element={<Loader />} />
					<Route path="/products/:productId" element={<ProductDetail />} />
					<Route path="/payment" element={<PayDetails />} />
					<Route
						path="/dashboard"
						element={
							<ProtectedRoute isAuthenticated={isAuthenticated} isAdmin={true}>
								<Dashboard />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/create-product"
						element={
							<ProtectedRoute isAuthenticated={isAuthenticated} isAdmin={true}>
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
						path="/user-roles"
						element={
							<ProtectedRoute isAuthenticated={isAuthenticated} isAdmin={true}>
								<TipoUsuario />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/edit-product/:id"
						element={
							<ProtectedRoute isAuthenticated={isAuthenticated} isAdmin={true}>
								<EditProduct />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/profile"
						element={
							<ProtectedRoute isAuthenticated={isAuthenticated} isAdmin={true}>
								<UserProfile />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/buy"
						element={
							<ProtectedRoute isAuthenticated={isAuthenticated} isAdmin={true}>
								<PayDetails />
							</ProtectedRoute>
						}
					/>

					<Route path="/access-denied" element={<AccessDeniedPage />} />
					<Route path="*" element={<NotFoundPage />} />
				</Routes>
			</BrowserRouter>
		</>
	)
}
export default App
