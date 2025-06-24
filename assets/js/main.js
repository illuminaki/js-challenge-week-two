// ---------------------------
// REQUERIMIENTO 8: Clase para modelar mensajes
// ---------------------------
/**
 * Representa un mensaje en el chat.
 * Cada instancia tiene un autor, el contenido del mensaje y una marca de tiempo.
 */
class ChatMessage {
  /**
   * @param {string} autor - Quién envía el mensaje ("usuario" o "ia").
   * @param {string} contenido - El texto del mensaje.
   */
  constructor(autor, contenido) {
    this.autor = autor;
    this.contenido = contenido;
    this.timestamp = new Date();
  }
}

// ---------------------------
// REQUERIMIENTO 2 y 5: Historial y contador (Closure)
// ---------------------------
// Array que almacena todos los objetos de mensaje (el historial de la conversación).
const historialMensajes = [];

/**
 * REQUERIMIENTO 5: Closure para contar preguntas.
 * Crea una función que mantiene un estado privado (el contador).
 * @returns {function(): number} - Una función que incrementa y devuelve el contador.
 */
function crearContadorPreguntas() {
  let contador = 0; // Variable privada dentro del closure.
  return function() {
    contador++;
    // console.log(`Total de preguntas: ${contador}`); // Descomentar para depuración.
    return contador;
  };
}
// Creamos una instancia del contador.
const contarPregunta = crearContadorPreguntas();

// ---------------------------
// REQUERIMIENTO 3: Renderizado de mensajes en el DOM
// ---------------------------
/**
 * Muestra todos los mensajes del historial en el contenedor del chat.
 * Limpia el contenedor y lo vuelve a llenar con los mensajes actualizados.
 * @param {ChatMessage[]} historial - El array de mensajes a renderizar.
 */
function renderizarHistorial(historial) {
  const contenedor = document.getElementById('chat');
  contenedor.innerHTML = ""; // Limpia el chat para volver a renderizar
  historial.forEach(msg => {
    // 1. Crear el contenedor principal del mensaje
    const divMensaje = document.createElement('div');
    divMensaje.className = `mensaje mensaje-${msg.autor}`;

    // 2. Crear el avatar con el emoji correspondiente
    const spanAvatar = document.createElement('span');
    spanAvatar.className = 'avatar';
    spanAvatar.textContent = msg.autor === 'ia' ? '🤖' : '😊';

    // 3. Crear el contenedor para el texto del mensaje
    const divContenido = document.createElement('div');
    divContenido.className = 'contenido';
    // Usamos solo el contenido, sin el formato de autor y fecha
    divContenido.textContent = msg.contenido;

    // 4. Ensamblar el mensaje: avatar + contenido
    divMensaje.appendChild(spanAvatar);
    divMensaje.appendChild(divContenido);
    
    // 5. Añadir el mensaje completo al contenedor del chat
    contenedor.appendChild(divMensaje);
  });
  // Scroll automático al final del chat
  contenedor.scrollTop = contenedor.scrollHeight;
}

// ---------------------------
// REQUERIMIENTO 9: Promesa para simular carga asíncrona
// ---------------------------
/**
 * Simula la carga de mensajes antiguos desde un servidor.
 * Devuelve una promesa que se resuelve después de un tiempo con mensajes de ejemplo.
 * @returns {Promise<ChatMessage[]>}
 */
function cargarMensajesAntiguos() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        new ChatMessage("usuario", "Este es un mensaje antiguo."),
        new ChatMessage("ia", "Y esta es una respuesta antigua.")
      ]);
    }, 1200);
  });
}

// ---------------------------
// REQUERIMIENTO 11: Simulación de "escribiendo..." (setTimeout)
// ---------------------------
/**
 * Muestra un indicador de "escribiendo..." para mejorar la experiencia de usuario.
 * @param {function} callback - Función a ejecutar después de que la simulación termine.
 */
function simularTypingIA(callback) {
  const typingDiv = document.getElementById('typing');
  typingDiv.style.display = "block";
  setTimeout(() => {
    typingDiv.style.display = "none";
    callback(); // Ejecuta el callback para continuar el flujo.
  }, 1200);
}

