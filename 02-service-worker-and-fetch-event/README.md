## FORMA 1: live server

Para abrir este proyecto de 02-service-worker en el navegador, hay que abrir esta carpeta en otra ventana de Visual Studio Code e ir al index.html y abrirlo con live server o sino usando directamente su extensión que debería aparecer en la barra inferior casi llegando a la esquina derecha.

Luego nos dará una url con el ip pero lo cambiaremos por localhost, es decir, tendría que quedar algo similar a http://localhost:5501/

---

## FORMA 2: http-server

Para abrir este proyecto de 02-service-worker en el navegador, hay que ir a la ruta donde está esta carpeta, es decir, colocar en la terminal la ruta del 02-service-worker.

Luego, como ya se tiene instalado el http-server de forma global, entonces sería cuestión de colocar en la terminal `http-server` o `http-server -o` para que lo abra directo en el navegador y de esa forma nos dará una url con el ip pero cambiaremos esa ip por localhost, es decir, tendría que quedar algo similar a http://localhost:8080/

Pero aquí hay que ir bajando y subiendo el http-server con cada cambio.

---

## CONCEPTOS

- El Service Worker es un archivo de JavaScript que se compone de muchos eventListeners. Estará pendiende de algunos eventos como:

  - install -> instalación del Service Worker
  - activate -> cuando se activa el Service Worker
  - push -> cuando se recibe una notificación push
  - fetch -> cuando se hace algún fetch
  - sync -> cuando se recupera la conexión a internet y queremos hacer algún tipo de sincronización
  - message -> cuando se recibe algún mensaje del tab del navegador o un mensaje de la aplicación como tal

- El Service Worker corre en un hilo independiente a la página web, está corriendo en un lugar especial separado de la página web, es decir, se podría cerrar toda la página web y el Service Worker se seguiría ejecutando, seguirá escuchando eventos hasta que venga un nuevo Service Worker o hasta que nosotros explícitamente le digamos que ya queremos borrar el Service Worker. Aunque también el Service Worker puede tener una comunicación directa 1 a 1 o 1 a muchos tabs del navegador. Entonces como está corriendo en el background de la aplicación eso nos permite recibir notificaciones push, saber cuando se recupera o se pierde la conexión a internet y también nos permite realizar actualizaciones en el background sin necesidad de preguntarle nada al usuario

- ¿Cuántos service workers se pueden tener en background simultaneamente? ¿Cuál es la forma más óptima de actualizar un service worker?

  - Dependería del scope que este definido para el service worker ya que solo 1 es permitido por scope. Ahora, para actualizarlo, el navegador detecta cuando hay cambios en el service worker y queda en espera. La próxima vez que nuestro usuario acceda a nuestra pagina web se instalará y hará uso de la nueva versión del service worker. Documentación muy buena sobre los PWA: https://web.dev/learn/pwa/update/#updating-the-service-worker

- Para saber si podemos usar o no el service worker, es decir, saber si existe el objeto serviceWorker en navigator:

  - FORMA 1:

  ```js
  if (navigator.serviceWorker) {
    console.log("Sí podemos usarlo");
  } else {
    console.log("No podemos usarlo");
  }
  ```

  - FORMA 2:

  ```js
  if ("serviceWorker" in navigator) {
    console.log("Sí podemos usarlo");
  } else {
    console.log("No podemos usarlo");
  }
  ```
