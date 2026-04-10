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
      endpoint: "product/getTipoInsumo",
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
    placeholder: "Selecciona un tipo",
    required: true,
    select: {
      options: [
        { label: "Kg", value: "kg" },
        { label: "Unidad", value: "unidad" },
        { label: "Litros", value: "litros" },
        { label: "Metros", value: "metros" },
        { label: "Mililitro", value: "mililitro" },
      ],
    },
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
