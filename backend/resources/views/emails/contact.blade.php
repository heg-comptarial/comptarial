<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; padding: 20px;">
  <h2 style="color: #4A90E2; border-bottom: 1px solid #eaeaea; padding-bottom: 10px;">
    {{ $data['subject'] ?? 'Nouveau message de contact' }}
  </h2>

  <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
    <tr>
      <td style="font-weight: bold; padding: 8px; background-color: #f9f9f9;">Nom</td>
      <td style="padding: 8px;">{{ $data['name'] }}</td>
    </tr>
    <tr>
      <td style="font-weight: bold; padding: 8px; background-color: #f9f9f9;">Email</td>
      <td style="padding: 8px;">{{ $data['email'] }}</td>
    </tr>
    <tr>
      <td style="font-weight: bold; padding: 8px; background-color: #f9f9f9; vertical-align: top;">Message</td>
      <td style="padding: 8px;">{!! nl2br(e($data['message'])) !!}</td>
    </tr>
  </table>

  <p style="margin-top: 30px; font-size: 0.9em; color: #888;">
    — Comptarial Contact Form
  </p>
</div>
