export const settingsProfileInputFields = [
  {
    name: "name",
    label: "username *",
    placeholder: "Ej. Pepito_Perez32",
  },
  { name: "age", label: "Edad *", placeholder: "Ej. 28", type: "number" },
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
    type: "text",
  },
];

export const settingsAdminsInputFields = [
  {
    name: "name",
    label: "Nombre completo *",
    placeholder: "Ej. Pepito Perez",
  },
  { name: "age", label: "Edad *", placeholder: "Ej. 28", type: "number" },
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
    name: "status",
    label: "Estado",
    placeholder: "Selecciona un estado",
    select: {
      options: [
        { label: "Activo", value: "activo" },
        { label: "Inhabilitado", value: "inhabilitado" },
      ],
    },
  },
  {
    name: "role",
    label: "Rol *",
    placeholder: "Ej. Administrador",
    type: "text",
  },
  {
    name: "phone",
    label: "Numero de celular *",
    placeholder: "Ej. 313821...",
    type: "number",
  },
  {
    name: "familyPhone",
    label: "Numero familiar",
    placeholder: "Ej. 3001234567",
    type: "number",
  },
  {
    name: "email",
    label: "Correo electronico *",
    placeholder: "Ej. admin@agrogestion.com",
    type: "email",
  },
  {
    name: "address",
    label: "Direccion *",
    placeholder: "Ej. Finca Tres Esquinas",
  },
];

export const settingsProfileFieldValidations = {
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
  familyPhone: {
    pattern: /^\d{10}$/,
    message: "Telefono familiar de 10 digitos",
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Correo electronico invalido",
  },
  address: {
    pattern: /^(?=.*\S).{4,}$/,
    message: "Ingresa minimo 4 caracteres",
  },
};

export const settingsProfileInitialValues = {
  name: "Juan_Eduardo43",
  avatar:
    "https://i.pinimg.com/736x/70/32/3f/70323ffbb5122198b97cfa259c313678.jpg",
  age: "34",
  docType: "cc",
  document: "1060212231",
  status: "activo",
  role: "Dueño",
  phone: "3138211234",
  familyPhone: "3001234567",
  email: "juan.eduardo@agrogestion.com",
  address: "Finca Tres Esquinas",
  notes: "Perfil administrador principal del sistema.",
};
