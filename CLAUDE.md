# CLAUDE.md — AgroGestion360

Contexto de arquitectura y convenciones del proyecto para asistencia futura.

---

## ¿Qué es este proyecto?

AgroGestion360 es una **aplicación web de gestión para fincas/granjas**, desarrollada como proyecto SENA. Centraliza inventario de insumos, trabajadores, actividades laborales, ganadería, solicitudes internas, reportes PDF y configuración de usuarios en un solo sistema.

**Estado:** Primera entrega estable. Módulo de porcicultura reservado para fases futuras (solo estructura en BD, sin backend activo).

---

## Arquitectura general

```
Browser ──► Frontend (React SPA)  ──►  Backend (API REST)  ──►  PostgreSQL
              Vite / Vercel               Express / Node.js        Puerto 5432
              Puerto 5173                 Puerto 3001
```

El proyecto contiene **3 sub-proyectos** independientes en la raíz:

```
AgroGestion360-SENA/
├── Backend/        → API REST (Node.js + Express)
├── Frontend/       → SPA (React + Vite)
├── db/             → Script SQL base (PostgreSQL)
├── doc/            → Documentación técnica
│   ├── backend.md
│   └── frontend.md
└── README.md
```

---

## Sub-proyecto: Backend

**Stack:** Node.js 18+, Express.js 5, PostgreSQL 14+ (`pg`), JWT (cookie httpOnly), Cloudinary, Nodemailer, Multer, Jest + Supertest.

**Estructura interna:**
```
Backend/
├── index.js               → arranque del servidor y montaje de rutas
├── app.js
├── config/
│   ├── db.js              → pool de conexiones PostgreSQL
│   ├── cloudinary.js      → config de carga de imágenes
│   ├── corsOptions.js     → orígenes permitidos
│   └── email.js           → transporte Nodemailer/Gmail
├── middleware/
│   ├── authMiddleware.js  → verifica JWT en cookie (expira 2h)
│   └── uploadImage.js     → Multer para subida de archivos
├── routes/                → definición de endpoints por módulo
├── controllers/           → validación HTTP y armado de respuestas
├── models/                → TODA la lógica SQL va aquí
└── test/
    ├── auth/
    └── inventario/
```

**Convención importante:** Toda consulta SQL debe vivir en `models/`, nunca en controllers.

**Módulos y endpoints principales:**

| Módulo | Prefijo | Operaciones |
|---|---|---|
| Auth | `/api/auth` | login, logout, verify, forgot-password, perfil, admins |
| Inventario | `/api/product` | CRUD, filtros, paginación, stock-alerts, tipo_insumo |
| Trabajadores | `/api/workers` | CRUD, filtros, paginación, búsqueda |
| Actividades | `/api/activity` | CRUD, filtros, estados, comprobante |
| Consumo | `/api/consumption` | GET por actividad, register, edit |
| Ganadería | `/api/ganaderia` | CRUD, vacunas, historial, venta |
| Solicitudes | `/api/request` | CRUD, notificaciones |
| Reportes | `/api/report` | inventory, payroll, cattle-sales, activity-payment-invoice/:id |
| Estadísticas | `/api/statistics` | dashboard-cards, dashboard-overview |
| Imágenes | `/api/image` | upload → Cloudinary |

**Autenticación:** JWT almacenado en cookie httpOnly. El middleware `authMiddleware.js` verifica la cookie en cada endpoint protegido. Sin refresh token (expiración 2h).

**CORS permitido:** `http://localhost:5173`, `http://localhost:5174`, `https://agrogestion.app`

**Variables de entorno requeridas (`Backend/.env`):**
```env
PORT=3001
DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT, DB_SSL
JWT_SECRET
NODE_ENV
CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_FOLDER
EMAIL_USER, EMAIL_APP_PASSWORD
TEST_USER_EMAIL, TEST_USER_PASSWORD
```

**Arranque:**
```bash
cd Backend && npm install && node index.js
```

**Tests:**
```bash
cd Backend && npm test   # jest --verbose --detectOpenHandles
```

---

## Sub-proyecto: Frontend

**Stack:** React 19, Vite 7 + SWC, React Router v7, Zustand 5, Recharts, jsPDF + jsPDF-AutoTable, Lucide React, react-hot-toast.

**Estructura interna:**
```
Frontend/src/
├── main.jsx               → punto de entrada
├── App.jsx                → composición principal
├── routing/AppRouter.jsx  → rutas públicas y privadas
├── pages/                 → vistas completas por módulo
├── components/
│   ├── atoms/
│   ├── molecules/
│   ├── organism/          → componentes complejos autónomos
│   └── templates/         → layouts
├── store/                 → estado global Zustand
│   ├── userStore.js       → usuario autenticado
│   ├── sidebarStore.js    → sección activa y colapso
│   ├── modalStore.js      → modales globales
│   ├── actionModalStore.js→ confirmaciones destructivas
│   └── dataStore.js       → listas principales (productos, actividades, ganadería, solicitudes)
├── context/
│   ├── loaderProvider/    → spinner global
│   └── actionModalProvider/
├── data/                  → config de formularios dinámicos y sidebar
└── utils/
    ├── apiBase.js         → buildApiUrl() — SIEMPRE usar esto, nunca hardcodear URLs
    ├── auth.js            → verificación de sesión
    ├── stockAlertsStorage.js → alertas stock en localStorage + EventEmitter
    ├── generateReportPdf.js
    └── generateActivityPaymentInvoicePdf.js
```

