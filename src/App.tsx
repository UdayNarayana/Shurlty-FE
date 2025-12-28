import "./App.css";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Links from "./pages/Links";
import LoginForm from "./components/auth/LoginForm/LoginForm";
import RegisterForm from "./components/auth/RegisterForm/RegisterForm";

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
					<Route path="/links" element={<Links />} />

					{/* fallback */}
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</div>
		</BrowserRouter>
	);
}

export default App;
