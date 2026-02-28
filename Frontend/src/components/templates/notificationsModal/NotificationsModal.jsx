import { Bell, CheckCheck, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import CardNotification from "@/components/molecules/cardNotification/CardNotification";
import RequestCreate from "@/components/molecules/requestCreate/RequestCreate";
import NotificationDetails from "@/components/organism/notificationDetails/NotificationDetails";
import styles from "./NotificationsModal.module.css";

const NotificationsModal = ({
  isOpen,
  onClose,
  notifications = [],
  onMarkAllRead,
}) => {
  const [stateContent, setStateContent] = useState("notifications");
  const [currentDetailsId, setCurrentDetailsId] = useState(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("currentDetails")
      : null,
  );

  const unreadCount = notifications.filter((item) => !item.read).length;
  const isCreateRequestView = stateContent === "createRequest";
  const isDetailsView = stateContent === "details";
  const isNotificationsView = stateContent === "notifications";
  const hasNotifications = notifications.length > 0;
  const selectedNotification = notifications.find(
    (item) => item.id === currentDetailsId,
  );

  const handleOpenDetails = (id) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("currentDetails", id);
    }
    setCurrentDetailsId(id);
    setStateContent("details");
  };

  useEffect(() => {
    if (!isOpen) {
      // Volver a la vista de notificaciones al cerrar el modal
      setStateContent("notifications");
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
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={onMarkAllRead}
          >
            <CheckCheck size={15} />
            Marcar leidas
          </button>
        </section>

        <section className={styles.list}>
          {isCreateRequestView ? (
            <RequestCreate
              onCancel={() => setStateContent("notifications")}
              onSubmitRequest={() => setStateContent("notifications")}
            />
          ) : isDetailsView ? (
            <NotificationDetails
              notification={selectedNotification}
              onBack={() => setStateContent("notifications")}
            />
          ) : hasNotifications ? (
            notifications.map((item) => (
              <CardNotification
                key={item.id}
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
