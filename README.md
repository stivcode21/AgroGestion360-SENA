# AgroGestion360

AgroGestion360 es una aplicacion web para la gestion operativa de una finca. La plataforma centraliza inventario, trabajadores, actividades, ganaderia, notificaciones, reportes y configuracion de usuarios dentro de un solo sistema.

## Estado del proyecto

Esta version corresponde a una primera entrega estable del sistema. Ya cuenta con flujo funcional de autenticacion, CRUD principales, reportes PDF, estadisticas reales en dashboard y una base de datos semilla lista para arrancar el proyecto.

## Modulos disponibles

- `Dashboard`: resumen general, cards principales, top trabajadores y estadisticas operativas.
- `Inventario`: registro, edicion, filtros, detalles, reportes y alertas de stock bajo.
- `Trabajadores`: gestion completa del personal.
- `Actividades`: registro, edicion, consumo de insumos, pagos y comprobantes.
- `Ganaderia`: registro de animales, vacunaciones, historial de vacunas y venta de ganado.
- `Reportes`: inventario, nomina por actividades, ventas de animales y factura de pago por actividad.
- `Configuracion`: perfil del usuario autenticado y administracion de usuarios del sistema.
- `Porcicultura`: estructura reservada para futuras etapas.

## Estructura general

```txt
AgroGestion360-SENA/
├─ Backend/
├─ Frontend/
├─ db/
├─ doc/
└─ README.md
```

- `Backend/`: API en Express y acceso a PostgreSQL.
- `Frontend/`: SPA en React + Vite.
- `db/`: base SQL del proyecto lista para recrear el entorno.
- `doc/`: documentacion tecnica del frontend y backend.

## Requisitos

- `Node.js` 18 o superior
- `PostgreSQL` 14 o superior
- Cuenta de `Cloudinary` para carga de imagenes
- Cuenta `Gmail` con contraseña de aplicacion para recuperacion de contraseña

## Base de datos

El archivo principal es [agroGestion.sql](db/agroGestion.sql).

Ese script:

- recrea la base desde cero
- crea las tablas que hoy usa el backend
- conserva `porcicultura` para futuras fases
- inserta catalogos base
- crea usuarios iniciales
- deja datos minimos para probar inventario, notificaciones, actividades, reportes y ganaderia

## Usuarios base

El SQL crea estos accesos iniciales:

- `superadmin@gmail.com` / `12345678`
- `admin@demo.com` / `12345678`

## Variables de entorno

### Backend

Consulta la guia completa en [doc/backend.md](doc/backend.md). Las variables esperadas son:

- `PORT`
- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_PORT`
- `DB_SSL`
- `JWT_SECRET`
- `NODE_ENV`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_FOLDER`
- `EMAIL_USER`
- `EMAIL_APP_PASSWORD`

Tambien se incluye un ejemplo sugerido en `Backend/.env.example`.

### Frontend

La variable principal es:

- `VITE_API_BASE_URL`

Tambien se incluye un ejemplo sugerido en `Frontend/.env.example`.

## Como arrancar el proyecto

### 1. Crear la base de datos

1. Crea una base vacia en PostgreSQL.
2. Ejecuta el script [agroGestion.sql](db/agroGestion.sql).

### 2. Configurar backend

```bash
cd Backend
npm install
```

Crea un archivo `.env` basado en `Backend/.env.example`.

Inicia la API:

```bash
node index.js
```

### 3. Configurar frontend

```bash
cd Frontend
npm install
```

Crea un archivo `.env` basado en `Frontend/.env.example`.

Inicia la aplicacion:

```bash
npm run dev
```

## Flujo general del sistema

1. El usuario inicia sesion.
2. El backend valida credenciales y guarda un JWT en cookie.
3. El frontend verifica esa cookie para proteger rutas.
4. Cada modulo consume la API correspondiente.
5. Los modelos del backend consultan PostgreSQL.
6. El dashboard, reportes y notificaciones se alimentan con datos reales del sistema.

## Documentacion tecnica

- [Guia de backend](doc/backend.md)
- [Guia de frontend](doc/frontend.md)

## Notas importantes

- La autenticacion usa cookie HTTP, no `localStorage`.
- El frontend centraliza la URL de la API en `Frontend/src/utils/apiBase.js`.
- Las alertas de stock bajo se persisten localmente en el navegador.
- El modulo de porcicultura aun no esta conectado a un backend funcional, pero su tabla base se conserva en la DB.
