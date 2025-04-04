import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, vi, expect, beforeEach } from "vitest";
import Dashboard from "./page";
import { MemoryRouter } from "react-router-dom";

// Define a type for the fetch response
interface FetchResponse {
  json: () => Promise<{ message: string }> | Promise<any>;
  ok: boolean;
}

vi.stubGlobal("fetch", vi.fn<() => Promise<FetchResponse>>());

describe("Dashboard Page", () => {
  beforeEach(() => {
    // Clear any previous mock calls
    vi.clearAllMocks();

    // Resetting mock fetch response
    (fetch as vi.Mock).mockResolvedValueOnce({
      json: async () => ({ message: "Success" }),
      ok: true,
    });
  });

  it("should render the page correctly", async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    // Test page title
    expect(screen.getByText("Tableau de bord administrateur")).toBeInTheDocument();

    // Test for backend message display
    expect(screen.getByText("Backend Response: Success")).toBeInTheDocument();
  });

  it("should trigger search when clicking the search button", async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    const searchButton = screen.getByText("Rechercher");
    const input = screen.getByPlaceholderText("Rechercher...");

    fireEvent.change(input, { target: { value: "John Doe" } });
    fireEvent.click(searchButton);

    // Wait for API call (mocked)
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("search?q=John+Doe"),
      expect.anything()
    );
  });

  it("should show loading indicator while fetching data", async () => {
    // Mock the fetch to simulate loading state
    (fetch as vi.Mock).mockResolvedValueOnce(new Promise(() => {})); // Make fetch hang

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    // Test loading state
    expect(screen.getByText("Chargement des demandes...")).toBeInTheDocument();
  });

  it("should display users in table when data is fetched", async () => {
    const mockUsers = [
      {
        user_id: 1,
        nom: "John Doe",
        email: "john@example.com",
        numeroTelephone: "123456789",
        localite: "Paris",
        adresse: "123 rue Example",
        codePostal: "75000",
        role: "admin",
        statut: "approved",
        dateCreation: "2023-04-01T00:00:00Z",
      },
    ];

    // Mocking fetch response for approved users
    (fetch as vi.Mock).mockResolvedValueOnce({
      json: async () => mockUsers,
      ok: true,
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    // Wait for table to update with users
    await waitFor(() => expect(screen.getByText("John Doe")).toBeInTheDocument());
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("123456789")).toBeInTheDocument();
  });

  it("should show error message if fetch fails", async () => {
    // Mocking a failed fetch request
    (fetch as vi.Mock).mockRejectedValueOnce(new Error("Failed to fetch"));

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    // Check for error handling
    await waitFor(() => expect(screen.getByText("Erreur lors du chargement des demandes:")).toBeInTheDocument());
  });
});
