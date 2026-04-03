-- =====================================================
-- AGRO DB - SCHEMA + SEED BASE
-- PostgreSQL
-- =====================================================

BEGIN;

-- =====================================================
-- DROP TABLES
-- =====================================================
DROP TABLE IF EXISTS pago CASCADE;
DROP TABLE IF EXISTS solicitud CASCADE;
DROP TABLE IF EXISTS consumo_insumo CASCADE;
DROP TABLE IF EXISTS actividades CASCADE;
DROP TABLE IF EXISTS ventas_animales CASCADE;
DROP TABLE IF EXISTS vacunas CASCADE;
DROP TABLE IF EXISTS porcicultura CASCADE;
DROP TABLE IF EXISTS ganaderia CASCADE;
DROP TABLE IF EXISTS inventario CASCADE;
DROP TABLE IF EXISTS trabajadores CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS estado_actividades CASCADE;
DROP TABLE IF EXISTS estado_animal CASCADE;
DROP TABLE IF EXISTS tipo_origen CASCADE;
DROP TABLE IF EXISTS tipo_ganado CASCADE;
DROP TABLE IF EXISTS tipo_trabajador CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS tipo_documento CASCADE;
DROP TABLE IF EXISTS estado_pago CASCADE;
DROP TABLE IF EXISTS tipo_insumo CASCADE;

-- =====================================================
-- TABLES
-- =====================================================

CREATE TABLE tipo_insumo (
    id_tipo INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(45) NOT NULL
);

