import { Bell, CheckCheck, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import CardNotification from "@/components/molecules/cardNotification/CardNotification";
import RequestCreate from "@/components/molecules/requestCreate/RequestCreate";
import styles from "./NotificationsModal.module.css";

const NotificationsModal = ({
  isOpen,
  onClose,
  notifications = [],
  onMarkAllRead,
}) => {
  const [stateContent, setStateContent] = useState("notifications");

  const unreadCount = notifications.filter((item) => !item.read).length;
  const isCreateRequestView = stateContent === "createRequest";
  const hasNotifications = notifications.length > 0;

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
                prev === "createRequest" ? "notifications" : "createRequest",
              )
            }
          >
            <Plus size={15} />
            {isCreateRequestView ? "Ver bandeja" : "Nueva solicitud"}
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
          ) : hasNotifications ? (
            notifications.map((item) => (
              <CardNotification key={item.id} item={item} />
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
