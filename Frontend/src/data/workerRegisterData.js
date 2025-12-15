export const workerInputFields = [
  { name: "name", label: "Nombre completo *", placeholder: "Ej. pepito perez" },
  { name: "age", label: "Edad *", placeholder: "Ej. 20", type: "number" },
  {
    name: "type_dni",
    label: "Tipo de cedula",
    placeholder: "Selecciona un tipo",
    select: {
      options: [
        { label: "cedula de ciudania", value: "cc" },
        { label: "pasaporte", value: "pasaporte " },
      ],
    },
  },
  {
    name: "dni",
    label: "Numero de cedula *",
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
    name: "address",
    label: "Direccion *",
    placeholder: "Ej. finca tres esquinas",
  },
  {
    name: "phonefamily",
    label: "numero familiar",
    placeholder: "DD-MM-AA",
    type: "number",
  },
];

export const workerFieldValidations = {
  name: {
    pattern: /^[A-Za-z\s]{3,}$/,
    message: "Solo letras y espacios (min 3 caracteres)",
  },
  age: { pattern: /^(?:[1-9]\d{0,2})$/, message: "Ingresa una edad valida" },
  phone: { pattern: /^\d{10}$/, message: "Ingresa exactamente 10 digitos" },
  phonefamily: {
    pattern: /^\d{10}$/,
    message: "Telefono familiar de 10 digitos",
  },
  address: {
    pattern: /^(?=.*\S).{4,}$/,
    message: "Ingresa minimo 4 caracteres",
  },
  dni: { pattern: /^\d{6,12}$/, message: "Entre 6 y 12 numeros" },
};
