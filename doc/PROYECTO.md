# Proyecto: AgroGestion360

## Vision general
Aplicacion web tipo SPA construida con React y Vite. La navegacion es por rutas internas y el estado global se maneja con Zustand.

## Arquitectura (frontend)
- Entrada: `Frontend/src/main.jsx` monta React y carga `App`.
- App: `Frontend/src/App.jsx` configura el enrutador y aplica el modo claro/oscuro via clases en `body`.
- Enrutamiento: `Frontend/src/routing/AppRouter.jsx` define las rutas principales.
- Estado global: stores en `Frontend/src/store/`.
- Alias: `@` apunta a `Frontend/src` (configurado en `Frontend/vite.config.js`).

## Rutas principales
- `/` bienvenida
- `/login` acceso
- `/dashboard` panel principal
- `/inventario` lista de inventario
- `/inventario/registrar` formulario de producto
- `/inventario/editar/:id` edicion de producto
- `/reportes` reportes
- `/trabajadores` listado de trabajadores
- `/trabajadores/registrar` registro de trabajador
- `/trabajadores/editar/:id` edicion de trabajador
- `/actividades` actividades
- `/ganaderia` modulo de ganaderia
- `/porcicultura` modulo de porcicultura

## Estado global (Zustand)
- `authStore`: controla el estado de inicio de sesion.
- `ThemeStore`: modo claro/oscuro persistido en `localStorage`.
- `sidebarStore`: estado de la barra lateral y seccion activa.
- `modalStore`: estado de modales y seleccion de elementos.

## Componentes y organizacion
- `Frontend/src/components/` sigue un estilo tipo atomic design:
  - `atoms`, `molecules`, `organism`, `templates`
- `Frontend/src/pages/` agrupa cada pantalla por dominio funcional.
- `Frontend/src/data/` contiene datos locales usados por las vistas.
- `Frontend/src/assets/` y `Frontend/public/` alojan imagenes y recursos.

## Backend (estado actual)
- `Backend/` contiene archivos base (`.htaccess`, `config/conexion.php`) sin implementacion activa.
- No hay API definida ni endpoints expuestos en este momento.

## Como correr la aplicacion
Frontend (desarrollo):
```bash
cd Frontend
npm install
npm run dev
```

Frontend (produccion local):
```bash
cd Frontend
npm run build
npm run preview
```

## Despliegue
- `Frontend/vercel.json` define un rewrite para SPA (todas las rutas sirven `/`).

## Notas y pendientes
- Conectar el frontend con un backend real.
- Definir variables de entorno y configuracion de API cuando exista.
