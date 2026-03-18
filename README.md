# AgroGestion360

AgroGestion360 es una aplicacion web para apoyar la gestion operativa de una finca. El proyecto centraliza procesos como inventario, administracion, actividades y otros modulos del entorno agropecuario en una sola interfaz.

## Que incluye hoy
- Inicio de sesion con cookie de sesion y validacion de acceso.
- Modulo de inventario con listado, filtros, creacion, edicion y eliminacion.
- Modulo de configuracion con perfil de usuario y gestion de administradores.
- Base visual para dashboard, reportes, trabajadores, actividades, ganaderia y porcicultura.

## Como esta organizado
```txt
AgroGestion360-SENA/
├─ Backend/
├─ Frontend/
├─ db/
├─ doc/
└─ README.md
```

- `Backend/`: API en `Express`, autenticacion, rutas y acceso a PostgreSQL.
- `Frontend/`: SPA en `React` + `Vite`.
- `db/`: script base de la base de datos.
- `doc/`: documentacion tecnica separada para backend y frontend.

## Stack principal
- Frontend: React, Vite, React Router, Zustand, react-hot-toast.
- Backend: Node.js, Express, pg, jsonwebtoken, cookie-parser.
- Base de datos: PostgreSQL.

## Primeros pasos

### 1. Backend
```bash
cd Backend
npm install
node index.js
```

### 2. Frontend
```bash
cd Frontend
npm install
npm run dev
```

Variable importante del frontend:

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

Si no se define, el frontend usa esa misma URL por defecto.

## Flujo general de la aplicacion
1. El usuario inicia sesion desde el frontend.
2. El backend valida credenciales y guarda un JWT en cookie.
3. El frontend verifica esa sesion con `auth/verify`.
4. Los modulos consumen la API para listar, crear, editar o eliminar datos.
5. El backend consulta PostgreSQL desde los modelos y responde en JSON.

## Modulos principales
- `Inventario`: modulo mas avanzado actualmente.
- `Configuracion`: perfil del usuario y administradores.
- `Dashboard`
- `Reportes`
- `Trabajadores`
- `Actividades`
- `Ganaderia`
- `Porcicultura`

## Documentacion adicional
- [Guia de backend](doc/backend.md)
- [Guia de frontend](doc/frontend.md)

## Puntos importantes para nuevos desarrolladores
- La autenticacion actual depende de cookie, no de `localStorage`.
- El frontend centraliza las URLs en `Frontend/src/utils/apiBase.js`.
- La comunicacion con base de datos esta concentrada en `Backend/models/`.
- El script SQL base del proyecto esta en `db/agroGestion.sql`.