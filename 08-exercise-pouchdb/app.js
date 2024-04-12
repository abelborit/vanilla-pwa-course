// Entrenamiento PouchDB

// 1- Crear la base de datos cuyo nombre será "mensajes"
var db = new PouchDB("mensajes");

// Objeto a grabar en base de datos
let mensaje = {
  _id: new Date().toISOString(),
  user: "spiderman",
  mensaje: "Mi tía hizo unos panqueques muy buenos",
  sincronizado: false,
};

// 2- Insertar en la base de datos
// db.put(mensaje, function (err, result) {
//   if (!err) {
//     console.log("Successfully posted a todo!");
//   }
// });

// 3- Leer todos los mensajes offline que aparezca en la consola
db.allDocs({ include_docs: true, descending: true }, function (err, docs) {
  /* Hemos incluido una función auxiliar redrawTodosUIque toma una serie de todos para mostrar, por lo que todo lo que necesitamos hacer es leer los todos de la base de datos. */
  console.log(docs);
  console.log(docs.rows);
});

// 4- Cambiar el valor 'sincronizado' de todos los objetos en la BD a TRUE
// db.allDocs({ include_docs: true, descending: true }, function (err, docs) {
//   /* Hemos incluido una función auxiliar redrawTodosUIque toma una serie de todos para mostrar, por lo que todo lo que necesitamos hacer es leer los todos de la base de datos. */
//   console.log(docs);

//   docs.rows.forEach((row) => {
//     console.log(row);

//     let doc = row.doc;
//     doc.sincronizado = true; // cambiar el valor

//     /* guardar en la base de datos local el doc actualizado */
//     db.put(doc);
//   });
// });

// 5- Borrar todos los registros, uno por uno, evaluando cuales estan sincronizados deberá de comentar todo el código que actualiza el campo de la sincronización
db.allDocs({ include_docs: true, descending: true }, function (err, docs) {
  /* Hemos incluido una función auxiliar redrawTodosUIque toma una serie de todos para mostrar, por lo que todo lo que necesitamos hacer es leer los todos de la base de datos. */
  console.log(docs);

  docs.rows.forEach((row) => {
    console.log(row);

    let doc = row.doc;

    if (doc.sincronizado) {
      db.remove(doc);
    }
  });
});
