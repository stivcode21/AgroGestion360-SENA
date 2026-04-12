# Backend

## Vision general

El backend de AgroGestion360 esta construido con `Express` y `pg`. Expone una API REST que cubre autenticacion, inventario, trabajadores, actividades, ganaderia, reportes, solicitudes y estadisticas del dashboard.

## Estructura principal

- `Backend/index.js`: arranque del servidor y montaje de rutas.
- `Backend/config/db.js`: conexion a PostgreSQL.
- `Backend/config/cloudinary.js`: configuracion de carga de imagenes.
- `Backend/config/email.js`: transporte de correo para recuperacion de contraseña.
- `Backend/middleware/authMiddleware.js`: verificacion del JWT en cookie.
- `Backend/routes/`: definicion de endpoints por modulo.
- `Backend/controllers/`: validacion HTTP y respuestas.
- `Backend/models/`: consultas SQL reales.

## Modulos actuales de la API

### Auth

- inicio de sesion con cookie JWT
- cierre de sesion
- verificacion de sesion
- perfil del usuario
- administradores
- recuperacion de contraseña por correo

### Product

- CRUD de inventario
- filtros y paginacion
- catalogo de `tipo_insumo`
- alertas de stock bajo

### Workers

- CRUD de trabajadores
- filtros y paginacion
- busqueda por nombre o documento

### Activities

- CRUD de actividades
- relacion con trabajador
- estado de actividad
- comprobante de pago
- consumo de insumos asociado

### Ganaderia

- CRUD de animales
- vacunaciones por animal
- venta de ganado
- historial de vacunas

### Request

- solicitudes de compra internas
- lectura, actualizacion y eliminacion

### Reports

- reporte de inventario
- reporte de nomina por actividades
- reporte de ventas de animales
- factura PDF de pago por actividad

### Statistics

- cards principales del dashboard
- resumen general del dashboard

## Endpoints relevantes

### Auth

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/forgot-password`
- `GET /api/auth/verify`
- `GET /api/auth/user/:id`
- `GET /api/auth/admins/list`
- `PUT /api/auth/update/:id`
- `POST /api/auth/admin`

### Inventario

- `GET /api/product/list/:page`
- `GET /api/product/getproduct/:id`
- `GET /api/product/getTipoInsumo`
- `GET /api/product/filter/:page`
- `GET /api/product/stock-alerts`
- `POST /api/product/register`
- `PUT /api/product/edit/:id`
- `DELETE /api/product/delete/:id`

### Trabajadores

- `GET /api/workers/list/:page`
- `GET /api/workers/getworker/:id`
- `GET /api/workers/filter/:page`
- `POST /api/workers/register`
- `PUT /api/workers/edit/:id`
- `DELETE /api/workers/delete/:id`

### Actividades

- `GET /api/activity/list/:page`
- `GET /api/activity/getactivity/:id`
- `GET /api/activity/filter/:page`
- `POST /api/activity/register`
- `PUT /api/activity/editactivity/:id`
- `DELETE /api/activity/delete/:id`

### Consumo

- `GET /api/consumption/activity/:id`
- `POST /api/consumption/register`
- `PUT /api/consumption/edit/:id`

### Ganaderia

- `GET /api/ganaderia/list/:page`
- `GET /api/ganaderia/getganaderia/:id`
- `GET /api/ganaderia/:id/vacunas`
- `GET /api/ganaderia/filter/:page`
- `POST /api/ganaderia/createganaderia`
- `POST /api/ganaderia/sell/:id`
- `PUT /api/ganaderia/editganaderia/:id`
- `DELETE /api/ganaderia/deleteganaderia/:id`

### Solicitudes

- `GET /api/request/list`
- `GET /api/request/request/:id`
- `POST /api/request/create`
- `PUT /api/request/edit/:id`
- `DELETE /api/request/delete/:id`

### Reportes

- `GET /api/report/inventory`
- `GET /api/report/payroll`
- `GET /api/report/cattle-sales`
- `GET /api/report/activity-payment-invoice/:id`

### Estadisticas

- `GET /api/statistics/dashboard-cards`
- `GET /api/statistics/dashboard-overview`

## Variables de entorno

El backend necesita estas variables:

```env
PORT=3001
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=tu_password
DB_NAME=agrogestion360
DB_PORT=5432
DB_SSL=false
JWT_SECRET=una_clave_segura
NODE_ENV=development

CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
CLOUDINARY_FOLDER=agrogestion360/products

EMAIL_USER=tu_correo@gmail.com
EMAIL_APP_PASSWORD=tu_app_password
```

Notas:

- `DB_SSL=true` solo si tu entorno lo necesita.
- `EMAIL_APP_PASSWORD` corresponde a una contraseña de aplicacion de Gmail.
- No conviene subir credenciales reales al repositorio.

## Base de datos

El archivo base es [agroGestion.sql](../db/agroGestion.sql).

Este script deja listas las tablas realmente usadas por el backend actual:

- `usuarios`
- `tipo_documento`
- `roles`
- `trabajadores`
- `tipo_insumo`
- `inventario`
- `ganaderia`
- `porcicultura`
- `vacunas`
- `ventas_animales`
- `estado_actividades`
- `actividades`
- `consumo_insumo`
- `solicitud`

Tambien crea datos semilla para:

- usuarios base
- trabajadores
- inventario
- ganado
- vacunaciones
- ventas
- actividades
- solicitudes

## Como arrancarlo

```bash
cd Backend
npm install
node index.js
```

## Recomendaciones

- Mantener toda consulta SQL dentro de `models`.
- Seguir usando `credentials: include` en frontend, porque la autenticacion depende de cookie.
- Si cambias el esquema SQL, actualizar tambien `db/agroGestion.sql` para no desfasar la base inicial del proyecto.
