import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./RegisterForm.module.css";
import { registerUser } from "../../../services/authService";

export default function RegisterForm() {
	const navigate = useNavigate();
	const [name, setName] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function submitHandler(e: React.FormEvent) {
		e.preventDefault();
		setError(null);

		if (!name.trim()) return setError("Name is required");
		if (!email.trim()) return setError("Email is required");
		if (!password.trim()) return setError("Password is required");
		if (password.length < 8) return setError("Password must be at least 8 characters");

		try {
			setLoading(true);
			await registerUser(name.trim(), email.trim(), password);
			navigate("/login");
		} catch (err: any) {
			setError(err?.message || "Registration failed");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className={styles.page}>
			<div className={styles.card}>
				<h1 className={styles.title}>Create account</h1>

				<form className={styles.form} onSubmit={submitHandler}>
					<label className={styles.label}>
						Name
						<input
							className={styles.input}
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Your name"
							autoComplete="name"
						/>
					</label>

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
							placeholder="Min 8 characters"
							autoComplete="new-password"
						/>
					</label>

					{error && <div className={styles.error}>{error}</div>}

					<button className={styles.button} type="submit" disabled={loading}>
						{loading ? "Creating..." : "Register"}
					</button>
				</form>

				<div className={styles.footer}>
					Already have an account? <Link to="/login">Login</Link>
				</div>
			</div>
		</div>
	);
}
