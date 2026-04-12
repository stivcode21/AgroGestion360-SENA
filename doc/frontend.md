# Frontend

## Vision general

El frontend de AgroGestion360 esta construido con `React` y `Vite`. Consume la API del backend por `fetch`, usa `react-router-dom` para la navegacion, `zustand` para estado global y `react-hot-toast` para notificaciones visuales.

## Estructura principal

- `Frontend/src/main.jsx`: punto de entrada.
- `Frontend/src/App.jsx`: composicion principal.
- `Frontend/src/routing/AppRouter.jsx`: rutas publicas y privadas.
- `Frontend/src/pages/`: vistas completas por modulo.
- `Frontend/src/components/`: componentes reutilizables.
- `Frontend/src/store/`: estado global con Zustand.
- `Frontend/src/context/`: providers globales como loader y modal de accion.
- `Frontend/src/data/`: configuraciones de formularios, sidebar y contenido informativo.
- `Frontend/src/utils/apiBase.js`: construye la URL base de la API.

## Modulos actuales del frontend

### Dashboard

- cards resumen conectadas a estadisticas reales
- grafico semanal de actividades completadas
- top trabajadores
- total de activos del inventario

### Inventario

- listado paginado
- filtros
- busqueda
- modal de detalles
- formulario de crear y editar
- alertas de stock bajo integradas a notificaciones

### Trabajadores

- listado
- filtros
- detalle
- registro y edicion

### Actividades

- registro y edicion de actividades
- buscador de trabajador
- consumo de insumos
- detalle
- pago con comprobante
- factura PDF

### Ganaderia

- listado y filtros
- registro y edicion
- vacunaciones locales en formulario
- historial de vacunaciones
- venta de animal
- detalle completo

### Reportes

- inventario
- nomina por actividades
- ventas de animales

### Configuracion

- perfil del usuario autenticado
- gestion de administradores

## Estado global importante

- `userStore.js`: usuario autenticado.
- `sidebarStore.js`: seccion activa y colapso del sidebar.
- `modalStore.js`: modales globales de details e imagen ampliada.
- `actionModalStore.js`: confirmaciones globales.
- `dataStore.js`: listas globales principales como productos, actividades, ganaderia y solicitudes.

## Flujos clave

### Sesion

- `Login.jsx` envia credenciales a `POST /api/auth/login`.
- `auth.js` consulta `GET /api/auth/verify`.
- `Header.jsx` carga el perfil del usuario autenticado.
- `Sidebar.jsx` cierra sesion con `POST /api/auth/logout`.

### Notificaciones

- las solicitudes viven en `dataStore`
- las alertas de stock bajo se guardan en `localStorage`
- `NotificationsModal.jsx` une ambas fuentes solo para renderizar
- `Header.jsx` suma ambos contadores no leidos

### Imagenes

- `ImgPicker` carga imagenes al backend
- el backend delega la subida en Cloudinary
- `DetailsImage` y `ImgEnlarge` centralizan la visualizacion y ampliacion

### Formularios dinamicos

- varios formularios leen su estructura desde `src/data/`
- `FormInput` soporta selects locales y dinamicos por endpoint

## Variables de entorno

El frontend necesita:

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

Si no se define, el sistema usa `http://localhost:3001/api` por defecto.

## Como arrancarlo

```bash
cd Frontend
npm install
npm run dev
```

## Build de produccion

```bash
cd Frontend
npm run build
npm run preview
```

## Puntos importantes

- La autenticacion depende de cookie, no de token en `localStorage`.
- Conviene reutilizar siempre `buildApiUrl()` para no hardcodear rutas.
- El frontend usa modales reutilizables para details, imagen ampliada y acciones de confirmacion.
- El contenido institucional del landing se configura desde `src/data/accordionData.jsx`.
- Las datas de formularios estan en `src/data/` y ayudan a mantener formularios dinamicos y consistentes.
