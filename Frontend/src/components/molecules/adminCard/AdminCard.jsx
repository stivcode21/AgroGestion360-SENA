import { Ellipsis, Mail, Phone } from "lucide-react";
import styles from "./AdminCard.module.css";

const statusClassMap = {
  online: styles.statusOnline,
  offline: styles.statusOffline,
  busy: styles.statusBusy,
};

const AdminCard = ({ admin }) => {
  return (
    <article className={styles.card}>
      <header className={styles.top}>
        <figure className={styles.avatarBox}>
          <img
            src={admin.avatar}
            alt={`avatar de ${admin.name}`}
            className={styles.avatar}
          />
          <span
            className={`${styles.status} ${statusClassMap[admin.status] ?? styles.statusOffline}`}
            aria-hidden="true"
          />
        </figure>
        <button
          className={styles.menuButton}
          type="button"
          aria-label="Opciones"
        >
          <Ellipsis size={20} />
        </button>
      </header>

      <section className={styles.identity}>
        <h3 className={styles.username}>{admin.username}</h3>
        <p className={styles.role}>{admin.role}</p>
      </section>

      <section className={styles.description}>
        <p className={styles.name}>{admin.name}</p>
        <p className={styles.edad}>{admin.edad}</p>
      </section>

      <footer className={styles.contact}>
        <p className={styles.contactRow}>
          <Mail size={14} className={styles.icon} />
          <span>{admin.email}</span>
        </p>
        <p className={styles.contactRow}>
          <Phone size={14} className={styles.icon} />
          <span>{admin.phone}</span>
        </p>
      </footer>
    </article>
  );
};

export default AdminCard;
