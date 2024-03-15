# Introducción al Cache Storage

---

- ### NOTAS:

  - Para más información: https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage

  - Sobre el rendimiento del almacenamiento en Cache Storage:

    - ¿Almacenar en caché almacena el archivo mismo en el window de la página haciendo una nueva copia de este? ¿o lo que graba es una referencia al archivo previamente descargado y almacenado al entrar por primera vez al sitio? Sí, se graba una copia del archivo en la computadora y esto ayuda a que cuando estemos sin conexión, podamos mostrar la página web o lo que queramos sin conexión.

    - ¿Afectaría el rendimiento futuro si almaceno, por ejemplo, muchos elementos en el caché? ¿o si estos son muy pesados, por ejemplo, imágenes de 1mb? Imagenes de 1MB no deberían de ser problema, aunque realmente depende de la computadora que corra la aplicación web, pero hay que ser lo más eficiente posible, hay que recordar que no todos tenemos espacio ilimitado y también hay una recomendación de 50 megas en la PWA.

  - En el caso que se tengan que cargar varias imágenes (10 o 20 o 100 o más) en el navegador y que el usuario pueda interactuar con normalidad ¿se tendría que realizar ese proceso de cachear las imágenes una por una? Si queremos que las imagenes puedan verse sin conexión, tenemos que cachearlas todas sí o sí. ¿En qué cache lo metemos? dependerá de la aplicación ya que si nunca van a cambiar esas imagenes podemos añadirlas en el cache inmutable, pero si van a cambiar (sea con mucha frecuencia o poca) podriamos añadirlo en el cache dinámico, o si se quisiera crear un cache solo para las imagenes.
