import { render, screen } from "@testing-library/react";
import Home from "./page";
import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";

// Mock du router Next.js
vi.mock("next/navigation", () => ({
    useRouter: vi.fn(() => ({
        push: vi.fn(),
        })),
}));

// Mock de requestSubmit pour éviter l'erreur
HTMLFormElement.prototype.requestSubmit = vi.fn();

describe("Home Page", () => {
  it("affiche correctement le header avec le logo et les liens de navigation", () => {
    render(<Home />);

    expect(screen.getByText("Comptarial")).toBeInTheDocument();
    expect(screen.getByText("Accueil")).toBeInTheDocument();
    expect(screen.getByText("Nous")).toBeInTheDocument();
    expect(screen.getByText("Services")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
  });

  it("affiche les boutons d'authentification", () => {
    render(<Home />);

    expect(screen.getByTestId("signup-button")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Se connecter/i })).toBeInTheDocument();
  });

  it("affiche les sections principales", () => {
    render(<Home />);

    expect(screen.getByText("Bienvenue chez Comptarial")).toBeInTheDocument();
    expect(screen.getByText("À Propos de Nous")).toBeInTheDocument();
    expect(screen.getByText("Nos Services")).toBeInTheDocument();

    const heading = screen.getByRole("heading", { name: /Contactez-nous/i });
    expect(heading).toBeInTheDocument();
  });

  it("le bouton 'Se connecter' contient le bon lien", () => {
    render(<Home />);
    const link = screen.getByTestId("signin-button").closest("a"); // Récupère l'élément <a> parent
    expect(link).toHaveAttribute("href", "/login");
});

it("le bouton 'S'inscrire' contient le bon lien", () => {
    render(<Home />);
    const link = screen.getByTestId("signup-button").closest("a"); // Récupère l'élément <a> parent
    expect(link).toHaveAttribute("href", "/register");
});

});