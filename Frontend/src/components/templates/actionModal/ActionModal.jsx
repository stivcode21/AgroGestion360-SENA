import { LogOut, Pencil, Trash2 } from "lucide-react";
import styles from "./ActionModal.module.css";

const VARIANTS = {
  delete: {
    icon: Trash2,
    accent: "#ef4444",
    soft: "#fee2e2",
    action: "#dc2626",
    confirmLabel: "Eliminar",
  },
  logout: {
    icon: LogOut,
    accent: "#ef4444",
    soft: "#fee2e2",
    action: "#dc2626",
    confirmLabel: "Cerrar sesion",
  },
  save: {
    icon: Pencil,
    accent: "#2563eb",
    soft: "#dbeafe",
    action: "#1d4ed8",
    confirmLabel: "Aceptar",
  },
};

const ActionModal = ({
  isOpen,
  variant = "delete",
  title,
  highlight,
  titleSuffix = "?",
  description,
  note,
  confirmLabel,
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const current = VARIANTS[variant] || VARIANTS.delete;
  const Icon = current.icon;
  const confirmText = confirmLabel || current.confirmLabel;

  return (
    <div className={styles.backdrop} onClick={onCancel}>
      <div
        className={styles.card}
        onClick={(event) => event.stopPropagation()}
        style={{
          "--accent": current.accent,
          "--soft": current.soft,
          "--action": current.action,
        }}
      >
        <div className={styles.iconWrap}>
          <Icon className={styles.icon} />
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>
            {title}
            {highlight ? (
              <span className={styles.highlight}> {highlight}</span>
            ) : null}
            {titleSuffix}
          </h3>
          {description ? (
            <p className={styles.description}>{description}</p>
          ) : null}
          {note ? <p className={styles.note}>{note}</p> : null}
        </div>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={styles.confirmButton}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionModal;
