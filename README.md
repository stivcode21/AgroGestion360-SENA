# AgroGestion360
Sistema para la gestion integral de fincas (ganaderia, porcicultura, inventario, actividades y administracion de personal).

## Vision general
El repositorio contiene un frontend SPA en React y una base inicial de backend en PHP. El frontend ya integra autenticacion por sesion (cookie httpOnly), navegacion por rutas y modulos operativos por dominio.

## Modulos funcionales
- Autenticacion y control de sesion
- Dashboard
- Inventario
- Reportes
- Trabajadores
- Actividades
- Ganaderia
- Porcicultura
- Configuraciones (perfil y administradores)

## Stack actual
- Frontend: React 19, Vite 7, React Router DOM 7, Zustand, Lucide React, Recharts, react-hot-toast
- Backend (base): PHP en `Backend/` (sin API productiva completa)

## Requisitos
- Node.js LTS
- npm

## Instalacion y ejecucion (Frontend)
```bash
cd Frontend
npm install
npm run dev
```

## Scripts utiles
- `npm run dev`: servidor de desarrollo
- `npm run build`: build de produccion
- `npm run preview`: vista local del build
- `npm run lint`: analisis estatico

## Variable de entorno
El frontend construye URLs con `VITE_API_BASE_URL`.
Si no se define, usa por defecto:
`http://localhost:3001/api`

## Estructura del repositorio
```txt
/Backend
/Frontend
/doc
README.md
```

## Documentacion adicional
- Documento tecnico detallado: `doc/PROYECTO.md`
- Guia del frontend: `Frontend/README.md`

## Licencia
No definida.
