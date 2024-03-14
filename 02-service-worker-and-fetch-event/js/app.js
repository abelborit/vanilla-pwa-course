if (navigator.serviceWorker) {
  /* colocar el path de donde se encuentra el archivo de service worker. Se coloca "/" porque usualmente el archivo del service worker debería estar en al raiz de donde se encuentra el proyecto, es decir, al mismo nivel de donde se encuentra el index.html. Usualmente el archivo se llama sw.js o serviceWorker.js */
  /* tendría sentido también que al ser un archivo .js entonces se coloque en al carpeta js pero el service worker controla de por sí a la carpeta en donde está, es por eso que se coloca en la raiz del proyecto */
  /* usando navigator.serviceWorker.register(.....) se crea o actualiza el registro del service worker */
  navigator.serviceWorker.register("/serviceWorker.js");
}
