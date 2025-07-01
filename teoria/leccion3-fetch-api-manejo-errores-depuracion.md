# Lección 3: Fetch API, Manejo de errores y Depuración en JavaScript

## 1. Fetch API

### Introducción a Fetch API

La Fetch API es una interfaz moderna para realizar peticiones HTTP en JavaScript, diseñada para reemplazar XMLHttpRequest (XHR). Proporciona una forma más potente y flexible de obtener recursos de la red, basada en Promesas.

### Sintaxis Básica

```javascript
fetch(url)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

### Características Principales

1. **Basada en Promesas**
   - Facilita el manejo de operaciones asíncronas.
   - Compatible con async/await para código más limpio.

2. **API más Limpia**
   - Interfaz más intuitiva comparada con XMLHttpRequest.
   - Separación clara entre la respuesta y los datos.

3. **Manejo de Diferentes Tipos de Respuesta**
   - `response.json()` - Para respuestas JSON
   - `response.text()` - Para respuestas de texto plano
   - `response.blob()` - Para datos binarios (imágenes, archivos)
   - `response.formData()` - Para datos de formulario
   - `response.arrayBuffer()` - Para datos binarios en formato ArrayBuffer

### Opciones de Configuración

```javascript
fetch(url, {
  method: 'POST', // *GET, POST, PUT, DELETE, etc.
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token123'
  },
  body: JSON.stringify({
    nombre: 'Usuario',
    mensaje: 'Hola mundo'
  }),
  mode: 'cors', // no-cors, *cors, same-origin
  credentials: 'same-origin', // include, *same-origin, omit
  cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
  redirect: 'follow', // manual, *follow, error
  referrerPolicy: 'no-referrer', // no-referrer, *client
})
.then(response => response.json())
.then(data => console.log(data));
```

### Fetch con async/await

```javascript
async function obtenerDatos() {
  try {
    const response = await fetch('https://api.ejemplo.com/datos');
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener datos:', error);
    throw error; // Propagar el error para manejo adicional
  }
}

// Uso
async function mostrarDatos() {
  try {
    const datos = await obtenerDatos();
    console.log('Datos obtenidos:', datos);
  } catch (error) {
    console.error('No se pudieron mostrar los datos:', error);
  }
}

mostrarDatos();
```

### Características Avanzadas

#### Abortar Peticiones

```javascript
// Crear un controlador de aborto
const controller = new AbortController();
const signal = controller.signal;

// Hacer la petición con la señal
fetch('https://api.ejemplo.com/datos-grandes', { signal })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => {
    if (error.name === 'AbortError') {
      console.log('Petición cancelada');
    } else {
      console.error('Error:', error);
    }
  });

