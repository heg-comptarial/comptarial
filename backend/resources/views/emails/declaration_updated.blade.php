<div style="font-family: Arial, sans-serif; color: #333; padding: 30px; line-height: 1.6;">
  <h2 style="color: #4A90E2; font-size: 24px; border-bottom: 1px solid #eaeaea; padding-bottom: 10px;">
    Mise à jour de déclaration
  </h2>

  <table style="width: 100%; margin-top: 20px; border-collapse: collapse; font-size: 16px;">
    <tr>
      <td style="font-weight: bold; padding: 8px; background-color: #f9f9f9;">Nom</td>
      <td style="padding: 8px;">{{ $user->nom }}</td>
    </tr>
    <tr>
      <td style="font-weight: bold; padding: 8px; background-color: #f9f9f9;">Email</td>
      <td style="padding: 8px;"><a href="mailto:{{ $user->email }}">{{ $user->email }}</a></td>
    </tr>
    <tr>
      <td style="font-weight: bold; padding: 8px; background-color: #f9f9f9;">Titre de la déclaration</td>
      <td style="padding: 8px;">{{ $declaration->titre }}</td>
    </tr>
    <tr>
      <td style="font-weight: bold; padding: 8px; background-color: #f9f9f9;">Année</td>
      <td style="padding: 8px;">{{ $declaration->annee }}</td>
    </tr>
  </table>

  <p style="margin-top: 30px; font-size: 0.9em; color: #888;">
    — Comptarial Declaration Form
  </p>
</div>
