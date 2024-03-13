fetch("https://reqres.in/api/users/1").then((resp) => {
  /* al usar el .clone() crea un clon o copia exacta de la respuesta y con eso rompe la relación que tiene JavaScript con los objetos y sigue trabajando normal haciendo la petición */
  resp
    .clone()
    .json()
    .then((response) => {
      console.log(response.data);
    });

  resp.json().then((response) => {
    console.log(response.data);
  });

  /* al intentar leer esto nos dará un error similar a "Uncaught (in promise) TypeError: Failed to execute 'json' on 'Response': body stream already read" de que ya se leyó el body stream
    at fetch-5.js:13:8 */
  resp.json().then((response) => {
    console.log(response.data);
  });
});
