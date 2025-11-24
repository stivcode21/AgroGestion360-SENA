import MainLayout from "@/components/templates/mainLayout/MainLayout";
import styles from "./Porcicultura.module.css";

const Porcicultura = () => {
  return (
    <MainLayout>
      <section className={styles.page}>
        <h1 className={styles.title}>Porcicultura</h1>
        <p className={styles.description}>
          Seccion Porcicultura pendiente por contenido.
        </p>
      </section>
    </MainLayout>
  );
};

export default Porcicultura;
