function sumarUno(numero) {
  /* El resolve y reject no paran la ejecución de código, simplemente cambian el estado de la promesa y prosigue el código, de forma normal. Si se quiere que al realizarse el resolve/reject se detenga ahí y no ejecute un posible código siguiente, se puede hacer un return (return resolve/reject(.....) o un return al final) y ahí sí pararia la ejecucíon de código. Dependiendo de las necesidades del código se puede querer que se siga ejecutando código después del cambio de estado o no */
  var promesa = new Promise(function (resolve, reject) {
    console.log({ numero });

    if (numero >= 7) {
      reject("El número es muy alto");
      return;
    }

    setTimeout(function () {
      resolve(numero + 1);
      return;
    }, 800);
  });

  return promesa;
}

/* aquí sumarUno() regresa una promesa entonces por eso se puede colocar los .then anidados uno tras otro, ya que cada sumarUno() regresa una promesa */
sumarUno(5)
  .then(sumarUno) // FORMA 2: .then(newValue => sumarUno(newValue)) ---- FORMA 3: .then(newValue => { return sumarUno(newValue) })
  .then(sumarUno)
  .then(sumarUno)
  .then(sumarUno)
  .then(sumarUno)
  .then((nuevoNumero) => {
    console.log(nuevoNumero);
  })
  .catch((error) => {
    console.log("ERROR EN PROMESA");
    console.log(error);
  });
