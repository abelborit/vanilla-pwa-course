/* USANDO EL Promise.all() */

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

/* se ejecutan y se muestran en el orden en que se colocaron */
Promise.all(promisesArray)
  .then((respuestas) => {
    console.log(respuestas);
  })
  .catch(console.log);

// sumarLento(5).then(console.log);
// sumarRapido(10).then(console.log);
