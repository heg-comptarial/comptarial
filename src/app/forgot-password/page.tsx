"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("http://localhost:8000/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      setIsSubmitted(true);
    } else {
      const error = await res.json();
      alert(error.message || "Erreur");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {!isSubmitted ? (
          <>
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">Mot de passe oublié?</h1>
              <p className="text-muted-foreground">
                Saisissez l&apos;adresse mail associée à votre compte et nous
                vous enverrons un lien pour réinitialiser votre mot de passe.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="Adresse mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              <Button type="submit" className="w-full">
                Envoyer le lien de réinitialisation
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
            <h1 className="text-3xl font-bold">Email envoyé</h1>
            <p className="text-muted-foreground">
              Nous avons envoyé un lien de réinitialisation du mot de passe à{" "}
              <span className="font-medium">{email}</span>. Veuillez consulter
              votre boîte mail et suivez les instructions pour réinitialiser
              votre mot de passe.
            </p>
            <p className="text-sm text-muted-foreground">
              Si vous ne recevez pas l&apos;email dans les minutes qui suivent,
              vérifiez vos courriers indésirables ou{" "}
              <button
                onClick={() => setIsSubmitted(false)}
                className="text-sm font-medium underline hover:text-primary"
              >
                essayez à nouveau
              </button>
            </p>
            <div className="pt-4">
              <Link
                href="/login"
                className="text-sm text-muted-foreground hover:underline"
              >
                Retour à la connexion
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
