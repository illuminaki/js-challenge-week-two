# Lección 2: APIs Externas, AJAX y CORS

## 1. APIs Externas

### Definición y Tipos
Las APIs externas son interfaces proporcionadas por terceros que permiten a los desarrolladores acceder a funcionalidades o datos específicos sin necesidad de implementarlos desde cero. Estas APIs pueden ser públicas, privadas o de pago.

### Categorías Comunes de APIs Externas

#### APIs de Servicios Web
- **Redes Sociales**: Twitter, Facebook, Instagram
- **Pagos**: Stripe, PayPal, Mercado Pago
- **Mapas y Geolocalización**: Google Maps, Mapbox, OpenStreetMap
- **Clima**: OpenWeatherMap, Weather API
- **Almacenamiento en la Nube**: Dropbox, Google Drive, AWS S3

#### APIs de Inteligencia Artificial
- **Procesamiento de Lenguaje Natural**: OpenAI (GPT), Google Cloud NLP
- **Visión por Computadora**: Google Vision API, Azure Computer Vision
- **Reconocimiento de Voz**: Google Speech-to-Text, Amazon Transcribe

### Autenticación en APIs Externas

#### Métodos Comunes de Autenticación

1. **API Keys**
   - Clave única que identifica al desarrollador/aplicación.
   - Generalmente se envía como parámetro de consulta o en el encabezado.
   ```javascript
   fetch('https://api.ejemplo.com/datos?api_key=TU_API_KEY')
   ```

2. **OAuth 2.0**
   - Protocolo de autorización que permite acceso seguro a recursos del usuario.
   - Flujo común: el usuario autoriza a la aplicación, que recibe un token de acceso.
   ```javascript
   fetch('https://api.ejemplo.com/recursos', {
     headers: {
       'Authorization': 'Bearer TOKEN_DE_ACCESO'
     }
   })
   ```

3. **JWT (JSON Web Tokens)**
   - Tokens firmados que contienen información del usuario y permisos.
   - Autocontenidos y verificables.

### Mejores Prácticas para Consumir APIs Externas

1. **Gestión Segura de Credenciales**
   - Nunca incluir API keys o tokens directamente en el código del frontend.
   - Utilizar variables de entorno o un backend propio como intermediario.

2. **Manejo de Límites de Tasa (Rate Limiting)**
   - Implementar cachés para reducir llamadas repetidas.
   - Respetar los límites de la API y manejar errores 429 (Too Many Requests).

3. **Versionado**
   - Especificar la versión de la API que se está utilizando.
   - Estar atento a cambios y deprecaciones.

4. **Manejo de Errores**
   - Implementar estrategias de reintentos para fallos temporales.
   - Proporcionar feedback útil al usuario cuando hay problemas.

## 2. AJAX (Asynchronous JavaScript and XML)

### Definición e Historia
AJAX es una técnica que permite actualizar partes de una página web sin necesidad de recargarla completamente. Aunque originalmente utilizaba XML, actualmente es más común usar JSON.

### Evolución de AJAX

#### XMLHttpRequest (XHR)
La forma original de implementar AJAX:

```javascript
const xhr = new XMLHttpRequest();
xhr.open('GET', 'https://api.ejemplo.com/datos', true);

xhr.onreadystatechange = function() {
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
      const respuesta = JSON.parse(xhr.responseText);
      console.log(respuesta);
    } else {
      console.error('Error:', xhr.status);
    }
  }
};

xhr.send();
```

#### jQuery AJAX
Simplificación popular de AJAX antes de las APIs modernas:

```javascript
$.ajax({
  url: 'https://api.ejemplo.com/datos',
  method: 'GET',
  dataType: 'json',
  success: function(respuesta) {
    console.log(respuesta);
  },
  error: function(xhr, status, error) {
    console.error('Error:', error);
  }
});
```

#### Fetch API
API moderna para realizar peticiones HTTP (cubierta en detalle en la Lección 3):

