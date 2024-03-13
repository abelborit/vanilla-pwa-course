/* la forma en como se trabaja originalmente usando el callback hell */
function sumarUno(numero, callback) {
  if (numero >= 7) {
    callback("Número muy alto");
    return;
  }

  setTimeout(function () {
    // return numero + 1;
    callback(null, numero + 1);
  }, 800);
}

/* aquí se está haciendo como un callback hell, es decir, callback tras otro callback tras otro callback */
sumarUno(5, function (error, nuevoValor) {
  if (error) {
    console.log(error);
    return;
  }
  console.log(nuevoValor);

  sumarUno(nuevoValor, function (error, nuevoValor2) {
    if (error) {
      console.log(error);
      return;
    }
    console.log(nuevoValor2);

    sumarUno(nuevoValor2, function (error, nuevoValor3) {
      if (error) {
        console.log(error);
        return;
      }
      console.log(nuevoValor3);
    });
  });
});
