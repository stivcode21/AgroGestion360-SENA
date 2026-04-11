export const cattleInputFields = [
  {
    name: "nombre",
    label: "Nombre *",
    placeholder: "Ej. Luna",
  },
  {
    name: "tipo",
    label: "Tipo",
    placeholder: "Selecciona un tipo",
    select: {
      options: [
        { label: "Vaca", value: "vaca" },
        { label: "Novillo", value: "novillo" },
        { label: "Ternera", value: "ternera" },
        { label: "Toro", value: "toro" },
      ],
    },
  },
  {
    name: "raza",
    label: "Raza *",
    placeholder: "Ej. Holstein",
  },
  {
    name: "fecha_nacimiento",
    label: "Fecha de nacimiento",
    placeholder: "DD-MM-AA",
    type: "date",
  },
  {
    name: "peso_inicial",
    label: "Peso (kg) *",
    placeholder: "Ej. 480",
    type: "number",
  },
  {
    name: "vendido",
    label: "estado",
    select: {
      options: [
        { label: "Vendido", value: true },
        { label: "Disponible", value: false },
      ],
    },
  },

  {
    name: "estado_salud",
    label: "Estado de salud",
    placeholder: "Selecciona un estado",
    select: {
      options: [
        { label: "Sano", value: "sano" },
        { label: "Tratamiento", value: "tratamiento" },
        { label: "Observacion", value: "observacion" },
      ],
    },
  },

  {
    name: "origen_ciudad",
    label: "Ciudad de origen *",
    placeholder: "Ej. Medellín",
    type: "text",
  },
];
