import MainLayout from "@/components/templates/mainLayout/MainLayout";
import styles from "./Inventario.module.css";

const Inventario = () => {
  return (
    <MainLayout>
      <section className={styles.page}>
        <h1 className={styles.title}>Inventario</h1>
        <p className={styles.description}>
          Seccion Inventario pendiente por contenido.
        </p>
      </section>
    </MainLayout>
  );
};

export default Inventario;
