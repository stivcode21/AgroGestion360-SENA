CREATE DATABASE agro_db;
USE agro_db;

CREATE TABLE tipo_insumo (
    id_tipo INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(45) NOT NULL
);

CREATE TABLE estado_pago (
    id_estado_pago INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE tipo_documento (
    id_tipo INT PRIMARY KEY AUTO_INCREMENT,
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

CREATE TABLE tipo_ganado (
    id_tipo INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE tipo_origen (
    id_tipo INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE estado_animal (
    id_estado INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE estado_actividades (
    id_estado INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL
);

CREATE TABLE usuarios (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre_completo VARCHAR(50) NOT NULL,
    edad INT,
    id_tipo_documento INT NOT NULL,
    numero_documento VARCHAR(20) NOT NULL, 
    celular VARCHAR(20) NOT NULL,
    url_img VARCHAR(255),
    correo VARCHAR(45) NOT NULL,
    contrasena VARCHAR(50) NOT NULL,
    id_rol INT NOT NULL,
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol),
    FOREIGN KEY (id_tipo_documento) REFERENCES tipo_documento(id_tipo)
);

CREATE TABLE trabajadores (
    id_trabajador INT PRIMARY KEY AUTO_INCREMENT,
    nombre_completo VARCHAR(50) NOT NULL,
    url_img VARCHAR(300),
    id_tipo_documento INT NOT NULL,
    numero_documento VARCHAR(20) NOT NULL,
    celular VARCHAR(20) NOT NULL,
    id_tipo_trabajador INT NOT NULL,
    direccion VARCHAR(50),
    observaciones VARCHAR(200),
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_tipo_trabajador) REFERENCES tipo_trabajador(id_tipo),
    FOREIGN KEY (id_tipo_documento) REFERENCES tipo_documento(id_tipo)
);

CREATE TABLE inventario (
    id_insumo INT PRIMARY KEY AUTO_INCREMENT,
    id_tipo INT NOT NULL,
    url_img VARCHAR(300),
    nombre VARCHAR(50) NOT NULL,
    marca VARCHAR(50) ,
    cantidad INT NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_vencimiento DATETIME,
    unidad_medida VARCHAR(20),
    proveedor VARCHAR(45),
    precio_unitario INT NOT NULL,
    observaciones VARCHAR(250),
    FOREIGN KEY (id_tipo) REFERENCES tipo_insumo(id_tipo)
);

CREATE TABLE ganaderia (
    id_animal INT PRIMARY KEY AUTO_INCREMENT,
    url_img VARCHAR(300),
    fecha_ingreso DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_tipo INT NOT NULL,
    id_tipo_origen INT NOT NULL,
    fecha_nacimiento DATETIME,
    peso_inicial DECIMAL(10,2) NOT NULL,
    estado_salud VARCHAR(45),
    id_estado INT NOT NULL,
    observaciones VARCHAR(250),
    marcado BOOLEAN,
    FOREIGN KEY (id_tipo_origen) REFERENCES tipo_origen(id_tipo),
    FOREIGN KEY (id_tipo) REFERENCES tipo_ganado(id_tipo),
    FOREIGN KEY (id_estado) REFERENCES estado_animal(id_estado)
);  

CREATE TABLE porcicultura (
    id_animal INT PRIMARY KEY AUTO_INCREMENT,
    url_img VARCHAR(300),
    fecha_ingreso DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_nacimiento DATETIME,
    peso_inicial DECIMAL(10,2) NOT NULL,
    sexo VARCHAR(45) NOT NULL,
    estado_salud VARCHAR(45),
    id_estado INT NOT NULL,
    observaciones VARCHAR(250),
    FOREIGN KEY (id_estado) REFERENCES estado_animal(id_estado)
);  

CREATE TABLE vacunas (
    id_registro INT PRIMARY KEY AUTO_INCREMENT,
    tipo_vacuna VARCHAR(50),
    fecha_aplicacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    dosis VARCHAR(45) NOT NULL,
    responsable VARCHAR(60) NOT NULL,
    id_animal INT NOT NULL,
    tipo_animal VARCHAR(45),
    estado_vacunacion BOOLEAN DEFAULT FALSE,
    observaciones VARCHAR(250)
);

CREATE TABLE ventas_animales (
    id_venta INT PRIMARY KEY AUTO_INCREMENT,
    id_animal INT NOT NULL,
    tipo_animal VARCHAR(45),
    comprador VARCHAR(45),
    fecha_venta DATETIME DEFAULT CURRENT_TIMESTAMP,
    monto_total DECIMAL(10,2) NOT NULL,
    observaciones VARCHAR(250)
);

CREATE TABLE consumo_insumo (
    id_consumo  INT PRIMARY KEY AUTO_INCREMENT,
    actividad_asociada VARCHAR(50),
    cantidad INT NOT NULL,
    unidad_medida VARCHAR(20),
    id_responsable INT NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_insumo INT NOT NULL,
    FOREIGN KEY (id_insumo) REFERENCES inventario(id_insumo),
    FOREIGN KEY (id_responsable) REFERENCES trabajadores(id_trabajador)
);

CREATE TABLE actividades (
    id_registro INT PRIMARY KEY AUTO_INCREMENT,
    url_evidencia VARCHAR(250),
    fecha_inicio DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_fin DATETIME,
    duracion VARCHAR(30),
    id_trabajador INT NOT NULL,
    id_estado INT NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    observaciones VARCHAR(250),
    FOREIGN KEY (id_estado) REFERENCES estado_actividades(id_estado),
    FOREIGN KEY (id_trabajador) REFERENCES trabajadores(id_trabajador)
);

CREATE TABLE solicitud (
    id_solicitud INT PRIMARY KEY AUTO_INCREMENT,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    titulo VARCHAR(50) NOT NULL,
    motivo VARCHAR(100) NOT NULL,
    id_tipo_insumo INT NOT NULL,
    cantidad INT NOT NULL,
    especie_destino VARCHAR(30),
    unidad_medida VARCHAR(20),
    proveedor VARCHAR(30),
    fecha_vencimiento DATETIME,
    FOREIGN KEY (id_tipo_insumo) REFERENCES tipo_insumo(id_tipo)
);

CREATE TABLE Pago (
    id_pago INT PRIMARY KEY AUTO_INCREMENT,
    fecha_pago DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_actividad INT,
    FOREIGN KEY (id_actividad) REFERENCES actividades(id_registro)
);
