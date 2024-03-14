/* TAMBIÉN SE PUEDE CREAR EL SERVICE WORKER EN TYPESCRIPT: https://www.devextent.com/create-service-worker-typescript/ */
/* ¿Cuales son los pasos que suceden cuando NO existe un Service Worker previo? Se registra, se descarga, se instala y se activa */
/* ************************************************************************************************************************ */

/* ***** Ciclos de vida del SW ***** */
console.log("SW: Funcionando✅");

/* ***** cuando se instala un service worker ***** */
/* el install del service worker se va a ejecutar o disparar cada vez que haya cualquier cambio en el service worker y lanzará su instalación pero esto NO quiero decir que se activa, ya que ese es un siguiente paso que veremos más abajo */
self.addEventListener("install", (event) => {
  /* en el momento de la instalación nosotros podemos hacer cosas como:
    - descargar assets, archivos de js y css
    - creamos un cache
    - etc....
  */
  console.log("SW: Instalando Service Worker✅");
  console.log(event);

  /* si queremos que el nuevo service worker tome control de la aplicación apenas se instala y que no se espere que el usuario cierre todo los tabs de la aplicación o cierre toda la aplicación y que vuelva a entrar. Su uso dependerá de cómo funcione la aplicación, porque puede ser que el usuario esté trabajando con algo del service worker y luego recibe una notificación push y puede ser que el usuario pierda lo que estaba trabajando anteriormente del service worker porque por medio de la notificación push trajo uno nuevo, por eso sería mejor que el usuario sea quien controle de forma indirecta la instalación y activación del nuevo service worker al cerrar toda la aplicación y luego al volverla a abrir esté el service worker más reciente. Se podría manejar con algo similar a https://deanhume.com/displaying-a-new-version-available-progressive-web-app/ */
  // self.skipWaiting();

  const installationPromise = new Promise((resolve, reject) => {
    /* simular que este setTimeout ejecuta la labor de instalación o que guarda algo en cache */
    setTimeout(() => {
      console.log("SW: Instalaciones terminadas✅");

      /* este self.skipWaiting() se usará solo para fines prácticos */
      self.skipWaiting();

      /* cuando termine entonces se llamará al resolve para resolver la promesa */
      resolve();
    }, 1500);
  });

  /* usualmente cuando hacemos la instalación o hacemos la activación o recibimos una notificación push o tratamos de sincronisar datos con el servidor cuando recuperamos conexión, etc., en resumen, cuando ejecutamos cualquier event listener el service worker lo ejecuta de una manera extremadamente rápida pero lo que ocurre dentro de la instalación como tal o dentro de la activación como tal u otros eventos no se ejecutan de una forma tan rápida entonces si queremos por ejemplo guardar datos en la cache eso puede demorar y queremos esperar hasta que este evento termine para poder ejecutar otro y evitar problemas inesperados, por eso se usará el .waitUntil() */
  /* este .waitUntil() está en todos los eventos de instalación, activación, etc y usualmente dentro del .waitUntil(....) va una promesa, entonces crearemos una promesa para la instalación que será el installationPromise y eso lo colocaremos dentro del .waitUntil(....) y con esto veremos que se va realizando el flujo pero no pasará al siguiente paso hasta que se complete lo que pusimos dentro del .waitUntil(....) */
  event.waitUntil(installationPromise);
});

/* ***** cuando se activa un service worker y toma el control de la aplicación ***** */
self.addEventListener("activate", (event) => {
  /* en el momento de la activación nosotros podemos hacer cosas como:
    - borrar cache viejo (quiere decir que el viejo service worker ya no se utiliza y ahora tendrá que utilizar los nuevos caches del nuevo service worker que se hizo en la instalación)
    - etc....
  */
  console.log("SW: Activando Service Worker✅");
  console.log(event);
});

/* ***** para hacer peticiones HTTP usando fetch ***** */
self.addEventListener("fetch", (event) => {
  /* en el momento que se hace un fetch nosotros podemos hacer cosas como:
    - aplicar estrategias del cache (ver qué se puede guardar en el caché, etc.)
    - etc....
  */

  console.log("SW: Peticiones Service Worker✅", event.request.url);

  if (event.request.url.includes("https://reqres.in/")) {
    const response = new Response(`{ok: false, message: 'jajaja'}`);

    /* con esto veremos que sí se realiza la petición como se muestra en "SW: Peticiones Service Worker✅ https://reqres.in/api/users" pero el service worker nos regresa "{ok: false, message: 'jajaja'}" */
    event.respondWith(response);
  }
});

/* ***** sincronizar la data cuando ya se tenga conexión usando "sync" ***** */
self.addEventListener("sync", (event) => {
  /* disparar este evento localmente es un poco engañoso pero ya se verá más adelante */

  console.log("SW: Se reestableció la conexión✅");
  console.log(event);

  /* este .tag es que por ejemplo, cuando vamos a hacer un posteo de algo y eso se puede hacer en el background entonces podemos asignarle un tag o una etiqueta o algo que le diga que eso serán los posteos o posteos sin conexión para que cuando se reestablezca la conexión entonces veremos qué hay que hacer mediante estos tag y aquí también se hace uso del indexDB (base de datos interna de JavaScript que ya traen los navegadores web) y mediante el tag poder hacer algo determinado */
  console.log(event.tag);
});

/* ***** manejar las push notification usando "push" ***** */
self.addEventListener("push", (event) => {
  console.log("SW: Notificación recibida✅");
  console.log(event);
});
