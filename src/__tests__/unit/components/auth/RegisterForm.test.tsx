import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RegisterForm from "../../../../components/auth/RegisterForm/RegisterForm";

vi.mock("../../../../services/authService", () => ({
	registerUser: vi.fn(),
}));

// Mock only useNavigate; keep other router exports real
const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
	const actual: any = await vi.importActual("react-router-dom");
	return {
		...actual,
		useNavigate: () => navigateMock,
	};
});

import { registerUser } from "../../../../services/authService";

describe("RegisterForm (unit)", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	function renderRegister() {
		return render(
			<MemoryRouter>
				<RegisterForm />
			</MemoryRouter>
		);
	}

	it("renders name, email, password inputs and register button", () => {
		renderRegister();

		expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /Register/i })).toBeInTheDocument();
	});

	it("shows validation error if name is missing", async () => {
		renderRegister();

		fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "u@x.com" } });
		fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });
		fireEvent.click(screen.getByRole("button", { name: /Register/i }));

		expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
		expect(registerUser).not.toHaveBeenCalled();
	});

	it("shows validation error if email is missing", async () => {
		renderRegister();

		fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "Uday" } });
		fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });
		fireEvent.click(screen.getByRole("button", { name: /Register/i }));

		expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
		expect(registerUser).not.toHaveBeenCalled();
	});

	it("shows validation error if password is missing", async () => {
		renderRegister();

		fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "Uday" } });
		fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "u@x.com" } });
		fireEvent.click(screen.getByRole("button", { name: /Register/i }));

		expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
		expect(registerUser).not.toHaveBeenCalled();
	});

	it("shows validation error if password is less than 8 chars", async () => {
		renderRegister();

		fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "Uday" } });
		fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "u@x.com" } });
		fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "short" } });
		fireEvent.click(screen.getByRole("button", { name: /Register/i }));

		expect(await screen.findByText(/at least 8 characters/i)).toBeInTheDocument();
		expect(registerUser).not.toHaveBeenCalled();
	});

	it("calls registerUser with trimmed name/email and navigates to /login on success", async () => {
		(registerUser as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
			message: "User registered",
			userId: 1,
		});

		renderRegister();

		fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "  Uday  " } });
		fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "  u@x.com  " } });
		fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });

		fireEvent.click(screen.getByRole("button", { name: /Register/i }));

		await waitFor(() => {
			expect(registerUser).toHaveBeenCalledWith("Uday", "u@x.com", "password123");
		});

		expect(navigateMock).toHaveBeenCalledWith("/login");
	});

	it("shows API error message on failure", async () => {
		(registerUser as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(
			new Error("Email already in use")
		);

		renderRegister();

		fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "Uday" } });
		fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "u@x.com" } });
		fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });

		fireEvent.click(screen.getByRole("button", { name: /Register/i }));

		expect(await screen.findByText(/email already in use/i)).toBeInTheDocument();
		expect(navigateMock).not.toHaveBeenCalled();
	});

	it("does not submit twice while loading", async () => {
		let resolveFn: (v: any) => void = () => {};
		const p = new Promise((resolve) => {
			resolveFn = resolve;
		});

		(registerUser as unknown as ReturnType<typeof vi.fn>).mockReturnValue(p);

		renderRegister();

		fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "Uday" } });
		fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "u@x.com" } });
		fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });

		const btn = screen.getByRole("button", { name: /Register/i });
		fireEvent.click(btn);
		fireEvent.click(btn);

		expect(registerUser).toHaveBeenCalledTimes(1);

		resolveFn({ message: "User registered", userId: 1 });

		await waitFor(() => {
			expect(navigateMock).toHaveBeenCalledWith("/login");
		});
	});
});
