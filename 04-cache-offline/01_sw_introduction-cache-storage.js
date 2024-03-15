console.log("SW: Funcionando✅");

/* detectar si tenemos una conexión o si la conexión falla */
self.addEventListener("fetch", (event) => {
  /* se usa el new Response ya que me permite crear la respuesta de una petición que es lo que respondWith() necesita */

  /* respuesta offline con texto plano */
  // const offlineResponse = new Response(`
  //   Bienvenido a mi página web.
  //   Disculpa pero necesitas internet para usar esta página web.
  // `);

  /* respuesta offline con HTML de forma directa */
  const offlineResponse = new Response(
    `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>Mi PWA</title>
      </head>

      <body class="container p-3">
        <h1>Offline Mode</h1>
      </body>
    </html>
  `,
    {
      headers: {
        "Content-Type": "text/html",
      },
    }
  );

  /* al hacer de esta forma es lo mismo que lo de abajo, ya que al hacer el fetch es realizar una petición mediante internet y como no hay internet entonces no aparecerá este archivo y es como que nada adicional se hubiera hecho y aquí es donde entran las estrategias de cache para poder retornar la información de otro lugar sin usar el fetch */
  // const offlineResponse = fetch("pages/offline.html");

  const response = fetch(event.request).catch(() => {
    return offlineResponse;
  });

  event.respondWith(response);
});
