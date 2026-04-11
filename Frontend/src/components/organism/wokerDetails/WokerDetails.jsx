import { Pencil, Trash2 } from "lucide-react";
import styles from "../productDetails/ProductDetails.module.css";
import styless from "./WokerDetails.module.css";
import { useModalStore } from "@/store/modalStore";
import { Link } from "react-router-dom";
import { useLoader } from "@/context/loaderProvider/LoaderProvider";
import { useActionModal } from "@/context/actionModalProvider/ActionModalProvider";
import { buildApiUrl } from "@/utils/apiBase";
import toast from "react-hot-toast";
import { workerInputFields } from "@/data/workerRegisterData";
import previuIMG from "@/assets/img/previuUser.png";
import { hasRole } from "@/utils/auth";
import { useUserStore } from "@/store/userStore";

const WorkerDetails = () => {
  const { selectWoker, setIsOpenModal, setSelectWoker } = useModalStore();
  const { toggleLoader } = useLoader();
  const { openActionModal } = useActionModal();
  const { user } = useUserStore();
  const canView = hasRole(user, 1);

  const documentTypeOptions =
    workerInputFields.find((field) => field.name === "id_tipo_documento")
      ?.select?.options ?? [];

  const handleDeleteConfirm = async () => {
    if (!selectWoker?.id_trabajador) return;

    try {
      toggleLoader(true);

      const res = await fetch(
        buildApiUrl(`workers/delete/${selectWoker.id_trabajador}`),
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);
      setSelectWoker(null);
      setIsOpenModal(false);
    } catch (error) {
      console.error("Error al eliminar trabajador:", error);
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
      highlight: selectWoker?.id_trabajador,
      description: "Esta accion eliminara el trabajador permanentemente.",
      onConfirm: handleDeleteConfirm,
    });
  };

  if (!selectWoker) {
    return (
      <div className={styles.container}>
        <p className={styles.empty}>No se encontraron datos del trabajador.</p>
      </div>
    );
  }

  const {
    nombre_completo,
    edad,
    id_tipo_documento,
    numero_documento,
    estado,
    rol,
    celular,
    direccion,
    observaciones,
    url_img,
    id_trabajador,
  } = selectWoker;

  const tipoDocumentoNombre =
    documentTypeOptions.find((opt) => opt.value === id_tipo_documento)?.label ??
    id_tipo_documento;

  return (
    <div className={styles.container}>
      <h2 className={styles.productCode}>ID: {id_trabajador}</h2>
      <h3 className={styles.sectionTitle}>Detalles del trabajador</h3>
      <div className={styless.image}>
        {url_img ? (
          <img src={url_img} alt={nombre_completo} loading="lazy" />
        ) : (
          <img src={previuIMG} alt="Imagen del trabajador" loading="lazy" />
        )}
      </div>
      <header className={styles.header}>
        <div className={styles.actions}>
          {canView && (
            <button
              type="button"
              className={styles.action}
              onClick={openDeleteModal}
            >
              <Trash2 className={`${styles.icon} ${styles.iconDelete}`} />
              <span>Eliminar</span>
            </button>
          )}

          <Link
            to={`/trabajadores/editar/${id_trabajador}`}
            onClick={() => setIsOpenModal(false)}
            className={styles.action}
          >
            <Pencil className={`${styles.icon} ${styles.iconEdit}`} />
            <span>Editar</span>
          </Link>
        </div>
      </header>

      <section className={styles.section}>
        <div className={styles.detailCard}>
          <div className={styles.row}>
            <span className={styles.label}>Nombre completo</span>
            <span className={styles.value}>{nombre_completo}</span>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Documento</span>
            <span className={styles.value}>{numero_documento}</span>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Tipo de documento</span>
            <span className={styles.value}>{tipoDocumentoNombre}</span>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Celular</span>
            <span className={styles.value}>{celular}</span>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Edad</span>
            <span className={styles.value}>{edad}</span>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Rol</span>
            <span className={styles.value}>{rol}</span>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Estado</span>
            <span className={styles.value}>
              {estado ? "Activo" : "Inactivo"}
            </span>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Dirección</span>
            <span className={styles.value}>{direccion}</span>
          </div>

          <div className={`${styles.row} ${styles.descriptionRow}`}>
            <span className={styles.label}>Observaciones</span>
            <p className={styles.description}>
              {observaciones || "Sin observaciones. Agrega comentarios."}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WorkerDetails;
