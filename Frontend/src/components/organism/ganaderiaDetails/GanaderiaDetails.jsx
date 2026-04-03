import { Banknote, Pencil, Trash2 } from "lucide-react";
import styles from "../productDetails/ProductDetails.module.css";
import { cattleData } from "@/data/cattleData";
import { useModalStore } from "@/store/modalStore";
import { Link } from "react-router-dom";

const typeLabels = {
  vaca: "Vaca",
  novillo: "Novillo",
  ternera: "Ternera",
  toro: "Toro",
};

const GanaderiaDetails = () => {
  const { selectCattle, setIsOpenModal } = useModalStore();
  const cattle = cattleData.find((item) => item.id === selectCattle);

  if (!cattle) {
    return (
      <div className={styles.container}>
        <p className={styles.empty}>No se encontraron datos del animal.</p>
      </div>
    );
  }

  const {
    name,
    tag,
    type,
    breed,
    age,
    weight,
    statusLabel,
    milkLiters,
    lastCheck,
    avatar,
  } = cattle;

  return (
    <div className={styles.container}>
      <h2 className={styles.productCode}>{tag}</h2>

      <header className={styles.header}>
        <h3 className={styles.sectionTitle}>Detalles del animal</h3>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.iconAction}
            aria-label="Verder"
            title="Verder"
          >
            <Banknote className={styles.iconSell} />
          </button>
          <button
            type="button"
            className={styles.iconAction}
            aria-label="Eliminar"
            title="Eliminar"
          >
            <Trash2 className={styles.iconDelete} />
          </button>
          <button
            type="button"
            className={styles.iconAction}
            onClick={() => setIsOpenModal(false)}
            aria-label="Editar"
            title="Editar"
          >
            <Link
              to={`/ganaderia/editar/${selectCattle}`}
              className={styles.iconLink}
            >
              <Pencil className={styles.iconEdit} />
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
            <span className={styles.label}>Tipo</span>
            <span className={styles.value}>{typeLabels[type] ?? type}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Raza</span>
            <span className={styles.value}>{breed}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Edad</span>
            <span className={styles.value}>{age}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Peso</span>
            <span className={styles.value}>{weight} kg</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Estado</span>
            <span className={styles.value}>{statusLabel}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Produccion</span>
            <span className={styles.value}>{milkLiters} L/dia</span>
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

export default GanaderiaDetails;
