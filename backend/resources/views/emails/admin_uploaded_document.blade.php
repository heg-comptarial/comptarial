<div style="font-family: Arial, sans-serif; color: #333; padding: 30px; line-height: 1.6;">
  <h2 style="color: #4A90E2; font-size: 24px; margin-bottom: 20px;">
    Bonjour {{ $user->nom }},
  </h2>

  <p style="font-size: 16px; margin-bottom: 16px;">
    Un administrateur a récemment ajouté un <strong>nouveau document</strong> à votre déclaration
    intitulée <strong>{{ $declaration->titre }}</strong> pour l'année <strong>{{ $declaration->annee }}</strong>.
  </p>

  <p style="font-size: 16px; margin-bottom: 16px;">
    Connectez-vous à votre espace personnel pour le consulter dès maintenant.
  </p>

  <p style="font-size: 16px; margin-top: 30px;">
    Si vous avez des questions, notre équipe reste à votre écoute.
  </p>

  <p style="font-size: 16px; font-weight: bold; margin-top: 10px;">
    L'équipe Comptarial
  </p>
</div>
