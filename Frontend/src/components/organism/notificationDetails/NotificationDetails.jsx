import { ArrowLeft, CalendarClock, CircleCheckBig, CircleX, Clock3 } from "lucide-react";
import styles from "./NotificationDetails.module.css";

const statusConfig = {
  pendiente: {
    label: "Pendiente",
    Icon: Clock3,
    badgeClass: styles.badgePending,
  },
  aprobada: {
    label: "Aprobada",
    Icon: CircleCheckBig,
    badgeClass: styles.badgeApproved,
  },
  rechazada: {
    label: "Rechazada",
    Icon: CircleX,
    badgeClass: styles.badgeRejected,
  },
};

const NotificationDetails = ({ notification, onBack }) => {
  if (!notification) {
    return (
      <section className={styles.emptyState}>
        <h4>No se encontro la notificacion</h4>
        <p>Selecciona otra notificacion para ver su detalle completo.</p>
        <button type="button" className={styles.backButton} onClick={onBack}>
          <ArrowLeft size={16} />
          Volver a bandeja
        </button>
      </section>
    );
  }

  const currentStatus = statusConfig[notification.status] || statusConfig.pendiente;
  const StatusIcon = currentStatus.Icon;

  const detailsRows = [
    {
      label: "Titulo",
      value: notification.title ?? notification.subject,
    },
    {
      label: "Motivo de la solicitud",
      value: notification.reason ?? notification.message,
    },
    {
      label: "Tipo de insumo",
      value: notification.requestType ?? "No registrado",
    },
    {
      label: "Cantidad",
      value: notification.quantity ?? "No registrada",
    },
    {
      label: "Especie destino",
      value: notification.targetSpecies ?? "No registrada",
    },
    {
      label: "Unidad de medida",
      value: notification.unit ?? "No registrada",
    },
    {
      label: "Proveedor",
      value: notification.provider ?? "No registrado",
    },
    {
      label: "Fecha de vencimiento",
      value: notification.expirationDate || "No aplica",
    },
  ];

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <button type="button" className={styles.backButton} onClick={onBack}>
          <ArrowLeft size={16} />
          Volver
        </button>
        <span className={`${styles.statusBadge} ${currentStatus.badgeClass}`}>
          <StatusIcon size={14} />
          {currentStatus.label}
        </span>
      </header>

      <div className={styles.metaInfo}>
        <CalendarClock size={15} />
        <span>{notification.time ?? "Sin fecha"}</span>
      </div>

      <section className={styles.detailsCard}>
        {detailsRows.map((row) => (
          <div key={row.label} className={styles.row}>
            <span className={styles.label}>{row.label}</span>
            <p className={styles.value}>{row.value}</p>
          </div>
        ))}
      </section>
    </section>
  );
};

export default NotificationDetails;
