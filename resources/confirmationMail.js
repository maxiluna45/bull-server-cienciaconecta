export const confirmationMailHtml = (token) =>`
      
<!DOCTYPE html>
<html>
<head>
  <title>Verifica tu cuenta de correo</title>
  <style>
    .outer-container {
      margin-top: 40px; 
      padding-top: 40px;
      padding-bottom: 40px;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #fff;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.2);
      position: relative;
    }

    .shadow {
      position: absolute;
      top: -10px;
      left: -10px;
      right: -10px;
      bottom: -10px;
      box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.1);
      z-index: -1;
    }

    .marca-agua-container {
      text-align: center;
      margin-top: 10px; /* Separación del párrafo anterior */
    }
    .marca-agua {
      font-family: 'Open Sans', sans-serif;
      font-size: 24px;
      font-weight: bold; 
      color: #00ACE6;
    }

    .black-text {
      color: #000000; /* Color negro (#000000) */
    }
  </style>
</head>
<body style="font-family: Arial, sans-serif; text-align: center; background-color: #f0f0f0;">
  <div class="outer-container">
    <div class="shadow">
      <div class="container">
        <h2 style="color: #00ACE6;">¡Bienvenido a Ciencia Conecta!</h2>
        <p class="black-text" style="font-size: 16px;">Estamos emocionados de que formes parte de nuestra plataforma</p>
        <p class="black-text" style="font-size: 16px;">Hacé clic en el siguiente botón para verificar tu cuenta:</p>
        <a href="http://localhost:5000/api/v1/auth/confirmar/${token}" style="display: inline-block; background-color: #00ACE6; color: #fff; padding: 10px 20px; text-decoration: none; font-size: 16px; border-radius: 5px; margin-top: 20px;">Verificar cuenta</a>
        <p style="font-size: 14px; color: #888; margin-top: 20px;">Si tenés problemas con el botón de verificación, también podés copiar y pegar el siguiente enlace en tu navegador:</p>
        <p style="font-size: 14px; color: #888;"><a href="http://localhost:5000/api/v1/auth/confirmar/${token}" style="color: #00ACE6; text-decoration: none;">http://localhost:5000/api/v1/auth/confirmar/${token}</a></p>
        <div class="marca-agua-container">
          <p class="marca-agua">CienciaConecta</p>
        </div>
      </div>
    </div>
  </div>
</body>
</html>

`;