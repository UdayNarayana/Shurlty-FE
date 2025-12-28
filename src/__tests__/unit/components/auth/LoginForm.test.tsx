import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LoginForm from "../../../../components/auth/LoginForm/LoginForm";

vi.mock("../../../../services/authService", () => ({
	loginUser: vi.fn(),
}));

vi.mock("../../../../utils/token", () => ({
	setToken: vi.fn(),
}));

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
	const actual: any = await vi.importActual("react-router-dom");
	return {
		...actual,
		useNavigate: () => navigateMock,
	};
});

import { loginUser } from "../../../../services/authService";
import { setToken } from "../../../../utils/token";

describe("LoginForm (unit)", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	function renderLogin() {
		return render(
			<MemoryRouter>
				<LoginForm />
			</MemoryRouter>
		);
	}

	it("renders email + password inputs and login button", () => {
		renderLogin();

		expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
	});

	it("shows validation error if email is missing", async () => {
		renderLogin();

		fireEvent.change(screen.getByLabelText(/password/i), {
			target: { value: "password123" },
		});

		fireEvent.click(screen.getByRole("button", { name: /login/i }));

		expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
		expect(loginUser).not.toHaveBeenCalled();
	});

	it("shows validation error if password is missing", async () => {
		renderLogin();

		fireEvent.change(screen.getByLabelText(/email/i), {
			target: { value: "u@x.com" },
		});

		fireEvent.click(screen.getByRole("button", { name: /login/i }));

		expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
		expect(loginUser).not.toHaveBeenCalled();
	});

	it("calls loginUser with trimmed email, stores token, and navigates on success", async () => {
		(loginUser as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
			token: "jwt-token",
		});

		renderLogin();

		fireEvent.change(screen.getByLabelText(/email/i), {
			target: { value: "  u@x.com  " },
		});

		fireEvent.change(screen.getByLabelText(/password/i), {
			target: { value: "password123" },
		});

		fireEvent.click(screen.getByRole("button", { name: /login/i }));

		await waitFor(() => {
			expect(loginUser).toHaveBeenCalledWith("u@x.com", "password123");
		});

		expect(setToken).toHaveBeenCalledWith("jwt-token");
		expect(navigateMock).toHaveBeenCalledWith("/links");
	});

	it("shows API error message on failure", async () => {
		(loginUser as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(
			new Error("Invalid credentials")
		);

		renderLogin();

		fireEvent.change(screen.getByLabelText(/email/i), {
			target: { value: "u@x.com" },
		});

		fireEvent.change(screen.getByLabelText(/password/i), {
			target: { value: "wrongpass" },
		});

		fireEvent.click(screen.getByRole("button", { name: /login/i }));

		expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
		expect(setToken).not.toHaveBeenCalled();
		expect(navigateMock).not.toHaveBeenCalled();
	});

	it("does not submit twice when loading (button disabled)", async () => {
		let resolveFn: (v: any) => void = () => {};
		const p = new Promise((resolve) => {
			resolveFn = resolve;
		});
		(loginUser as unknown as ReturnType<typeof vi.fn>).mockReturnValue(p);

		renderLogin();

		fireEvent.change(screen.getByLabelText(/email/i), {
			target: { value: "u@x.com" },
		});
		fireEvent.change(screen.getByLabelText(/password/i), {
			target: { value: "password123" },
		});

		const btn = screen.getByRole("button", { name: /login/i });
		fireEvent.click(btn);
		fireEvent.click(btn);

		expect(loginUser).toHaveBeenCalledTimes(1);

		// resolve async call
		resolveFn({ token: "jwt-token" });

		await waitFor(() => {
			expect(setToken).toHaveBeenCalledWith("jwt-token");
		});
	});
});
