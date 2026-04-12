import { Bell, CheckCheck, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import CardNotification from "@/components/molecules/cardNotification/CardNotification";
import RequestCreate from "@/components/molecules/requestCreate/RequestCreate";
import NotificationDetails from "@/components/organism/notificationDetails/NotificationDetails";
import { hasRole } from "@/utils/auth";
import { useUserStore } from "@/store/userStore";
import { buildApiUrl } from "@/utils/apiBase";
import toast from "react-hot-toast";
import styles from "./NotificationsModal.module.css";
import { useDataStore } from "@/store/dataStore";
import { useNavigate } from "react-router-dom";
import {
  getStockAlertsStorage,
  setStockAlertsStorage,
} from "@/utils/stockAlertsStorage";

const NotificationsModal = ({ isOpen, onClose }) => {
  const [stateContent, setStateContent] = useState("notifications");
  const [currentDetailsId, setCurrentDetailsId] = useState(null);
  const [stockAlerts, setStockAlerts] = useState([]);
  const { user } = useUserStore();
  const { notifications, setNotifications } = useDataStore();
  const canManageRequests = hasRole(user, 1);
  const navigate = useNavigate();

  const requestNotifications = notifications.map((item) => ({
    ...item,
    type: "request",
  }));
  const allNotifications = [...stockAlerts, ...requestNotifications];
  const unreadCount = allNotifications.filter((item) => !item.read).length;
  const hasNotifications = allNotifications.length > 0;
  const selectedNotification = requestNotifications.find(
    (item) => String(item.id_solicitud) === String(currentDetailsId),
  );

  const isCreateRequestView = stateContent === "createRequest";
  const isDetailsView = stateContent === "details";
  const isNotificationsView = stateContent === "notifications";

  //se ejecuta al hacer click en una notificaion
  const persistStockAlerts = (nextAlerts) => {
    setStockAlerts(nextAlerts);
    setStockAlertsStorage(nextAlerts);
  };

  //se ejecuta al hacer click en una notificaion
  const handleOpenDetails = async (notification) => {
    //si es alerta de stock, marcar como leida y redirigir a inventario
    if (notification.type === "stock-alert") {
      const nextAlerts = stockAlerts.map((item) =>
        item.id === notification.id ? { ...item, read: true } : item,
      );

      persistStockAlerts(nextAlerts);
      onClose();
      navigate(notification.route || "/inventario");
      return;
    }

    const currentNotification = notifications.find(
      (item) => Number(item.id_solicitud) === Number(notification.id_solicitud),
    );

    //si es request solo si es dueño cambia el estado a leida
    if (canManageRequests && currentNotification && !currentNotification.read) {
      try {
        const res = await fetch(
          buildApiUrl(`request/edit/${notification.id_solicitud}`),
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ read: true }),
          },
        );

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.message ?? "No se pudo actualizar la solicitud.");
        } else if (data?.data) {
          setNotifications((prev) =>
            prev.map((item) =>
              Number(item.id_solicitud) === Number(notification.id_solicitud)
                ? { ...item, ...data.data }
                : item,
            ),
          );
        }
      } catch (error) {
        console.error("Error al marcar solicitud como leida:", error);
        toast.error("No se pudo marcar la notificacion como leida.");
      }
    }

    setCurrentDetailsId(notification.id_solicitud);
    setStateContent("details");
  };

  // Volver a la vista de notificaciones al cerrar el modal
  useEffect(() => {
    if (isOpen) {
      setStockAlerts(getStockAlertsStorage());
    }

    if (!isOpen) {
      setStateContent("notifications");
      setCurrentDetailsId(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <section className={styles.backdrop} onClick={onClose}>
      <article
        className={styles.modal}
        onClick={(event) => event.stopPropagation()}
      >
        <header className={styles.header}>
          <div className={styles.titleRow}>
            <span className={styles.iconWrap}>
              <Bell size={16} />
            </span>
            <h3 className={styles.title}>Notificaciones</h3>
            {unreadCount ? (
              <span className={styles.counter}>{unreadCount}</span>
            ) : null}
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
          >
            <X size={17} />
          </button>
        </header>

        <section className={styles.actions}>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={() =>
              setStateContent((prev) =>
                prev === "notifications" ? "createRequest" : "notifications",
              )
            }
          >
            <Plus size={15} />
            {isNotificationsView ? "Nueva solicitud" : "Ver bandeja"}
          </button>
        </section>

        <section className={styles.list}>
          {isCreateRequestView ? (
            <RequestCreate onCancel={() => setStateContent("notifications")} />
          ) : isDetailsView ? (
            <NotificationDetails
              notification={selectedNotification}
              canManageRequests={canManageRequests}
              onDeleted={() => {
                setStateContent("notifications");
                setCurrentDetailsId(null);
              }}
            />
          ) : hasNotifications ? (
            allNotifications.map((item) => (
              <CardNotification
                key={item.id || item.id_solicitud}
                item={item}
                onClick={handleOpenDetails}
              />
            ))
          ) : (
            <div className={styles.placeholder}>
              <h4 className={styles.placeholderTitle}>No hay notificaciones</h4>
              <p className={styles.placeholderMessage}>
                Cuando recibas notificaciones, apareceran aqui.
              </p>
            </div>
          )}
        </section>
      </article>
    </section>
  );
};

export default NotificationsModal;
