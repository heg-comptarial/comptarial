import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ConfirmationMotDePasseOublie() {
  return (
    <div className="flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            E-mail envoyé
          </CardTitle>
          <CardDescription className="text-center">
            Un e-mail de réinitialisation a été envoyé à votre adresse.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Veuillez vérifier votre boîte de réception et suivre les
            instructions pour réinitialiser votre mot de passe. Si vous ne
            recevez pas l&apos;e-mail dans les prochaines minutes, vérifiez votre
            dossier de spam.
          </p>
          <div className="flex justify-center">
            <Button variant="link" className="text-sm">
              Renvoyer mail?
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
