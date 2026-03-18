# Backend

## Vision general
El backend esta construido con `Express` y usa `pg` para conectarse a PostgreSQL. La API actual cubre autenticacion por cookie con JWT y el modulo de inventario.

## Donde esta cada cosa
- `Backend/index.js`: arranque del servidor, middlewares globales y montaje de rutas.
- `Backend/config/db.js`: pool de conexiones PostgreSQL.
- `Backend/config/corsOptions.js`: origenes y headers permitidos en desarrollo.
- `Backend/routes/authRoutes.js`: rutas de autenticacion y administradores.
- `Backend/routes/productRoutes.js`: rutas de inventario.
- `Backend/controllers/`: capa HTTP; valida datos, arma respuestas y llama a modelos.
- `Backend/models/`: capa SQL; aqui viven las consultas reales a la base de datos.
- `Backend/middleware/authMiddleware.js`: verificacion del JWT guardado en cookie.

## Archivos que hablan con la base de datos
- `Backend/config/db.js`
- `Backend/models/productModel.js`
- `Backend/models/adminModel.js`

## Flujo general
1. La ruta recibe la peticion.
2. El controller valida parametros y body.
3. El controller llama al model.
4. El model ejecuta `db.query(...)` contra PostgreSQL.
5. El controller devuelve JSON al frontend.

## Endpoints principales

### Auth
- `POST /api/auth/login`: valida credenciales, genera JWT y lo guarda en cookie.
- `POST /api/auth/logout`: limpia la cookie de sesion.
- `GET /api/auth/verify`: valida la cookie y devuelve el usuario del token.
- `GET /api/auth/user/:id`: trae un usuario por id.
- `GET /api/auth/admins/list`: lista usuarios con rol de administrador.
- `PUT /api/auth/update/:id`: actualiza un administrador o perfil.
- `POST /api/auth/admin`: crea un administrador.

### Inventario
- `GET /api/product/list/:page`: lista insumos paginados.
- `GET /api/product/getproduct/:id`: trae un producto por id.
- `POST /api/product/register`: crea un insumo.
- `PUT /api/product/edit/:id`: actualiza un insumo.
- `DELETE /api/product/delete/:id`: elimina un insumo.
- `GET /api/product/filter/:page?tipo=2&orden=recientes`: filtra y pagina insumos.

## Variables de entorno
El archivo actual es `Backend/.env`.

Variables usadas por la API:
- `PORT`: puerto del servidor Express.
- `DB_HOST`: host de PostgreSQL.
- `DB_USER`: usuario de PostgreSQL.
- `DB_PASSWORD`: contrasena de PostgreSQL.
- `DB_NAME`: nombre de la base de datos.
- `DB_PORT`: puerto de PostgreSQL.
- `DB_SSL`: `true` o `false` segun el entorno.
- `JWT_SECRET`: clave para firmar tokens.
- `NODE_ENV`: normalmente `development` o `production`.


## Base de datos
- Script principal: `db/agroGestion.sql`
- Tablas usadas directamente por la API actual:
- `usuarios`
- `inventario`
- `tipo_insumo`

## Cosas importantes a tener en cuenta
- La autenticacion depende de la cookie `token`, asi que el frontend debe enviar `credentials: include` en login, logout y verificacion de sesion.
- En desarrollo se habilita `cors`; en produccion se asume que la app corre detras de proxy y `trust proxy` ya esta activado.
- Los controllers de inventario y administradores mezclan datos existentes con `req.body` para no perder campos al editar.

## Como arrancarlo
```bash
cd Backend
npm install
node index.js
```
