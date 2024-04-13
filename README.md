# Vanilla PWA Course - (Progressive Web App)

---

# Temas puntuales de la sección

### ¿Qué veremos en esta sección?

1. Primera parte: **Fundamentos de las PWA - Progressive Web App**

   - ¿Por qué construir una PWA?
   - ¿Cómo funciona?
   - Conceptos básicos de una PWA
   - Reforzamiento: Promesas - Fetch API - HttpServer:

     - Promesas
     - Promesas en cadena
     - Promise.all
     - Promise.race
     - Fetch API
     - Gets
     - Posts
     - Fetch de Blobs
     - http-server

2. Segunda parte: **Service Worker y Fetch Event**

   - Esta sección está enfocada principalmente en el tema del service worker, ¿cómo instalarlo? y ¿qué podemos hacer con él? También veremos a modificar respuestas que es un tema crucial cuando se haga el manejo del cache y respuestas offline. Veremos el poder que tiene el Service Worker sobre toda la aplicación web.

3. Tercera parte: **Ciclo de vida de un service worker y listeners más comunes**

   - Entre los listeners más comunes están:

     - fetch
     - sync
     - install
     - activate
     - push

4. Cuarta parte: **Estrategias de cache y offline mode**

   - Este es quizás el tema más importante para una PWA después del service worker. Es vital saber cómo funcionará nuestra aplicación para poder aplicar una estrategia del manejo del cache eficiente que sirva para brindarle al usuario final la mejor experiencia posible. Veremos cómo trabajar cuando nuestra aplicación no tiene conexión a internet y cómo podemos servir archivos, inclusive si estos nunca se han cargado en el HTML. Trabajaremos con 5 estrategias comunes y luego implementaremos una mezcla para poder resolver a las necesidades particulares de nuestra aplicación.

5. Quinta parte: **Despliegues a dispositivos - Ejercicio Práctico: Twittor**

   - Esta sección está enfocada en probar la aplicación en un dispositivo y verlo funcionando en ese dispositivo. Es recomendable trabajar con android ya que es el sistema operativo que mejor implementa las PWA hasta el momento, pero también veremos unos tips que servirán para mejorar el aspecto visual de nuestra aplicación en IOS. El corazón de esta sección es el archivo manifest.json, quien nos ayuda a indicarle al sistema operativo cómo debe de lucir nuestra aplicación, pero también veremos un par de atributos meta y técnicas para que se vea aún mejor la aplicación web.

6. Sexta parte: **IndexedDB - Base de datos local**

- Esta sección está enfocada a grabar data en una base de datos local que funcione sin conexión a internet. La idea central, es poder realizar grabaciones locales sin conexión a internet para que cuando recuperemos la comunicación con el servidor, se realice una sincronización de los registros almacenados localmente. Para trabajar con esto ocupamos algo llamado indexeddb, el cual es algo complicado y poco amigable, pero aquí lo aprenderemos de igual forma, y también nos enfocaremos en utilizar una alternativa fácil de usar que nos resolverá el mismo problema.

7. Séptima parte: **PouchDB en vez de IndexedDB**

8. Octava parte: **PouchDB - Ejercicio Práctico**

9. Novena parte: **Offline Synchronization (Peticiones Offline)**

10. Décima parte: **Push Notifications**

11. Onceava parte: **Angular PWA**

    - Esta sección usará el paquete de @angular/pwa en donde se creará una aplicación web desde cero consumiendo servicios e implementando diferentes estrategias de caché que nos ofrece el el paquete de @angular/pwa.

### \* RECURSOS A USAR:

- Documentación y/o articulo de almacenamiento para la Web: https://web.dev/articles/storage-for-the-web?hl=es-419

  - Hay que tener presente que la vigencia es relativa, pueda que el usuario tenga programas que hagan limpieza de caché, y esto puede borrar nuestro caché, también que no tenga espacio en disco y otros factores, por lo que debemos de ser eficientes con lo que grabamos en el caché. Cuando se instala como PWA en el dispositivo, también se irá acumulando ahí todo lo que guardemos en caché, por lo que el usuario será capaz de ver cuanto espacio consumido tiene nuestra app, y si es descomunalmente grande, la borrará.

