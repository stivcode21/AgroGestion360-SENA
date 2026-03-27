export const requestCreateInputFields = [
  {
    name: "requestType",
    label: "Tipo de insumo *",
    placeholder: "Selecciona un tipo",
    select: {
      options: [
        { label: "Fertilizante", value: "1" },
        { label: "Herramienta", value: "2" },
        { label: "Alimento", value: "3" },
      ],
    },
  },
  {
    name: "quantity",
    label: "Cantidad *",
    placeholder: "Ej. 10",
    type: "number",
  },
  {
    name: "targetSpecies",
    label: "Especie destino *",
    placeholder: "Selecciona una especie",
    select: {
      options: [
        { label: "Cerdos", value: "cerdos" },
        { label: "Peces", value: "peces" },
        { label: "Ganado", value: "ganado" },
        { label: "Gallinas", value: "gallinas" },
        { label: "Ninguna", value: "ninguna" },
      ],
    },
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
