import { Pencil, Trash2 } from "lucide-react";
import styles from "../productDetails/ProductDetails.module.css";
import { porciculturaData } from "@/data/porciculturaData";
import { useModalStore } from "@/store/modalStore";
import { Link } from "react-router-dom";

const PorciculturaDetails = () => {
  const { selectPig, setIsOpenModal } = useModalStore();
  const pig = porciculturaData.find((item) => item.id === selectPig);

  if (!pig) {
    return (
      <div className={styles.container}>
        <p className={styles.empty}>No se encontraron datos del porcino.</p>
      </div>
    );
  }

  const {
    name,
    tag,
    breed,
    statusLabel,
    weight,
    stage,
    lastCheck,
    avatar,
  } = pig;

  return (
    <div className={styles.container}>
      <h2 className={styles.productCode}>{tag}</h2>

      <header className={styles.header}>
        <h3 className={styles.sectionTitle}>Detalles del porcino</h3>

        <div className={styles.actions}>
          <button type="button" className={styles.action}>
            <Trash2 className={styles.icon} />
            <span>Eliminar</span>
          </button>
          <button
            type="button"
            className={styles.action}
            onClick={() => setIsOpenModal(false)}
          >
            <Link to={`/porcicultura/editar/${selectPig}`}>
              <Pencil className={styles.icon} />
              <span>Editar</span>
            </Link>
          </button>
        </div>
      </header>

      <section className={styles.section}>
        <div className={styles.detailCard}>
          <div className={styles.row}>
            <span className={styles.label}>Nombre</span>
            <span className={styles.value}>{name}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Raza</span>
            <span className={styles.value}>{breed}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Estado</span>
            <span className={styles.value}>{statusLabel}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Peso</span>
            <span className={styles.value}>{weight} kg</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Etapa</span>
            <span className={styles.value}>{stage}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Ultimo control</span>
            <span className={styles.value}>{lastCheck}</span>
          </div>
          <div className={`${styles.row} ${styles.imageRow}`}>
            <span className={styles.label}>Foto</span>
            <div className={styles.imageWrapper}>
              <div className={styles.imageCard}>
                {avatar ? (
                  <img src={avatar} alt={name} loading="lazy" />
                ) : (
                  <span className={styles.imageBadge}>Sin imagen</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PorciculturaDetails;
