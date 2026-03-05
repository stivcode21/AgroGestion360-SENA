# Proyecto: AgroGestion360

## Vision general
Aplicacion web SPA construida con React + Vite. La app usa rutas internas, estado global con Zustand y autenticacion por sesion con cookie (enviada con `credentials: include`).

## Arquitectura (Frontend)
- Entrada: `Frontend/src/main.jsx`.
- App raiz: `Frontend/src/App.jsx` envuelve en `BrowserRouter`, `LoaderProvider` y `Toaster`.
- Enrutamiento: `Frontend/src/routing/AppRouter.jsx`.
- Estado global: `Frontend/src/store/ThemeStore.js`, `Frontend/src/store/sidebarStore.js`, `Frontend/src/store/modalStore.js`.
- Utils clave: `Frontend/src/utils/apiBase.js`, `Frontend/src/utils/auth.js`.
- Alias: `@` apunta a `Frontend/src` (vite config).

## Control de acceso
`AppRouter` ejecuta `checkAuth()` cuando cambia la ruta:
- Rutas publicas: `/` y `/login`.
- Si no hay sesion y la ruta es privada, redirige a `/login`.
- Si hay sesion y se entra a ruta publica, redirige a `/dashboard`.

## Rutas principales
- `/` bienvenida
- `/login` inicio de sesion
- `/dashboard` panel principal
- `/settings` configuraciones
- `/inventario`
- `/reportes`
- `/trabajadores`
- `/actividades`
- `/ganaderia`
- `/porcicultura`

## Rutas de registro
- `/inventario/registrar`
- `/trabajadores/registrar`
- `/actividades/registrar`
- `/ganaderia/registrar`
- `/porcicultura/registrar`
- `/admin/registrar`

## Rutas de edicion (dinamicas)
- `/inventario/editar/:id`
- `/trabajadores/editar/:id`
- `/actividades/editar/:id`
- `/ganaderia/editar/:id`
- `/porcicultura/editar/:id`
- `/admin/editar/:id`

## Estado global (Zustand)
- `ThemeStore`: modo claro guardado en `localStorage`.
- `sidebarStore`: seccion activa, colapso de sidebar y estado desktop.
- `modalStore`: estado de modal y seleccion de entidades (producto, trabajador, actividad, ganado y porcino).

## Navegacion lateral y cierre de sesion
El componente `Sidebar`:
- sincroniza la seccion activa con la ruta actual,
- omite rutas de formularios para no perder contexto visual,
- muestra modal de confirmacion para cierre de sesion,
- invoca `POST auth/logout` contra la API y redirige a `/`.

## Configuraciones (`/settings`)
- Vista "Mi perfil".
- Vista "Administradores" con tarjetas de admin.
- Flujo de actualizacion de credenciales por modal (estructura lista para integrar API).

## Integracion con API
- Base URL configurable con `VITE_API_BASE_URL`.
- Fallback local: `http://localhost:3001/api`.
- Helper central: `buildApiUrl(path)`.

## Estructura base del frontend
- `src/components/` (atoms, molecules, organism, templates)
- `src/pages/` (pantallas por modulo)
- `src/store/` (Zustand)
- `src/data/` (datos locales)
- `src/utils/` (helpers)
- `src/assets/` y `public/` (recursos estaticos)

## Backend (estado actual)
`Backend/` contiene base de configuracion (ej. `config/conexion.php`) y estructura inicial. No hay API completa documentada dentro de este repositorio aun.

## Ejecucion
```bash
cd Frontend
npm install
npm run dev
```

## Build local
```bash
cd Frontend
npm run build
npm run preview
```

## Despliegue
- `Frontend/vercel.json` incluye rewrite para SPA.

## Pendientes sugeridos
- Documentar endpoints finales cuando el backend este cerrado.
- Completar la integracion real para actualizar credenciales de administradores.
- Centralizar documentacion de variables de entorno por ambiente.
