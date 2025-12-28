import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../../App";

// ---- Mock auth service used by forms ----
vi.mock("../../services/authService", () => ({
  loginUser: vi.fn(),
  registerUser: vi.fn(),
}));

// ---- Mock token utils (so we can verify token set) ----
let tokenStore: string | null = null;

vi.mock("../../utils/token", () => ({
  getToken: () => tokenStore,
  setToken: (t: string) => {
    tokenStore = t;
  },
  clearToken: () => {
    tokenStore = null;
  },
}));

import { loginUser, registerUser } from "../../services/authService";

function goTo(path: string) {
  window.history.pushState({}, "", path);
}

describe("Auth flow (integration)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    tokenStore = null;
  });

  it("renders Home route (/) and shows h1 Home", async () => {
    goTo("/");
    render(<App />);

    expect(await screen.findByRole("heading", { name: /Home/i })).toBeInTheDocument();
  });

  it("login: submits credentials, stores token, and navigates to Home", async () => {
    (loginUser as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({ token: "jwt-token" });

    goTo("/login");
    render(<App />);

    // Assert we're on the login page by checking the form fields
    const email = await screen.findByLabelText(/email/i);
    const password = screen.getByLabelText(/password/i);

    fireEvent.change(email, { target: { value: "u@x.com" } });
    fireEvent.change(password, { target: { value: "password123" } });

    // Button text must match your LoginForm button label.
    // If your button is "Sign in", change /login/i to /sign in/i
    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith("u@x.com", "password123");
    });

    // token stored
    expect(tokenStore).toBe("jwt-token");

    // navigated to Home: your Home page has <h1>Home</h1>
    expect(await screen.findByRole("heading", { name: /Links/i })).toBeInTheDocument();
  });

  it("register: submits name/email/password and navigates to /login", async () => {
    (registerUser as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      message: "User registered",
      userId: 1,
    });

    goTo("/register");
    render(<App />);

    const name = await screen.findByLabelText(/name/i);
    const email = screen.getByLabelText(/email/i);
    const password = screen.getByLabelText(/password/i);

    fireEvent.change(name, { target: { value: "Uday" } });
    fireEvent.change(email, { target: { value: "u@x.com" } });
    fireEvent.change(password, { target: { value: "password123" } });

    // Button text must match your RegisterForm button label.
    // If your button is "Create account", change /register/i accordingly.
    fireEvent.click(screen.getByRole("button", { name: /Register/i }));

    await waitFor(() => {
      expect(registerUser).toHaveBeenCalledWith("Uday", "u@x.com", "password123");
    });

    await waitFor(() => {
      expect(window.location.pathname).toBe("/login");
    });

    // After successful register, your RegisterForm navigates to "/login"
    // Verify we are on login page by checking login fields exist
    expect(await screen.findByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });
});
