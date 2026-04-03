import FormInput from "@/components/molecules/formInput/FormInput";
import styles from "./VacunaForm.module.css";

const vacunaFields = [
  {
    name: "tipoVacuna",
    label: "Tipo de vacuna",
    placeholder: "Ej. Brucelosis",
    type: "text",
  },
  {
    name: "dosisAplicada",
    label: "Dosis aplicada",
    placeholder: "Ej. 5 ml",
    type: "text",
  },
  {
    name: "fechaAplicacion",
    label: "Fecha de aplicacion",
    placeholder: "Selecciona una fecha",
    type: "date",
  },
  {
    name: "responsable",
    label: "Responsable de la vacunacion",
    placeholder: "Ej. Juan Perez",
    type: "text",
  },
];

const VacunaForm = ({ formDataVacuna, setFormDataVacuna }) => {
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormDataVacuna((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <div>
          <h3 className={styles.sectionTitle}>
            Registro de vacuna <span>(Opcional)</span>
          </h3>
          <p className={styles.description}>
            Completa estos datos solo si deseas dejar registrada una vacunacion
            asociada al animal.
          </p>
        </div>
      </header>

      <div className={styles.inputsGrid}>
        {vacunaFields.map((field) => (
          <FormInput
            key={field.name}
            label={field.label}
            name={field.name}
            onChange={handleChange}
            placeholder={field.placeholder}
            type={field.type}
            value={formDataVacuna[field.name] ?? ""}
          />
        ))}
      </div>
    </section>
  );
};

export default VacunaForm;
