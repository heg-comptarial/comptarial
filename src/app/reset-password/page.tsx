"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          token,
          password,
          password_confirmation: confirmPassword,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Erreur lors de la réinitialisation.");
        return;
      }

      setError("");
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {!isSubmitted ? (
          <>
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">
                Réinitialisez votre mot de passe
              </h1>
              <p className="text-muted-foreground">
                Saisissez votre nouveau mot de passe ci-dessous. Assurez-vous
                qu&apos;il contient au moins 8 caractères.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Nouveau mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center px-3"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <EyeIcon className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirmer le mot de passe"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center px-3"
                  >
                    {showConfirmPassword ? (
                      <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <EyeIcon className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>
              {error && (
                <p className="text-sm font-medium text-destructive">{error}</p>
              )}
              <Button type="submit" className="w-full">
                Réinitialiser le mot de passe
              </Button>
            </form>
            <div className="text-center">
              <Link
                href="/login"
                className="text-sm text-muted-foreground hover:underline"
              >
                Retour à la connexion
              </Link>
            </div>
          </>
        ) : (
          <div className="space-y-6 text-center">
            <h1 className="text-3xl font-bold">
              Réinitialisation du mot de passe réussi
            </h1>
            <p className="text-muted-foreground">
              Votre mot de passe a été réinitialisé avec succès. Vous pouvez
              maintenant vous connecter avec votre nouveau mot de passe.
            </p>
            <Button asChild className="mt-4">
              <Link href="/login">Retour à la connexion</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
