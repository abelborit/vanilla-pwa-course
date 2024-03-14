/* error manejado por el catch (darse cuenta que la API no exite entonces al ser un problema de la petición como tal, ese error es manejado por el catch) */
// fetch("https://reqres.inasdasdapi/users/1")
//   .then((response) => {
//     response.json();
//   })
//   .then((data) => console.log(data))
//   .catch((error) => {
//     console.log("Error en la petición");
//     console.log(error);
//   });

/* error NO manejado por el catch (darse cuenta que la API si existe pero que los parámetros que se le están pasando no hay registros en la API entonces nos da un 404 y esos 404 no son manejados por el catch) */
// fetch("https://reqres.in/api/users/100000")
//   .then((response) => {
//     response.json();
//   })
//   .then((data) => console.log(data))
//   .catch((error) => {
//     console.log("Error en la petición");
//     console.log(error);
//   });

/* errores manejados por el catch y manejados según la respuesta de la API (darse cuenta que si hay un error porque la API no existe entonces se irá directo al catch y si hay un error de que según el parámetro no es encontrado en la API, es decir, un 404, entonces en el response tendrá un "ok: true" o un "ok: false" indicando si hubo respuesta correcta o incorrecta y se manejará ese 404 como un error manejado por nosotros con el throw new Error() el cual después será enviado al catch) */
fetch("https://reqres.in/api/users/100000")
  .then((response) => {
    console.log(response);

    if (response.ok) {
      return response.json();
    } else {
      // console.log('No existe el usuario 100000');
      throw new Error("No existe el usuario 100000");
    }
  })
  .then(console.log)
  .catch((error) => {
    console.log("Error en la petición");
    console.log(error);
  });
