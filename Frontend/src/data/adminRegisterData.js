export const adminInputFields = [
  {
    name: "name",
    label: "Nombre completo *",
    placeholder: "Ej. Juan Perez",
  },
  { name: "age", label: "Edad *", placeholder: "Ej. 30", type: "number" },
  {
    name: "docType",
    label: "Tipo de documento *",
    placeholder: "Selecciona un tipo",
    select: {
      options: [
        { label: "Cedula de ciudadania", value: "1" },
        { label: "Cedula de extranjeria", value: "2" },
        { label: "Pasaporte", value: "3" },
      ],
    },
  },
  {
    name: "document",
    label: "Numero de documento *",
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
    name: "email",
    label: "Correo electronico *",
    placeholder: "Ej. admin@agrogestion.com",
    type: "email",
  },
];
