export const adminInputFields = [
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
        { label: "Cedula de ciudadania", value: "1" },
        { label: "Cedula de extranjeria", value: "2" },
        { label: "Pasaporte", value: "3" },
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
  phone: {
    pattern: /^\d{10}$/,
    message: "Ingresa exactamente 10 digitos",
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Correo electronico invalido",
  },
};
