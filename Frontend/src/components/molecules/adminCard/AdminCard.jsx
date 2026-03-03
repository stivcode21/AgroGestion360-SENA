import { Ellipsis, KeyRound, Mail, Pencil, Phone, UserX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminCard.module.css";

const docTypeLabelMap = {
  cc: "CC",
  ce: "CE",
  pasaporte: "Pasaporte",
};

const AdminCard = ({ admin, onOpenCredentials }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <article className={styles.card}>
      <header className={styles.top}>
        <figure className={styles.avatarBox}>
          <img
            src={admin.avatar}
            alt={`avatar de ${admin.name}`}
            className={styles.avatar}
          />
        </figure>
        <div className={styles.menuWrap} ref={menuRef}>
          <button
            className={styles.menuButton}
            type="button"
            aria-label="Opciones"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <Ellipsis size={20} />
          </button>

          {isMenuOpen ? (
            <div className={styles.dropdown}>
              <button
                type="button"
                className={styles.dropdownItem}
                onClick={() => {
                  navigate(`/admin/editar/${admin.id}`);
                  setIsMenuOpen(false);
                }}
              >
                <Pencil size={14} />
                Editar
              </button>
              <button
                type="button"
                className={styles.dropdownItem}
                onClick={() => {
                  onOpenCredentials?.({
                    userId: admin.id,
                    defaultUsername: admin.username,
                  });
                  setIsMenuOpen(false);
                }}
              >
                <KeyRound size={14} />
                Gestionar credenciales
              </button>
              <button
                type="button"
                className={styles.dropdownItem}
                onClick={() => setIsMenuOpen(false)}
              >
                <UserX size={14} />
                Inhabilitar
              </button>
            </div>
          ) : null}
        </div>
      </header>

      <section className={styles.identity}>
        <h3 className={styles.username}>{admin.username}</h3>
        <p className={styles.role}>{admin.role}</p>
      </section>

      <section className={styles.description}>
        <p className={styles.name}>{admin.name}</p>
        <p className={styles.edad}>{admin.age} años</p>
        <p className={styles.document}>
          {docTypeLabelMap[admin.docType] ?? "Documento"}: {admin.document}
        </p>
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
