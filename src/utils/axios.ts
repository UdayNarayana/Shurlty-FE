import axios from "axios";
import { getToken, clearToken } from "./token";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export const api = axios.create({
	baseURL: API_BASE,
	headers: {
		"Content-Type": "application/json",
	},
});

// Attach Authorization header
api.interceptors.request.use((config) => {
	const token = getToken();
	if (token) {
		config.headers = config.headers ?? {};
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

// Handle 401 globally
api.interceptors.response.use(
	(res) => res,
	(err) => {
		const status = err?.response?.status;
		if (status === 401) {
			clearToken();
			//redirect to login
			if (window.location.pathname !== "/login") {
				window.location.href = "/login";
			}
		}
		return Promise.reject(err);
	}
);