// ---------------------------
// REQUERIMIENTO 12: Manejo de estados de carga y errores
// ---------------------------
/**
 * Muestra un mensaje de estado en la interfaz (ej: "Cargando...", "Error").
 * @param {string} mensaje - El texto a mostrar. Si es vacío, se oculta.
 */
function mostrarEstado(mensaje) {
  const estadoDiv = document.getElementById('estado');
  estadoDiv.textContent = mensaje;
}

// ---------------------------
// Lógica principal y eventos
// ---------------------------
// Se ejecuta cuando el DOM está completamente cargado.
document.addEventListener('DOMContentLoaded', async () => {
  mostrarEstado("Cargando historial...");
  try {
    // Carga los mensajes antiguos y los muestra.
    const antiguos = await cargarMensajesAntiguos();
    antiguos.forEach(msg => historialMensajes.push(msg));
    renderizarHistorial(historialMensajes);
    mostrarEstado(""); // Limpia el estado si todo va bien.
  } catch {
    mostrarEstado("Error al cargar historial");
  }
});

// Referencias a los elementos del DOM.
const formulario = document.getElementById('formulario');
const inputMensaje = document.getElementById('inputMensaje');

// Maneja el envío del formulario de chat.
formulario.addEventListener('submit', async (e) => {
  e.preventDefault(); // Evita que la página se recargue.
  const texto = inputMensaje.value.trim();
  if (!texto) return; // No envía mensajes vacíos.

  // REQUERIMIENTO 4: Hoisting. La función se puede llamar antes de ser declarada.
  saludar();
  function saludar() {
    // Función solo para demostrar hoisting. No tiene impacto funcional.
    // console.log("¡Hola desde hoisting!");
  }

  // 1. Crea el mensaje del usuario y lo muestra.
  const mensajeUsuario = new ChatMessage("usuario", texto);
  historialMensajes.push(mensajeUsuario);
  renderizarHistorial(historialMensajes);
  inputMensaje.value = ""; // Limpia el campo de entrada.

  // 2. Incrementa el contador de preguntas (uso del closure).
  contarPregunta();

  // 3. Muestra que la IA está "pensando".
  mostrarEstado("Esperando respuesta de la IA...");
  simularTypingIA(async () => {
    try {
      // 4. Obtiene la respuesta de la IA (llamada a la API).
      const respuesta = await obtenerRespuestaIA(texto);
      
      // 5. REQUERIMIENTO 6: Callback. `manejarRespuestaIA` se ejecuta con la respuesta.
      manejarRespuestaIA(respuesta);
      mostrarEstado(""); // Limpia el estado.
    } catch {
      mostrarEstado("Error de conexión con la IA");
    }
  });
});

// ---------------------------
// REQUERIMIENTO 6: Callback para procesar la respuesta de la IA
// ---------------------------
/**
 * Se ejecuta cuando se recibe la respuesta de la IA.
 * Crea un nuevo mensaje y lo añade al historial.
 * @param {string} respuesta - El texto de la respuesta de la IA.
 */
function manejarRespuestaIA(respuesta) {
  const mensajeIA = new ChatMessage("ia", respuesta);
  historialMensajes.push(mensajeIA);
  renderizarHistorial(historialMensajes);
}

// ---------------------------
// REQUERIMIENTO 7: Consumo de API con async/await y try/catch
// ---------------------------
/**
 * Llama al backend para obtener una respuesta de la API de OpenAI.
 * @param {string} pregunta - El mensaje del usuario.
 * @returns {Promise<string>} - La respuesta de la IA.
 */
async function obtenerRespuestaIA(pregunta) {
  // La URL del backend que gestiona la API Key de forma segura.
  const API_ENDPOINT = 'http://localhost:3001/api/chat';
  
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ mensaje: pregunta })
    });

    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.status}`);
    }

    const data = await response.json();
    if (data.respuesta) {
      return data.respuesta;
    } else {
      throw new Error(data.error || 'La respuesta de la API no tiene el formato esperado.');
    }
  } catch (error) {
    console.error("Error en obtenerRespuestaIA:", error);
    throw error; // Propaga el error para que sea capturado por el bloque try/catch principal.
  }
}

