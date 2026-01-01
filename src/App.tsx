import "./App.css";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Links from "./pages/Links";
import LoginForm from "./components/auth/LoginForm/LoginForm";
import RegisterForm from "./components/auth/RegisterForm/RegisterForm";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
	return (
		<BrowserRouter>
			<div>
				<nav>
					<Link to="/">Home</Link>
					<Link to="/links">My Links</Link>
					<Link to="/login">Login</Link>
					<Link to="/register">Register</Link>
				</nav>

				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<LoginForm />} />
					<Route path="/register" element={<RegisterForm />} />

					{/* Protected routes */}
					<Route element={<ProtectedRoute />}>
						<Route path="/links" element={<Links />} />
					</Route>

					{/* fallback */}
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</div>
		</BrowserRouter>
	);
}

export default App;
