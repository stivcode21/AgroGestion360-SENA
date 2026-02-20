CREATE DATABASE ganaderia_db;
USE ganaderia_db;

CREATE TABLE categoria (
    id_categoria INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(45) NOT NULL
);

CREATE TABLE estados_actividades (
    id_estado INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(45) NOT NULL
);

CREATE TABLE estado_pago (
    id_estado_pago INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE roles (
    id_rol INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(45) NOT NULL
);

CREATE TABLE tipo_trabajador (
    id_tipo INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE tipo_animal (
    id_tip_animal INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(60) NOT NULL
);

CREATE TABLE vacuna (
    id_vacuna INT PRIMARY KEY AUTO_INCREMENT,
    tipo_vacuna VARCHAR(45) NOT NULL
);

CREATE TABLE tipo_reporte (
    id_tipo_reporte INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(45) NOT NULL
);

CREATE TABLE usuarios (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    url_img VARCHAR(255),
    usuario VARCHAR(45) NOT NULL,
    contrasena VARCHAR(45) NOT NULL,
    id_rol INT,
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
);

CREATE TABLE trabajadores (
    id_trabajador INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    celular INT,
    estado INT,
    id_tipo INT,
    FOREIGN KEY (id_tipo) REFERENCES tipo_trabajador(id_tipo)
);

CREATE TABLE recursos (
    id_recurso INT PRIMARY KEY AUTO_INCREMENT,
    tipo VARCHAR(45) NOT NULL,
    nombre VARCHAR(45) NOT NULL,
    cantidad INT,
    fecha_registro DATETIME,
    unidad_medida VARCHAR(45),
    precio_unitario INT,
    descripcion VARCHAR(100)
);

CREATE TABLE animales (
    id_animal INT PRIMARY KEY AUTO_INCREMENT,
    raza VARCHAR(45),
    fecha_nacimiento DATETIME,
    fecha_ingreso DATETIME,
    tipo_origen VARCHAR(45),
    peso_inicial VARCHAR(45),
    peso_actual VARCHAR(45),
    estado VARCHAR(45),
    observaciones VARCHAR(255),
    id_tip_animal INT,
    FOREIGN KEY (id_tip_animal) REFERENCES tipo_animal(id_tip_animal)
);  

CREATE TABLE ventas_animales (
    id_venta INT PRIMARY KEY AUTO_INCREMENT,
    comprador VARCHAR(45),
    fecha DATETIME,
    monto_total INT,
    observaciones VARCHAR(45),
    id_animal INT,
    FOREIGN KEY (id_animal) REFERENCES animales(id_animal)
);

CREATE TABLE consumo_insumo (
    id_egreso INT PRIMARY KEY AUTO_INCREMENT,
    descripcion VARCHAR(100),
    cantidad INT,
    fecha_registro DATETIME,
    id_recurso INT,
    FOREIGN KEY (id_recurso) REFERENCES recursos(id_recurso)
);

CREATE TABLE reportes (
    id_reportes INT PRIMARY KEY AUTO_INCREMENT,
    fecha DATETIME,
    descripcion VARCHAR(45),
    id_tipo_reporte INT,
    FOREIGN KEY (id_tipo_reporte) REFERENCES tipo_reporte(id_tipo_reporte)
);

CREATE TABLE actividades (
    id_registro INT PRIMARY KEY AUTO_INCREMENT,
    url_evidencia VARCHAR(50),
    monto DOUBLE,
    descripcion TEXT,
    fecha_inicio DATETIME,
    fecha_fin DATETIME,
    fecha_creacion DATETIME,
    observacion VARCHAR(100),
    categoria_id_categoria INT,
    estados_id_estado INT,
    FOREIGN KEY (categoria_id_categoria) REFERENCES categoria(id_categoria),
    FOREIGN KEY (estados_id_estado) REFERENCES estados_actividades(id_estado)
);

CREATE TABLE actividades_has_trabajador (
    actividades_id_registro INT,
    trabajadores_id_trabajador INT,
    detalle_pago INT,
    PRIMARY KEY (actividades_id_registro, trabajadores_id_trabajador),
    FOREIGN KEY (actividades_id_registro) REFERENCES actividades(id_registro),
    FOREIGN KEY (trabajadores_id_trabajador) REFERENCES trabajadores(id_trabajador)
);

CREATE TABLE detalle_pago (
    id_pago INT,
    actividades_has_trabajador_id_act_trab INT,
    PRIMARY KEY (id_pago, actividades_has_trabajador_id_act_trab)
);

CREATE TABLE Pago (
    id_pago INT PRIMARY KEY AUTO_INCREMENT,
    fecha_pago DATETIME,
    concepto VARCHAR(45),
    monto DOUBLE,
    estado_pago_id_estado_pago INT,
    FOREIGN KEY (estado_pago_id_estado_pago) REFERENCES estado_pago(id_estado_pago)
);

CREATE TABLE animales_has_vacuna (
    animales_id_animal INT,
    fecha_aplicacion DATETIME,
    dosis_aplicada VARCHAR(45),
    responsable_aplicacion VARCHAR(45),
    estado_vacunacion VARCHAR(45),
    observacion VARCHAR(45),
    vacuna_id_vacuna INT,
    PRIMARY KEY (animales_id_animal, vacuna_id_vacuna),
    FOREIGN KEY (animales_id_animal) REFERENCES animales(id_animal),
    FOREIGN KEY (vacuna_id_vacuna) REFERENCES vacuna(id_vacuna)
);
