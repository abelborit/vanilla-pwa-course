console.log("SW: Funcionando✅");
// const CACHE_NAME = "cache-v1";
const CACHE_STATIC_NAME = "static-v1"; // este será como el cache-v1
const CACHE_DYNAMIC_NAME = "dynamic-v1"; // para guardar contenido dinámico
const CACHE_INMUTABLE_NAME = "inmutable-v1"; // para guardar contenido inmutable como por ejemplo el link de bootstrap porque eso no lo vamos a cambiar nosotros, las versiones seguirán aumentando pero la que estamos usando en particular se queda con esa versión
const CACHE_DYNAMIC_LIMIT = 50;

/* limitar el cache dinámico para que solo guarde una cantidad limitada y lo demás lo siga solicitando a la web */
/* usualmente solo se limpia el cache dinámico pero ahora lo haremos para que pueda limpiar cualquier cache pasándolo como argumento en el cacheName */
function cleanLimitCache(cacheName, numberItemsCache) {
  caches.open(cacheName).then((cacheInfo) => {
    /* barrer todos los elementos que están dentro de este cacheInfo */
    return cacheInfo.keys().then((cacheKeys) => {
      /* cacheKeys sería cada uno de los registros que hay en el cache pero recordar que .keys que retorna un arreglo */
      // console.log(cacheKeys);

      /* validar primero si ya alcancé el tamaño y como es un arreglo lo que me retorna el .keys() entonces se puede usar el .length y con eso si se supera el límete entonces se limpiará el cache y si no entonces se sigue el flujo normal de seguir guardando elementos en el cache */
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
/* el App Shell es lo que se necesita sí o sí para que la aplicación funcione. Este App Shell sería todo el código que se utiliza para que la aplicación funcione correctamente (estilos, funcionalidades, script's, textos, imágenes, etc.) y ese App Shell es lo que queremos cargar rápidamente y eso es lo vamos a guardar en el cache al momento de la instalación del service worker */
self.addEventListener("install", (event) => {
  console.log("SW: Instalando service worker✅");

  /* guardar todo lo que queremos en el cache dándole el nombre de "cache-v1" y asignar toda la lógica a la constante cacheStaticPromise para poder utilizarla en el waitUntil(). El .open() nos regresa una promesa por eso se usa el .then() para poder realizar la lógica de guardado en el cache que sería el "cache-v1" y luego el addAll([...]) también es una promesa es por eso que se retorna para que la función como tal, que está guardada en la constante cacheStaticPromise, se pueda utilizar en el waitUntil() ya que necesita una promesa para que funcione correctamente */
  /* aquí antes estaba el CACHE_NAME en vez del CACHE_STATIC_NAME solo que ahora se está dividiendo los recursos estáticos y los recursos dinámicos */
  const cacheStaticPromise = caches
    .open(CACHE_STATIC_NAME)
    .then((cacheInfo) => {
      console.log("SW: Instalaciones cache estático terminadas✅");

      /* aquí se retorna porque el waitUntil() necesita una promesa para poder esperar a que termine de resolverse y de ahí recién poder pasar a otro evento. Ahora con esto ya tenemos todo lo que queremos guardado en cache pero aún no lo estamos utilizando */
      return cacheInfo.addAll([
        /* este "/" también tiene que estar porque sino al momento de aplicar las estrategias de cache falla la aplicación al entrar a http://localhost:5500/ porque no está contemplado o guardado en el cache, pero si en el navegador se coloca http://localhost:5500/index.html sin que haya este "/" aquí entonces funciona todo normal porque el index.html sí está guardado en el cache. Entonces para evitar todo esto es necesario colocar el "/" aquí ya que el usuario puede entrar a http://localhost:5500/ o http://localhost:5500/index.html y es lo mismo porque apunta al mismo recurso de index.html */
        "/",
        "/index.html",
        "/css/style.css",
        "/img/main.jpg",
        "/img/no-img.jpg", // para colocar una imagen por defecto
        "/js/app.js",
      ]);

      /* NOTA: Tener en cuenta que si alguna ruta no se encuentra, es decir, si algún archivo no está bien definido porque se colocó mal la ruta o porque el archivo no existe, entonces nos dará un error en la instalación */
      /* si hay un error en alguna ruta que se colocó porque está mal colocada o no existe el archivo como el "/index123.html" entonces nos dará un error similar a "Uncaught (in promise) TypeError: Failed to execute 'addAll' on 'Cache': Request failed" y como nos menciona un "Request failed" entonces tenemos que verificar en todos los lugares donde nosotros hacemos ese request, es decir, en este caso como solo tenemos estas rutas entonces se tendría que revisar ruta por ruta para ver si existe el archivo o si el path del archivo es válido */
      // return cacheInfo.addAll([
      //   "/index123.html",
      //   "/css/style.css",
      //   "/img/main.jpg",
      //   "/js/app.js",
      // ]);
    });

  const cacheInmutablePromise = caches
    .open(CACHE_INMUTABLE_NAME)
    .then((cacheInfo) => {
      console.log("SW: Instalaciones cache inmutable terminadas✅");

      /* aquí se retorna porque el waitUntil() necesita una promesa para poder esperar a que termine de resolverse y de ahí recién poder pasar a otro evento. Ahora con esto ya tenemos todo lo que queremos guardado en cache pero aún no lo estamos utilizando */
      return cacheInfo.addAll([
        "https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css", // bootstrap, aquí realmente se almacena lo que nos devuelve esta url. No ocupaa mucho espacio porque está optimizado para web y está comprimido lo máximo posible pero si fuera una librería muy pesada no se usaría ya que los tiempo de carga para la web son importantes
      ]);
    });

  /* cuando se termine de resolver las promesas de cacheStaticPromise y cacheInmutablePromise recién podrá pasar a otro evento como, por ejemplo, pasar al activate */
  /* En este bloque de código, se utiliza Promise.all() para combinar dos promesas, cacheStaticPromise y cacheInmutablePromise, en una sola. Promise.all() espera a que todas las promesas se resuelvan o alguna de ellas se rechace. Si alguna de las promesas se rechaza, el resultado de Promise.all() será una promesa rechazada y la ejecución del evento se detendrá, ya que waitUntil() espera a que la promesa pasada como argumento se resuelva. Si ambas promesas se resuelven correctamente, el evento continuará su ejecución. */
  event.waitUntil(Promise.all([cacheStaticPromise, cacheInmutablePromise]));

  /* Aquí, se proporciona un array directamente a waitUntil(). En este caso, waitUntil() espera a que todas las promesas dentro del array se resuelvan, pero no hay garantía de que se rechace si alguna de las promesas falla. Por lo tanto, si cualquiera de las promesas en el array se rechaza, la ejecución del evento puede continuar en lugar de detenerse. */
  // event.waitUntil([cacheStaticPromise, cacheInmutablePromise]);

  /* Este bloque de código pasa dos promesas como argumentos separados a waitUntil(). Sin embargo, el método waitUntil() solo acepta un argumento, por lo que solo se considerará el primero y se ignorará el segundo. En este caso, solo cacheStaticPromise se pasará a waitUntil(), y cacheInmutablePromise no se tendrá en cuenta. */
  // event.waitUntil(cacheStaticPromise, cacheInmutablePromise);

  /* En resumen, la primera opción es la más segura cuando necesitas asegurarte de que todas las promesas se resuelvan antes de continuar con la ejecución, mientras que la segunda opción no garantiza que el evento se detenga si alguna de las promesas falla. La tercera opción es incorrecta ya que waitUntil() solo acepta un argumento, no múltiples promesas separadas. */
});

/* ********** ESTRATEGIA DE CACHE ********** */
/* una vez que se hace la instalación del service worker y guardamos en cache cada uno de los recursos que nuestra página web necesita entonces ya no es necesario volver a la web para volver a descargar esos mismos recursos, es por eso que existen diferentes estrategias para el cache */
/* las estrategias de cache, según el ciclo de vida del service worker, se hacen en el evento fetch porque ahí es cuando se trae toda la información que la página necesita y entonces ahí es donde se puede usar para guardar esa información en el cache */
self.addEventListener("fetch", (event) => {
  // console.log(event);
  // console.log(event.request); // irán apareciendo todas las peticiones fetch que se hacen a cada recurso que necesita la aplicación para funcionar

  /* ************************************************************************************************************************ */

  /* 01. Cache Only */
  /* Es decir, cuando queremos que toda la aplicación sea servida o utilizada desde el cache, ya no habría peticiones hacia la web, todo saldría desde el cache. Esta estrategia tiene ciertos problemas, por ejemplo, si nosotros no actualizamos el service worker entonces los archivos que guardamos arriba en cache jamás se van a actualizar porque jamás se llega a la web y por ende si el usuario intenta acceder a algún lugar y eso no está guardado en cache entonces se romperá la aplicación, pero eso se soluciona con otras estrategias de cache */

  /* responderá con el cache que haga match o que coincida con la request que tenga este event, es decir, se responderá usando el respondWith() y dentro de todos los caches que hayan se hará un match con el cache que coincida usando el caches.match() con lo que se le está mandando que es el event.request */
  // event.respondWith(caches.match(event.request));

  /* ************************************************************************************************************************ */

  /* 02. Cache With Network Fallback (se añadió el guardado en cache entonces podría ser "Cache With Network Fallback Then Cache") */
  /* Es decir, primero intenta del cache y si no encuentras el archivo en el cache entonces ve a internet para descargar ese archivo. Esta estrategia es más robusta que la anterior pero tiene ciertos problemas, por ejemplo, en cache se mezcla mi App Shell (es decir, mi cascarón de la aplicación) con recursos dinámicos que se guardan si no existen pero eso se soluciona con otras estrategias de cache y con optimizaciones en cache dinámico */
  // event.respondWith(
  //   caches.match(event.request).then((response) => {
  //     // console.log(response); // es la respuesta de la petición a la web

  //     /* hay que verificar si se resolvió correctamente, recordar que los 404 no se pueden manejar directamente con el .catch(). Si response tiene algo entonces que retorne eso pero sino entonces tendría que ir a internet a buscar el recurso */
  //     if (response) {
  //       console.log(response);
  //       return response;
  //     } else {
  //       console.log("No existe el recurso", event.request.url);
  //       console.log(event.request);

  //       /* para ir a la web y buscar el archivo entonces tenemos que hacer un fetch a ese archivo */
  //       return fetch(event.request).then((newResponse) => {
  //         console.log(newResponse);

  //         /* también sería necesario que al ya tener la nueva respuesta guardarla en el caché para así evitar que se hagan peticiones fetch innecesarias */
  //         caches.open(CACHE_NAME).then((cacheInfo) => {
  //           /* cacheInfo.put(a dónde se está haciendo la solicitud, la respuesta que queremos que guarde) */
  //           cacheInfo.put(event.request, newResponse);
  //         });

  //         /* se utiliza el .clone() porque arriba en "cacheInfo.put(event.request, newResponse);" ya se está utilizando el newResponse, es decir, se estaría regresando dos veces, una para colocarlo nuevamente en el cache (la de arriba) y esta (aquí abajo) que sería para regresar la respuesta como tal, ya que si no se clona aparecería este problema en consola "Uncaught (in promise) TypeError: Failed to execute 'put' on 'Cache': Response body is already used" entonces para romper esa referencia se usa el .clone() para utilizarla en ambos lugares porque cuando usamos el objeto (la respuesta que es el newResponse) la primera vez ya se modifica y cambian cierta propiedades internas y lamentablemente sólo se puede usar una vez y eso nos impide que podamos volver a extraer la data o volver a utilizarla por lo que debemos de clonarlo antes de usarse y se clona aquí y no el .put(....) ya que se debe de clonar si se va a usar más de una vez */
  //         return newResponse.clone();
  //       });
  //     }
  //   })
  // );

  /* ************************************************************************************************************************ */

  /* 02-1. Cache With Network Fallback (se añadió el guardado en cache entonces podría ser "Cache With Network Fallback Then Cache") con optimizaciones en cache dinámico */
  // event.respondWith(
  //   caches.match(event.request).then((response) => {
  //     // console.log(response); // es la respuesta de la petición a la web

  //     /* hay que verificar si se resolvió correctamente, recordar que los 404 no se pueden manejar directamente con el .catch(). Si response tiene algo entonces que retorne eso pero sino entonces tendría que ir a internet a buscar el recurso */
  //     if (response) {
  //       console.log(response);
  //       return response;
  //     } else {
  //       console.log("No existe el recurso", event.request.url);
  //       console.log(event.request);

  //       /* para ir a la web y buscar el archivo entonces tenemos que hacer un fetch a ese archivo */
  //       /* NOTA: Los return dentro dentro de una promesa que retornan promesas, son usados para mantener la cadena y poder anexar otro .then para evitar el callback hell */
  //       return fetch(event.request)
  //         .then((newResponse) => {
  //           console.log(newResponse);

  //           /* también sería necesario que al ya tener la nueva respuesta guardarla en el caché para así evitar que se hagan peticiones fetch innecesarias */
  //           caches.open(CACHE_DYNAMIC_NAME).then((cacheInfo) => {
  //             /* cacheInfo.put(a dónde se está haciendo la solicitud, la respuesta que queremos que guarde) */
  //             cacheInfo.put(event.request, newResponse);

  //             /* aquí sería un buen punto para limpiar el cache ya que se irán grabando los recursos que no hayan en el cache estático. Recordar que todo esto sucede en el background de la aplicación, es decir, totalmente independiente de la aplicación */
  //             cleanLimitCache(CACHE_DYNAMIC_NAME, 3); // se coloca 3 para ver mejor el ejercicio de que solo se guarden dos elementos en el cache dinámico pero usualmente se podría colocar unos 50 o unos 100 dependiendo de qué es lo que se quiera guardar
  //           });

  //           /* se utiliza el .clone() porque arriba en "cacheInfo.put(event.request, newResponse);" ya se está utilizando el newResponse, es decir, se estaría regresando dos veces, una para colocarlo nuevamente en el cache (la de arriba) y esta (aquí abajo) que sería para regresar la respuesta como tal, ya que si no se clona aparecería este problema en consola "Uncaught (in promise) TypeError: Failed to execute 'put' on 'Cache': Response body is already used" entonces para romper esa referencia se usa el .clone() para utilizarla en ambos lugares porque cuando usamos el objeto (la respuesta que es el newResponse) la primera vez ya se modifica y cambian cierta propiedades internas y lamentablemente sólo se puede usar una vez y eso nos impide que podamos volver a extraer la data o volver a utilizarla por lo que debemos de clonarlo antes de usarse y se clona aquí y no el .put(....) ya que se debe de clonar si se va a usar más de una vez */
  //           return newResponse.clone();
  //         });
  //     }
  //   })
  // );

  /* ************************************************************************************************************************ */

  /* 03. Network With Cache Fallback */
  /* Es decir, primero corre a internet y trata de obtener el recurso y si lo obtienes entonces lo muestras pero si no lo obtienes entonces corre al cache a ver si ahí existe. Esta estrategia tiene algunos problemas, por ejemplo, si estamos usando un dispositivo movil entonces siempre pero siempre va a tratar de traer la información más actualizada y eso ocasiona que siempre haya un fetch y por ende hay un consumo de datos, también que esta estrategia es más lenta que la de Cache With Network Fallback porque en Network With Cache Fallback tiene que hacer una descarga de esos recursos lo cual dependiendo del tipo de red que tengamos entonces será más rápido o más lento y en Cache With Network Fallback utiliza lo que ya se tiene en cache */
  /* NOTA: Esta estrategia, según como tenemos nuestra lógica en estos momentos, buscará TODOS los archivos en internet y los cachea en CACHE_DYNAMIC_NAME, hasta ahí todo bien pero darse cuenta que TODOS los archivos los está cacheando en CACHE_DYNAMIC_NAME y con esto surgen algunos problemas como: Primer problema, este cache lo tenemos limitado en 50 archivos o lo que diga CACHE_DYNAMIC_LIMIT. Segundo problema, ¿para qué quiero cachear el main.jpg u otros archivos en CACHE_DYNAMIC_NAME si ya lo tengo cacheado en CACHE_STATIC_NAME. Entonces para ello se podría refactorizar un poco de este código para que cada archivo se guarde en sus caches respectivos */
  // event.respondWith(
  //   fetch(event.request)
  //     .then((response) => {
  //       /* para probar este console.log se podría descomentar la línea "<img src="img/main222.jpg" alt="Vías del tren" class="img-fluid" />" y como esa imagen no existe entonces nos dará un 404 pero recordar que los 404 no se puede trabajar directo con el catch() entonces por eso se realiza una validación y si no existe (nos da el 404) entonces que retorne del cache lo que haga match con la petición que estoy dando */
  //       console.log("Fetch", response);

  //       /* aquí también se podría mandar un recurso por defecto, por ejemplo, como estamos hablando de imágenes, entonces se podría mandar una imagen por defecto */
  //       if (!response) return caches.match(event.request);

  //       caches.open(CACHE_DYNAMIC_NAME).then((cacheInfo) => {
  //         cacheInfo.put(event.request, response);
  //         cleanLimitCache(CACHE_DYNAMIC_NAME, CACHE_DYNAMIC_LIMIT);
  //       });

  //       return response.clone();
  //     })
  //     .catch((error) => {
  //       /* si la petición falla entonces viene la parte del Cache Fallback */
  //       /* este error no nos sirve para nada porque puede ser que no haya conexión a internet o algo similar y si no tenemos conexión a internet entonces solo nos queda revisar si existe el recurso en el cache */
  //       console.log(error);

  //       /* si existe algo en el cache que haga match con la petición que estoy dando (que sería el event.request) entonces eso es lo que se tiene que retornar */
  //       return caches.match(event.request);
  //     })
  // );

  /* ************************************************************************************************************************ */

  /* 04. Cache With Network Update */
  /* Esta estrategia es muy útil cuando el rendimiento es crítico, es decir, cuando queremos que aparezca lo más rápido posible nuestra aplicación para que el usuario sienta que está trabajando en una aplicación nativa pero también nos importan las actualizaciones pero en este caso las actualizaciones estarán siempre un paso atrás o una versión anterior, es decir, nuestras actualizaciones estarán siempre un paso atrás o una versión atrás de las que tiene el navegador web en ese momento, es decir, cualquier modificación que se haga por ejemplo en el index.html y se recarga el navegador web entonces se seguiría viendo tal cual como está porque eso está guardado en el cache pero una vez que se haga una petición a ese recurso entonces habrá una actualización en el background para que cuando el usuario vuelva a consultar la página web entonces tenga la nueva versión sin tener cambios en el service worker ya que el service worker hará toda esa lógica por nosotros */
  /* como se mencionó, esta estrategia es muy útil cuando el rendimiento es crítico, entonces por eso vamos a suponer que la aplicación va a trabajar con la información que se tenga en el cache de CACHE_STATIC_NAME */

  /* se hace esta validación para el bootstrap ya que abajo estamos trabajando solo con el CACHE_STATIC_NAME. Esto quiere decir que si la url de la request incluye "bootstrap" entonces me va a retornar, haciendo uso también del respondWith(), la información del cache que tenga lo que se está solicitando que sería el event.request que sería lo del bootstrap */
  // if (event.request.url.includes("bootstrap")) {
  //   return event.respondWith(caches.match(event.request));
  // }

  /*
  Explicación:
    1. buscar y abrir el cache CACHE_STATIC_NAME
    2. con se abra entonces que retorne la información que coincida con lo que está pidiendo la persona (event.request) lo cual debería estar en el cache 
    3. a la vez del paso 2 se hará un fetch para obtener la última versión de lo que se encuentre en el lugar donde estamos sirviendo la aplicación (sería el newResponse) para poder almacenarlo en el cache CACHE_STATIC_NAME y todo eso es servido en la versión que teníamos en el cache originalmente. NOTA: el fecth() se realizará después de lo que diga el return porque como es una promesa entonces toma más tiempo que solo leer el cache y luego retornarlo

  Pruebas:
    1. lo que se puede hacer para probar que esto funciona es ir al navegador y veremos que se instaló y funciona el service worker
    2. al actualizar la página veremos que todo está normal y hay información en el cache y todo bien
    3. ir al index.html y colocar o modificar cualquier cosa y luego guardar
    4. ir al navegador y refrescar la página entonces veremos que la página web sigue igual a como estaba antes porque el cache sigue igual a como estaba antes (su versión antigua) y eso es porque primero revisó y trajo la información desde el cache pero a su vez se actualiza el cache con la nueva información
    5. entonces como ya se actualizó el cache podemos volver a refrescar la página y veremos los últimos cambios reflejados en la página web
  */
  // event.respondWith(
  //   caches.open(CACHE_STATIC_NAME).then((cacheInfo) => {
  //     /* en esta estrategia se supone que ya tengo todo en el cache y que no existe nada que vaya a ser dinámico, entonces una vez que se sabe que ya se tiene el cache se hará un fetch al event.request para obtener la información y podamos tener esa nueva respuesta para poder actualizar el cache */
  //     /* en todas las estrategias por lo general si utilizan el fetch(), este fecth() se realizará después de lo que diga el return porque como es una promesa entonces toma más tiempo que solo leer el cache y luego retornarlo */
  //     fetch(event.request).then((newResponse) => {
  //       /* este newResponse es lo que está más actualizado en la web */

  //       /* put vs add */
  //       /* cache.add(request) -> Toma el URL, lo obtiene y añade la respuesta resultante al caché llamado. Esto sería como llamar el fetch y luego usar put para añadir los resultados al cache. El add nos ahorra un paso por decirlo así.*/
  //       /* cache.put(request, response) -> Toma ambos, la request y la response y los añade al caché dado.*/
  //       cacheInfo.put(event.request, newResponse);
  //     });

  //     /* luego tenemos que regresar lo que coincida en el cache de CACHE_STATIC_NAME para que eso sea lo que se sirve */
  //     /* aquí se está retornando el producto del cache */
  //     return cacheInfo.match(event.request);
  //   })
  // );

  /* ************************************************************************************************************************ */

  /* 05. Cache & Network Race */
  /* Esta estrategia es como una competencia para ver cuál de los dos responde primero, si el cache o el network (red) porque cabe la posibilidad que el usuario tenga un dispositivo con cache lento pero una velocidad de internet rápida entonces esto le brindará al usuario la capacidad de que tenga la información de la forma más rápida posible al realizar las peticiones de sus recursos */
  /*  
  Pruebas:
    1. ir al navegador y ver que esté funcionando todo correctamente y que el service worker se instaló correctamente
    2. colocar el modo offline y veremos que todo sigue funcionando bien porque se está jalando la data desde el service worker
    3. ir al cache estático y borrar la imagen main.jpg y recargar la página
    4. veremos que se coloca la imagen por defecto (no-img.jpg) jalada desde el cache (es importante que la imagen por defecto esté en el cache porque al no tener internet entonces no va a poder solicitar la imagen con un fetch y si no está en el cache entonces no se mostraría la imagen)
  */

  const responseCacheNetworkRace = new Promise((resolve, reject) => {
    /* se necesita una bandera o algo que me diga cuando una de las dos fue rechazada (el cache o la red) */
    let failedResponse = false;

    /* función para saber si ya falló una vez */
    const failedOnce = () => {
      /* evaluar si ya falló, es decir, si ya fue rechazada */
      if (failedResponse) {
        /* aquí sería que ya falló porque estaría como un true. Es decir, si la lógica del fetch falla entraría primero al else ya que todavía no falló porque está en false y recién se cambiará a un true, luego si también falla la lógica del cache entonces entraría directo al if porque el failedResponse ya estaría como true, y al revés también, si falla primero el cache y luego el fetch */

        /* si es una imagen que está fallando entonces se podría retornar una imagen por defecto */
        if (/\.(png|jpg)$/i.test(event.request.url)) {
          /* aquí tiene que resolver una imagen que esté en el cache si no entonces no me sirve */
          resolve(caches.match("/img/no-img.jpg"));
        } else {
          /* si no es una imagen entonces sería rechazarlo porque ya no hay más que se pueda hacer */
          reject("No se encontró respuesta❌");
        }
      } else {
        /* aquí sería que todavía no falló porque estaría como un false y por eso se cambia a true */
        failedResponse = true;
      }
    };

    /* dentro de esta promesa vamos a poner a competir cuál de las dos se hace primero si la respuesta del fetch o si la respuesta del cache */
    /* respuesta del fetch */
    fetch(event.request)
      .then((fetchResponse) => {
        fetchResponse.ok ? resolve(fetchResponse) : failedOnce();
      })
      .catch((error) => {
        console.log(error);
        /* el catch del fetch sería, por ejemplo, cuando no hay conexión a internet */
        return failedOnce();
      });

    /* respuesta del cache */
    caches
      .match(event.request)
      .then((cacheResponse) => {
        /* aquí ya vendría del cache entonces no hay el .ok sino ya viene el objeto directo */
        cacheResponse ? resolve(cacheResponse) : failedOnce();
      })
      .catch((error) => {
        console.log(error);
        /* el catch del fetch sería, por ejemplo, cuando no hay conexión a internet */
        return failedOnce();
      });
  });

  event.respondWith(responseCacheNetworkRace);
});
