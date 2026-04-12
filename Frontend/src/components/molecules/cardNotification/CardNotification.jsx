import {
  CheckCheck,
  CircleCheckBig,
  Clock3,
  CircleX,
  TriangleAlert,
} from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import styles from "./CardNotification.module.css";

const statusConfig = {
  pendiente: {
    label: "Pendiente",
    Icon: Clock3,
    cardClass: styles.pending,
    badgeClass: styles.badgePending,
    color: styles.iconPending,
  },
  aprobada: {
    label: "Aprobada",
    Icon: CircleCheckBig,
    cardClass: styles.approved,
    badgeClass: styles.badgeApproved,
    color: styles.iconApproved,
  },
  rechazada: {
    label: "Rechazada",
    Icon: CircleX,
    cardClass: styles.rejected,
    badgeClass: styles.badgeRejected,
    color: styles.iconRejected,
  },
  "stock-alert": {
    label: "Alerta",
    Icon: TriangleAlert,
    cardClass: styles.stockAlert,
    badgeClass: styles.badgeStockAlert,
    color: styles.iconStockAlert,
  },
};

const CardNotification = ({ item, onClick }) => {
  const current =
    statusConfig[item.type === "stock-alert" ? "stock-alert" : item.status] ||
    statusConfig.pendiente;
  const StatusIcon = current.Icon;
  const handleOpenDetails = () => onClick?.(item);

  return (
    <article
      className={`${styles.card} ${current.cardClass}`}
      onClick={handleOpenDetails}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleOpenDetails();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <span className={styles.iconWrap}>
        <StatusIcon size={15} className={current.color} />
      </span>

      <section className={styles.content}>
        <h4 className={styles.title}>{item.titulo || item.title}</h4>
        <p className={styles.message}>{item.motivo || item.message}</p>
        <footer className={styles.footer}>
          <span className={styles.time}>
            {formatDate(item.fecha_registro || item.createdAt) || ""}
          </span>
          <span className={`${styles.badge} ${current.badgeClass}`}>
            {current.label}
          </span>
        </footer>
      </section>

      {!item.read ? (
        <div className={styles.circle}></div>
      ) : (
        <span className={styles.readIconWrap} aria-label="Notificacion leida">
          <CheckCheck size={15} className={styles.readIcon} />
        </span>
      )}
    </article>
  );
};

export default CardNotification;
