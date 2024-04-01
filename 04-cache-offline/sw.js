console.log("SW: Funcionando✅");

const CACHE_STATIC_NAME = "static-v1";
const CACHE_DYNAMIC_NAME = "dynamic-v1";
const CACHE_INMUTABLE_NAME = "inmutable-v1";
const CACHE_DYNAMIC_LIMIT = 50;

/* limitar el cache dinámico para que solo guarde una cantidad limitada y lo demás lo siga solicitando a la web */
/* usualmente solo se limpia el cache dinámico pero ahora lo haremos para que pueda limpiar cualquier cache pasándolo como argumento en el cacheName */
function cleanLimitCache(cacheName, numberItemsCache) {
  caches.open(cacheName).then((cacheInfo) => {
    return cacheInfo.keys().then((cacheKeys) => {
      // console.log(cacheKeys);

      if (cacheKeys.length > numberItemsCache) {
        /* borrar el primero elemento del arreglo y para que sea recursivo entonces se puede colocar un .then(), ya que delete() me regresa una promesa, y llamar de nuevo a la función y pasarle los parámetros y eso se ejecutará de forma recursiva hasta que ya no se cumpla la condición */
        cacheInfo
          .delete(cacheKeys[0])
          .then(cleanLimitCache(cacheName, numberItemsCache));
      }
    });
  });
}

/* *************** GUARDAR EL APP SHELL CUANDO SE INSTALA EL SERVICE WORKER *************** */
self.addEventListener("install", (event) => {
  console.log("SW: Instalando service worker✅");

  const cacheStaticPromise = caches
    .open(CACHE_STATIC_NAME)
    .then((cacheInfo) => {
      console.log("SW: Instalaciones cache estático terminadas✅");

      return cacheInfo.addAll([
        "/",
        "/index.html",
        "/css/style.css",
        "/img/main.jpg",
        "/img/no-img.jpg", // para colocar una imagen por defecto
        "/js/app.js",
        "/pages/offline.html", // si no carga una página entonces cargará esta página
      ]);
    });

  const cacheInmutablePromise = caches
    .open(CACHE_INMUTABLE_NAME)
    .then((cacheInfo) => {
      console.log("SW: Instalaciones cache inmutable terminadas✅");

      return cacheInfo.addAll([
        "https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css", // bootstrap, aquí realmente se almacena lo que nos devuelve esta url. No ocupaa mucho espacio porque está optimizado para web y está comprimido lo máximo posible pero si fuera una librería muy pesada no se usaría ya que los tiempo de carga para la web son importantes
      ]);
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

            /* también sería necesario que al ya tener la nueva respuesta guardarla en el caché para así evitar que se hagan peticiones fetch innecesarias */
            caches.open(CACHE_DYNAMIC_NAME).then((cacheInfo) => {
              /* cacheInfo.put(a dónde se está haciendo la solicitud, la respuesta que queremos que guarde) */
              cacheInfo.put(event.request, newResponse);

              /* aquí sería un buen punto para limpiar el cache ya que se irán grabando los recursos que no hayan en el cache estático. Recordar que todo esto sucede en el background de la aplicación, es decir, totalmente independiente de la aplicación */
              cleanLimitCache(CACHE_DYNAMIC_NAME, 3); // se coloca 3 para ver mejor el ejercicio de que solo se guarden dos elementos en el cache dinámico pero usualmente se podría colocar unos 50 o unos 100 dependiendo de qué es lo que se quiera guardar
            });

            /* se utiliza el .clone() porque arriba en "cacheInfo.put(event.request, newResponse);" ya se está utilizando el newResponse, es decir, se estaría regresando dos veces, una para colocarlo nuevamente en el cache (la de arriba) y esta (aquí abajo) que sería para regresar la respuesta como tal, ya que si no se clona aparecería este problema en consola "Uncaught (in promise) TypeError: Failed to execute 'put' on 'Cache': Response body is already used" entonces para romper esa referencia se usa el .clone() para utilizarla en ambos lugares porque cuando usamos el objeto (la respuesta que es el newResponse) la primera vez ya se modifica y cambian cierta propiedades internas y lamentablemente sólo se puede usar una vez y eso nos impide que podamos volver a extraer la data o volver a utilizarla por lo que debemos de clonarlo antes de usarse y se clona aquí y no el .put(....) ya que se debe de clonar si se va a usar más de una vez */
            return newResponse.clone();
          })
          .catch((error) => {
            /* aquí sería un error de que no tengo conexión a internet */
            console.log(error);

            /* validación para que solo retorne el offline.html si lo que falla es cuando se solicita un html como en el caso de page2.html y una forma es de hacerlo con headers.get("accept").includes("text/html") y se puede variar un poco el código para detectar imágenes, css, etc... */
            if (event.request.headers.get("accept").includes("text/html")) {
              return caches.match("/pages/offline.html");
            }
          });
      }
    })
  );
});
