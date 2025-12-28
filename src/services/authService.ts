import { api } from "../utils/axios";

export type RegisterResponse = { 
  message: string; 
  userId?: number 
};

export type LoginResponse = { 
  token: string 
};

function extractError(err: any): string {
	return (
		err?.response?.data?.error ||
		err?.response?.data?.message ||
		err?.message ||
		"Something went wrong"
	);
}

export async function registerUser(name: string, email: string, password: string): Promise<RegisterResponse> {
	try {
		const res = await api.post<RegisterResponse>("/api/v1/auth/register", { name, email, password });
		return res.data;
	} catch (err: any) {
		throw new Error(extractError(err));
	}
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
	try {
		const res = await api.post<LoginResponse>("/api/v1/auth/login", { email, password });
		return res.data;
	} catch (err: any) {
		throw new Error(extractError(err));
	}
}
