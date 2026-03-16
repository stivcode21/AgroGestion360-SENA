import { Mail, Pencil, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminCard.module.css";
import previuIMG from "@/assets/img/previuIMG.webp";

const docTypeLabelMap = {
  1: "CC",
  2: "CE",
  3: "Pasaporte",
};

const AdminCard = ({ admin }) => {
  const navigate = useNavigate();
  const avatarSrc = admin.url_img?.trim() || previuIMG;

  return (
    <article className={styles.card}>
      <header className={styles.top}>
        <figure className={styles.avatarBox}>
          <img
            src={avatarSrc}
            alt={`avatar de ${admin.nombre_completo}`}
            className={styles.avatar}
          />
        </figure>
        <button
          className={styles.editButton}
          type="button"
          aria-label={`Editar a ${admin.nombre_completo}`}
          title="Editar administrador"
          onClick={() => navigate(`/admin/editar/${admin.id_usuario}`)}
        >
          <Pencil size={18} />
        </button>
      </header>

      <section className={styles.identity}>
        <h3 className={styles.username}>{admin.nombre_completo}</h3>
      </section>

      <section className={styles.description}>
        <p className={styles.edad}>{admin.edad} años</p>
        <p className={styles.document}>
          {docTypeLabelMap[admin.id_tipo_documento] ?? "Documento"}:{"  "}
          {admin.numero_documento}
        </p>
      </section>

      <footer className={styles.contact}>
        <p className={styles.contactRow}>
          <Mail size={14} className={styles.icon} />
          <span>{admin.correo}</span>
        </p>
        <p className={styles.contactRow}>
          <Phone size={14} className={styles.icon} />
          <span>{admin.celular}</span>
        </p>
      </footer>
    </article>
  );
};

export default AdminCard;
