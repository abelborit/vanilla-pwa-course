if (navigator.serviceWorker) {
  navigator.serviceWorker.register("/sw.js");
}

/* *************** INTRODUCCIÓN AL CACHE STORAGE *************** */
/* el cache storage es parte del objeto window como tal, no es parte del navegador como el service worker */
if (window.caches) {
  /* aquí le decimos que vaya al cache (que es un espacio del navegador) e intenta abrir el espacio llamado "prueba-1" y si no existe entonces créalo. Se puede tener cualquier cantidad de caches pero hay que tener en cuenta que eso impacta en el dispositivo donde se esté usando la aplicación */
  caches.open("prueba-1");
  caches.open("prueba-2");

  /* comprobar si un cache existe y esto regresará una promesa y por eso se puede usar el .then() */
  caches.has("prueba-2").then((response) => {
    console.log(response);
  });
  caches.has("prueba-3").then((response) => {
    console.log(response);
  });

  /* borrar los caches */
  caches.delete("prueba-2").then((response) => {
    console.log(response);
  });

  /* ************************************************************************************************************************ */

  /* ejemplo usando el cache */
  caches.open("cache-v1").then((cacheInfo) => {
    /* este cacheInfo es la referencia a este cache (a los archivos del cache y al cache como tal) */
    console.log(cacheInfo);

    /* FORMA 1: almacenar archivo por archivo */
    /* leer el index.html y que lo almacene manualmente ahí */
    // cacheInfo.add("/index.html");
    // cacheInfo.add("/js/app.js");

    /* FORMA 2: almacenar archivos mediante un arreglo */
    cacheInfo
      .addAll(["/index.html", "/js/app.js", "/img/main.jpg"])
      .then(() => {
        /* para borrar algo de este cache en específico se tiene que hacer de esta forma porque como el .addAll([....]) es una promesa entonces el guardar información es más lento que el eliminar información y por eso cuando se termine la promesa quiere decir que ya se guardó todo en cache y entonces recién se podría hacer el delete */
        cacheInfo.delete("/img/main.jpg");

        /* reemplazar algo que está en el cache con información que está más actualizada en la web, es decir, se puede mostrar información que está en el cache y poder actualizar el registro del cache mediante una petición fetch para traer los datos y luego poder actualizar el cache con la nueva información y la próxima vez que el usuario vuelva entonces ya tendría la versión actualizada del cache */
        /* se hace aquí ya que el siguiente código se haría más rápido que guardar la información en disco (memoria) es por eso que una vez que se termine la promesa entonces recién se ejecutaría este código. Entonces como ya se sabe que se guardó el index.html en caché pero ahora queremos reemplazar ese index.html por otra cosa */
        cacheInfo.put("index.html", new Response("Se reemplazó el recurso!!"));
      });

    /* leer información del cache y mostrarlo en la consola, se usará el match() que es para ver si algo hace match o coincide con lo que se le ponga y si existe o no existe entonces siempre va a regresar una promesa */
    cacheInfo.match("/index.html").then((response) => {
      if (response) {
        /* se usa el .text() para leerlo en texto plano, es como utilizar .json() para tener en formato JSON, entonces me dará una promesa y por eso se usa el .then() */
        response.text().then((response) => console.log(response));
      } else {
        console.log("Aún no existe el recurso a reemplazar...");
      }
    });
  });

  /* obtener todos los cache que tengo y me los retornaría como un arreglo y como es una promesa entonces se puede usar el .then() */
  caches.keys().then((cacheKey) => console.log(cacheKey));
}

/* ************************************************************************************************************************ */
/* otra forma de trabajarlo usando async/await */
// if (navigator.serviceWorker) {
//   navigator.serviceWorker.register("/sw.js");
// }

// if (window.caches) {
//   loadCache();
// }

// async function loadCache() {
//   const cacheInfo = await caches.open("cache-v1.1");

//   await cacheInfo.addAll(["/index.html", "/css/style.css", "/img/main.jpg"]);
//   await cacheInfo.delete("/css/style.css");

//   const isHTML = await cacheInfo.match("/index.html");

//   console.log(isHTML);

//   await cacheInfo.put("/index.html", new Response("Hiiii"));

//   console.log(await cacheInfo.keys());
// }