CREATE TABLE estado_pago (
    id_estado_pago INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE tipo_documento (
    id_tipo INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE roles (
    id_rol INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(45) NOT NULL
);

CREATE TABLE tipo_trabajador (
    id_tipo INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE tipo_ganado (
    id_tipo INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE tipo_origen (
    id_tipo INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE estado_animal (
    id_estado INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE estado_actividades (
    id_estado INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE usuarios (
    id_usuario INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_completo VARCHAR(50) NOT NULL,
    edad INTEGER,
    id_tipo_documento INTEGER NOT NULL,
    numero_documento VARCHAR(20) NOT NULL,
    celular VARCHAR(20) NOT NULL,
    url_img VARCHAR(350),
    correo VARCHAR(45) NOT NULL,
    contrasena VARCHAR(50) NOT NULL,
    id_rol INTEGER NOT NULL,
    estado BOOLEAN DEFAULT TRUE,
    CONSTRAINT usuarios_id_rol_fkey
        FOREIGN KEY (id_rol) REFERENCES roles(id_rol),
    CONSTRAINT usuarios_id_tipo_documento_fkey
        FOREIGN KEY (id_tipo_documento) REFERENCES tipo_documento(id_tipo)
);

CREATE TABLE trabajadores (
    id_trabajador INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_completo VARCHAR(50) NOT NULL,
    url_img VARCHAR(250),
    id_tipo_documento INTEGER NOT NULL,
    numero_documento VARCHAR(20) NOT NULL,
    celular VARCHAR(20) NOT NULL,
    id_tipo_trabajador INTEGER NOT NULL,
    direccion VARCHAR(50),
    observaciones VARCHAR(200),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado BOOLEAN DEFAULT TRUE,
    edad INTEGER,
    CONSTRAINT trabajadores_id_tipo_trabajador_fkey
        FOREIGN KEY (id_tipo_trabajador) REFERENCES tipo_trabajador(id_tipo),
    CONSTRAINT trabajadores_id_tipo_documento_fkey
        FOREIGN KEY (id_tipo_documento) REFERENCES tipo_documento(id_tipo)
);

CREATE TABLE inventario (
    id_insumo INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_tipo INTEGER NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    marca VARCHAR(50),
    cantidad INTEGER NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_vencimiento TIMESTAMP,
    unidad_medida VARCHAR(20),
    proveedor VARCHAR(45),
    precio_unitario INTEGER NOT NULL,
    observaciones VARCHAR(250),
    url_img VARCHAR(500),
    CONSTRAINT inventario_id_tipo_fkey
        FOREIGN KEY (id_tipo) REFERENCES tipo_insumo(id_tipo)
);

CREATE TABLE ganaderia (
    id_animal INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    fecha_ingreso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_tipo INTEGER NOT NULL,
    id_tipo_origen INTEGER NOT NULL,
    fecha_nacimiento TIMESTAMP,
    peso_inicial NUMERIC(10,2) NOT NULL,
    estado_salud VARCHAR(45),
    id_estado INTEGER NOT NULL,
    observaciones VARCHAR(250),
    marcado BOOLEAN,
    CONSTRAINT ganaderia_id_tipo_origen_fkey
        FOREIGN KEY (id_tipo_origen) REFERENCES tipo_origen(id_tipo),
    CONSTRAINT ganaderia_id_tipo_fkey
        FOREIGN KEY (id_tipo) REFERENCES tipo_ganado(id_tipo),
    CONSTRAINT ganaderia_id_estado_fkey
        FOREIGN KEY (id_estado) REFERENCES estado_animal(id_estado)
);

CREATE TABLE porcicultura (
    id_animal INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    fecha_ingreso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_nacimiento TIMESTAMP,
    peso_inicial NUMERIC(10,2) NOT NULL,
    sexo VARCHAR(45) NOT NULL,
    estado_salud VARCHAR(45),
    id_estado INTEGER NOT NULL,
    observaciones VARCHAR(250),
    CONSTRAINT porcicultura_id_estado_fkey
        FOREIGN KEY (id_estado) REFERENCES estado_animal(id_estado)
);

CREATE TABLE vacunas (
    id_registro INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tipo_vacuna VARCHAR(50),
    fecha_aplicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dosis VARCHAR(45) NOT NULL,
    responsable VARCHAR(60) NOT NULL,
    id_animal INTEGER NOT NULL,
    tipo_animal VARCHAR(45),
    estado_vacunacion BOOLEAN DEFAULT FALSE,
    observaciones VARCHAR(250)
);

CREATE TABLE ventas_animales (
    id_venta INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_animal INTEGER NOT NULL,
    tipo_animal VARCHAR(45),
    comprador VARCHAR(45),
    fecha_venta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    monto_total NUMERIC(10,2) NOT NULL,
    observaciones VARCHAR(250)
);

CREATE TABLE actividades (
    id_registro INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    url_evidencia VARCHAR(250),
    fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_fin TIMESTAMP,
    duracion VARCHAR(30),
    id_trabajador INTEGER NOT NULL,
    id_estado INTEGER NOT NULL,
    monto NUMERIC(10,2) NOT NULL,
    observaciones VARCHAR(250),
    actividad VARCHAR(100) NOT NULL DEFAULT 'Sin actividad',
    CONSTRAINT actividades_id_estado_fkey
        FOREIGN KEY (id_estado) REFERENCES estado_actividades(id_estado),
    CONSTRAINT actividades_id_trabajador_fkey
        FOREIGN KEY (id_trabajador) REFERENCES trabajadores(id_trabajador)
);

CREATE TABLE consumo_insumo (
    id_consumo INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cantidad INTEGER NOT NULL,
    id_responsable INTEGER NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_insumo INTEGER NOT NULL,
    id_actividad INTEGER,
    CONSTRAINT consumo_insumo_id_insumo_fkey
        FOREIGN KEY (id_insumo) REFERENCES inventario(id_insumo),
    CONSTRAINT consumo_insumo_id_responsable_fkey
        FOREIGN KEY (id_responsable) REFERENCES trabajadores(id_trabajador),
    CONSTRAINT fk_consumo_insumo_actividad
        FOREIGN KEY (id_actividad) REFERENCES actividades(id_registro) ON DELETE SET NULL
);

CREATE TABLE solicitud (
    id_solicitud INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    titulo VARCHAR(50) NOT NULL,
    motivo VARCHAR(200) NOT NULL,
    id_tipo_insumo INTEGER NOT NULL,
    cantidad INTEGER NOT NULL,
    especie_destino VARCHAR(30),
    unidad_medida VARCHAR(20),
    proveedor VARCHAR(30),
    fecha_vencimiento DATE,
    read BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) NOT NULL DEFAULT 'pendiente',
    tipo_solicitud VARCHAR(50) NOT NULL DEFAULT 'request',
    CONSTRAINT solicitud_id_tipo_insumo_fkey
        FOREIGN KEY (id_tipo_insumo) REFERENCES tipo_insumo(id_tipo)
);

CREATE TABLE pago (
    id_pago INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_actividad INTEGER,
    CONSTRAINT pago_id_actividad_fkey
        FOREIGN KEY (id_actividad) REFERENCES actividades(id_registro)
);

-- =====================================================
-- DATA BASE / CATALOGS
-- =====================================================

INSERT INTO tipo_insumo (id_tipo, nombre) OVERRIDING SYSTEM VALUE VALUES
(1, 'Herramienta'),
(2, 'Alimento'),
(3, 'Fertilizante');

INSERT INTO estado_pago (id_estado_pago, nombre) OVERRIDING SYSTEM VALUE VALUES
(1, 'Pendiente'),
(2, 'Pagado'),
(3, 'Cancelado');

INSERT INTO tipo_documento (id_tipo, nombre) OVERRIDING SYSTEM VALUE VALUES
(1, 'CC'),
(2, 'Cédula de extranjería'),
(3, 'Pasaporte');

INSERT INTO roles (id_rol, nombre) OVERRIDING SYSTEM VALUE VALUES
(1, 'Administrador'),
(2, 'Dueño');

INSERT INTO tipo_trabajador (id_tipo, nombre) OVERRIDING SYSTEM VALUE VALUES
(1, 'Operario'),
(2, 'Veterinario'),
(3, 'Administrador de campo');

INSERT INTO tipo_ganado (id_tipo, nombre) OVERRIDING SYSTEM VALUE VALUES
(1, 'Bovino'),
(2, 'Lechero'),
(3, 'Doble propósito');

INSERT INTO tipo_origen (id_tipo, nombre) OVERRIDING SYSTEM VALUE VALUES
(1, 'Nacimiento en finca'),
(2, 'Compra'),
(3, 'Traslado');

INSERT INTO estado_animal (id_estado, nombre) OVERRIDING SYSTEM VALUE VALUES
(1, 'Activo'),
(2, 'En tratamiento'),
(3, 'Vendido');

INSERT INTO estado_actividades (id_estado, nombre) OVERRIDING SYSTEM VALUE VALUES
(1, 'activa'),
(2, 'completada'),
(3, 'cancelada');

-- =====================================================
-- USERS FOR LOGIN
-- =====================================================

INSERT INTO usuarios (
    id_usuario,
    nombre_completo,
    edad,
    id_tipo_documento,
    numero_documento,
    celular,
    url_img,
    correo,
    contrasena,
    id_rol,
    estado
) OVERRIDING SYSTEM VALUE VALUES
(
    1,
    'Admin Base',
    30,
    1,
    '1000000001',
    '3000000001',
    NULL,
    'admin@demo.com',
    '12345678',
    2,
    TRUE
),
(
    2,
    'Stiven Smith',
    45,
    1,
    '1000000002',
    '3000000002',
    NULL,
    'superadmin@gmail.com',
    '12345678',
    1,
    TRUE
);

-- =====================================================
-- BASE WORKERS
-- =====================================================

INSERT INTO trabajadores (
    id_trabajador,
    nombre_completo,
    url_img,
    id_tipo_documento,
    numero_documento,
    celular,
    id_tipo_trabajador,
    direccion,
    observaciones,
    fecha_registro,
    estado,
    edad
) OVERRIDING SYSTEM VALUE VALUES
(
    1,
    'Juan Camilo Pérez',
    NULL,
    1,
    '1032456789',
    '3001234567',
    1,
    'Vereda El Progreso',
    'Operario base del sistema',
    CURRENT_TIMESTAMP,
    TRUE,
    28
),
(
    2,
    'María Fernanda López',
    NULL,
    1,
    '1022334455',
    '3019876543',
    2,
    'Finca La Esperanza',
    'Veterinaria base del sistema',
    CURRENT_TIMESTAMP,
    TRUE,
    31
),
(
    3,
    'Carlos Andrés Rojas',
    NULL,
    1,
    '1098765432',
    '3024567890',
    3,
    'Sector Rural Norte',
    'Administrador de campo base del sistema',
    CURRENT_TIMESTAMP,
    TRUE,
    35
);

-- =====================================================
-- MINIMUM SYSTEM DATA
-- =====================================================

INSERT INTO inventario (
    id_insumo,
    id_tipo,
    nombre,
    marca,
    cantidad,
    fecha_registro,
    fecha_vencimiento,
    unidad_medida,
    proveedor,
    precio_unitario,
    observaciones,
    url_img
) OVERRIDING SYSTEM VALUE VALUES
(
    1,
    2,
    'Concentrado bovino',
    'NutriCampo',
    25,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP + INTERVAL '90 days',
    'bultos',
    'Proveedor Base',
    85000,
    'Inventario inicial',
    NULL
),
(
    2,
    1,
    'Pala',
    'Truper',
    8,
    CURRENT_TIMESTAMP,
    NULL,
    'unidad',
    'FerreAgro',
    45000,
    'Herramienta inicial',
    NULL
),
(
    3,
    3,
    'Fertilizante NPK',
    'AgroFert',
    15,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP + INTERVAL '180 days',
    'sacos',
    'Agroinsumos del Norte',
    120000,
    'Fertilizante inicial',
    NULL
);

INSERT INTO solicitud (
    id_solicitud,
    fecha_registro,
    titulo,
    motivo,
    id_tipo_insumo,
    cantidad,
    especie_destino,
    unidad_medida,
    proveedor,
    fecha_vencimiento,
    read,
    status,
    tipo_solicitud
) OVERRIDING SYSTEM VALUE VALUES
(
    1,
    CURRENT_TIMESTAMP,
    'Compra inicial de alimento',
    'Solicitud base para pruebas del módulo',
    2,
    10,
    'ganado',
    'bultos',
    'Proveedor Base',
    CURRENT_DATE + INTERVAL '60 days',
    FALSE,
    'pendiente',
    'request'
);

INSERT INTO actividades (
    id_registro,
    url_evidencia,
    fecha_inicio,
    fecha_fin,
    duracion,
    id_trabajador,
    id_estado,
    monto,
    observaciones,
    actividad
) OVERRIDING SYSTEM VALUE VALUES
(
    1,
    NULL,
    CURRENT_TIMESTAMP,
    NULL,
    '2 horas',
    1,
    1,
    50000.00,
    'Actividad inicial para pruebas',
    'Revisión general'
);

INSERT INTO consumo_insumo (
    id_consumo,
    cantidad,
    id_responsable,
    fecha_registro,
    id_insumo,
    id_actividad
) OVERRIDING SYSTEM VALUE VALUES
(
    1,
    2,
    1,
    CURRENT_TIMESTAMP,
    1,
    1
);

INSERT INTO pago (
    id_pago,
    fecha_pago,
    id_actividad
) OVERRIDING SYSTEM VALUE VALUES
(
    1,
    CURRENT_TIMESTAMP,
    1
);

-- =====================================================
-- SEQUENCES
-- =====================================================

SELECT setval('tipo_insumo_id_tipo_seq', (SELECT MAX(id_tipo) FROM tipo_insumo), true);
SELECT setval('estado_pago_id_estado_pago_seq', (SELECT MAX(id_estado_pago) FROM estado_pago), true);
SELECT setval('tipo_documento_id_tipo_seq', (SELECT MAX(id_tipo) FROM tipo_documento), true);
SELECT setval('roles_id_rol_seq', (SELECT MAX(id_rol) FROM roles), true);
SELECT setval('tipo_trabajador_id_tipo_seq', (SELECT MAX(id_tipo) FROM tipo_trabajador), true);
SELECT setval('tipo_ganado_id_tipo_seq', (SELECT MAX(id_tipo) FROM tipo_ganado), true);
SELECT setval('tipo_origen_id_tipo_seq', (SELECT MAX(id_tipo) FROM tipo_origen), true);
SELECT setval('estado_animal_id_estado_seq', (SELECT MAX(id_estado) FROM estado_animal), true);
SELECT setval('estado_actividades_id_estado_seq', (SELECT MAX(id_estado) FROM estado_actividades), true);
SELECT setval('usuarios_id_usuario_seq', (SELECT MAX(id_usuario) FROM usuarios), true);
SELECT setval('trabajadores_id_trabajador_seq', (SELECT MAX(id_trabajador) FROM trabajadores), true);
SELECT setval('inventario_id_insumo_seq', (SELECT MAX(id_insumo) FROM inventario), true);
SELECT setval('actividades_id_registro_seq', (SELECT MAX(id_registro) FROM actividades), true);
SELECT setval('consumo_insumo_id_consumo_seq', (SELECT MAX(id_consumo) FROM consumo_insumo), true);
SELECT setval('solicitud_id_solicitud_seq', (SELECT MAX(id_solicitud) FROM solicitud), true);
SELECT setval('pago_id_pago_seq', (SELECT MAX(id_pago) FROM pago), true);

COMMIT;
