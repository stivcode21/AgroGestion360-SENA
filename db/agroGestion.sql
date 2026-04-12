-- =====================================================
-- AGROGESTION360 - SCHEMA + SEED BASE
-- PostgreSQL
-- =====================================================

BEGIN;

-- =====================================================
-- DROP TABLES
-- =====================================================

DROP TABLE IF EXISTS consumo_insumo CASCADE;
DROP TABLE IF EXISTS ventas_animales CASCADE;
DROP TABLE IF EXISTS vacunas CASCADE;
DROP TABLE IF EXISTS actividades CASCADE;
DROP TABLE IF EXISTS solicitud CASCADE;
DROP TABLE IF EXISTS porcicultura CASCADE;
DROP TABLE IF EXISTS ganaderia CASCADE;
DROP TABLE IF EXISTS inventario CASCADE;
DROP TABLE IF EXISTS trabajadores CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS estado_actividades CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS tipo_documento CASCADE;
DROP TABLE IF EXISTS tipo_insumo CASCADE;

-- =====================================================
-- CATALOGS
-- =====================================================

CREATE TABLE tipo_insumo (
    id_tipo INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(60) NOT NULL UNIQUE
);

CREATE TABLE tipo_documento (
    id_tipo INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(60) NOT NULL UNIQUE
);

CREATE TABLE roles (
    id_rol INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(45) NOT NULL UNIQUE
);

