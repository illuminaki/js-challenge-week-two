# Guía de Aprendizaje y Construcción: Chat JS con OpenAI

Bienvenido a esta guía mejorada. No solo construiremos un chat funcional, sino que también usaremos este proyecto para entender conceptos clave de JavaScript, desde los fundamentos hasta la asincronía. Esta guía está diseñada para que cada paso te ayude a consolidar tu conocimiento.

--- 

## Fase 1: Preparando Nuestro Entorno

Antes de escribir código, necesitamos una base sólida.

**1. Estructura de Archivos:**

Nuestro proyecto se organiza así para separar responsabilidades:

```
/js-challenge-week-two
  ├── assets/
  │   ├── css/style.css      # Estilos para que se vea bien
  │   └── js/main.js         # Toda la lógica del chat en el navegador
  ├── index.html             # La estructura de nuestra página
  ├── server.js              # Nuestro backend que habla con OpenAI
  ├── .env                   # ¡SECRETO! Aquí va nuestra API Key
  ├── .gitignore             # Le dice a Git qué ignorar (como .env)
  ├── package.json           # Define nuestro proyecto y sus dependencias
  └── README.md              # Documentación del proyecto
```

**2. El Backend y la Seguridad de la API Key:**

**¿Por qué un backend?** Para proteger nuestra `OPENAI_API_KEY`. Si la pusiéramos en el `main.js`, cualquiera podría verla y usarla. En su lugar, el frontend (`main.js`) le pide la respuesta al backend (`server.js`), y es el backend el único que conoce la clave y habla con OpenAI.

**Configuración:**

- **Crea un archivo `.env`** en la raíz del proyecto.
- **Añade tu API Key** dentro de ese archivo así:
  ```
  OPENAI_API_KEY=sk-TuClaveSecretaDeOpenAI
  ```
- **Instala las dependencias** del backend (Express, Dotenv, etc.) con el comando:
  ```bash
  npm install
  ```
- **Inicia el servidor** para que esté listo para recibir peticiones:
  ```bash
  node server.js
  ```

--- 

## Fase 2: Aprendiendo con Código

Ahora, vamos a explorar los conceptos de JavaScript aplicados en `assets/js/main.js`.

### Lección 1: Estructuras de Datos - Clases y Objetos

**El Concepto:** Las **Clases** son como "moldes" para crear **Objetos**. Un objeto es una instancia de una clase, con sus propias propiedades y métodos. En nuestro chat, cada mensaje es un objeto, creado a partir del molde `ChatMessage`.

**La Aplicación (`main.js`):**

La clase `ChatMessage` define la estructura de cada mensaje. Cada vez que el usuario o la IA envían un mensaje, creamos un *objeto* nuevo a partir de esta clase.

```javascript
// assets/js/main.js

class ChatMessage {
  constructor(autor, contenido) {
    this.autor = autor; // Quién lo envía: 'usuario' o 'ia'
    this.contenido = contenido; // El texto del mensaje
    this.timestamp = new Date(); // La hora en que se creó
  }
}

// Así creamos un OBJETO (una instancia) de esta clase:
const mensaje = new ChatMessage("usuario", "¡Hola, mundo!");
console.log(mensaje.autor); // "usuario"
```

### Lección 2: El Motor de JS - Hoisting, Closures y Callbacks

**1. Hoisting (Elevación):**

- **El Concepto:** En JavaScript, las declaraciones de funciones (no las expresiones) se "elevan" al inicio de su scope. Esto significa que puedes llamar a una función antes de declararla en el código.
- **La Aplicación (`main.js`):** Dentro del `addEventListener` del formulario, llamamos a `saludar()` antes de su declaración para demostrar este concepto.

  ```javascript
  // assets/js/main.js

  formulario.addEventListener('submit', async (e) => {
    // ...
    saludar(); // La llamamos aquí...

    function saludar() { // ...y la declaramos aquí. ¡Funciona por el hoisting!
      // console.log("¡Hola desde hoisting!");
    }
    // ...
  });
  ```

**2. Closures (Clausuras):**

- **El Concepto:** Un closure ocurre cuando una función "recuerda" las variables que la rodeaban cuando fue creada, incluso si se ejecuta en un scope diferente. Es como una "mochila" de variables que la función lleva consigo.
- **La Aplicación (`main.js`):** `crearContadorPreguntas` es una fábrica de contadores. Devuelve una función que tiene acceso a la variable `contador`, la cual es privada y solo puede ser modificada por la función que la "recuerda".

  ```javascript
  // assets/js/main.js

  function crearContadorPreguntas() {
    let contador = 0; // Esta variable está "encerrada" en el closure.
    return function() {
      contador++;
      return contador;
    };
  }

  const contarPregunta = crearContadorPreguntas(); // contarPregunta es ahora un closure.
  contarPregunta(); // Devuelve 1
  contarPregunta(); // Devuelve 2
  ```