- http-server: https://www.npmjs.com/package/http-server
  - `npm i http-server -g`

### \* NOTAS:

- **¿Qué son las PWA - Progressive Web App?**

  - Primero hay que definir qué NO es una PWA:

    - NO es una extensión del navegador web
    - NO es una framework como React, Vue, Angular, etc
    - NO es un plugin o una librería para los frameworks
    - NO es nada parecido a React Native, Native Script, Ionic, etc

  - Una PWA entonces SI es:

    - Es una aplicación web que también puede ser una página web que progresivamente va implementando características como Push Notifications, un lugar en nuestro Home Screen del celular (pantalla de inicio) que es totalmente indiferenciable de una aplicación nativa.
    - Funciona sin conexión a internet
    - Usa características nativas del dispositivo
    - Se actualiza constantemente
    - Es confiable
    - Pesa muy poco
    - Es muy rápido al momento de cargar

- **Glosario de las PWA - Progressive Web App?**

  - `Service Worker:` es el corazón de una PWA
  - `Manifest:` es un archivo json que nos dirá cómo lucirá nuestra aplicación cuando esté en el Home Screen (pantalla de inicio)
  - `IndexedDB:` nos permite hacer posteos o grabar información en nuestra base de datos aunque el usuario no tenga conexión a internet en ese momento
  - `Push Server:` nos permite mandar push notifications a nuestra PWA

- **Conceptos de las PWA - Progressive Web App?**

  - Las PWA tienen que ser servidas en un protocolo seguro (https), es decir, tiene que tener un certificado porque los Service Workers tienen demasiado poder sobre nuestra página web y cualquier persona podría intercerptar nuestro Service Worker y dañar nuestra página web. La única excepción a la regla es cuando se usa el localhost ya que ahí es http://localhost.....
  - El Service Workers es un archivo de JavaScript plano, no es un código especial, es solo un código JavaScript, entonces cuando nuestra página web hace una solicitud a Internet realmente lo que sucede es que esa petición o esas peticiones son interceptadas por el Service Worker quien dependiendo de las condiciones que les digamos si puede regresar toda la página web sin comunicarse con Internet o bien que necesita ciertos recursos que deben ser cargados desde Internet. De esta manera la red le responde al Service Worker y el Service Workers le responde a nuestro navegador web quién renderiza toda la información. Por eso es que es importante que sea con un protocolo seguro porque el Service Worker puede cambiar absolutamente cualquier cosa en nuestra aplicación.
  - El Service Worker corre en un hilo independiente a la página web, está corriendo en un lugar especial separado de la página web, es decir, se podría cerrar toda la página web y el Service Worker se seguiría ejecutando.

- **Ciclo de vida de los Service Worker**

  - FASE 1: Instalación del Service Worker:

    - Se descarga el archivo de JavaScript
    - El archivo es parseado o revisado
      - Si hay algún error entonces se sale del proceso y hay un error en la consola
    - Entra a la fase de instalación
    - Si todo lo hace correctamente entonces entra a la siguiente fase de Instalado

  - FASE 2: Service Worker instalado:

    - El Service Worker se moverá al siguiente estado inmediatamente si no existe otro Service Worker en ejecución
    - Si ya existe otro Service Worker entonces se esperará a que todos los tabs del navegador sean cerrados para poder entrar al siguiente paso o fase de Activación. (Si todos los tabs fueran de la misma aplicación, se tendría que cerrar todos esos tabs de chrome para que el nuevo Service Worker se active)

  - FASE 3: Activación del Service Worker:

    - Esta fase es justo antes de que el nuevo Service Worker tome el control de la aplicación, es decir, se podrían hacer limpiezas, etc, este evento es disparado

  - FASE 4: Service Worker activo:

    - Cuando el Service Worker ya está activo entonces toma el control de toda la aplicación o el alcance que nosotros le digamos, normalmente tomaría el poder de toda la aplicación.

  - FASE 5: Estado ocioso del Service Worker:

    - Esta fase es cuando el Service Worker falla en la instalación o es reemplazado por versiones nuevas.
    - El Service Worker ya no tiene control de la aplicación y está esperando que sea destruído para dar el pase a un nuevo Service Worker.
