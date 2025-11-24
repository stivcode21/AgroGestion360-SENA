import MainLayout from "@/components/templates/mainLayout/MainLayout";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  return (
    <MainLayout>
      <section className={styles.page}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.description}>
          Seccion Dashboard pendiente por contenido.
        </p>
      </section>
    </MainLayout>
  );
};

export default Dashboard;