CREATE TABLE estado_actividades (
    id_estado INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

-- =====================================================
-- USERS / AUTH
-- =====================================================

CREATE TABLE usuarios (
    id_usuario INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_completo VARCHAR(100) NOT NULL,
    edad INTEGER,
    id_tipo_documento INTEGER NOT NULL,
    numero_documento VARCHAR(20) NOT NULL UNIQUE,
    celular VARCHAR(20),
    url_img VARCHAR(500),
    correo VARCHAR(120) NOT NULL UNIQUE,
    contrasena VARCHAR(120) NOT NULL,
    id_rol INTEGER NOT NULL,
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT usuarios_tipo_documento_fkey
        FOREIGN KEY (id_tipo_documento) REFERENCES tipo_documento(id_tipo),
    CONSTRAINT usuarios_rol_fkey
        FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
);

-- =====================================================
-- WORKERS
-- =====================================================

CREATE TABLE trabajadores (
    id_trabajador INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_completo VARCHAR(100) NOT NULL,
    url_img VARCHAR(500),
    id_tipo_documento INTEGER NOT NULL,
    numero_documento VARCHAR(20) NOT NULL UNIQUE,
    celular VARCHAR(20),
    rol VARCHAR(60) NOT NULL,
    direccion VARCHAR(150),
    observaciones VARCHAR(250),
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    edad INTEGER,
    CONSTRAINT trabajadores_tipo_documento_fkey
        FOREIGN KEY (id_tipo_documento) REFERENCES tipo_documento(id_tipo)
);

-- =====================================================
-- INVENTORY
-- =====================================================

CREATE TABLE inventario (
    id_insumo INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_tipo INTEGER NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    url_img VARCHAR(500),
    marca VARCHAR(80),
    cantidad INTEGER NOT NULL,
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_vencimiento TIMESTAMP,
    unidad_medida VARCHAR(20),
    proveedor VARCHAR(100),
    precio_unitario NUMERIC(10,2) NOT NULL,
    observaciones VARCHAR(250),
    CONSTRAINT inventario_tipo_fkey
        FOREIGN KEY (id_tipo) REFERENCES tipo_insumo(id_tipo)
);

-- =====================================================
-- CATTLE
-- =====================================================

CREATE TABLE ganaderia (
    id_animal INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(60) NOT NULL,
    fecha_ingreso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado_salud VARCHAR(60) NOT NULL,
    origen_ciudad VARCHAR(100),
    fecha_nacimiento DATE,
    peso_inicial NUMERIC(10,2) NOT NULL,
    observaciones VARCHAR(250),
    url_img VARCHAR(500),
    raza VARCHAR(80),
    vendido BOOLEAN NOT NULL DEFAULT FALSE
);

-- Se conserva para el siguiente modulo aunque aun no tenga backend activo.
CREATE TABLE porcicultura (
    id_animal INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    fecha_ingreso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_nacimiento DATE,
    peso_inicial NUMERIC(10,2) NOT NULL,
    sexo VARCHAR(20) NOT NULL,
    estado_salud VARCHAR(60),
    observaciones VARCHAR(250),
    url_img VARCHAR(500),
    raza VARCHAR(80),
    vendido BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE vacunas (
    id_registro INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tipo_vacuna VARCHAR(80) NOT NULL,
    fecha_aplicacion TIMESTAMP,
    dosis VARCHAR(45) NOT NULL,
    responsable VARCHAR(100) NOT NULL,
    observaciones VARCHAR(250),
    id_animal INTEGER NOT NULL,
    CONSTRAINT vacunas_animal_fkey
        FOREIGN KEY (id_animal) REFERENCES ganaderia(id_animal) ON DELETE CASCADE
);

CREATE TABLE ventas_animales (
    id_venta INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_animal INTEGER NOT NULL,
    comprador VARCHAR(100) NOT NULL,
    fecha_venta TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    monto_total NUMERIC(10,2) NOT NULL,
    observaciones VARCHAR(250),
    CONSTRAINT ventas_animales_animal_fkey
        FOREIGN KEY (id_animal) REFERENCES ganaderia(id_animal) ON DELETE CASCADE
);

-- =====================================================
-- ACTIVITIES
-- =====================================================

CREATE TABLE actividades (
    id_registro INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    url_evidencia VARCHAR(500),
    urlcomprobante VARCHAR(500),
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_inicio TIMESTAMP NOT NULL,
    fecha_fin TIMESTAMP,
    duracion VARCHAR(30),
    monto NUMERIC(10,2) NOT NULL,
    observaciones VARCHAR(250),
    actividad VARCHAR(120) NOT NULL,
    id_trabajador INTEGER NOT NULL,
    id_estado INTEGER NOT NULL,
    CONSTRAINT actividades_trabajador_fkey
        FOREIGN KEY (id_trabajador) REFERENCES trabajadores(id_trabajador),
    CONSTRAINT actividades_estado_fkey
        FOREIGN KEY (id_estado) REFERENCES estado_actividades(id_estado)
);

CREATE TABLE consumo_insumo (
    id_consumo INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cantidad INTEGER NOT NULL,
    id_responsable INTEGER NOT NULL,
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_insumo INTEGER NOT NULL,
    id_actividad INTEGER NOT NULL,
    CONSTRAINT consumo_insumo_insumo_fkey
        FOREIGN KEY (id_insumo) REFERENCES inventario(id_insumo),
    CONSTRAINT consumo_insumo_responsable_fkey
        FOREIGN KEY (id_responsable) REFERENCES trabajadores(id_trabajador),
    CONSTRAINT consumo_insumo_actividad_fkey
        FOREIGN KEY (id_actividad) REFERENCES actividades(id_registro) ON DELETE CASCADE
);

-- =====================================================
-- REQUESTS / NOTIFICATIONS
-- =====================================================

CREATE TABLE solicitud (
    id_solicitud INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    titulo VARCHAR(80) NOT NULL,
    motivo VARCHAR(250) NOT NULL,
    id_tipo_insumo INTEGER NOT NULL,
    cantidad INTEGER NOT NULL,
    especie_destino VARCHAR(30),
    unidad_medida VARCHAR(20),
    proveedor VARCHAR(100),
    fecha_vencimiento DATE,
    read BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(50) NOT NULL DEFAULT 'pendiente',
    tipo_solicitud VARCHAR(50) NOT NULL DEFAULT 'request',
    CONSTRAINT solicitud_tipo_insumo_fkey
        FOREIGN KEY (id_tipo_insumo) REFERENCES tipo_insumo(id_tipo)
);

-- =====================================================
-- CATALOG DATA
-- =====================================================

INSERT INTO tipo_insumo (nombre) VALUES
('Herramienta'),
('Alimento'),
('Fertilizante'),
('Medicamento'),
('Limpieza');

INSERT INTO tipo_documento (nombre) VALUES
('CC'),
('Cedula de extranjeria'),
('Pasaporte');

INSERT INTO roles (nombre) VALUES
('Dueno'),
('Administrador');

INSERT INTO estado_actividades (nombre) VALUES
('Activa'),
('Completada'),
('Cancelada');

-- =====================================================
-- BASE USERS FOR LOGIN
-- id_rol 1 = Dueno
-- id_rol 2 = Administrador
-- =====================================================

INSERT INTO usuarios (
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
) VALUES
(
    'Dueño',
    45,
    1,
    '1000000001',
    '3000000001',
    NULL,
    'superadmin@gmail.com',
    '12345678',
    1,
    TRUE
),
(
    'Admin Base',
    30,
    1,
    '1000000002',
    '3000000002',
    NULL,
    'admin@gmail.com',
    '12345678',
    2,
    TRUE
);

-- =====================================================
-- BASE WORKERS
-- =====================================================

INSERT INTO trabajadores (
    nombre_completo,
    url_img,
    id_tipo_documento,
    numero_documento,
    celular,
    rol,
    direccion,
    observaciones,
    fecha_registro,
    estado,
    edad
) VALUES
(
    'Juan Camilo',
    NULL,
    1,
    '1032456789',
    '3001234567',
    'Operario',
    'Vereda El Progreso',
    'Trabajador base del sistema.',
    CURRENT_TIMESTAMP,
    TRUE,
    28
),
(
    'Maria Fernanda Lopez',
    NULL,
    1,
    '1022334455',
    '3019876543',
    'Veterinaria',
    'Finca La Esperanza',
    'Veterinaria base del sistema.',
    CURRENT_TIMESTAMP,
    TRUE,
    31
),
(
    'Carlos Andres Rojas',
    NULL,
    1,
    '1098765432',
    '3024567890',
    'Administrador de campo',
    'Sector Rural Norte',
    'Administrador de campo base del sistema.',
    CURRENT_TIMESTAMP,
    TRUE,
    35
),
(
    'Carlos Perez',
    NULL,
    1,
    '1003456789',
    '3045567788',
    'Operario',
    'Vereda Santa Rosa',
    'Apoyo operativo.',
    CURRENT_TIMESTAMP,
    TRUE,
    27
),
(
    'juan eduardo albeiro',
    NULL,
    1,
    '1009876543',
    '3056677889',
    'Operario',
    'Finca El Roble',
    'Apoyo en labores generales.',
    CURRENT_TIMESTAMP,
    TRUE,
    24
);

-- =====================================================
-- BASE INVENTORY
-- Se deja un producto con stock bajo para probar alertas.
-- =====================================================

INSERT INTO inventario (
    id_tipo,
    nombre,
    url_img,
    marca,
    cantidad,
    fecha_registro,
    fecha_vencimiento,
    unidad_medida,
    proveedor,
    precio_unitario,
    observaciones
) VALUES
(
    2,
    'Concentrado bovino',
    NULL,
    'NutriCampo',
    25,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP + INTERVAL '90 days',
    'bultos',
    'Proveedor Base',
    85000.00,
    'Inventario inicial.'
),
(
    1,
    'Pala',
    NULL,
    'Truper',
    8,
    CURRENT_TIMESTAMP,
    NULL,
    'unidad',
    'FerreAgro',
    45000.00,
    'Herramienta inicial.'
),
(
    3,
    'Fertilizante NPK',
    NULL,
    'AgroFert',
    15,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP + INTERVAL '180 days',
    'sacos',
    'Agroinsumos del Norte',
    120000.00,
    'Fertilizante inicial.'
),
(
    4,
    'Vacuna bovina A',
    NULL,
    'AgroVet',
    2,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP + INTERVAL '120 days',
    'unidad',
    'VetDistribuciones',
    38000.00,
    'Producto con stock bajo para pruebas.'
);

-- =====================================================
-- BASE CATTLE
-- =====================================================

INSERT INTO ganaderia (
    nombre,
    tipo,
    fecha_ingreso,
    estado_salud,
    origen_ciudad,
    fecha_nacimiento,
    peso_inicial,
    observaciones,
    url_img,
    raza,
    vendido
) VALUES
(
    'Luna',
    'Lechero',
    '2026-03-01 08:00:00',
    'saludable',
    'Monteria',
    '2024-05-12',
    320.50,
    'Animal base para pruebas.',
    NULL,
    'Holstein',
    FALSE
),
(
    'Rayo',
    'Bovino',
    '2026-02-10 09:00:00',
    'estable',
    'Sincelejo',
    '2023-11-08',
    410.00,
    'Listo para control y seguimiento.',
    NULL,
    'Brahman',
    FALSE
),
(
    'Canela',
    'Doble proposito',
    '2026-01-15 07:30:00',
    'vendido',
    'Planeta Rica',
    '2023-07-20',
    365.40,
    'Animal vendido para pruebas del modulo.',
    NULL,
    'Gyr',
    TRUE
);

INSERT INTO vacunas (
    tipo_vacuna,
    fecha_aplicacion,
    dosis,
    responsable,
    observaciones,
    id_animal
) VALUES
(
    'Brucelosis',
    '2026-03-05 08:00:00',
    '5 ml',
    'Maria Fernanda Lopez',
    'Aplicacion sin novedad.',
    1
),
(
    'Fiebre aftosa',
    '2026-03-18 09:30:00',
    '3 ml',
    'Carlos Andres Rojas',
    'Seguimiento de rutina.',
    1
),
(
    'Vitaminizacion',
    '2026-02-15 10:15:00',
    '10 ml',
    'Juan Camilo',
    'Refuerzo preventivo.',
    2
);

INSERT INTO ventas_animales (
    id_animal,
    comprador,
    fecha_venta,
    monto_total,
    observaciones
) VALUES
(
    3,
    'Ganados del Caribe SAS',
    '2026-04-02 14:00:00',
    2850000.00,
    'Venta de prueba para reportes.'
);

-- =====================================================
-- BASE ACTIVITIES
-- Incluye estados mezclados para dashboard, details y top workers.
-- fecha_creacion se usa en las estadisticas del dashboard.
-- =====================================================

INSERT INTO actividades (
    url_evidencia,
    urlcomprobante,
    fecha_creacion,
    fecha_inicio,
    fecha_fin,
    duracion,
    monto,
    observaciones,
    actividad,
    id_trabajador,
    id_estado
) VALUES
(
    NULL,
    NULL,
    '2026-04-06 08:00:00',
    '2026-04-06 08:00:00',
    '2026-04-06 10:00:00',
    '2 horas',
    50000.00,
    'Revision general de inicio de semana.',
    'Revision general',
    1,
    2
),
(
    NULL,
    NULL,
    '2026-04-07 07:30:00',
    '2026-04-07 07:30:00',
    '2026-04-07 09:00:00',
    '1.5 horas',
    40000.00,
    'Aplicacion de tratamiento preventivo.',
    'Control sanitario',
    2,
    2
),
(
    NULL,
    NULL,
    '2026-04-08 09:00:00',
    '2026-04-08 09:00:00',
    '2026-04-08 11:00:00',
    '2 horas',
    35000.00,
    'Limpieza de corral principal.',
    'Limpieza de corral',
    3,
    2
),
(
    NULL,
    NULL,
    '2026-04-09 06:30:00',
    '2026-04-09 06:30:00',
    '2026-04-09 08:30:00',
    '2 horas',
    28000.00,
    'Control de bebederos.',
    'Mantenimiento de bebederos',
    4,
    2
),
(
    NULL,
    NULL,
    '2026-04-10 07:00:00',
    '2026-04-10 07:00:00',
    '2026-04-10 10:00:00',
    '3 horas',
    77000.00,
    'Vacunacion general.',
    'Jornada de vacunacion',
    2,
    2
),
(
    NULL,
    NULL,
    '2026-04-11 08:30:00',
    '2026-04-11 08:30:00',
    '2026-04-11 11:30:00',
    '3 horas',
    89000.00,
    'Inspeccion del lote de ganado.',
    'Inspeccion de lote',
    1,
    2
),
(
    NULL,
    NULL,
    '2026-04-12 08:00:00',
    '2026-04-12 08:00:00',
    '2026-04-12 10:00:00',
    '2 horas',
    60000.00,
    'Apoyo dominical de rutina.',
    'Ronda de seguimiento',
    5,
    2
),
(
    NULL,
    NULL,
    '2026-04-11 13:00:00',
    '2026-04-11 13:00:00',
    NULL,
    '2 horas',
    45000.00,
    'Actividad activa para pruebas.',
    'Revision de establo',
    3,
    1
);

INSERT INTO consumo_insumo (
    cantidad,
    id_responsable,
    fecha_registro,
    id_insumo,
    id_actividad
) VALUES
(
    2,
    1,
    '2026-04-06 09:00:00',
    1,
    1
),
(
    1,
    2,
    '2026-04-10 08:00:00',
    4,
    5
);

-- =====================================================
-- BASE REQUESTS
-- =====================================================

INSERT INTO solicitud (
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
) VALUES
(
    CURRENT_TIMESTAMP,
    'Compra inicial de alimento',
    'Solicitud base para pruebas del modulo de notificaciones.',
    2,
    10,
    NULL,
    'bultos',
    'Proveedor Base',
    CURRENT_DATE + INTERVAL '60 days',
    FALSE,
    'pendiente',
    'request'
),
(
    CURRENT_TIMESTAMP,
    'Reposicion de vacuna bovina',
    'Se requiere reponer el inventario por stock bajo.',
    4,
    12,
    NULL,
    'unidad',
    'VetDistribuciones',
    CURRENT_DATE + INTERVAL '120 days',
    FALSE,
    'aprobada',
    'request'
);

COMMIT;
