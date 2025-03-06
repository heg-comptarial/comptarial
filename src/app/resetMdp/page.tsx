function ResetPassword() {
  return (
    <div className="flex items-center justify-center min-h-screen py-12">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <div className="space-y-1 mb-6">
          <h1 className="text-2xl font-bold text-center">
            Réinitialiser votre mot de passe
          </h1>
          <p className="text-gray-500 text-center">
            Veuillez créer un nouveau mot de passe pour votre compte.
          </p>
        </div>

        <form className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Nouveau mot de passe
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Entrez votre nouveau mot de passe"
              required
            />
            <p className="text-xs text-gray-500">
              Le mot de passe doit contenir au moins 8 caractères, une
              majuscule, un chiffre et un caractère spécial.
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirmer le mot de passe
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirmez votre nouveau mot de passe"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Réinitialiser le mot de passe
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <a
            href="/connexion"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Retour à la connexion
          </a>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
