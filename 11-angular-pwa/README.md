# Angular + PWA

---

- ### Más Información:

  - https://itnext.io/build-a-production-ready-pwa-with-angular-and-firebase-8f2a69824fcc
  - https://angular.io/guide/service-worker-getting-started
  - https://angular.io/guide/service-worker-config
  - https://stackoverflow.com/questions/42474908/using-multiple-javascript-service-workers-at-the-same-domain-but-different-folde
  - https://stackoverflow.com/questions/56199460/need-information-about-using-multi-service-worker-in-a-domain

- ### Notas:

  - Crear el service worker de forma manual:

    - Si queremos hacer una aplicacion de Angular con PWA pero manualmente se tendría que trabajar con los archivos ya generados de produccion, es decir, una vez que se genere la carpeta dist recien ahí se comenzaría a crear un ServiceWorker y manifest y se enlazaría con los archivos generados en la carpeta dist y cada vez que se cambiara el dist se tendría que cambiar el nombre de los archivos en el ServiceWorker ya que el nombre de los archivos cambian (por su hash)

    - Segun esta respuesta de StackOverflow (https://stackoverflow.com/questions/56065065/manual-service-worker-in-angular/56070671#56070671):

      - Crear el archivo sw.js en el root de la aplicación:

        ```js
        var cacheName = "your cache name";

        self.addEventListener("install", (event) => {
          event.waitUntil(
            caches
              .open(cacheName)
              .then((cache) => cache.addAll([]))
              .then(() => self.skipWaiting())
          );
        });

        //Removing outdated caches
        self.addEventListener("activate", function (event) {
          event.waitUntil(
            caches
              .keys()
              .then(function (cacheNames) {
                return Promise.all(
                  cacheNames
                    .filter(function (cacheName) {
                      return true;
                    })
                    .map(function (cacheName) {
                      return caches.delete(cacheName);
                    })
                );
              })
              .then(() => self.clients.claim())
          );
        });

        // Cache any new resources as they are fetched
        self.addEventListener("fetch", function (event) {});
        ```

      - Luego en el "app.component.ts" colocar:

        ```js
        public ngOnInit() {
            if ("serviceWorker" in navigator) {
              navigator.serviceWorker
                .register("./sw.js")
                .then(registration => {
                  // Registration was successful
                  console.log(
                    "ServiceWorker registration successful with scope: ",
                    registration.scope
                  );
                })
                .catch(err => {
                  // registration failed :(
                  console.log("ServiceWorker registration failed: ", err);
                });

            }}
        ```

        - Si hay algún error con lo anterior se podría intentar:

          - Generar el Dist y ahí modificar el index.html agregando el script de activación del sw y debería funcionar utilizando http-server.

  - Usando el "ng add @angular/pwa@16":

    - Al ya tener instalado el "ng add @angular/pwa@16" veremos que se crean y actualizan varios archivos pero aún no funciona el service worker ni el manifest en el navegador y todavía no vemos el archivo del service worker ni el manifest en el proyecto, ya que el archivo "ngsw-config.json" está destinado a funcionar solo cuando se hace el build de producción.

    - Entonces al hacer el build de producción se creará una carpeta llamada "dist" que ya está lista para producción y ahí veremos todos los archivos de nuestro proyecto y también el manifest y el service worker que se crearon de forma automática.

    - **IMPORTANTE:** para probar el service worker hay que deplegar la aplicación de producción (dist) y para eso podríamos usar "http-server" para probarlo en un servidor local de pruebas pero al usar la aplicación en modo offline veremos que sí está el service worker y todo instalado correctamente pero no vemos la información y veremos errores o warnings en la consola del navegador, esto quiere decir que, nuestra aplicación sí está desplegada pero como requiere información del servicio de las API para mostrar gran parte de la información o HTML del proyecto en la pantalla, entonces no se muestra casi nada o nada pero si tuviéramos información que no requiere conexión a internet entonces eso sí lo mostraría. Veremos warnings que no se pudo usar el archivo "animate.css" o el "bootstrap" aunque esté a través de una CDN, o que no se pudo realizar la petición a la API lo que nos da un error 504 (Un error 504 de tiempo de espera entre servidores indica que el servidor web está esperando demasiado tiempo para responder desde otro servidor y está agotando el tiempo de espera), entonces tenemos que configurar nuestro archivo "ngsw-config.json" para que se puedan guardar algunas cosas como el "animate.css", "bootstrap", etc.

      - Algunos errores:

        ```
        -> GET https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css net::ERR_ABORTED 504 (Gateway Timeout)

        -> GET https://restcountries.com/v3.1/lang/spanish 504 (Gateway Timeout)
        ```

        - En el archivo "ngsw-config.json" el colocar ""urls": ["https://cdn.jsdelivr.net/npm/**"]" y el "https://cdn.jsdelivr.net/npm/**" donde esos dos asteríscos nos quiere decir que todo lo que venga de "https://cdn.jsdelivr.net/npm/" lo cual nos sirve para no colocar una versión en específico, aunque también se podría colocar la versión que estamos usando, es decir, colocar de forma completa "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"

        - En el archivo "ngsw-config.json" el colocar ""dataGroups": [{.....}]" es una configuración de llamados a ciertas API donde:

          ```json
            "dataGroups": [
              {
                "name": "country-api", // nombre que le pondremos a nuestra api
                "urls": ["https://restcountries.com/v3.1/**"], // urls de donde se harán las peticiones
                "cacheConfig": {
                  "maxSize": 4, // número máximo de entradas o respuestas que se almacenarán en cache de esta api
                  "maxAge": "72h", // cuánto tiempo esta información se almacenará en cache
                  "timeout": "3s", // cuánto tiempo esperará la respuesta de internet y si pasado ese tiempo no hay respuesta o falla entonces entonces usará el caché
                  "strategy": "performance", // "freshness" -> network first then cache ---- "performance" -> cache first with network fallback
                }
              }
            ]
          ```

          - **IMPORTANTE:** Tener en cuenta que sí funciona el service worker al entrar a la página del listado de todos los países y si se coloca offline entonces como la información de la api del listado de los países ya se descargó y se guardó en cache entonces carga esa información desde el cache, pero si se está offline y si se quiere ingresar a una pais para ver su información no se podrá entrar y te redirigirá a la pantalla de inicio (como se configuró si no encontraba el id) y esto sucede ya que como se está offline y previamente online no se hizo esa solicitud a la api según el id entonces no se hizo el guardado de la información del pais en cache y por ende no hay nada pero si se está online y se entra a un país determinado y luego se coloca como offline entonces solo se tendrá la información de ese país y de los demás no ya que no se hizo el guardado en cache de esa solicitud. Para solucionar eso entonces se podría reestructurar el código para que con la información de la api en una primera isntancia y se guardó en " public countries = signal<CountryResponse[]>([]);" entonces en el método de "handleGetCountryById" hacer un filtrado según el id y evitar hacer una nueva solicitud a la api según el id, y con eso ya se tendría toda la información de todos los países porque previamente ya se guardó en caché. Lo anterior sucderá con las imágenes de las banderas de los países ya que eso es una petición a otra api que se realiza o sino se podrían cargar las banderas desde un inicio para ya poder almacenarlas en cache.

---

# AngularPwa

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.14.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
