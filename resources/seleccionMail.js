export const seleccionMailHtml = (docente) =>`
      
<!DOCTYPE html>
<html>
<head>
  <title>Notificación de Selección como Evaluador</title>
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
    .black-text {
      color: #000000; /* Color negro (#000000) */
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
  </style>
</head>
<body style="font-family: Arial, sans-serif; text-align: center; background-color: #f0f0f0;">
  <div class="outer-container">
    <div class="shadow">
      <div class="container">
        <h2 style="color: #00ACE6;">¡Felicidades, ${docente.nombre} ${docente.apellido}!</h2>
        <p class="black-text" style="font-size: 16px;">Te informamos que has sido seleccionado como evaluador de la Feria de Ciencias y Tecnología.</p>
        <p class="black-text" style="font-size: 16px;">El número de CUIL asociado a tu cuenta es: ${docente.cuil}</p>
        <p style="font-size: 14px; color: #888; margin-top: 20px;">Próximamente serás asignado a diferentes proyectos para poder evaluarlos</p>
        <div class="marca-agua-container">
          <p class="marca-agua">CienciaConecta</p>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
`;