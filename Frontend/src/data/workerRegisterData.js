export const workerInputFields = [
  {
    name: "nombre_completo",
    label: "Nombre completo *",
    placeholder: "Ej. pepito perez",
  },
  {
    name: "edad",
    label: "Edad *",
    placeholder: "Ej. 20",
    type: "number",
  },
  {
    name: "id_tipo_documento",
    label: "Tipo de documento",
    placeholder: "Selecciona un tipo",
    select: {
      options: [
        { label: "Cédula de ciudadanía", value: 1 }, 
        { label: "Pasaporte", value: 2 },
      ],
    },
  },
  {
    name: "numero_documento",
    label: "Numero de documento *",
    placeholder: "Ej. 1023...",
    type: "text", 
  },
  {
    name: "estado",
    label: "Estado",
    placeholder: "Selecciona un estado",
    select: {
      options: [
        { label: "Activo", value: true },
        { label: "Inhabilitado", value: false },
      ],
    },
  },
  {
    name: "rol",
    label: "Rol *",
    placeholder: "Ej. Operario de campo",
    type: "text",
  },
  {
    name: "celular",
    label: "Numero de celular *",
    placeholder: "Ej. 313821...",
    type: "number", 
  },
  {
    name: "direccion",
    label: "Direccion *",
    placeholder: "Ej. finca tres esquinas",
    type:"text",
  },
];
