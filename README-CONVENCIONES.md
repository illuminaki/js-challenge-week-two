# Convenciones de nombramiento y buenas prácticas

## 1. Convenciones para nombramiento de ramas (Azure DevOps)

- Usa el ID del ticket seguido de una breve descripción en kebab-case.
- Formato sugerido:
  - `feature/{id}-{descripcion-breve}` para nuevas funcionalidades
  - `bugfix/{id}-{descripcion-breve}` para correcciones
  - `hotfix/{id}-{descripcion-breve}` para emergencias
- Ejemplos:
  - `feature/1234-login-usuario`
  - `bugfix/5678-error-login`

## 2. Buenas prácticas para IDs y clases CSS

- Usa nombres descriptivos y en kebab-case (minúsculas, palabras separadas por guiones).
- Prefiere nombres semánticos sobre genéricos.
  - Correcto: `main-header`, `user-profile-card`
  - Incorrecto: `header1`, `box2`
- Evita usar IDs para estilos, úsalos solo para referencias únicas (por ejemplo, anclas o JS).

## 3. Buenas prácticas para variables en JavaScript

- Usa camelCase para variables y funciones: `userProfile`, `getUserData`
- Usa PascalCase para clases y constructores: `UserProfile`
- Constantes globales en mayúsculas y guiones bajos: `MAX_USERS`
- Nombres descriptivos y claros, evita abreviaturas innecesarias.
