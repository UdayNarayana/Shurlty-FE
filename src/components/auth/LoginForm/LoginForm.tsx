import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./LoginForm.module.css";
import { loginUser } from "../../../services/authService";
import { setToken } from "../../../utils/token";

const LoginForm = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const submitHandler = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		if (!email.trim()) return setError("Email is required");
		if (!password.trim()) return setError("Password is required");

		try {
			setLoading(true);
			const { token } = await loginUser(email.trim(), password);
			setToken(token);
			navigate("/links");
		} catch (err: any) {
			setError(err?.message || "Login failed");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className={styles.page}>
			<div className={styles.card}>
				<h1 className={styles.title}>Login</h1>

				<form className={styles.form} onSubmit={submitHandler}>
					<label className={styles.label}>
						Email
						<input
							className={styles.input}
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="you@example.com"
							autoComplete="email"
						/>
					</label>

					<label className={styles.label}>
						Password
						<input
							className={styles.input}
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Your password"
							autoComplete="current-password"
						/>
					</label>

					{error && <div className={styles.error}>{error}</div>}

					<button className={styles.button} type="submit" disabled={loading}>
						{loading ? "Logging in..." : "Login"}
					</button>
				</form>

				<div className={styles.footer}>
					Don’t have an account? <Link to="/register">Register</Link>
				</div>
			</div>
		</div>
	);
}

export default LoginForm;