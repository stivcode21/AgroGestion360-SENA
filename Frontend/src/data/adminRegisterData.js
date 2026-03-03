export const adminInputFields = [
  {
    name: "username",
    label: "Username *",
    placeholder: "Ej. juan_admin43",
  },
  {
    name: "name",
    label: "Nombre completo *",
    placeholder: "Ej. Juan Perez",
  },
  { name: "age", label: "Edad *", placeholder: "Ej. 30", type: "number" },
  {
    name: "docType",
    label: "Tipo de documento *",
    placeholder: "Selecciona un tipo",
    select: {
      options: [
        { label: "Cedula de ciudadania", value: "cc" },
        { label: "Cedula de extranjeria", value: "ce" },
        { label: "Pasaporte", value: "pasaporte" },
      ],
    },
  },
  {
    name: "document",
    label: "Numero de documento *",
    placeholder: "Ej. 1023...",
    type: "number",
  },
  {
    name: "role",
    label: "Rol *",
    placeholder: "Ej. Administrador",
  },
  {
    name: "phone",
    label: "Numero de celular *",
    placeholder: "Ej. 313821...",
    type: "number",
  },
  {
    name: "email",
    label: "Correo electronico *",
    placeholder: "Ej. admin@agrogestion.com",
    type: "email",
  },
];

export const adminFieldValidations = {
  username: {
    pattern: /^[A-Za-z0-9_]{3,}$/,
    message: "Usa letras, numeros o guion bajo (min 3)",
  },
  name: {
    pattern: /^[A-Za-z\s]{3,}$/,
    message: "Solo letras y espacios (min 3 caracteres)",
  },
  age: {
    pattern: /^(?:1[89]|[2-9]\d)$/,
    message: "Ingresa una edad valida (18-99)",
  },
  document: {
    pattern: /^\d{6,12}$/,
    message: "Entre 6 y 12 numeros",
  },
  role: {
    pattern: /^.{3,}$/,
    message: "Ingresa minimo 3 caracteres",
  },
  phone: {
    pattern: /^\d{10}$/,
    message: "Ingresa exactamente 10 digitos",
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Correo electronico invalido",
  },
};
