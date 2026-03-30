import {
  CalendarClock,
  CircleCheckBig,
  CircleX,
  Clock3,
  Save,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useActionModal } from "@/context/actionModalProvider/ActionModalProvider";
import { formatDate } from "@/utils/formatDate";
import { buildApiUrl } from "@/utils/apiBase";
import toast from "react-hot-toast";
import styles from "./NotificationDetails.module.css";
import { useDataStore } from "@/store/dataStore";

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

const NotificationDetails = ({
  notification,
  canManageRequests = false,
  onDeleted,
}) => {
  const [selectedStatus, setSelectedStatus] = useState("pendiente");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { openActionModal } = useActionModal();
  const { setNotifications } = useDataStore();

  useEffect(() => {
    setSelectedStatus(notification?.status || "pendiente");
  }, [notification]);

  if (!notification) {
    return (
      <section className={styles.emptyState}>
        <h4>No se encontro la notificacion</h4>
        <p>Selecciona otra notificacion para ver su detalle completo.</p>
      </section>
    );
  }

  const currentStatus =
    statusConfig[notification.status] || statusConfig.pendiente;
  const StatusIcon = currentStatus.Icon;

  const handleSaveStatus = async () => {
    if (!canManageRequests || selectedStatus === notification.status) return;

    try {
      setIsSaving(true);

      const res = await fetch(
        buildApiUrl(`request/edit/${notification.id_solicitud}`),
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status: selectedStatus }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message ?? "No se pudo actualizar el estado.");
        return;
      }

      if (data?.data) {
        setNotifications((prev) =>
          prev.map((item) =>
            Number(item.id_solicitud) === Number(notification.id_solicitud)
              ? { ...item, ...data.data }
              : item,
          ),
        );
      }

      toast.success("Estado actualizado correctamente.");
    } catch (error) {
      console.error("Error al actualizar estado de solicitud:", error);
      toast.error("No se pudo actualizar el estado.");
    } finally {
      setIsSaving(false);
    }
  };

  // elimina la solicitud actual y actualiza el listado en el componente padre
  const handleDeleteConfirm = async () => {
    if (!canManageRequests) return;

    try {
      setIsDeleting(true);

      const res = await fetch(
        buildApiUrl(`request/delete/${notification.id_solicitud}`),
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message ?? "No se pudo eliminar la solicitud.");
        return;
      }

      setNotifications((prev) =>
        prev.filter(
          (item) =>
            //los que sean igual esta solicitud se eliminan del listado
            Number(item.id_solicitud) !== Number(notification.id_solicitud),
        ),
      );

      toast.success("Solicitud eliminada correctamente.");
      onDeleted?.();
    } catch (error) {
      console.error("Error al eliminar solicitud:", error);
      toast.error("No se pudo eliminar la solicitud.");
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeleteModal = () => {
    if (!canManageRequests) return;

    openActionModal({
      variant: "delete",
      title: "Quieres eliminar",
      titleSuffix: "",
      highlight: notification.titulo,
      description: "Esta accion eliminara la solicitud permanentemente.",
      onConfirm: handleDeleteConfirm,
    });
  };

  const detailsRows = [
    {
      label: "Titulo",
      value: notification.titulo,
    },
    {
      label: "Motivo de la solicitud",
      value: notification.motivo,
    },
    {
      label: "Tipo de insumo",
      value: notification.id_tipo_insumo ?? "No registrado",
    },
    {
      label: "Cantidad",
      value: notification.cantidad ?? "No registrada",
    },
    {
      label: "Especie destino",
      value: notification.especie_destino ?? "No registrada",
    },
    {
      label: "Unidad de medida",
      value: notification.unidad_medida ?? "No registrada",
    },
    {
      label: "Proveedor",
      value: notification.proveedor ?? "No registrado",
    },
    {
      label: "Fecha de vencimiento",
      value: formatDate(notification.fecha_vencimiento) || "No aplica",
    },
  ];

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <span className={`${styles.statusBadge} ${currentStatus.badgeClass}`}>
          <StatusIcon size={14} />
          {currentStatus.label}
        </span>
        {canManageRequests ? (
          <div className={styles.actionsWrap}>
            <select
              className={styles.statusSelect}
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
            >
              <option value="pendiente">Pendiente</option>
              <option value="aprobada">Aprobada</option>
              <option value="rechazada">Rechazada</option>
            </select>
            <button
              type="button"
              className={styles.actionButton}
              onClick={handleSaveStatus}
              disabled={isSaving || selectedStatus === notification.status}
            >
              <Save size={15} />
              Guardar
            </button>
            <button
              type="button"
              className={`${styles.actionButton} ${styles.deleteButton}`}
              onClick={openDeleteModal}
              disabled={isDeleting}
            >
              <Trash2 size={15} />
            </button>
          </div>
        ) : null}
      </header>

      <div className={styles.metaInfo}>
        <CalendarClock size={15} />
        <span>{formatDate(notification.fecha_registro) || "Sin fecha"}</span>
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
