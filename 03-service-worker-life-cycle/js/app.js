// Detectar si podemos usar Service Workers
if (navigator.serviceWorker) {
  /* este register es una promesa entonces se puede usar los .then() para manejar la promesa del registro e instalación */
  navigator.serviceWorker.register("/sw.js").then((register) => {
    console.log(register);

    /* no todos los navegadores que soportan el service worker soportan la tecnología de esa sincronización cuando se reestablece la conexión, es decir, si algún navegador no soporta el syncmanager entonces tenemos que hacer los posteos normales cuando sí se tenga conexión y decirle al usuario que no podrá postear algo mientras no tenga internet o que se instale un navegador web moderno */
    /* se realizará un registro de una tarea asíncrona cuando no hay conexión a internet y por ahora se simulará con el setTimeout */
    setTimeout(() => {
      /* aquí por ejemplo se está simulando que se hicieron post a una galería mientras no se tenía conexión a internet. Entonces se entra a la aplicación, luego se pierde la conexión y se recargar la aplicación veremos el mensaje de "Se enviaron las fotos al servidor" y luego cuando se reestablezca la conexión veremos el mensaje de "SW: Se reestableció la conexión✅" y su lógica correspondiente */
      register.sync.register("posteo-de-fotos");
      console.log("Se enviaron las fotos al servidor");
    }, 3000);

    /* para mostrar una notificación (sería bueno también hacer una validación a ver si existe Notification en window) y luego usar el requestPermission para pedirle permiso al usuario de que si quiere o no recibir notificaciones porque nosotros no podemos mandar una notificación sin el permiso del usuario y una vez que el usuario acepta entonces recién se podrá mandar la notificación y si no acepta entonces el usuario tendría que aceptar manualmente la notificación */
    Notification.requestPermission().then((result) => {
      console.log(result);
      register.showNotification("Se realizó la notificación al usuario✅");
    });
  });
}

/* hacer una petición para simular qué es lo que haríamos para guardar data en el cache usando el event fetch y eso lo veremos también en la consola, ya que veremos algo similar a:

SW: Peticiones Service Worker✅ http://localhost:5500/css/style.css
SW: Peticiones Service Worker✅ http://localhost:5500/img/main.jpg
SW: Peticiones Service Worker✅ http://localhost:5500/js/app.js
SW: Peticiones Service Worker✅ https://reqres.in/api/users --> es la petición que hicimos abajo
SW: Peticiones Service Worker✅ chrome-extension://ienfalfjdbdpebioblfackkekamfmbnh/app/detect_angular_for_extension_icon_bundle.js

al colocar el .then(....).then(....) veremos también en la consola la respuesta de la petición realizada que sería algo similar a:

SW: Peticiones Service Worker✅ http://localhost:5500/css/style.css
SW: Peticiones Service Worker✅ http://localhost:5500/img/main.jpg
SW: Peticiones Service Worker✅ http://localhost:5500/js/app.js
SW: Peticiones Service Worker✅ https://reqres.in/api/users --> es la petición que hicimos abajo
app.js:16 {page: 1, per_page: 6, total: 12, total_pages: 2, data: Array(6), …} --> (data) => console.log(data)
SW: Peticiones Service Worker✅ chrome-extension://ienfalfjdbdpebioblfackkekamfmbnh/app/detect_angular_for_extension_icon_bundle.js
*/
fetch("https://reqres.in/api/users")
  .then((response) => response.text())
  .then((data) => console.log(data));