**Páginas disponibles:**
- `welcome` — landing público
- `login` — autenticación
- `dashboard` — estadísticas, gráficos, top trabajadores
- `inventario` — CRUD insumos con alertas de stock
- `workers` — gestión de empleados
- `actividades` / `activityForm` — registro, pagos, comprobantes
- `ganaderia` / `ganaderiaForm` — animales, vacunas, ventas
- `porcicultura` / `porciculturaForm` — reservado (sin backend)
- `reportes` — generación de PDFs
- `settings` — perfil y admins

**Reglas importantes:**
- La autenticación usa **cookie HTTP**, nunca `localStorage` para el token.
- Siempre usar `buildApiUrl()` de `utils/apiBase.js` para construir URLs de la API.
- Los formularios dinámicos leen su estructura desde `src/data/`.
- Los PDFs se generan **en el frontend** con jsPDF usando datos traídos de la API.
- Las alertas de stock bajo se persisten en `localStorage` y se notifican via EventEmitter.
- Los modales de confirmación destructiva usan `actionModalStore`.

**Variables de entorno requeridas (`Frontend/.env`):**
```env
VITE_API_BASE_URL=http://localhost:3001/api
```

**Deploy:** Configurado para Vercel (`vercel.json` con rewrites para SPA).

**Arranque:**
```bash
cd Frontend && npm install && npm run dev
```

---

## Sub-proyecto: Base de Datos

**Motor:** PostgreSQL 14+  
**Script:** `db/agroGestion.sql`

**Tablas:**

| Tabla | Propósito |
|---|---|
| `usuarios` | Login, roles (Dueño / Administrador) |
| `roles` | Catálogo de roles |
| `tipo_documento` | CC, Cédula extranjería, Pasaporte |
| `trabajadores` | Empleados de la finca |
| `tipo_insumo` | Herramienta, Alimento, Fertilizante, Medicamento, Limpieza |
| `inventario` | Insumos con cantidad, precio, vencimiento |
| `ganaderia` | Animales con raza, peso, estado de salud |
| `porcicultura` | Reservada para fases futuras |
| `vacunas` | Vacunaciones por animal (ON DELETE CASCADE → ganaderia) |
| `ventas_animales` | Ventas de ganado (ON DELETE CASCADE → ganaderia) |
| `estado_actividades` | Activa, Completada, Cancelada |
| `actividades` | Tareas laborales vinculadas a trabajador |
| `consumo_insumo` | Insumos usados por actividad (ON DELETE CASCADE → actividades) |
| `solicitud` | Solicitudes internas de compra |

**Relaciones clave:**
```
actividades ──► trabajadores
actividades ──► estado_actividades
actividades ◄── consumo_insumo ──► inventario
ganaderia ◄── vacunas
ganaderia ◄── ventas_animales
inventario ──► tipo_insumo
trabajadores ──► tipo_documento
usuarios ──► tipo_documento, roles
```

**Usuarios semilla:**
- `superadmin@gmail.com` / `12345678`
- `admin@demo.com` / `12345678`

**Setup de BD:**
```bash
# 1. Crear base de datos vacía en PostgreSQL
# 2. Ejecutar el script:
psql -U postgres -d nombre_db -f db/agroGestion.sql
```

---

## Flujos clave

### Autenticación
1. `POST /api/auth/login` → Backend valida en tabla `usuarios` → genera JWT en cookie httpOnly
2. `authMiddleware.js` verifica cookie en cada request protegido
3. `GET /api/auth/verify` → Frontend usa esto para proteger rutas privadas
4. `POST /api/auth/logout` → elimina cookie

### Carga de imágenes
1. Frontend sube archivo via `ImgPicker` → Backend (Multer)
2. Backend delega a Cloudinary API
3. Cloudinary retorna URL pública → Backend guarda URL en BD
4. Frontend renderiza desde URL de Cloudinary

### Generación de PDFs
- Frontend obtiene datos via API REST → genera PDF localmente con jsPDF
- No hay generación de PDF en el backend

### Notificaciones
- Solicitudes de compra: viven en `dataStore` (Zustand)
- Alertas de stock bajo: `localStorage` via `stockAlertsStorage.js`
- `Header.jsx` suma ambos contadores no leídos

---

## Decisiones técnicas y convenciones

- **Sin Docker / CI/CD** configurado. Deployment manual.
- **Sin rate limiting** en la API actual.
- **Sin refresh token** — JWT expira en 2 horas.
- El frontend usa **Atomic Design** para componentes (atoms → molecules → organism → templates).
- Si se modifica el esquema SQL, actualizar también `db/agroGestion.sql`.
- `credentials: include` es obligatorio en todos los `fetch` del frontend.

---

## Documentación adicional

- [doc/backend.md](doc/backend.md) — endpoints completos y variables de entorno
- [doc/frontend.md](doc/frontend.md) — flujos, stores y convenciones de UI
- [README.md](README.md) — setup completo del proyecto
