import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function MotDePasseOublie() {
  return (
    <div className="flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Mot de passe oublié
          </CardTitle>
          <CardDescription className="text-center">
            Veuillez entrer votre adresse e-mail pour recevoir un lien de
            réinitialisation de mot de passe.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              id="email"
              type="email"
              placeholder="Adresse mail"
              className="w-full"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <Button asChild>
              <Link href="/mot-de-passe-oublie/confirmation">Envoyer</Link>
            </Button>
            <Button variant="link" asChild className="px-0">
              <Link href="/connexion" className="text-sm">
                Annuler
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default MotDePasseOublie;
