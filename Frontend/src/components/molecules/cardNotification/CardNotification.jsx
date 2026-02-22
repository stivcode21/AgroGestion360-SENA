import { CircleCheckBig, Clock3, CircleX } from "lucide-react";
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
};

const CardNotification = ({ item }) => {
  const current = statusConfig[item.status] || statusConfig.pendiente;
  const StatusIcon = current.Icon;

  return (
    <article className={`${styles.card} ${current.cardClass}`}>
      <span className={styles.iconWrap}>
        <StatusIcon size={15} className={current.color} />
      </span>

      <section className={styles.content}>
        <h4 className={styles.title}>{item.subject ?? item.title}</h4>
        <p className={styles.message}>{item.message}</p>
        <footer className={styles.footer}>
          <span className={styles.time}>{item.time}</span>
          <span className={`${styles.badge} ${current.badgeClass}`}>
            {current.label}
          </span>
        </footer>
      </section>

      {!item.read ? (
        <span className={styles.unread} aria-label="No leida"></span>
      ) : null}
    </article>
  );
};

export default CardNotification;
