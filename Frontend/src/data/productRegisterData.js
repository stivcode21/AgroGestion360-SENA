export const productInputFields = [
  {
    name: "name",
    label: "Nombre *",
    placeholder: "Ej. Fumigador mochila",
    required: true,
  },
  {
    name: "brand",
    label: "Marca *",
    placeholder: "Ej. Truper",
    required: true,
  },
  {
    name: "type",
    label: "Tipo *",
    placeholder: "Selecciona un tipo",
    required: true,
    select: {
      options: [
        { label: "Herramienta", value: "1" },
        { label: "Alimento", value: "2" },
        { label: "Fertilizante", value: "3" },
      ],
    },
  },
  {
    name: "amount",
    label: "Cantidad *",
    placeholder: "Ej. 10",
    type: "number",
    required: true,
  },
  {
    name: "unit",
    label: "Unidad de medida *",
    placeholder: "Ej. 20L",
    required: true,
  },
  {
    name: "price",
    label: "Precio unitario *",
    placeholder: "Ej. 120000",
    type: "number",
    required: true,
  },
  {
    name: "expiration",
    type: "date",
    label: "Fecha vencimiento",
    placeholder: "DD-MM-AA",
  },
  { name: "supplier", label: "Proveedor", placeholder: "Ej. Agroinsumos S.A." },
];

export const productFieldValidations = {
  name: {
    pattern: /^[A-Za-z0-9\s]{3,}$/,
    message: "Minimo 3 caracteres",
  },
  brand: {
    pattern: /^[A-Za-z0-9\s]{2,}$/,
    message: "Minimo 2 caracteres",
  },
  amount: {
    pattern: /^(?:[1-9]\d{0,3})$/,
    message: "Ingresa una cantidad valida",
  },
  unit: {
    pattern: /^.{1,10}$/,
    message: "Hasta 10 caracteres",
  },
  price: {
    pattern: /^\d{1,9}$/,
    message: "Solo numeros (hasta 9 digitos)",
  },
  expiration: {
    pattern: /^\d{4}-\d{2}-\d{2}$/,
    message: "Formato esperado YYYY-MM-DD",
  },
  supplier: {
    pattern: /^.{3,}$/,
    message: "Minimo 3 caracteres",
  },
};
