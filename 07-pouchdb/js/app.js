(function () {
  "use strict";

  var ENTER_KEY = 13;
  var newTodoDom = document.getElementById("new-todo");
  var syncDom = document.getElementById("sync-wrapper");

  // EDITING STARTS HERE (you dont need to edit anything above this line)

  /* Creando una base de datos */
  var db = new Pouch("todos");
  var remoteCouch = false;
  var cookie;

  /* Actualizar la interfaz de usuario */
  /* No queremos actualizar la página para ver nuevos elementos. Lo más habitual es que actualices la interfaz de usuario manualmente cuando escribas datos en ella; sin embargo, en PouchDB puedes sincronizar datos de forma remota, por lo que debes asegurarte de actualizar cada vez que cambien los datos remotos. Para ello llamaremos a db.changesaquel que se suscribe a las actualizaciones de la base de datos, vengan de donde vengan. Puede ingresar este código entre la declaración remoteCouchy addTodo. */
  /* Entonces, cada vez que se realiza una actualización en la base de datos, redibujamos la interfaz de usuario para mostrar los nuevos datos. La livebandera significa que esta función continuará ejecutándose indefinidamente. Ahora intenta ingresar una nueva tarea pendiente y debería aparecer inmediatamente. */
  db.info(function (err, info) {
    /* db.changes(....) si la base de datos sufre algún cambio entonces entonces hará el showTodos */
    db.changes({
      since: info.update_seq,
      onChange: showTodos,
      continuous: true,
    });
  });

  // We have to create a new todo document and enter it in the database
  /* Colocar los todos en la base de datos */
  function addTodo(text) {
    if (text.length <= 0) return;

    var todo = {
      /* En PouchDB se requiere que cada documento tenga un archivo _id. Cualquier escritura posterior en un documento con el mismo _idse considerará actualización. Aquí estamos usando una cadena de fecha como archivo _id. Para nuestro caso de uso, será único y también se puede utilizar para ordenar elementos en la base de datos. Puede usarlo db.post()si desea identificaciones aleatorias. Es _idlo único que se requiere al crear un nuevo documento. El resto del objeto lo puedes crear como quieras. */
      _id: new Date().toISOString(),
      title: text,
      completed: false,
    };

    /* para ver los nuevos registros insertados hay que refrescar la tabla de _doc_id_rev */
    /* trabajarlo mediante callbacks */
    db.put(todo, function (err, result) {
      if (!err) {
        console.log("Successfully posted a todo!");
      }
    });

    /* trabajarlo mediante promesas */
    // db.put(todo)
    //   .then(console.log("Successfully promise posted a todo!"))
    //   .catch(console.log("Error"));
  }

  // Show the current list of todos by reading them from the database
  /* Mostrar elementos de la base de datos */
  function showTodos() {
    /* Una vez que haya incluido este código, debería poder actualizar la página para ver todos los que haya ingresado. */

    /* Aquí simplemente leeremos todos los documentos usando db.allDocs. La include_docsopción le dice a PouchDB que nos proporcione los datos dentro de cada documento, y la opción descending le dice a PouchDB cómo ordenar los resultados según su _idcampo, dándonos los más nuevos primero. */
    db.allDocs({ include_docs: true, descending: true }, function (err, doc) {
      /* Hemos incluido una función auxiliar redrawTodosUIque toma una serie de todos para mostrar, por lo que todo lo que necesitamos hacer es leer los todos de la base de datos. */
      console.log(doc);
      redrawTodosUI(doc.rows);
    });
  }

  /* Editar una tarea pendiente */
  /* Cuando el usuario marca una casilla de verificación, checkboxChangedse llamará a la función, por lo que completaremos el código para editar el objeto y llamaremos db.put */
  /* Esto es similar a crear un documento, sin embargo, el documento también debe contener un _revcampo (además de _id), de lo contrario la escritura será rechazada. Esto garantiza que no sobrescriba accidentalmente los cambios realizados en un documento. Puede probar que esto funciona marcando una tarea pendiente y actualizando la página. Debería permanecer controlado. */
  function checkboxChanged(todo, event) {
    console.log(todo);
    console.log(event);

    todo.completed = event.target.checked;
    db.put(todo);
  }

  // User pressed the delete button for a todo, delete it
  /* Eliminar un objeto */
  /* Para eliminar un objeto, puede llamar a db.remove con el objeto. De manera similar a editar un documento, se requieren las propiedades _idy _rev. Puede notar que estamos pasando el objeto completo que leímos previamente de la base de datos. Por supuesto, puede construir el objeto manualmente, como: {_id: todo._id, _rev: todo._rev}, pero pasar el objeto existente suele ser más conveniente y menos propenso a errores. */
  function deleteButtonPressed(todo) {
    db.remove(todo);
  }

  // The input box when editing a todo has blurred, we should save
  // the new title or delete the todo if the title is empty
  /* Resto completo de Todo UI */
  /* todoBlurredSe llama cuando el usuario edita un documento. Aquí eliminaremos el documento si el usuario ingresó un título en blanco y lo actualizaremos en caso contrario. */
  function todoBlurred(todo, event) {
    /* verificar que haya información dentro del campo */
    var trimmedText = event.target.value.trim();

    if (!trimmedText) {
      db.remove(todo);
    } else {
      todo.title = trimmedText;
      db.put(todo);
    }
  }

  // Initialise a sync with the remote server
  function sync() {
    syncDom.setAttribute("data-sync-state", "syncing");
    var remote = new PouchDB(remoteCouch, { headers: { Cookie: cookie } });
    var pushRep = db.replicate.to(remote, {
      continuous: true,
      complete: syncError,
    });
    var pullRep = db.replicate.from(remote, {
      continuous: true,
      complete: syncError,
    });
  }

  // EDITING STARTS HERE (you dont need to edit anything below this line)

  // There was some form or error syncing
  function syncError() {
    syncDom.setAttribute("data-sync-state", "error");
  }

  // User has double clicked a todo, display an input so they can edit the title
  function todoDblClicked(todo) {
    var div = document.getElementById("li_" + todo._id);
    var inputEditTodo = document.getElementById("input_" + todo._id);
    div.className = "editing";
    inputEditTodo.focus();
  }

  // If they press enter while editing an entry, blur it to trigger save
  // (or delete)
  function todoKeyPressed(todo, event) {
    if (event.keyCode === ENTER_KEY) {
      var inputEditTodo = document.getElementById("input_" + todo._id);
      inputEditTodo.blur();
    }
  }

  // Given an object representing a todo, this will create a list item
  // to display it.
  function createTodoListItem(todo) {
    var checkbox = document.createElement("input");
    checkbox.className = "toggle";
    checkbox.type = "checkbox";
    checkbox.addEventListener("change", checkboxChanged.bind(this, todo));

    var label = document.createElement("label");
    label.appendChild(document.createTextNode(todo.title));
    label.addEventListener("dblclick", todoDblClicked.bind(this, todo));

    var deleteLink = document.createElement("button");
    deleteLink.className = "destroy";
    deleteLink.addEventListener("click", deleteButtonPressed.bind(this, todo));

    var divDisplay = document.createElement("div");
    divDisplay.className = "view";
    divDisplay.appendChild(checkbox);
    divDisplay.appendChild(label);
    divDisplay.appendChild(deleteLink);

    var inputEditTodo = document.createElement("input");
    inputEditTodo.id = "input_" + todo._id;
    inputEditTodo.className = "edit";
    inputEditTodo.value = todo.title;
    inputEditTodo.addEventListener("keypress", todoKeyPressed.bind(this, todo));
    inputEditTodo.addEventListener("blur", todoBlurred.bind(this, todo));

    var li = document.createElement("li");
    li.id = "li_" + todo._id;
    li.appendChild(divDisplay);
    li.appendChild(inputEditTodo);

    if (todo.completed) {
      li.className += "complete";
      checkbox.checked = true;
    }

    return li;
  }

  function redrawTodosUI(todos) {
    var ul = document.getElementById("todo-list");
    ul.innerHTML = "";
    todos.forEach(function (todo) {
      ul.appendChild(createTodoListItem(todo.doc));
    });
  }

  function newTodoKeyPressHandler(event) {
    if (event.keyCode === ENTER_KEY) {
      addTodo(newTodoDom.value);
      newTodoDom.value = "";
    }
  }

  function addEventListeners() {
    newTodoDom.addEventListener("keypress", newTodoKeyPressHandler, false);
  }

  addEventListeners();
  showTodos();

  if (remoteCouch) {
    sync();
  }

  // Host that the couch-persona server is running on
  var authHost = "http://127.0.0.1:3000";

  var loggedIn = function (result) {
    console.log("logged in:", result);
    remoteCouch = result.dbUrl;
    cookie = result.authToken.replace("HttpOnly", "");
    sync();
  };

  var loggedOut = function () {
    console.log("logged out!");
  };

  function simpleXhrSentinel(xhr) {
    return function () {
      if (xhr.readyState !== 4) {
        return;
      }
      if (xhr.status == 200) {
        var result = {};
        try {
          result = JSON.parse(xhr.responseText);
        } catch (e) {}
        loggedIn(result);
      } else {
        navigator.id.logout();
        loggedOut();
      }
    };
  }

  function verifyAssertion(assertion) {
    var xhr = new XMLHttpRequest();
    var param = "assert=" + assertion;
    xhr.open("POST", authHost + "/persona/sign-in", true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("Content-length", param.length);
    xhr.setRequestHeader("Connection", "close");
    xhr.send(param);
    xhr.onreadystatechange = simpleXhrSentinel(xhr);
  }

  function signoutUser() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", authHost + "/persona/sign-out", true);
    xhr.send(null);
    xhr.onreadystatechange = simpleXhrSentinel(xhr);
  }

  navigator.id.watch({
    onlogin: verifyAssertion,
    onlogout: signoutUser,
  });

  var signinLink = document.getElementById("signin");
  var signoutLink = document.getElementById("signout");
  signinLink.onclick = function () {
    navigator.id.request();
  };
  signoutLink.onclick = function () {
    navigator.id.logout();
  };
})();
