<div style="font-family: Arial, sans-serif; color: #333; padding: 30px; line-height: 1.6;">
  <h2 style="color: #3498db; font-size: 24px; margin-bottom: 20px;">
    Bonjour {{ $user->nom }},
  </h2>

  <p style="font-size: 16px; margin-bottom: 16px;">
    Vous avez demandé à <strong>réinitialiser votre mot de passe</strong> pour accéder à votre compte sur <strong>Comptarial</strong>.
  </p>

  <p style="font-size: 16px; margin-bottom: 16px;">
    Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe :
  </p>

  <p style="text-align: center; margin: 30px 0;">
    <a href="{{ $resetUrl }}"
       style="background-color: #2ecc71; color: white; padding: 12px 24px; border-radius: 5px; text-decoration: none; font-weight: bold; font-size: 16px;">
      Réinitialiser mon mot de passe
    </a>
  </p>

  <p style="font-size: 14px; margin-bottom: 16px; color: #888;">
    ⏳ Ce lien est valable pendant 60 minutes.
  </p>

  <p style="font-size: 16px; margin-bottom: 16px;">
    Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email en toute sécurité.
  </p>

  <p style="font-size: 16px; font-weight: bold; margin-top: 30px;">
    L'équipe Comptarial
  </p>
</div>
