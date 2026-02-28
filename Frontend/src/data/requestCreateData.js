export const requestCreateInputFields = [
  {
    name: "requestType",
    label: "Tipo de insumo *",
    placeholder: "Selecciona un tipo",
    select: {
      options: [
        { label: "Fertilizante", value: "fertilizante" },
        { label: "Herramienta", value: "herramienta" },
        { label: "Alimento", value: "alimento" },
        { label: "Medicina", value: "medicina" },
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

export const requestCreateFieldValidations = {
  title: {
    pattern: /^.{3,}$/,
    message: "Minimo 3 caracteres",
  },
  reason: {
    pattern: /^.{8,}$/,
    message: "Minimo 8 caracteres",
  },
  requestType: {
    pattern: /^(fertilizante|herramienta|alimento|medicina)$/,
    message: "Selecciona un tipo valido",
  },
  quantity: {
    pattern: /^(?:[1-9]\d{0,3})$/,
    message: "Ingresa una cantidad valida",
  },
  targetSpecies: {
    pattern: /^(cerdos|peces|ganado|gallinas|ninguna)$/,
    message: "Selecciona una especie valida",
  },
  unit: {
    pattern: /^(kg|litros|sacos|unidad)$/,
    message: "Selecciona una unidad valida",
  },
  provider: {
    pattern: /^.{3,}$/,
    message: "Minimo 3 caracteres",
  },
  expirationDate: {
    pattern: /^(?:\d{4}-\d{2}-\d{2})?$/,
    message: "Usa el formato AAAA-MM-DD",
  },
};

export const requestCreateRequiredFields = [
  "title",
  "reason",
  "requestType",
  "quantity",
  "targetSpecies",
  "unit",
  "provider",
];
