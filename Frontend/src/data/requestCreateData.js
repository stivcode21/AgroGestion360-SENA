export const requestCreateInputFields = [
  {
    name: "requestType",
    label: "Tipo de insumo *",
    placeholder: "Selecciona un tipo",
    select: {
      endpoint: "product/getTipoInsumo",
    },
  },
  {
    name: "quantity",
    label: "Cantidad *",
    placeholder: "Ej. 10",
    type: "number",
  },
  {
    name: "unit",
    label: "Unidad de medida *",
    placeholder: "Selecciona una unidad",
    select: {
      options: [
        { label: "Kg", value: "kg" },
        { label: "Litros", value: "litros" },
        { label: "Sacos", value: "sacos" },
        { label: "Unidad", value: "unidad" },
      ],
    },
  },
  {
    name: "provider",
    label: "Proveedor *",
    placeholder: "Ej. Agroinsumos del Norte",
  },
  {
    name: "expirationDate",
    label: "Fecha de vencimiento",
    placeholder: "AAAA-MM-DD",
    type: "date",
  },
];
