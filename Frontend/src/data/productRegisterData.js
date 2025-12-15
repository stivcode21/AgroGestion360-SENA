export const productInputFields = [
  { name: "name", label: "Nombre *", placeholder: "Ej. Fumigador mochila" },
  { name: "brand", label: "Marca *", placeholder: "Ej. Truper" },
  { name: "type", label: "Tipo *", placeholder: "Selecciona un tipo" },
  { name: "quantity", label: "Cantidad *", placeholder: "Ej. 10", type: "number" },
  { name: "unit", label: "Unidad de medida *", placeholder: "Ej. 20L" },
  { name: "price", label: "Precio unitario *", placeholder: "Ej. 120000", type: "number" },
  { name: "expiration", label: "Fecha vencimiento", placeholder: "DD-MM-AA" },
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
  type: {
    pattern: /^[A-Za-z\s]{3,}$/,
    message: "Solo letras y espacios (min 3)",
  },
  quantity: {
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
    pattern: /^(?:\d{4}-\d{2}-\d{2}|\d{2}[/-]\d{2}[/-]\d{2,4})$/,
    message: "Formato esperado DD-MM-AA",
  },
  supplier: {
    pattern: /^.{3,}$/,
    message: "Minimo 3 caracteres",
  },
};