```javascript
fetch('https://api.ejemplo.com/datos')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

### Ventajas de AJAX

1. **Mejora de la Experiencia de Usuario**
   - Actualizaciones parciales sin recargar la página.
   - Interfaces más fluidas y responsivas.

2. **Reducción de Tráfico de Red**
   - Solo se transfieren los datos necesarios, no toda la página.

3. **Separación de Datos y Presentación**
   - Facilita la arquitectura cliente-servidor.
   - Permite crear aplicaciones web más modulares.

### Desventajas y Consideraciones

1. **Problemas de SEO**
   - El contenido cargado dinámicamente puede ser invisible para algunos motores de búsqueda.

2. **Manejo del Historial del Navegador**
   - Las aplicaciones AJAX pueden romper la funcionalidad de los botones atrás/adelante.
   - Solución: History API.

3. **Accesibilidad**
   - Actualizaciones dinámicas pueden confundir a lectores de pantalla.
   - Importante usar ARIA y otras prácticas de accesibilidad.

## 3. CORS (Cross-Origin Resource Sharing)

### El Problema del Mismo Origen

Por seguridad, los navegadores implementan la "política del mismo origen" (Same-Origin Policy), que impide que un script cargado desde un origen (dominio, protocolo o puerto) acceda a recursos de otro origen diferente.

### ¿Qué es CORS?

CORS es un mecanismo que permite a los servidores especificar qué orígenes tienen permiso para acceder a sus recursos. Funciona mediante encabezados HTTP adicionales.

### Funcionamiento de CORS

#### Peticiones Simples
Si una petición cumple ciertos criterios (métodos GET, HEAD o POST con ciertos tipos de contenido), el navegador envía la petición con un encabezado `Origin` y verifica el encabezado `Access-Control-Allow-Origin` en la respuesta.

```
// Petición del navegador
GET /api/datos HTTP/1.1
Origin: https://mi-app.com

// Respuesta del servidor
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://mi-app.com
Content-Type: application/json
```

#### Peticiones Preflight
Para peticiones más complejas, el navegador envía primero una petición OPTIONS para verificar si la petición real está permitida.

```
// Petición preflight
OPTIONS /api/datos HTTP/1.1
Origin: https://mi-app.com
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: Content-Type

// Respuesta preflight
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://mi-app.com
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: Content-Type
Access-Control-Max-Age: 86400
```

### Soluciones a Problemas de CORS

#### Desde el Servidor

1. **Configurar encabezados CORS correctamente**

   En Express.js:
   ```javascript
   const express = require('express');
   const cors = require('cors');
   const app = express();
   
   // Permitir todos los orígenes (no recomendado para producción)
   app.use(cors());
   
   // O configuración específica
   app.use(cors({
     origin: 'https://mi-app.com',
     methods: ['GET', 'POST', 'PUT', 'DELETE'],
     allowedHeaders: ['Content-Type', 'Authorization']
   }));
   ```

2. **Configuración en servidores web**

   Apache (.htaccess):
   ```
   Header set Access-Control-Allow-Origin "https://mi-app.com"
   Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE"
   Header set Access-Control-Allow-Headers "Content-Type, Authorization"
   ```

   Nginx:
   ```
   location /api/ {
     if ($request_method = 'OPTIONS') {
       add_header 'Access-Control-Allow-Origin' 'https://mi-app.com';
       add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE';
       add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization';
       add_header 'Access-Control-Max-Age' 86400;
       return 204;
     }
     add_header 'Access-Control-Allow-Origin' 'https://mi-app.com';
   }
   ```

#### Desde el Cliente

1. **Proxy de Desarrollo**
   - Herramientas como webpack-dev-server o create-react-app incluyen proxies para desarrollo.
   ```javascript
   // En package.json de create-react-app
   {
     "proxy": "http://localhost:3001"
   }
   ```

2. **Servidor Proxy Propio**
   - Crear un backend que actúe como intermediario entre el frontend y la API externa.

3. **JSONP** (técnica antigua)
   - Aprovecha que las etiquetas `<script>` no están sujetas a la política del mismo origen.
   - Limitado a peticiones GET y con problemas de seguridad.

### Consideraciones de Seguridad con CORS

1. **No usar `Access-Control-Allow-Origin: *` en APIs que requieren autenticación**
   - Especificar orígenes concretos.
   - Considerar el uso de `Access-Control-Allow-Credentials: true` cuando sea necesario.

2. **Validar cuidadosamente las peticiones**
   - CORS no reemplaza otras medidas de seguridad.
   - Implementar autenticación, autorización y validación de entrada adecuadas.

## 4. Implementación Práctica: Consumo de APIs Externas

### Ejemplo: Consumir la API de OpenWeatherMap

```javascript
// Configuración segura de la API key
const API_KEY = process.env.WEATHER_API_KEY; // En backend o variables de entorno
const ciudad = 'Madrid';