**3. Callbacks (Funciones de Retrollamada):**

- **El Concepto:** Un callback es una función que se pasa como argumento a otra función, para ser ejecutada más tarde. Es la forma clásica de manejar la asincronía.
- **La Aplicación (`main.js`):** `simularTypingIA` acepta un `callback`. Después de esperar 1.2 segundos (usando `setTimeout`), ejecuta la función `callback` que le pasamos.

  ```javascript
  // assets/js/main.js

  function simularTypingIA(callback) {
    const typingDiv = document.getElementById('typing');
    typingDiv.style.display = "block";
    setTimeout(() => {
      typingDiv.style.display = "none";
      callback(); // Aquí se ejecuta la función que pasamos como argumento.
    }, 1200);
  }

  // Así se usa:
  simularTypingIA(() => {
    console.log("La IA ha terminado de escribir.");
  });
  ```

### Lección 3: Asincronía Moderna - Promesas y Async/Await

**1. Promesas:**

- **El Concepto:** Una `Promise` es un objeto que representa el resultado de una operación asíncrona. Puede estar en uno de tres estados: *pendiente*, *resuelta* (éxito) o *rechazada* (error). Son una mejora sobre los callbacks.
- **La Aplicación (`main.js`):** `cargarMensajesAntiguos` devuelve una Promesa que simula una llamada a un servidor. Después de 1.2 segundos, se *resuelve* con un array de mensajes.

  ```javascript
  // assets/js/main.js

  function cargarMensajesAntiguos() {
    return new Promise(resolve => { // Creamos y devolvemos una nueva Promesa.
      setTimeout(() => {
        resolve([ // La Promesa se resuelve con éxito.
          new ChatMessage("usuario", "Mensaje antiguo 1"),
          new ChatMessage("ia", "Mensaje antiguo 2")
        ]);
      }, 1200);
    });
  }
  ```

**2. Async/Await:**

- **El Concepto:** `async/await` es "azúcar sintáctico" sobre las Promesas. Nos permite escribir código asíncrono que parece síncrono, haciéndolo mucho más fácil de leer y entender. La palabra `async` se pone antes de una función para indicar que devolverá una promesa, y `await` se usa dentro de ella para esperar a que otra promesa se resuelva.
- **La Aplicación (`main.js`):** Usamos `async/await` para obtener la respuesta de la IA. El `await` pausa la ejecución de la función hasta que `obtenerRespuestaIA` (que devuelve una promesa) termine, sin bloquear el navegador.

  ```javascript
  // assets/js/main.js

  // El evento del formulario es una función asíncrona.
  formulario.addEventListener('submit', async (e) => {
    // ...
    try {
      // Esperamos (await) a que la promesa de la API se resuelva.
      const respuesta = await obtenerRespuestaIA(texto);
      manejarRespuestaIA(respuesta);
    } catch (error) {
      mostrarEstado("Error de conexión con la IA");
    }
    // ...
  });

  // La función que llama a nuestro backend también es asíncrona.
  async function obtenerRespuestaIA(pregunta) {
    const response = await fetch('http://localhost:3001/api/chat', { /* ... */ });
    const data = await response.json();
    return data.respuesta;
  }
  ```

--- 

## Fase 3: Buenas Prácticas y Entrega

- **Modularidad:** Separa tu código en archivos con responsabilidades únicas (`main.js`, `server.js`, `style.css`).
- **Seguridad:** **NUNCA** subas tu archivo `.env` o claves API a un repositorio. Asegúrate de que `.gitignore` lo esté ignorando.
- **Documentación:** Mantén tu `README.md` actualizado, explicando cómo instalar y ejecutar el proyecto.
- **Control de Versiones:** Usa Git para llevar un historial de tus cambios.

¡Felicidades! Siguiendo esta guía, no solo has construido un proyecto completo, sino que has aplicado y entendido algunos de los conceptos más importantes de JavaScript.

---

## 6. Buenas prácticas y convenciones

- Usa nombres descriptivos y sigue las convenciones del archivo [README-CONVENCIONES.md](./README-CONVENCIONES.md).
- Mantén el código modular y bien comentado.
- Separa la lógica de UI y datos.
- Documenta en el README la división de tareas y decisiones técnicas.
- **No subas el archivo `.env` ni ninguna clave sensible al repositorio.**

---

## 7. Entrega y presentación

- Sube el código al repositorio.
- Asegúrate de cumplir todos los requerimientos y de que el README explique cómo funciona tu solución.
- Si es posible, haz una demo del chat funcionando.
- Incluye instrucciones para correr el backend y configurar variables de entorno.
- Actualiza tu tablero de tareas en el Azure DevOps.                                                                                                             

---

¡Listo! Siguiendo estos pasos tu proyecto cumple con todos los requerimientos técnicos, de seguridad y de buenas prácticas.