// Cancelar la petición después de 5 segundos
setTimeout(() => controller.abort(), 5000);
```

#### Peticiones en Paralelo

```javascript
async function obtenerMultiplesDatos() {
  try {
    const [usuariosResponse, productosResponse] = await Promise.all([
      fetch('https://api.ejemplo.com/usuarios'),
      fetch('https://api.ejemplo.com/productos')
    ]);
    
    const usuarios = await usuariosResponse.json();
    const productos = await productosResponse.json();
    
    return { usuarios, productos };
  } catch (error) {
    console.error('Error al obtener datos múltiples:', error);
    throw error;
  }
}
```

## 2. Manejo de Errores en JavaScript

### Tipos de Errores

1. **Errores de Sintaxis**
   - Ocurren cuando el código no sigue las reglas del lenguaje.
   - Detectados durante la compilación/interpretación.
   - Ejemplo: `console.log('Hola mundo";` (comilla no cerrada correctamente)

2. **Errores de Tiempo de Ejecución**
   - Ocurren durante la ejecución del programa.
   - Ejemplos: ReferenceError, TypeError, RangeError.
   - `const resultado = 10 / 0;` (Infinity, no es error en JS)
   - `const valor = undefined.propiedad;` (TypeError)

3. **Errores Lógicos**
   - El código se ejecuta sin errores técnicos pero no hace lo esperado.
   - Difíciles de detectar automáticamente.
   - Ejemplo: `if (edad = 18)` (asignación en lugar de comparación)

### Técnicas de Manejo de Errores

#### 1. Try...Catch...Finally

```javascript
try {
  // Código que podría generar un error
  const data = JSON.parse(textoNoJSON);
  console.log(data);
} catch (error) {
  // Manejo del error
  console.error('Error al parsear JSON:', error.message);
} finally {
  // Código que se ejecuta siempre, haya error o no
  console.log('Proceso de parseo finalizado');
}
```

#### 2. Throw

```javascript
function dividir(a, b) {
  if (b === 0) {
    throw new Error('No se puede dividir por cero');
  }
  return a / b;
}

try {
  const resultado = dividir(10, 0);
  console.log(resultado);
} catch (error) {
  console.error('Error en la división:', error.message);
}
```

#### 3. Objetos de Error Personalizados

```javascript
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

function validarUsuario(usuario) {
  if (!usuario.nombre) {
    throw new ValidationError('El nombre es obligatorio', 'nombre');
  }
  if (!usuario.email) {
    throw new ValidationError('El email es obligatorio', 'email');
  }
  // Más validaciones...
}

try {
  validarUsuario({ nombre: '', email: 'correo@ejemplo.com' });
} catch (error) {
  if (error instanceof ValidationError) {
    console.error(`Error de validación en el campo ${error.field}: ${error.message}`);
  } else {
    console.error('Error desconocido:', error);
  }
}
```

#### 4. Manejo de Errores en Promesas

```javascript
// Con .catch()
fetch('https://api.ejemplo.com/datos')
  .then(response => {
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  })
  .then(data => console.log('Datos:', data))
  .catch(error => console.error('Error en la petición:', error));

// Con async/await
async function obtenerDatos() {
  try {
    const response = await fetch('https://api.ejemplo.com/datos');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    console.log('Datos:', data);
  } catch (error) {
    console.error('Error en la petición:', error);
  }
}
```

### Mejores Prácticas para Manejo de Errores

1. **Ser Específico con los Bloques Try-Catch**
   - Envolver solo el código que podría fallar, no bloques grandes.
   - Facilita la identificación del origen del error.

2. **Proporcionar Mensajes de Error Útiles**
   - Incluir detalles relevantes sobre qué falló y por qué.
   - Considerar al usuario final al redactar mensajes.

3. **Registrar Errores**
   - Mantener un registro de errores para análisis posterior.
   - Considerar servicios de monitoreo de errores en producción.

4. **Fallar Rápido y Explícitamente**
   - Validar entradas al inicio de las funciones.
   - Lanzar errores específicos cuando se detecten problemas.

## 3. Depuración en JavaScript

### Herramientas de Depuración

#### Console API

```javascript
// Mensajes básicos
console.log('Mensaje informativo');
console.info('Información');
console.warn('Advertencia');
console.error('Error');

// Agrupación de mensajes
console.group('Grupo de mensajes');
console.log('Mensaje dentro del grupo');
console.log('Otro mensaje dentro del grupo');
console.groupEnd();

// Tablas
console.table([{ nombre: 'Ana', edad: 28 }, { nombre: 'Juan', edad: 32 }]);

// Tiempo de ejecución
console.time('Operación');
// ... código a medir
console.timeEnd('Operación'); // Muestra el tiempo transcurrido

// Contadores
console.count('Evento'); // Incrementa y muestra el contador
console.count('Evento'); // Incrementa y muestra el contador
console.countReset('Evento'); // Reinicia el contador

// Seguimiento de pila
console.trace('Seguimiento de la pila de llamadas');
```

#### Declaración Debugger

```javascript
function funcionProblematica(valor) {
  let resultado = valor * 2;
  debugger; // El navegador se detendrá aquí cuando las herramientas de desarrollador estén abiertas
  return resultado + 5;
}
```

### Depuración con Chrome DevTools

#### Puntos de Interrupción (Breakpoints)

1. **Puntos de Interrupción de Línea**
   - Hacer clic en el número de línea en el panel Sources.
   - El código se detendrá cuando la ejecución llegue a esa línea.

2. **Puntos de Interrupción Condicionales**
   - Hacer clic derecho en el número de línea → Add conditional breakpoint.
   - Especificar una condición (ej: `contador > 5`).

3. **Puntos de Interrupción de Eventos**
   - En el panel Sources → Event Listener Breakpoints.
   - Seleccionar eventos como click, load, etc.

#### Control de Ejecución

- **Continue (F8)**: Continúa la ejecución hasta el siguiente punto de interrupción.
- **Step Over (F10)**: Ejecuta la siguiente línea sin entrar en funciones.
- **Step Into (F11)**: Entra en la función que se está llamando.
- **Step Out (Shift+F11)**: Sale de la función actual.

#### Inspección de Variables

- **Panel Scope**: Muestra las variables locales y globales disponibles en el contexto actual.
- **Panel Watch**: Permite monitorear expresiones específicas durante la depuración.
- **Consola en modo depuración**: Evaluar expresiones en el contexto de ejecución actual.

### Monitoreo de Red

#### Panel Network en DevTools

1. **Visualización de Peticiones**
   - Ver todas las peticiones HTTP realizadas por la página.
   - Filtrar por tipo (XHR, JS, CSS, etc.).

2. **Inspección de Peticiones Individuales**
   - Headers: Ver encabezados de petición y respuesta.
   - Preview: Vista previa formateada de la respuesta.
   - Response: Respuesta sin formato.
   - Timing: Desglose del tiempo de la petición.

3. **Simulación de Condiciones de Red**
   - Throttling: Simular conexiones lentas (3G, etc.).
   - Offline: Probar comportamiento sin conexión.

### Depuración de Código Asíncrono

1. **Async/Await**
   - Facilita la depuración al hacer que el código asíncrono parezca síncrono.
   - Los puntos de interrupción funcionan de manera más intuitiva.

2. **Breakpoints en Promesas**
   - En Chrome DevTools, se pueden establecer breakpoints en promesas rechazadas.
   - Ayuda a identificar errores en cadenas de promesas.

3. **Logging Estratégico**
   - Colocar console.log en puntos clave del flujo asíncrono.
   - Registrar el estado de las variables en diferentes etapas.

## Conclusión

En esta lección hemos explorado la Fetch API como una herramienta moderna para realizar peticiones HTTP en JavaScript, ofreciendo una sintaxis más limpia y potente basada en Promesas. También hemos aprendido técnicas efectivas para el manejo de errores, desde los bloques try-catch básicos hasta la creación de errores personalizados y estrategias para manejar errores en código asíncrono.

Las herramientas de depuración como la Console API, los puntos de interrupción y el panel Network de Chrome DevTools son fundamentales para identificar y resolver problemas en nuestras aplicaciones JavaScript. Dominar estas técnicas nos permite desarrollar aplicaciones más robustas y mantener un código de mayor calidad.

Estos conocimientos son esenciales para cualquier desarrollador JavaScript moderno, especialmente al trabajar con aplicaciones que interactúan con APIs y servicios externos.