# Reto Semana 3: Mejorando la Aplicación de Chat con Fetch API, Manejo de Errores y Depuración

En este reto, aplicaremos los conceptos aprendidos en la Lección 3 para mejorar nuestra aplicación de chat con IA. Implementaremos nuevas funcionalidades utilizando la Fetch API, técnicas avanzadas de manejo de errores y herramientas de depuración.

## Nuevos Requerimientos

### 1. Persistencia de Mensajes con LocalStorage

**Objetivo:** Implementar un sistema de persistencia de mensajes utilizando LocalStorage para que los mensajes no se pierdan al recargar la página.

**Tareas:**
- Crear funciones para guardar el historial de mensajes en LocalStorage cada vez que se añada un nuevo mensaje.
- Implementar la carga de mensajes desde LocalStorage al iniciar la aplicación.
- Añadir un botón para borrar el historial de mensajes (con confirmación).
- Manejar posibles errores de almacenamiento (cuota excedida, modo privado, etc.).

**Conceptos aplicados:** Fetch API (para cargar/guardar datos), manejo de errores.

### 2. Sistema de Reintentos para Peticiones Fallidas

**Objetivo:** Mejorar la robustez de la aplicación implementando un sistema de reintentos automáticos cuando falla una petición a la API.

**Tareas:**
- Modificar la función `obtenerRespuestaIA()` para implementar reintentos con backoff exponencial.
- Mostrar al usuario el estado de los reintentos.
- Permitir al usuario cancelar una petición en curso utilizando AbortController.
- Implementar un timeout para evitar esperas indefinidas.

**Conceptos aplicados:** Fetch API avanzado (AbortController), manejo de errores, promesas.

### 3. Validación y Sanitización de Mensajes

**Objetivo:** Implementar un sistema robusto de validación y sanitización de mensajes para prevenir inyecciones y mejorar la seguridad.

**Tareas:**
- Crear una clase `MessageValidator` que valide los mensajes antes de enviarlos.
- Implementar sanitización de HTML para evitar XSS en los mensajes mostrados.
- Añadir validación de longitud máxima y mínima de mensajes.
- Crear errores personalizados para diferentes tipos de validación fallida.

**Conceptos aplicados:** Clases de error personalizadas, manejo de excepciones, seguridad.


## Entrega

Para completar este reto, deberás:

1. Implementa los requerimientos descritos.
2. Documentar tu código con comentarios explicativos.
3. Incluir manejo de errores apropiado para cada nueva funcionalidad.
4. Optimizar el rendimiento de las nuevas características.

¡Buena suerte! Este reto te permitirá aplicar los conceptos avanzados de la Lección 3 en un contexto práctico, mejorando significativamente la calidad y robustez de tu aplicación de chat con IA.
