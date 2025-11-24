import MainLayout from "@/components/templates/mainLayout/MainLayout";
import styles from "./Ganaderia.module.css";

const Ganaderia = () => {
  return (
    <MainLayout>
      <section className={styles.page}>
        <h1 className={styles.title}>Ganaderia</h1>
        <p className={styles.description}>
          Seccion Ganaderia pendiente por contenido.
        </p>
      </section>
    </MainLayout>
  );
};

export default Ganaderia;