// Función para obtener datos del clima
async function obtenerClima(ciudad) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${API_KEY}&units=metric`;
    const respuesta = await fetch(url);
    
    if (!respuesta.ok) {
      throw new Error(`Error: ${respuesta.status}`);
    }
    
    const datos = await respuesta.json();
    return {
      temperatura: datos.main.temp,
      descripcion: datos.weather[0].description,
      humedad: datos.main.humidity,
      viento: datos.wind.speed
    };
  } catch (error) {
    console.error('Error al obtener el clima:', error);
    throw error;
  }
}

// Uso de la función
obtenerClima('Madrid')
  .then(datos => {
    console.log('Datos del clima:', datos);
    // Actualizar la interfaz con los datos
    document.getElementById('temperatura').textContent = `${datos.temperatura}°C`;
  })
  .catch(error => {
    // Mostrar mensaje de error al usuario
    document.getElementById('error').textContent = 'No se pudo obtener la información del clima';
  });
```

### Ejemplo: Integración con la API de GitHub

```javascript
// Función para buscar repositorios en GitHub
async function buscarRepositorios(termino) {
  try {
    const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(termino)}`;
    const respuesta = await fetch(url, {
      headers: {
        // GitHub permite un número limitado de peticiones sin autenticación
        // Para más peticiones, usar autenticación con token
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    if (!respuesta.ok) {
      throw new Error(`Error: ${respuesta.status}`);
    }
    
    const datos = await respuesta.json();
    return datos.items.map(repo => ({
      nombre: repo.name,
      descripcion: repo.description,
      estrellas: repo.stargazers_count,
      url: repo.html_url,
      lenguaje: repo.language
    }));
  } catch (error) {
    console.error('Error al buscar repositorios:', error);
    throw error;
  }
}

// Implementación en la interfaz de usuario
document.getElementById('buscarForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const termino = document.getElementById('terminoBusqueda').value.trim();
  const resultadosDiv = document.getElementById('resultados');
  
  if (!termino) return;
  
  try {
    resultadosDiv.innerHTML = '<p>Buscando repositorios...</p>';
    const repositorios = await buscarRepositorios(termino);
    
    if (repositorios.length === 0) {
      resultadosDiv.innerHTML = '<p>No se encontraron repositorios.</p>';
      return;
    }
    
    const html = repositorios.map(repo => `
      <div class="repositorio">
        <h3><a href="${repo.url}" target="_blank">${repo.nombre}</a></h3>
        <p>${repo.descripcion || 'Sin descripción'}</p>
        <p>Lenguaje: ${repo.lenguaje || 'No especificado'}</p>
        <p>⭐ ${repo.estrellas}</p>
      </div>
    `).join('');
    
    resultadosDiv.innerHTML = html;
  } catch (error) {
    resultadosDiv.innerHTML = '<p>Error al buscar repositorios. Intenta de nuevo más tarde.</p>';
  }
});
```

## Conclusión

En esta lección hemos explorado cómo consumir APIs externas de manera efectiva, la evolución de AJAX desde XMLHttpRequest hasta la moderna Fetch API, y cómo CORS afecta al desarrollo web y las soluciones para manejar estas restricciones.

Estos conceptos son fundamentales para desarrollar aplicaciones web modernas que interactúen con servicios externos y proporcionen experiencias de usuario fluidas y dinámicas. La capacidad de integrar servicios externos amplía enormemente las posibilidades de nuestras aplicaciones, permitiéndonos aprovechar funcionalidades especializadas sin tener que implementarlas desde cero.
