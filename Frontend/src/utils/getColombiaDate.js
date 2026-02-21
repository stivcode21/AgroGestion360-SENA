export const getColombiaDate = () => {
  const date = new Date();

  const formatter = new Intl.DateTimeFormat("es-CO", {
    timeZone: "America/Bogota",
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const formatted = formatter.format(date);

  // Capitalizar primera letra (porque viene en minúscula)
  return formatted.replace(/^\w/, (c) => c.toUpperCase());
};
