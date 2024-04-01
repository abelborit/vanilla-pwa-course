/* realizar la importación del sw-utils.js porque se está usando la función updateCacheDynamic. Se debe de hacer con el importScripts en lugar de modules/import de ES6 ya que no es exactamente una aplicación web lo que estamos escribiendo ahí */
importScripts("js/sw-utils.js");

console.log("SW: Funcionando✅");

const CACHE_STATIC_NAME = "static-v1";
const CACHE_DYNAMIC_NAME = "dynamic-v1";
const CACHE_INMUTABLE_NAME = "inmutable-v1";
// const CACHE_DYNAMIC_LIMIT = 50;

const APP_SHELL = [
  // "/", // se comenta porque este "/" nos servirá para desarrollo pero no para producción porque los demás archivos ya están en la ruta raiz de mi aplicación
  "index.html",
  "css/style.css",
  "img/favicon.ico",
  /* las imágenes se pueden guardar en un cache dinámico porque conforme se avance en la aplicación se puede colocar una funcionalidad para actualizar la imagen del avatar y tener en el cache la referencia a unas cuantas imágenes pero en este caso se guardarán de forma directa en el cache estático */
  "img/avatars/hulk.jpg",
  "img/avatars/ironman.jpg",
  "img/avatars/spiderman.jpg",
  "img/avatars/thor.jpg",
  "img/avatars/wolverine.jpg",
  "js/app.js",
  "js/sw-utils.js", // también se coloca el script que usamos para dividir el código del service worker
];

/* aquí iría lo que nosotros no hicimos, por ejemplo, las fuetes de google, la lógica de jquery, etc porque son cosas que nosotros no vamos a cambiar */
const APP_SHELL_INMUTABLE = [
  "https://fonts.googleapis.com/css?family=Quicksand:300,400",
  "https://fonts.googleapis.com/css?family=Lato:400,300",
  "https://use.fontawesome.com/releases/v5.3.1/css/all.css",
  "css/animate.css",
  "js/libs/jquery.js",
];

/* *************** GUARDAR EL APP SHELL CUANDO SE INSTALA EL SERVICE WORKER *************** */
self.addEventListener("install", (event) => {
  console.log("SW: Instalando service worker✅");

  const cacheStaticPromise = caches
    .open(CACHE_STATIC_NAME)
    .then((cacheInfo) => {
      console.log("SW: Instalaciones cache estático terminadas✅");

      return cacheInfo.addAll(APP_SHELL);
    });

  const cacheInmutablePromise = caches
    .open(CACHE_INMUTABLE_NAME)
    .then((cacheInfo) => {
      console.log("SW: Instalaciones cache inmutable terminadas✅");

      return cacheInfo.addAll(APP_SHELL_INMUTABLE);
    });

  /* cuando se termine de resolver las promesas de cacheStaticPromise y cacheInmutablePromise recién podrá pasar a otro evento como, por ejemplo, pasar al activate */
  event.waitUntil(Promise.all([cacheStaticPromise, cacheInmutablePromise]));
});

/* *************** ELIMINAR EL CACHE ANTIGUO Y QUE EL NUEVO TOME EL CONTROL DE LA APLICACIÓN *************** */
self.addEventListener("activate", (event) => {
  /* aquí se tendrían que eliminar todos los cache que sean "static-vX" menos el que tengo actualmente, porque arriba se realiza la instalación y cuando finaliza entonces recién se viene a este paso porque se está usando el "event.waitUntil(Promise.all([cacheStaticPromise, cacheInmutablePromise]));" */

  /* obtener primero todos los caches que estoy usando y eso me dará un arreglo de cacheKeys */
  const responseCaches = caches.keys().then((cacheKeys) => {
    /* barrer todos los caches del arreglo de cacheKeys y los que sean diferentes de CACHE_STATIC_NAME y los que incluyan en su nombre la palabra "static" entonces serán borrados */
    cacheKeys.forEach((key) => {
      if (key !== CACHE_STATIC_NAME && key.includes("static")) {
        return caches.delete(key);
      }
    });
  });

  /* NOTA: darse cuenta que cuando se instala un nuevo cache la versión anterior del cache sigue ahí porque hasta que la persona no salga de toda la aplicación y entre de nuevo o cuando le de un skip waiting entonces el cache anterior sigue y el nuevo cache se instala pero aún no se está usando, esto con la finalidad de que si el usuario está offline entonces pueda seguir usando el cache antiguo y cuando ya cierre todo y vuelva a entrar entonces tendrá el nuevo cache */

  /* que se termine todo lo de aquí para poder pasar al siguiente paso */
  event.waitUntil(responseCaches);
});

/* *************** APLICAR ESTRATEGIA DE CACHE *************** */
self.addEventListener("fetch", (event) => {
  /* 02-1. Cache With Network Fallback (se añadió el guardado en cache entonces podría ser "Cache With Network Fallback Then Cache") con optimizaciones en cache dinámico */
  event.respondWith(
    caches.match(event.request).then((response) => {
      // console.log(response); // es la respuesta de la petición a la web

      /* hay que verificar si se resolvió correctamente, recordar que los 404 no se pueden manejar directamente con el .catch(). Si response tiene algo entonces que retorne eso pero sino entonces tendría que ir a internet a buscar el recurso */
      if (response) {
        console.log(response);
        return response;
      } else {
        console.log("No existe el recurso", event.request.url);
        console.log(event.request);

        /* para ir a la web y buscar el archivo entonces tenemos que hacer un fetch a ese archivo */
        /* NOTA: Los return dentro dentro de una promesa que retornan promesas, son usados para mantener la cadena y poder anexar otro .then para evitar el callback hell */
        return fetch(event.request)
          .then((newResponse) => {
            console.log(newResponse);

            return updateCacheDynamic(
              CACHE_DYNAMIC_NAME,
              event.request,
              newResponse
            );
          })
          .catch((error) => {
            /* aquí sería un error de que no tengo conexión a internet */
            console.log(error);
          });
      }
    })
  );
});
