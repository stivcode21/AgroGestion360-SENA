import styles from "../productDetails/ProductDetails.module.css";
import { formatDate } from "@/utils/formatDate";
import { useModalStore } from "@/store/modalStore";
import { Banknote, FileText, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLoader } from "@/context/loaderProvider/LoaderProvider";
import { useActionModal } from "@/context/actionModalProvider/ActionModalProvider";
import { buildApiUrl } from "@/utils/apiBase";
import toast from "react-hot-toast";
import { useDataStore } from "@/store/dataStore";
import { generateFacturaPdf } from "@/utils/generateActivityPaymentInvoicePdf";
import ImgPicker from "@/components/atoms/imgPicker/ImgPicker";
import previuIMG from "@/assets/img/previuActivity.jpg";
import DetailsImage from "@/components/templates/detailsImage/DetailsImage";

const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const ActivityDetails = () => {
  const { selectActivity, setIsOpenModal, setSelectActivity } = useModalStore();
  const { setActivities } = useDataStore();
  const { toggleLoader } = useLoader();
  const { openActionModal } = useActionModal();
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [urlComprobante, setUrlComprobante] = useState("");

  useEffect(() => {
    setUrlComprobante(selectActivity?.urlcomprobante ?? "");
  }, [selectActivity]);

  // Elimina la actividad seleccionada despues de confirmar en el modal de accion.
  const handleDeleteConfirm = async () => {
    if (!selectActivity?.id_registro) return;

    try {
      toggleLoader(true);
      // Borra el producto seleccionado y cierra el detalle cuando el backend confirma la eliminacion.
      const res = await fetch(
        buildApiUrl(`activity/deleteactivity/${selectActivity.id_registro}`),
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      );
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      //filtra la actividad eliminada del estado global para actualizar la tabla sin necesidad de recargar la pagina.
      setActivities((prev) =>
        prev.filter((item) => item.id_registro !== selectActivity.id_registro),
      );
      toast.success(data.message);
      setSelectActivity(null);
      setIsOpenModal(false);
    } catch (error) {
      console.error("Error al eliminar actividad:", error);
      toast.error("Ha ocurrido un error inesperado.");
    } finally {
      toggleLoader(false);
    }
  };

  const openDeleteModal = () => {
    openActionModal({
      variant: "delete",
      title: "Quieres eliminar",
      titleSuffix: "",
      highlight: selectActivity?.id_registro,
      description: "Esta accion eliminara el producto permanentemente.",
      onConfirm: handleDeleteConfirm,
    });
  };

  // generacion de pago de actividad
  const handlePayment = async () => {
    if (!selectActivity?.id_registro) return;

    if (!urlComprobante) {
      setIsProofModalOpen(true);
      return;
    }

    try {
      toggleLoader(true);

      const res = await fetch(
        buildApiUrl(`activity/editactivity/${selectActivity.id_registro}`),
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            id_estado: 2,
            urlcomprobante: urlComprobante,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message ?? "No se pudo actualizar el pago.");
        return;
      }

      toast.success(data.message ?? "Pago actualizado correctamente.");

      // Actualiza el estado global sin necesidad de recargar la pagina.
      setActivities((prev) =>
        prev.map((item) =>
          item.id_registro === selectActivity.id_registro
            ? {
                ...item,
                id_estado: 2,
                estado: "Completada",
                urlcomprobante: urlComprobante,
              }
            : item,
        ),
      );

      setSelectActivity({
        ...selectActivity,
        id_estado: 2,
        estado: "Completada",
        urlcomprobante: urlComprobante,
      });
      setIsProofModalOpen(false);
      setIsOpenModal(false);
    } catch (error) {
      console.error("Error al actualizar credenciales:", error);
      toast.error("Ha ocurrido un error inesperado.");
    } finally {
      toggleLoader(false);
    }
  };

  //generar factura de pago de actividad
  const handleGenerateInvoice = async () => {
    if (!selectActivity?.id_registro) return;

    try {
      toggleLoader(true);

      const res = await fetch(
        buildApiUrl(
          `report/activity-payment-invoice/${selectActivity.id_registro}`,
        ),
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "No se pudo generar la factura.");
        return;
      }

      generateFacturaPdf(data.data);
      toast.success("Factura descargada correctamente.");
    } catch (error) {
      console.error("Error al generar factura:", error);
      toast.error("Ha ocurrido un error inesperado.");
    } finally {
      toggleLoader(false);
    }
  };

  if (!selectActivity) {
    return (
      <div className={styles.container}>
        <p className={styles.empty}>No se encontraron datos de la actividad.</p>
      </div>
    );
  }

  const {
    duracion,
    estado,
    fecha_fin,
    fecha_inicio,
    id_registro,
    monto,
    observaciones,
    trabajador,
    url_evidencia,
    urlcomprobante,
    documento,
    actividad,
  } = selectActivity;
  const normalizedEstado = estado?.toLowerCase();

  const handleProofConfirm = async () => {
    if (!urlComprobante) {
      toast.error("Debes subir el comprobante antes de continuar.");
      return;
    }

    await handlePayment();
  };

  return (
    <div className={styles.container}>
      {isProofModalOpen && (
        <div
          className={styles.innerModalBackdrop}
          onClick={() => setIsProofModalOpen(false)}
        >
          <div
            className={styles.innerModalCard}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.innerModalContent}>
              <h3 className={styles.innerModalTitle}>Sube el comprobante</h3>
              <p className={styles.innerModalDescription}>
                Antes de marcar esta actividad como pagada, adjunta la factura o
                comprobante correspondiente.
              </p>

              <ImgPicker
                urlValue={urlComprobante}
                title="Comprobante de factura"
                description="Sube una imagen clara del comprobante en PNG o JPG"
                setUrlState={setUrlComprobante}
              />
            </div>

            <div className={styles.innerModalActions}>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => setIsProofModalOpen(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className={styles.primaryButton}
                onClick={handleProofConfirm}
              >
                Confirmar pago
              </button>
            </div>
          </div>
        </div>
      )}

      <h2 className={styles.productCode}>ID: {id_registro}</h2>

      <header className={styles.header}>
        <h3 className={styles.sectionTitle}>Detalles de actividad</h3>

        <div className={styles.actions}>
          {normalizedEstado !== "completada" && (
            <button
              type="button"
              onClick={handlePayment}
              className={styles.action}
              aria-label="Pagar"
            >
              <Banknote className={`${styles.icon} ${styles.iconPayment}`} />
              <span>Pagar</span>
            </button>
          )}

          <button
            type="button"
            className={styles.action}
            onClick={handleGenerateInvoice}
            aria-label="Factura"
          >
            <FileText className={`${styles.icon} ${styles.iconFactura}`} />
            <span>Factura</span>
          </button>

          <button
            type="button"
            className={styles.action}
            onClick={openDeleteModal}
            aria-label="Eliminar"
          >
            <Trash2 className={`${styles.icon} ${styles.iconDelete}`} />
            <span>Eliminar</span>
          </button>

          <Link
            to={`/actividades/editar/${id_registro}`}
            className={styles.action}
            onClick={() => setIsOpenModal(false)}
          >
            <Pencil className={`${styles.icon} ${styles.iconEdit}`} />
            <span>Editar</span>
          </Link>
        </div>
      </header>

      <section className={styles.section}>
        <div className={styles.detailCard}>
          <div className={styles.row}>
            <span className={styles.label}>id registro</span>
            <span className={styles.value}>{id_registro}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Trabajador</span>
            <span className={styles.value}>{trabajador}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Documento</span>
            <span className={styles.value}>{documento}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Actividad</span>
            <span className={styles.value}>{actividad}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Estado</span>
            <span className={styles.value}>{estado}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Fecha inicio</span>
            <span className={styles.value}>
              {formatDate(fecha_inicio) || "--"}
            </span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Fecha final</span>
            <span className={styles.value}>
              {formatDate(fecha_fin) || "Aun no finalizada"}
            </span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>duracion</span>
            <span className={styles.value}>{duracion}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Costo</span>
            <span className={styles.value}>
              {currencyFormatter.format(monto || 0)}
            </span>
          </div>
          <div className={`${styles.row} ${styles.descriptionRow}`}>
            <span className={styles.label}>Detalle</span>
            <p className={styles.description}>
              {observaciones || "No hay descripcion para esta actividad."}
            </p>
          </div>
          <div className={`${styles.row} ${styles.imageRow}`}>
            <span className={styles.label}>Foto</span>
            <DetailsImage
              imageSrc={url_evidencia}
              emptyLabel="Sin evidencia"
              alt={trabajador}
            />
          </div>
          <div className={`${styles.row} ${styles.imageRow}`}>
            <span className={styles.label}>Comprobante</span>
            <DetailsImage
              imageSrc={urlcomprobante}
              alt={`Comprobante de ${trabajador}`}
              emptyLabel="Sin comprobante"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ActivityDetails;
