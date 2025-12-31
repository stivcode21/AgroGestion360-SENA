import { Pencil, Trash2 } from "lucide-react";
import styles from "../productDetails/ProductDetails.module.css";
import styless from "./WokerDetails.module.css";
import { workersData } from "@/data/workersData";
import { useModalStore } from "@/store/modalStore";
import { Link } from "react-router-dom";

const WokerDetails = () => {
  const { selectWoker, setIsOpenModal } = useModalStore();
  const worker = workersData.find((item) => item.id === selectWoker);

  if (!worker) {
    return (
      <div className={styles.container}>
        <p className={styles.empty}>No se encontraron datos del trabajador.</p>
      </div>
    );
  }

  const {
    name,
    document,
    docType,
    role,
    phone,
    familyPhone,
    age,
    status,
    address,
    admissionDate,
    activities,
    notes,
    avatar,
  } = worker;

  return (
    <div className={styles.container}>
      <h2 className={styles.productCode}>{document}</h2>

      <div className={styless.image}>
        {avatar ? (
          <img src={avatar} alt={name} loading="lazy" />
        ) : (
          <span className={styless.imageBadge}>Sin imagen</span>
        )}
      </div>

      <header className={styles.header}>
        <h3 className={styles.sectionTitle}>Detalles del trabajador</h3>

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
            <Link to={`/trabajadores/editar/${selectWoker}`}>
              <Pencil className={styles.icon} />
              <span>Editar</span>
            </Link>
          </button>
        </div>
      </header>

      <section className={styles.section}>
        <div className={styles.detailCard}>
          <div className={styles.row}>
            <span className={styles.label}>Nombre completo</span>
            <span className={styles.value}>{name}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Cedula</span>
            <span className={styles.value}>{document}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Tipo de cedula</span>
            <span className={styles.value}>{docType}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Celular</span>
            <span className={styles.value}>{phone}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Edad</span>
            <span className={styles.value}>{age}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Rol</span>
            <span className={styles.value}>{role}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Estado</span>
            <span className={styles.value}>{status}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Direccion</span>
            <span className={styles.value}>{address}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Fecha ingreso</span>
            <span className={styles.value}>{admissionDate}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Actividades</span>
            <span className={styles.value}>{activities}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Telefono familiar</span>
            <span className={styles.value}>{familyPhone}</span>
          </div>
          <div className={`${styles.row} ${styles.descriptionRow}`}>
            <span className={styles.label}>Observaciones</span>
            <p className={styles.description}>
              {notes || "Sin observaciones. Agrega comentarios."}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WokerDetails;
