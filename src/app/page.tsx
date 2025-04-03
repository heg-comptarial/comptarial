import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-white fixed top-0 left-0 w-full z-50 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="font-bold text-xl">Comptarial</div>
              <div className="bg-primary/10 p-2 rounded-md">
                <Image
                  src="/images/logo.png"
                  alt="Image d'accueil"
                  width={25}
                  height={10}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <a href="#accueil" className="font-medium hover:text-primary">
                Accueil
              </a>
              <a href="#nous" className="font-medium hover:text-primary">
                Nous
              </a>
              <a href="#services" className="font-medium hover:text-primary">
                Services
              </a>
              <a href="#contact" className="font-medium hover:text-primary">
                Contact
              </a>
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Link href="/connexion">
                <Button data-testid="signin-button" variant="outline">Se connecter</Button>
              </Link>
              <Link href="/inscription">
                <Button data-testid="signup-button">S&apos;inscrire</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-16">
        {/* Accueil */}
        <section id="accueil" className="py-20 bg-gray-100">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 items-center gap-12">
              {/* Texte à gauche */}
              <div>
                <h1 className="text-4xl font-bold">
                  Bienvenue chez Comptarial
                </h1>
                <p className="text-lg text-muted-foreground mt-4">
                  La comptabilité et la gestion fiduciaire simplifiées.
                </p>
                <p className="mt-4 text-muted-foreground">
                  Nous avons transformé la comptabilité et la gestion fiduciaire
                  avec des solutions numériques innovantes. Grâce à notre
                  plateforme 100% en ligne, nous vous offrons une expérience
                  fluide, rapide et transparente pour la gestion de vos
                  finances.
                </p>

                <div className="mt-6 flex gap-4">
                  <Link href="/inscription">
                    <Button size="lg">S&apos;inscrire</Button>
                  </Link>
                  <Link href="#contact">
                    <Button variant="outline" size="lg">
                      Contactez-nous
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Image à droite */}
              <div className="rounded-lg overflow-hidden border shadow-md">
                <Image
                  src="/images/placeholder.svg"
                  alt="Image d'accueil"
                  width={800}
                  height={500}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Nous */}
        <section id="nous" className="py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="grid md:grid-cols-2 items-center gap-12">
              {/* Texte à gauche */}
              <div className="rounded-lg overflow-hidden border shadow-md">
                <Image
                  src="/images/placeholder.svg"
                  alt="Image d'accueil"
                  width={800}
                  height={500}
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Image à droite */}
              <div>
                <h2 className="text-3xl font-bold">À Propos de Nous</h2>
                <p className="text-lg text-muted-foreground mt-4">
                  Nous sommes une équipe passionnée de professionnels en
                  comptabilité et fiduciaire qui a fait le choix de la
                  transformation numérique. Notre mission est de rendre la
                  gestion comptable plus simple, accessible et transparente pour
                  tous.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="py-20 bg-gray-100">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold">Nos Services</h2>
            <p className="text-lg text-muted-foreground mt-4">
              Découvrez nos services numériques pensés pour les entreprises
              modernes. Tout est accessible en ligne, où que vous soyez.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-8">
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-bold">Comptabilité en ligne</h3>
                <p className="text-muted-foreground mt-2">
                  Suivi de vos finances en temps réel, gestion de la TVA, des
                  bilans et des déclarations fiscales sans avoir à vous
                  déplacer.
                </p>

                {/* Accordion */}
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Is it accessible?</AccordionTrigger>
                    <AccordionContent>
                      Yes. It adheres to the WAI-ARIA design pattern.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-bold">
                  Gestion de la paie numérique
                </h3>
                <p className="text-muted-foreground mt-2">
                  Automatisation complète de la gestion des salaires, des
                  déclarations sociales, avec une interface claire et intuitive.
                </p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-bold">
                  Conseil et accompagnement personnalisé
                </h3>
                <p className="text-muted-foreground mt-2">
                  Nos experts sont à votre disposition pour vous conseiller sur
                  les stratégies fiscales et financières adaptées à votre
                  situation.
                </p>
              </div>
            </div>

            {/* Centrer les services 4 et 5 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-bold">
                  Déclarations fiscales automatisées
                </h3>
                <p className="text-muted-foreground mt-2">
                  Simplifiez vos déclarations fiscales grâce à nos outils
                  numériques qui automatisent les calculs et générent vos
                  rapports fiscaux.
                </p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-bold">
                  Gestion des documents fiscaux et comptables
                </h3>
                <p className="text-muted-foreground mt-2">
                  Numérisez et stockez tous vos documents fiscaux et comptables
                  dans notre système sécurisé, accessible à tout moment.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold">Contactez-nous</h2>
            <p className="text-lg text-muted-foreground mt-4">
              Remplissez le formulaire ci-dessous pour nous envoyer un message.
            </p>
            <div className="mt-8 max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
              <form>
                <div className="mb-4">
                  <label className="block text-left font-medium">Nom</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Votre nom"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-left font-medium">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Votre email"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-left font-medium">Message</label>
                  <textarea
                    className="w-full px-4 py-2 border rounded-lg"
                    rows={4}
                    placeholder="Votre message"
                  ></textarea>
                </div>
                <Button type="submit" className="w-full">
                  Envoyer
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <p>© 2024 Compagnie. Tous droits réservés.</p>
          <div className="mt-4 flex justify-center gap-6">
            <Link href="/terms" className="hover:underline">
              Conditions d&apos;utilisation
            </Link>
            <Link href="/privacy" className="hover:underline">
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
