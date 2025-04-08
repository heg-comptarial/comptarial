import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "./page";
import { describe, it, expect, vi } from "vitest";

// ✅ Mock du router Next.js
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// ✅ Mock d’Axios
import axios from "axios";
vi.mock("axios");
const mockedAxios = vi.mocked(axios);

describe("LoginPage component", () => {
  it("affiche correctement le formulaire de login", () => {
    render(<LoginPage />);

    expect(screen.getByText("LOGIN")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Mot de passe")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Se connecter/i })
    ).toBeInTheDocument();
  });

  it("permet à l'utilisateur de saisir un email et un mot de passe", () => {
    render(<LoginPage />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Mot de passe");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  it("affiche/masque le mot de passe au clic sur l'icône d'œil", () => {
    render(<LoginPage />);

    const passwordInput = screen.getByLabelText("Mot de passe");
    const eyeButton = screen.getByRole("button", {
      name: /afficher le mot de passe/i,
    });

    expect(passwordInput).toHaveAttribute("type", "password");

    fireEvent.click(eyeButton);
    expect(passwordInput).toHaveAttribute("type", "text");

    fireEvent.click(eyeButton);
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("soumet le formulaire et déclenche une requête API", async () => {
    // Simule la réponse API avec Axios
    mockedAxios.post.mockResolvedValueOnce({
      status: 200,
      data: {
        token: "fake-token",
        user: {
          user_id: 42,
          role: "user", // ou "admin"
        },
      },
    });

    render(<LoginPage />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Mot de passe");
    const submitButton = screen.getByRole("button", {
      name: /Se connecter/i,
    });

    fireEvent.change(emailInput, { target: { value: "prive@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "http://127.0.0.1:8000/api/login",
        { email: "prive@example.com", password: "password" },
        expect.any(Object)
      );
    });
  });
});
