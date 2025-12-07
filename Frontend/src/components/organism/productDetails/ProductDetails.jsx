import { Pencil, Trash } from "lucide-react";
import styles from "./ProductDetails.module.css";

const ProductDetails = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.productCode}>H12492</h2>

      <section className={styles.section}>
        <header className={styles.header}>
          <h3 className={styles.sectionTitle}>Detalles</h3>
          <div className={styles.actions}>
            <button type="button" className={styles.action}>
              <Trash />
              <span>Eliminar</span>
            </button>
            <button type="button" className={styles.action}>
              <Pencil />
              <span>Editar</span>
            </button>
          </div>
        </header>

        <div className={styles.detailCard}>
          <div className={styles.row}>
            <span className={styles.label}>Nombre</span>
            <span className={styles.value}>Cuido para vacas</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Marca</span>
            <span className={styles.value}>Intacol</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Tipo</span>
            <span className={styles.value}>Alimento</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Cantidad</span>
            <span className={styles.value}>14</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>U/medida</span>
            <span className={styles.value}>10kg</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Precio unitario</span>
            <span className={styles.value}>$98.000</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Fecha registro</span>
            <span className={styles.value}>12-03-24</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Ultima actualizacion</span>
            <span className={styles.value}>25-09-25</span>
          </div>
          <div className={`${styles.row} ${styles.descriptionRow}`}>
            <span className={styles.label}>Descripcion</span>
            <p className={styles.description}>
              Este cuido de vacas tiene gran cantidad de vitaminas y proteinas,
              perfecto para las vacas lecheras
            </p>
          </div>
          <div className={`${styles.row} ${styles.imageRow}`}>
            <span className={styles.label}>Imagen</span>
            <div className={styles.imageWrapper}>
              <div className={styles.imageCard}>
                <span className={styles.imageBadge}>Italganador</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;
