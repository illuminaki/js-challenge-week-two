# Lección 1: Servidores, APIs, Node.js y JSON Server

## 1. Servidores

### Concepto de Servidor
Un servidor es un sistema informático que proporciona servicios, recursos o funcionalidades a otros dispositivos llamados clientes. En el contexto web, un servidor responde a peticiones HTTP enviadas por navegadores web u otras aplicaciones cliente.

### Tipos de Servidores Web

#### Servidores Estáticos
- **Definición**: Entregan archivos tal como están almacenados sin procesamiento adicional.
- **Características**:
  - Rápidos y eficientes para contenido que no cambia.
  - Sirven archivos HTML, CSS, JavaScript, imágenes, etc.
  - No procesan lógica de negocio ni interactúan con bases de datos.
  - Ejemplos: Nginx, Apache cuando sirve archivos estáticos.

#### Servidores Dinámicos
- **Definición**: Generan contenido en tiempo real basado en la petición recibida.
- **Características**:
  - Procesan lógica de negocio antes de responder.
  - Interactúan con bases de datos y otros servicios.
  - Pueden personalizar respuestas según el usuario o contexto.
  - Ejemplos: Node.js, Django, Ruby on Rails, PHP.

### Ciclo de Vida de una Petición-Respuesta
1. El cliente envía una petición HTTP al servidor.
2. El servidor recibe y procesa la petición.
3. El servidor genera una respuesta (puede incluir consultas a bases de datos, procesamiento, etc.).
4. El servidor envía la respuesta HTTP al cliente.
5. El cliente recibe y procesa la respuesta.

## 2. APIs (Application Programming Interfaces)

### Definición y Propósito
Una API es un conjunto de reglas y protocolos que permite a diferentes aplicaciones comunicarse entre sí. Actúa como intermediario que define cómo los componentes de software deben interactuar.

### Tipos de APIs

#### APIs Web (REST, GraphQL, SOAP)
- **REST (Representational State Transfer)**:
  - Utiliza métodos HTTP estándar (GET, POST, PUT, DELETE).
  - Recursos identificados por URLs.
  - Sin estado (cada petición contiene toda la información necesaria).
  - Respuestas generalmente en formato JSON o XML.

- **GraphQL**:
  - Lenguaje de consulta que permite a los clientes solicitar exactamente los datos que necesitan.
  - Una sola endpoint para todas las operaciones.
  - Reduce el problema de sobre-fetching y bajo-fetching de datos.

- **SOAP (Simple Object Access Protocol)**:
  - Protocolo más rígido y estructurado.
  - Utiliza XML exclusivamente.
  - Incluye especificaciones para seguridad y transacciones.

#### APIs de Biblioteca/Framework
Interfaces de programación incluidas en bibliotecas o frameworks que facilitan tareas específicas.

### Formato de Datos en APIs
- **JSON (JavaScript Object Notation)**:
  - Ligero, fácil de leer y escribir para humanos.
  - Fácil de parsear y generar para máquinas.
  - Formato nativo para JavaScript.

- **XML (eXtensible Markup Language)**:
  - Más verboso pero muy estructurado.
  - Soporta espacios de nombres y esquemas de validación.

## 3. Node.js

### ¿Qué es Node.js?
Node.js es un entorno de ejecución para JavaScript construido sobre el motor V8 de Chrome que permite ejecutar código JavaScript en el servidor.

### Características Principales

#### Event-Driven (Basado en Eventos)
- Utiliza un modelo de programación basado en eventos.
- Los callbacks se ejecutan en respuesta a eventos.
- Ideal para aplicaciones en tiempo real y operaciones de entrada/salida.

#### Non-Blocking I/O (E/S No Bloqueante)
- Las operaciones de E/S no bloquean el hilo principal.
- Permite manejar múltiples conexiones simultáneamente sin crear nuevos hilos.
- Mejora significativamente la eficiencia en aplicaciones con muchas operaciones de E/S.

### Instalación de Node.js
```bash
# En Ubuntu/Debian
sudo apt update
sudo apt install nodejs npm

# En macOS con Homebrew
brew install node

# En Windows
# Descargar el instalador desde nodejs.org
```

### Uso Básico de Node.js

#### Crear un Servidor HTTP Básico
```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('¡Hola Mundo desde Node.js!');
});

server.listen(3000, 'localhost', () => {
  console.log('Servidor ejecutándose en http://localhost:3000/');
});
```

#### Sistema de Módulos
```javascript
// math.js - Módulo exportado
exports.suma = (a, b) => a + b;
exports.resta = (a, b) => a - b;

// app.js - Importación del módulo
const math = require('./math');
console.log(math.suma(5, 3)); // 8
```

