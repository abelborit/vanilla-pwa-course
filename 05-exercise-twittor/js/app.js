// validación para que si
let url = window.location.href;
let servideWorkerLocation = "/vanilla-pwa-course/sw.js";

// Registrar nuestro sw.js
if (navigator.serviceWorker) {
  /* cuando se despliegue a GitHub Pages por ejemplo, utilizarlo así "/sw.js" tendrá un problema y nos dirá algo similar a "Uncaught (in promise) TypeError: Failed to register a ServiceWorker for scope ('https://user.github.io/') with script ('https://user.github.io/sw.js'): A bad HTTP response code (404) was received when fetching the script." que lo que quiere decir es que no encuentra el recurso de "sw.js" porque como le estamos colocando "/sw.js" entonces se irá a la raiz de la aplicación que sería "https://user.github.io/" pero sabemos que ahí no se encuentra el service worker entonces sería correcto usar "/sw.js" cuando el service worker se encuentre en la raiz de mi proyecto como en el caso de desarrollo pero al desplegarlo a GitHub Pages, que sería como producción, entonces tenemos que resolver ese problema y para eso haremos una validación según la ruta en la cual nos encontremos */

  /* para desarrollo cambia la ruta de servideWorkerLocation a "/sw.js" */
  if (url.includes("localhost")) {
    servideWorkerLocation = "/sw.js";
  }

  /* para producción toma directamente la ruta de servideWorkerLocation que es  "/vanilla-pwa-course/sw.js" */
  navigator.serviceWorker.register(servideWorkerLocation);
}

// Referencias de jQuery
var titulo = $("#titulo");
var nuevoBtn = $("#nuevo-btn");
var salirBtn = $("#salir-btn");
var cancelarBtn = $("#cancel-btn");
var postBtn = $("#post-btn");
var avatarSel = $("#seleccion");
var timeline = $("#timeline");

var modal = $("#modal");
var modalAvatar = $("#modal-avatar");
var avatarBtns = $(".seleccion-avatar");
var txtMensaje = $("#txtMensaje");

// El usuario, contiene el ID del héroe seleccionado
var usuario;

// ===== Codigo de la aplicación
function crearMensajeHTML(mensaje, personaje) {
  var content = `
    <li class="animated fadeIn fast">
        <div class="avatar">
            <img src="img/avatars/${personaje}.jpg">
        </div>
        <div class="bubble-container">
            <div class="bubble">
                <h3>@${personaje}</h3>
                <br/>
                ${mensaje}
            </div>
            
            <div class="arrow"></div>
        </div>
    </li>
    `;

  timeline.prepend(content);
  cancelarBtn.click();
}

// Globals
function logIn(ingreso) {
  if (ingreso) {
    nuevoBtn.removeClass("oculto");
    salirBtn.removeClass("oculto");
    timeline.removeClass("oculto");
    avatarSel.addClass("oculto");
    modalAvatar.attr("src", "img/avatars/" + usuario + ".jpg");
  } else {
    nuevoBtn.addClass("oculto");
    salirBtn.addClass("oculto");
    timeline.addClass("oculto");
    avatarSel.removeClass("oculto");

    titulo.text("Seleccione Personaje");
  }
}

// Seleccion de personaje
avatarBtns.on("click", function () {
  usuario = $(this).data("user");

  titulo.text("@" + usuario);

  logIn(true);
});

// Boton de salir
salirBtn.on("click", function () {
  logIn(false);
});

// Boton de nuevo mensaje
nuevoBtn.on("click", function () {
  modal.removeClass("oculto");
  modal.animate(
    {
      marginTop: "-=1000px",
      opacity: 1,
    },
    200
  );
});

// Boton de cancelar mensaje
cancelarBtn.on("click", function () {
  modal.animate(
    {
      marginTop: "+=1000px",
      opacity: 0,
    },
    200,
    function () {
      modal.addClass("oculto");
      txtMensaje.val("");
    }
  );
});

// Boton de enviar mensaje
postBtn.on("click", function () {
  var mensaje = txtMensaje.val();
  if (mensaje.length === 0) {
    cancelarBtn.click();
    return;
  }

  crearMensajeHTML(mensaje, usuario);
});
