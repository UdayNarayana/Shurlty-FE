import { Link, NavLink, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import { getToken, clearToken } from "../../utils/token";

export default function Navbar() {
	const navigate = useNavigate();
	const authed = Boolean(getToken());

	const handleLogout = () => {
		clearToken();
		navigate("/login", { replace: true });
	};

	return (
		<header className={styles.header}>
			<div className={styles.inner}>
				<div className={styles.left}>
					<Link to="/" className={styles.brand}>
						Shurlty
					</Link>
				</div>
					<div className={styles.navLinks}>
						<NavLink
							to="/"
							end
							className={({ isActive }) =>
								isActive ? styles.active : styles.link
							}
						>
							Home
						</NavLink>

						{authed && (
							<NavLink
								to="/links"
								className={({ isActive }) =>
									isActive ? styles.active : styles.link
								}
							>
								My Links
							</NavLink>
						)}
				</div>

				<div className={styles.right}>
					{!authed ? (
						<>
							<NavLink
								to="/login"
								className={({ isActive }) =>
									isActive ? styles.active : styles.link
								}
							>
								Login
							</NavLink>

							<NavLink to="/register" className={styles.cta}>
								Register
							</NavLink>
						</>
					) : (
						<button
							type="button"
							className={styles.btnGhost}
							onClick={handleLogout}
						>
							Logout
						</button>
					)}
				</div>
			</div>
		</header>
	);
}
