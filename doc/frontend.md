# Frontend

## Vision general
El frontend esta construido con `React` + `Vite`. Consume la API del backend por `fetch`, usa `react-router-dom` para navegacion, `zustand` para estado global y `react-hot-toast` para mensajes.

## Donde esta cada cosa
- `Frontend/src/main.jsx`: punto de entrada.
- `Frontend/src/App.jsx`: envoltura principal de la app.
- `Frontend/src/routing/AppRouter.jsx`: rutas publicas y privadas.
- `Frontend/src/pages/`: pantallas completas por modulo.
- `Frontend/src/components/`: componentes reutilizables.
- `Frontend/src/store/`: estado global con Zustand.
- `Frontend/src/context/`: providers globales como loader y modal de accion.
- `Frontend/src/utils/apiBase.js`: construye la URL base de la API.
- `Frontend/src/utils/auth.js`: valida si la sesion actual sigue activa.
- `Frontend/src/data/`: configuraciones de campos, sidebar y datos mock.

## Componentes y modulos que consumen la API
- `Frontend/src/utils/auth.js`
- `Frontend/src/components/templates/tableLayout/TableLayout.jsx`
- `Frontend/src/pages/inventario/Inventario.jsx`
- `Frontend/src/pages/adminForm/AdminForm.jsx`
- `Frontend/src/components/organism/settingsPanel/SettingsPanel.jsx`
- `Frontend/src/pages/productForm/ProductForm.jsx`
- `Frontend/src/pages/login/Login.jsx`
- `Frontend/src/components/organism/listAdmins/ListAdmins.jsx`
- `Frontend/src/components/organism/productDetails/ProductDetails.jsx`
- `Frontend/src/components/molecules/sidebar/Sidebar.jsx`
- `Frontend/src/components/molecules/filtersBox/FiltersBox.jsx`
- `Frontend/src/components/molecules/header/Header.jsx`

## Flujos importantes

### Sesion
- `Login.jsx` envia credenciales a `POST /api/auth/login`.
- `auth.js` consulta `GET /api/auth/verify` para saber si la cookie sigue valida.
- `Header.jsx` usa esa respuesta para pedir el perfil completo del usuario.
- `Sidebar.jsx` cierra sesion llamando `POST /api/auth/logout`.

### Inventario
- `Inventario.jsx` carga la primera pagina de productos.
- `TableLayout.jsx` cambia de pagina reutilizando endpoint y filtros activos.
- `FiltersBox.jsx` arma los query params y actualiza la tabla.
- `ProductForm.jsx` crea o edita productos.
- `ProductDetails.jsx` elimina productos desde el modal de detalle.

### Administradores y perfil
- `ListAdmins.jsx` carga las cards de administradores.
- `AdminForm.jsx` crea y actualiza administradores.
- `SettingsPanel.jsx` actualiza el perfil del usuario autenticado.

## Variables de entorno
La principal variable del frontend es:

- `VITE_API_BASE_URL`: URL base del backend. Si no existe, el frontend usa `http://localhost:3001/api`.

Ejemplo:

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

## Estado global que conviene ubicar rapido
- `Frontend/src/store/userStore.js`: usuario autenticado.
- `Frontend/src/store/sidebarStore.js`: seccion activa y colapso del sidebar.
- `Frontend/src/store/modalStore.js`: modales de detalle y entidades seleccionadas.
- `Frontend/src/store/actionModalStore.js`: confirmaciones como eliminar o cerrar sesion.

## Cosas importantes a tener en cuenta
- El frontend depende de la cookie de sesion, no de tokens guardados en `localStorage`.
- `buildApiUrl()` centraliza la URL del backend; conviene reutilizarlo siempre.
- Varias paginas usan `useLoader()` para bloquear la UI mientras esperan respuestas del backend.
- Algunos modulos como trabajadores, actividades, ganaderia y porcicultura aun parecen estar en estado visual o con datos locales.
- El componente `UpdateCrendentials.jsx` todavia tiene un comentario de ejemplo y no esta conectado realmente a la API.

## Como arrancarlo
```bash
cd Frontend
npm install
npm run dev
```

## Build
```bash
cd Frontend
npm run build
npm run preview
```
