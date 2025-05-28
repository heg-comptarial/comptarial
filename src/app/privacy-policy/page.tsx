export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Politique de confidentialité</h1>
      <p className="mb-4">
        Chez Comptarial, nous accordons une grande importance à la confidentialité de vos données. Cette page explique comment nous collectons, utilisons et protégeons vos informations personnelles.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">1. Collecte des informations</h2>
      <p className="mb-4">
        Nous collectons uniquement les informations nécessaires à la gestion de votre compte et à la fourniture de nos services (nom, email, etc.).
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">2. Utilisation des données</h2>
      <p className="mb-4">
        Vos données sont utilisées exclusivement pour vous fournir nos services, améliorer votre expérience et assurer la sécurité de la plateforme.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">3. Partage des informations</h2>
      <p className="mb-4">
        Nous ne partageons jamais vos informations personnelles avec des tiers sans votre consentement, sauf obligation légale.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">4. Sécurité</h2>
      <p className="mb-4">
        Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données contre tout accès non autorisé.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">5. Vos droits</h2>
      <p className="mb-4">
        Vous pouvez à tout moment accéder à vos données, les corriger ou demander leur suppression en nous contactant à <a href="mailto:contact@comptarial.ch" className="text-blue-600 underline">contact@comptarial.ch</a>.
      </p>
      <p className="text-sm text-muted-foreground mt-8">
        Dernière mise à jour : Mai 2025
      </p>
    </div>
  );
}