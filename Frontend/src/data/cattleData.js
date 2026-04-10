export const cattleData = [
  {
    id: "cat-01",
    name: "Luna",
    tag: "V-1023",
    type: "vaca",
    breed: "Holstein",
    age: "3 anos",
    weight: 480,
    status: "sano",
    statusLabel: "Sano",
    milkLiters: 18,
    lastCheck: "09-10-25",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLA-MN3EEIxzjgEiougpvmZVvg6a20lcENNQ&s",
  },
  {
    id: "cat-02",
    name: "Canela",
    tag: "V-1041",
    type: "vaca",
    breed: "Jersey",
    age: "4 anos",
    weight: 420,
    status: "observacion",
    statusLabel: "Observacion",
    milkLiters: 16,
    lastCheck: "08-10-25",
    avatar:
      "https://www.pecuarios.club/razas/Raza59318a4e18224_02062017.jpg?x2",
  },
  {
    id: "cat-03",
    name: "Bruno",
    tag: "T-2088",
    type: "toro",
    breed: "Brahman",
    age: "5 anos",
    weight: 720,
    status: "sano",
    statusLabel: "Sano",
    milkLiters: 0,
    lastCheck: "07-10-25",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYcYjvA-DRZcPe-sxZKv1wCAPO_aaClZUBBg&s",
  },
  {
    id: "cat-04",
    name: "Cielo",
    tag: "N-3302",
    type: "novillo",
    breed: "Angus",
    age: "2 anos",
    weight: 520,
    status: "tratamiento",
    statusLabel: "Tratamiento",
    milkLiters: 0,
    lastCheck: "06-10-25",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWlXg0_J7nLemxdposZWfTMN9lKwnw-7nsAw&s",
  },
  {
    id: "cat-05",
    name: "Mora",
    tag: "T-4101",
    type: "ternera",
    breed: "Normando",
    age: "8 meses",
    weight: 210,
    status: "sano",
    statusLabel: "Sano",
    milkLiters: 0,
    lastCheck: "09-10-25",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLQJ_7Mm6JYQoTNwEvdsw0RCx-N1Gk11cWJQ&s",
  },
  {
    id: "cat-06",
    name: "Sol",
    tag: "V-1107",
    type: "vaca",
    breed: "Gyr",
    age: "3 anos",
    weight: 460,
    status: "sano",
    statusLabel: "Sano",
    milkLiters: 20,
    lastCheck: "09-10-25",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRf9Jkw6-RmpO--x0G5iQqcf1gQna88UBsHkQ&s",
  },
];

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
    label: "Disponibilidad",
    select: {
      options: [
        { label: "Vendido", value: true },
        { label: "Disponible", value: false },
      ],
    },
  },

  {
    name: "estado_salud",
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
    name: "origen_ciudad",
    label: "Ciudad de origen *",
    placeholder: "Ej. Medellín",
    type: "text",
  },
  
  
];

