/* este archivo sw-utils.js tendrá cierta lógica para no hacer que el sw.js cargue con todo el código en un solo archivo y poder dividirlo. Entonces este archivo se encargará de actualizar el cache dinámico que en vez de tener toda esa lógica en el sw.js solo esta funcionalidad estará aquí */
console.log("SW-Utils: Funcionando✅");

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

function updateCacheDynamic(cacheDynamic, request, response) {
  if (response.ok) {
    /* también sería necesario que al ya tener la nueva respuesta guardarla en el caché para así evitar que se hagan peticiones fetch innecesarias */
    return caches.open(cacheDynamic).then((cacheInfo) => {
      /* cacheInfo.put(a dónde se está haciendo la solicitud, la respuesta que queremos que guarde) */
      cacheInfo.put(request, response);

      /* aquí sería un buen punto para limpiar el cache ya que se irán grabando los recursos que no hayan en el cache estático. Recordar que todo esto sucede en el background de la aplicación, es decir, totalmente independiente de la aplicación */
      cleanLimitCache(cacheDynamic, 50); // se coloca 3 para ver mejor el ejercicio de que solo se guarden dos elementos en el cache dinámico pero usualmente se podría colocar unos 50 o unos 100 dependiendo de qué es lo que se quiera guardar

      /* se utiliza el .clone() porque arriba en "cacheInfo.put(event.request, response);" ya se está utilizando el response, es decir, se estaría regresando dos veces, una para colocarlo nuevamente en el cache (la de arriba) y esta (aquí abajo) que sería para regresar la respuesta como tal, ya que si no se clona aparecería este problema en consola "Uncaught (in promise) TypeError: Failed to execute 'put' on 'Cache': Response body is already used" entonces para romper esa referencia se usa el .clone() para utilizarla en ambos lugares porque cuando usamos el objeto (la respuesta que es el response) la primera vez ya se modifica y cambian cierta propiedades internas y lamentablemente sólo se puede usar una vez y eso nos impide que podamos volver a extraer la data o volver a utilizarla por lo que debemos de clonarlo antes de usarse y se clona aquí y no el .put(....) ya que se debe de clonar si se va a usar más de una vez */
      return response.clone();
    });
  } else {
    /* aquí ya falló el caché y falló la red, entonces no hay mucho por hacer entonces lo único que haremos es que regrese lo que tenga la respuesta */
    return response;
  }
}
