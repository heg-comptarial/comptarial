import '@testing-library/jest-dom';
import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "./page";
import { describe, it, expect, vi } from "vitest";

// Mock du router Next.js pour éviter l'erreur "expected app router to be mounted"
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(), // Mock de la redirection
  }),
}));

describe("LoginPage component", () => {
  it("affiche correctement le formulaire de login", () => {
    render(<LoginPage />);

    expect(screen.getByText("LOGIN")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Mot de passe")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Se connecter/i })).toBeInTheDocument();
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
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: "fake-token" }),
      })
    ) as unknown as typeof fetch;
    

    render(<LoginPage />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Mot de passe");
    const submitButton = screen.getByRole("button", { name: /Se connecter/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    expect(global.fetch).toHaveBeenCalledWith("http://127.0.0.1:8000/api/login", expect.any(Object));
  });
});