### NPM (Node Package Manager)
- Gestor de paquetes oficial de Node.js.
- Permite instalar, compartir y reutilizar código.
- Gestiona dependencias de proyectos.

```bash
# Inicializar un proyecto
npm init

# Instalar un paquete
npm install express

# Instalar como dependencia de desarrollo
npm install --save-dev nodemon
```

## 4. JSON Server

### ¿Qué es JSON Server?
JSON Server es una herramienta que permite crear rápidamente una API REST falsa completa a partir de un archivo JSON, sin necesidad de escribir código de backend.

### Ventajas
- Prototipado rápido de APIs.
- No requiere configuración de base de datos.
- Soporta todas las operaciones CRUD.
- Ideal para desarrollo frontend cuando el backend aún no está listo.

### Instalación y Configuración

```bash
# Instalación global
npm install -g json-server

# Instalación local en un proyecto
npm install --save-dev json-server
```

### Creación de una API REST con JSON Server

#### 1. Crear un archivo db.json
```json
{
  "mensajes": [
    { "id": 1, "autor": "usuario", "contenido": "Hola, ¿cómo estás?", "timestamp": "2023-06-15T14:22:00Z" },
    { "id": 2, "autor": "ia", "contenido": "¡Hola! Estoy bien, ¿en qué puedo ayudarte?", "timestamp": "2023-06-15T14:22:05Z" }
  ],
  "usuarios": [
    { "id": 1, "nombre": "Juan", "email": "juan@ejemplo.com" }
  ]
}
```

#### 2. Iniciar el servidor
```bash
json-server --watch db.json --port 3000
```

#### 3. Endpoints disponibles automáticamente
- GET /mensajes - Obtener todos los mensajes
- GET /mensajes/1 - Obtener un mensaje específico
- POST /mensajes - Crear un nuevo mensaje
- PUT /mensajes/1 - Actualizar un mensaje existente
- DELETE /mensajes/1 - Eliminar un mensaje

### Personalización de JSON Server

#### Rutas personalizadas
Crear un archivo `routes.json`:
```json
{
  "/api/v1/*": "/$1",
  "/mensajes/recientes": "/mensajes?_sort=timestamp&_order=desc&_limit=5"
}
```

Iniciar con rutas personalizadas:
```bash
json-server --watch db.json --routes routes.json
```

#### Middlewares
Crear un archivo `server.js` para personalizar el comportamiento:
```javascript
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Middleware personalizado
server.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.timestamp = new Date().toISOString();
  }
  next();
});

server.use(middlewares);
server.use(router);
server.listen(3000, () => {
  console.log('JSON Server está ejecutándose');
});
```

## 5. Persistencia de Mensajes

### Concepto de Persistencia
La persistencia de datos se refiere a la capacidad de almacenar y recuperar información incluso después de que la aplicación se cierre o reinicie.

### Opciones de Persistencia para Mensajes

#### 1. Almacenamiento Local (Cliente)
- **localStorage**: Almacenamiento persistente en el navegador.
  ```javascript
  // Guardar mensajes
  localStorage.setItem('chatMensajes', JSON.stringify(historialMensajes));
  
  // Recuperar mensajes
  const mensajesGuardados = JSON.parse(localStorage.getItem('chatMensajes')) || [];
  ```

- **IndexedDB**: Base de datos en el navegador para almacenar grandes cantidades de datos estructurados.

#### 2. Almacenamiento en Servidor
- **JSON Server**: Como se explicó anteriormente, ideal para prototipos.

- **Base de datos real**:
  - MongoDB (NoSQL): Ideal para datos tipo documento como mensajes de chat.
  - PostgreSQL/MySQL: Para aplicaciones que requieren relaciones complejas.

### Implementación de Persistencia con JSON Server

#### Guardar mensajes
```javascript
async function guardarMensaje(mensaje) {
  try {
    const response = await fetch('http://localhost:3000/mensajes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(mensaje)
    });
    return await response.json();
  } catch (error) {
    console.error('Error al guardar mensaje:', error);
    throw error;
  }
}
```

#### Cargar mensajes
```javascript
async function cargarMensajes() {
  try {
    const response = await fetch('http://localhost:3000/mensajes');
    return await response.json();
  } catch (error) {
    console.error('Error al cargar mensajes:', error);
    throw error;
  }
}
```

## Conclusión

En esta lección hemos explorado los fundamentos de los servidores web, las APIs y cómo Node.js proporciona un entorno para crear aplicaciones de servidor utilizando JavaScript. También hemos visto cómo JSON Server facilita la creación rápida de APIs REST para prototipos y desarrollo, así como diferentes opciones para implementar la persistencia de mensajes en una aplicación de chat.

Estos conocimientos son fundamentales para desarrollar aplicaciones web modernas que requieren comunicación cliente-servidor eficiente y manejo adecuado de datos.
