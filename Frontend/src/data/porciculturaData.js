export const porciculturaData = [
  {
    id: "por-01",
    name: "Lola",
    tag: "P-1204",
    breed: "Landrace",
    status: "sano",
    statusLabel: "Sano",
    weight: 110,
    stage: "Engorde",
    lastCheck: "09-10-25",
    avatar:
      "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=200&auto=format&fit=crop&q=60",
  },
  {
    id: "por-02",
    name: "Manchas",
    tag: "P-1311",
    breed: "Yorkshire",
    status: "observacion",
    statusLabel: "Observacion",
    weight: 95,
    stage: "Crecimiento",
    lastCheck: "08-10-25",
    avatar: "https://i.blogs.es/b97a24/cerdo-20duroc/450_1000.jpg",
  },
  {
    id: "por-03",
    name: "Roco",
    tag: "P-1408",
    breed: "Duroc",
    status: "sano",
    statusLabel: "Sano",
    weight: 130,
    stage: "Reproductor",
    lastCheck: "07-10-25",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShN-M5tcX5Uo8cM8gqAO3cLh1n8zzsXmYBLA&s",
  },
  {
    id: "por-04",
    name: "Nube",
    tag: "P-1520",
    breed: "Pietrain",
    status: "tratamiento",
    statusLabel: "Tratamiento",
    weight: 102,
    stage: "Engorde",
    lastCheck: "06-10-25",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzTvZbby3xyKpX6Q33EtWoHTaLOSyZdj9Vpg&s",
  },
  {
    id: "por-05",
    name: "Canela",
    tag: "P-1607",
    breed: "Hampshire",
    status: "sano",
    statusLabel: "Sano",
    weight: 88,
    stage: "Crecimiento",
    lastCheck: "09-10-25",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcOLkPffrmAlr52c_p-b4xcNmtoLz5pc-joQ&s",
  },
];

export const porciculturaInputFields = [
  {
    name: "name",
    label: "Nombre *",
    placeholder: "Ej. Lola",
  },
  {
    name: "tag",
    label: "Identificacion *",
    placeholder: "Ej. P-1204",
  },
  {
    name: "breed",
    label: "Raza *",
    placeholder: "Ej. Landrace",
  },
  {
    name: "status",
    label: "Estado",
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
    name: "weight",
    label: "Peso (kg) *",
    placeholder: "Ej. 110",
    type: "number",
  },
  {
    name: "stage",
    label: "Etapa",
    placeholder: "Selecciona una etapa",
    select: {
      options: [
        { label: "Crecimiento", value: "Crecimiento" },
        { label: "Engorde", value: "Engorde" },
        { label: "Reproductor", value: "Reproductor" },
      ],
    },
  },
  {
    name: "lastCheck",
    label: "Ultimo control",
    placeholder: "DD-MM-AA",
  },
];

export const porciculturaFieldValidations = {
  name: {
    pattern: /^[A-Za-z\s]{2,}$/,
    message: "Solo letras y espacios (min 2 caracteres)",
  },
  tag: {
    pattern: /^[A-Za-z0-9-]{2,12}$/,
    message: "Usa letras, numeros o guion (2-12)",
  },
  breed: {
    pattern: /^[A-Za-z\s]{3,}$/,
    message: "Solo letras y espacios (min 3)",
  },
  weight: {
    pattern: /^\d{1,4}$/,
    message: "Ingresa un peso valido",
  },
  stage: {
    pattern: /^[A-Za-z\s]{3,}$/,
    message: "Selecciona una etapa valida",
  },
  lastCheck: {
    pattern: /^(?:\d{4}-\d{2}-\d{2}|\d{2}[/-]\d{2}[/-]\d{2,4})$/,
    message: "Formato esperado DD-MM-AA",
  },
};
