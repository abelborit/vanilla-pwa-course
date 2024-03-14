/* este mensaje solo aparecerá la primera vez y al recargar la página ya no aparecerá, incluso eliminando o vaciando la caché, y todo esto es porque ya se instaló el service worker y cuando el navegador lee los archivos de este proyecto y ve que se está llamando a un service worker pero ya tiene uno instalado, entonces los compara y al ver que es el mismo entonces ya no ejecuta el código porque ya tiene el mismo service worker instalado. Cada que se haga cambios entonces los comparará y verá la versión más reciente del service worker y se quedará con esa versión más reciente */
console.log("SW: Funcionando✅");

/* en el service worker no es normal que escribamos directamente código de JavaScript como variables, etc, sino más que todo el service worker tendrá acciones que realizarán algo según eventos sucesos de la página o de la aplicación */
/* para hacer referencia a este service worker se usa la palabra "self" (que sería como colocar "let self = this" donde "this" hace referencia a este contexto o lugar del service worker pero se coloca solo como "self" de forma directa) y luego se añadirá un event listener al evento fetch (fetch es para hacer peticiones) y luego se le pasará una función flecha (se le puede poner event o cualquier otro nombre que tenga relación a lo que se realiza, en este caso se estará usando event porque son eventos de la página o aplicación) */
self.addEventListener("fetch", (event) => {
  /* aquí veremos varios datos y en uno veremos la propiedad request que es una petición GET hacia algunas url como para el style.css ("http://localhost:5501/css/style.css"), para el main.jpg ("http://localhost:5501/img/main.jpg"), para el app.js ("http://localhost:5501/js/app.js"), para el bootstrap, etc... y podemos ver en la pestaña de Network de las Herramientas del desarrollador que esas son las mismas peticiones que está haciendo el navegador cuando carga nuestra aplicación (01-imagen) */
  /* NOTA: veremos en una de las propiedades de la request del event que hay una propiedad mode:"cors" o mode:"no-cors" como por ejemplo en bootstrap y las demás peticiones respectivamente, ya que bootstrap sí permite llamar o consumir sus recursos desde otro dominio que en este caso sería esta aplicación y las demás peticiones tendrán "no-cors" ya que está todo en el localhost */
  // console.log(event);
  /* FETCH EVENT - FORMAS VÁLIDAS PARA HACER PETICIONES DESDE EL EVENT FETCH - BLOQUEAR UNA PETICIÓN */
  // if (event.request.url.includes("style.css")) {
  //   /* se responderá como null, que en este caso simulará como que no pudo realizar la petición. Al bloquear esta petición regresando un null, veremos que los estilos de la página ya no están y ahora tendrá el estilo por defecto de bootstrap y si vamos a la pestaña de Network veremos que el archivo style.css está dando un error (el archivo sí existe porque no se borró pero es el service worker quien está bloqueando la petición a ese archivo) pero veremos que los demás archivos sí pasaron la petición (03-imagen) */
  //   event.respondWith(null);
  //   /* formas válidas para hacer peticiones desde el event fetch */
  //   // event.request(fetch("css/style.css")) // hacer el fetch tomando el path relativo del archivo en mi servidor
  //   // event.request(fetch(event.request.url)) // hacer el fetch tomando la url completa
  //   // event.request(fetch(event.request)) // hacer el fetch tomando toda la request
  // } else {
  //   /* para retornar algo se usa el .respondWith() (más información en https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent/respondWith) que en este caso se hará que el event retorne una nueva respuesta lo cual será lo que venga al hacer la petición fetch del event.request. Esto quiere decir que las peticiones que se hacían antes para traer desde internet (en este caso de forma local) se traerá desde el service worker y veremos también más archivos del service worker (los archivos que tienen como un engranaje al costado) que son las peticiones que salieron del service worker, es decir, el service worker hizo la petición fetch a esa dirección por ejemplo, fetch a la dirección del bootstrap.min.css, style.css, etc... (02-imagen). Nosotros también podemos bloquear peticiones, por ejemplo vamos a bloquear la petición del style.css respondiendo un null como la condición de arriba que está evaluando si en el event en su propiedad request donde en su propiedad url si incluye el string "style.css" responderá un null y si no incluye style.css entonces dejará pasar la petición y que todo fluya normalmente */
  //   event.respondWith(fetch(event.request));
  // }
  /* ************************************************************************************************************************ */
  /* MODIFICANDO LA RESPUESTA DE LA PETICIÓN FETCH */
  // if (event.request.url.includes("style.css")) {
  //   /* aquí se modificará la respuesta para regresar un nuevo estilo, es decir, se va a sobreescribir lo que tenía style.css por algo nuevo usando new Response() (más información https://developer.mozilla.org/es/docs/Web/API/Response) la cual va a representar la respuesta a una petición */
  //   /* esta response creada es la que va a sobreescribir al style.css que se tenía, también se le está colocando cabeceras para que sea reconocida como un archivo .css ya que si no se coloca eso entonces sería un simple texto plano */
  //   let response = new Response(
  //     `
  //     body {
  //       background-color: red !important;
  //     }
  //   `,
  //     {
  //       headers: {
  //         "Content-Type": "text/css",
  //       },
  //     }
  //   );
  //   event.respondWith(response);
  // }
  /* ************************************************************************************************************************ */
  /* EJERCICIO DE INTERCEPTAR LA IMAGEN Y CAMBIARLA POR OTRA (solo se está modificando la petición, aún NO se está guardando en caché la imagen) */
  // if (event.request.url.includes("main.jpg")) {
  //   /* aquí nos daremos cuenta que en una primera instancia aparecerá el archivo main.jpg y main-patas-arriba.jpg desde el service worker pero al recargar la página o salir y volver a entrar a la aplicación y aunque se haya cambiado la imagen y su contenido como tal, igual para el navegador se seguirá llamando main.jpg y no main-patas-arriba.jpg, es decir, solo aparecerá main.jpg pero con este nuevo contenido llamado desde el service worker (04-imagen) (05-imagen) */
  //   const newImageResponse = fetch("/img/main-patas-arriba.jpg");
  //   event.respondWith(newImageResponse);
  // }
  /* ************************************************************************************************************************ */
  /* MANEJO DE ERRORES EN EL FETCH EVENT */
  /* para simular un error se podría ir al html y en "<img src="img/main.jpg" alt="Vías del tren" class="img-fluid" />" se podría colocar "<img src="img/main-2222.jpg" alt="Vías del tren" class="img-fluid" />" y nos dará un error porque no existe la imagen */
  /* al ser un error se pensaría que se podría colocar un catch() pero al ir a la consola nos daremos cuenta que sigue imprimiendo el error de siempre de "GET http://localhost:5501/img/main-2222.jpg 404 (Not Found)" y ahí nos dice que es un 404 y hay que recordar que los 404 o los 400 no son tratados directamente por el catch() */
  // event.respondWith(fetch(event.request)).catch((error) => {
  //   // console.log(error);
  //   console.log("Error en:", event.request.url);
  // });
  /* entonces para resolver lo anterior se seguirá tratando la promesa con el .then() pero hay que recordar que el event.respondWith() necesita un retorno que sea una promesa que regresa una response de un fetch ya que si NO se coloca eso entonces nos dará algo similar a la 06-imagen y para resolver eso entonces tenemos que retornar una response de una petición fetch, es decir, se podría colocar "return response", y al recargar la página nos daremos cuenta que todo sigue igual pero recordar que hasta que no se limpie la caché o se salga de la aplicación y se vuelva a entrar entonces seguirá el mismo service worker anterior ya que el nuevo se encuentra como que en lista de espera. Entonces con eso seguiremos viendo el mismo error de "GET http://localhost:5501/img/main-2222.jpg 404 (Not Found)" pero al menos ya se puede ingresar correctamente y ahora ya estamos manejando la response de nuestra request y se hace lo que se haría habitualmente de if(response.ok){.........} para manejar los errores 404 o los 400 y luego redirigirlos al catch() */
  /* con esto podemos manejar los errores y podemos responder otra cosa en caso no se haya encontrado algún archivo o si hay algún error en la petición, etc como en la imagen 07-imagen que no encontró el recurso de main-2222.jpg pero que cargó el main.jpg y al recargar la página veremos que el nuevo contenido del main-2222.jpg será el main.jpg aunque ya no aparezca su nombre */
  // event.respondWith(
  //   fetch(event.request).then((response) => {
  //     // console.log(response);
  //     if (response.ok) {
  //       return response;
  //     } else {
  //       return fetch("img/main.jpg");
  //     }
  //   })
  // );

  /* para optimizar lo anterior y que sea un poco más legible se podría crear una constante aparte y separar la lógica e incluso hacerlo mejor con un operador ternario. Darse cuenta que no genera recursividad del fetch del addEventListener y luego colocar otro fetch aquí dentro ya que lo que estamos haciendo es que es posible interceptar la solicitud http y permite que el SW envíe una respuesta personalizada, es decir, en el newResponseFetch se crea un proxy de la petición original y luego en el event.respondWith() se emite una respuesta personalizada */
  const newResponseFetch = fetch(event.request).then((response) => {
    // console.log(response);
    return response.ok ? response : fetch("img/main.jpg");
  });

  event.respondWith(newResponseFetch);
});
