/* USANDO EL Promise.race() pone a competir todos los parámetros dentro del arreglo que se le envíe y la respuesta será la que responda primero y si ambas responden simultáneamente entonces responderá o se mostrará la que esté primero en orden secuencial, es decir, la que esté más a la izquierda */

function retornaTrue() {
  return true;
}

function sumarLento(numero) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve(numero + 1);
      // reject( 'Sumar Lento falló' );
    }, 800);
  });
}

let sumarRapido = (numero) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(numero + 1);
      // reject( 'Sumar Rápido falló' );
    }, 300);
  });
};

let promisesArray = [
  sumarLento(5),
  sumarRapido(10),
  true,
  "hola mundo",
  retornaTrue(),
];

/* se ejecutan y se muestran en el orden en que se colocaron. Si falla una promesa entonces todo da un error */
Promise.race(promisesArray)
  .then((respuesta) => {
    console.log(respuesta);
  })
  .catch(console.log);

// sumarLento(5).then(console.log);
// sumarRapido(10).then(console.log);
