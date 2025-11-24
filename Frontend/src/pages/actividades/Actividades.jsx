import MainLayout from "@/components/templates/mainLayout/MainLayout";
import styles from "./Actividades.module.css";

const Actividades = () => {
  return (
    <MainLayout>
      <section className={styles.page}>
        <h1 className={styles.title}>Actividades</h1>
        <p className={styles.description}>
          Seccion Actividades pendiente por contenido.
        </p>
      </section>
    </MainLayout>
  );
};

export default Actividades;
