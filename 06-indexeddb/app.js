/* crear el espacio para la base de datos local en el navegador */
// let request = window.indexedDB.open(nombre de la base de datos, versión de la base de datos)
let request = window.indexedDB.open("my-database", 1);

/* cuando modificamos cualquier cosa o incluso si actualizamos la base de datos local tenemos que manejar todos los request o listeners de forma manual, es decir, podríamos subir la versión de la base de datos local y refrescar el navegador o sino eliminar la base de datos local y luego refrescar el navegador para que tome los nuevos cambios con la misma versión */
request.onupgradeneeded = (event) => {
  console.log("Actualización de la base de datos local✅");
  // console.log(event);

  /* ya dentro de este evento vamos a poder tener la referencia a la base de datos local */
  let dataBase = event.target.result;

  /* nuestra base de datos va a necesitar una llave o key la cual será necesaria para cualquier posteo o registro que hagamos en nuestra base de datos local. Con .createObjectStore() es el espacio donde vamos a almacenar la información que queremos */
  // dataBase.createObjectStore(nombre del espacio, opciones o parámetros)
  dataBase.createObjectStore("heroes", {
    keyPath: "id",
  });
};

/* manejo de errores */
request.onerror = (event) => {
  console.log("Error en el indexDB❌");
  console.log(event);

  let dataBase = event.target.error;
  console.log(dataBase);
};

/* insertar un registro */
request.onsuccess = (event) => {
  // console.log(event);

  let dataBase = event.target.result;

  /* crear un arreglo de la información que queremos postear en nuestra base de datos local */
  let heroesData = [
    { id: "1111", heroe: "Spiderman", mensaje: "Aquí su amigo Spiderman" },
    { id: "2222", heroe: "Ironman", mensaje: "Aquí en mi nuevo Mark 50" },
  ];

  /* para grabar la información tenemos que crear una transacción */
  // let heroesTransaction = dataBase.transaction(lugar donde queremos guardar la información, tipo de transacción como lectura o lectura y escritura);
  let heroesTransaction = dataBase.transaction("heroes", "readwrite");

  /* la transacción podría fallar entonces hay que manejar el error */
  heroesTransaction.onerror = (event) => {
    // console.log(event);
    console.log("Error al guardar registro❌:", event.target.error);
  };

  /* informa si la transacción se hace de forma exitosa */
  heroesTransaction.oncomplete = (event) => {
    // console.log(event);
    console.log("Transacción completada✅:", event);
  };

  /* ya tenemos la transacción y ahora necesitamos un objeto de esa transacción donde aquí ya será el lugar donde vamos a almacenar */
  let heroesStore = heroesTransaction.objectStore("heroes");

  /* ahora vamos a barrer el arreglo para insertar cada registro */
  for (let heroe of heroesData) {
    heroesStore.add(heroe);
  }

  /* si la inserción anterior se hace correctamente */
  heroesStore.onsuccess = (event) => {
    // console.log(event);
    console.log("Nuevo item agregado a la base de datos✅");
  };
};
