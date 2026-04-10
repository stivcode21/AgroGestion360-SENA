import { Banknote, Pencil, Trash2 } from "lucide-react";
import styles from "../productDetails/ProductDetails.module.css";
import { useModalStore } from "@/store/modalStore";
import { useDataStore } from "@/store/dataStore";
import { useLoader } from "@/context/loaderProvider/LoaderProvider";
import { useActionModal } from "@/context/actionModalProvider/ActionModalProvider";
import { Link } from "react-router-dom";
import { buildApiUrl } from "@/utils/apiBase";
import toast from "react-hot-toast";
import DetailsImage from "@/components/templates/detailsImage/DetailsImage";

const typeLabels = {
  bovino: "Bovino",
  porcino: "Porcino",
  caprino: "Caprino",
};

const GanaderiaDetails = () => {
  const { selectCattle, setIsOpenModal, setSelectCattle } = useModalStore();

  const { setGanaderia } = useDataStore();
  const { toggleLoader } = useLoader();
  const { openActionModal } = useActionModal();

  const handleDeleteConfirm = async () => {
    if (!selectCattle?.id_animal) return;

    try {
      toggleLoader(true);

      const res = await fetch(
        buildApiUrl(`ganaderia/deleteganaderia/${selectCattle.id_animal}`),
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

      setGanaderia((prev) =>
        prev.filter((item) => item.id_animal !== selectCattle.id_animal),
      );

      toast.success(data.message);
      setSelectCattle(null);
      setIsOpenModal(false);
    } catch (error) {
      console.error("Error al eliminar animal:", error);
      toast.error("Ha ocurrido un error inesperado.");
    } finally {
      toggleLoader(false);
    }
  };

  const openDeleteModal = () => {
    openActionModal({
      variant: "delete",
      title: "Quieres eliminar",
      highlight: selectCattle?.id_animal,
      description: "Esta accion eliminara el animal permanentemente.",
      onConfirm: handleDeleteConfirm,
    });
  };

  const handleSell = async () => {
    try {
      toggleLoader(true);

      const res = await fetch(
        buildApiUrl(`ganaderia/editganaderia/${selectCattle.id_animal}`),
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            estado_salud: "Vendido",
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);

      setGanaderia((prev) =>
        prev.map((item) =>
          item.id_animal === selectCattle.id_animal
            ? { ...item, estado_salud: "Vendido" }
            : item,
        ),
      );

      setIsOpenModal(false);
    } catch (error) {
      console.error(error);
      toast.error("Error al vender animal");
    } finally {
      toggleLoader(false);
    }
  };

  if (!selectCattle || !selectCattle.id_animal) {
    return (
      <div className={styles.container}>
        <p className={styles.empty}>No se encontraron datos del animal.</p>
      </div>
    );
  }

  const {
    id_animal,
    nombre,
    tipo,
    raza,
    peso_inicial,
    estado_salud,
    origen_ciudad,
    url_img,
    observaciones,
    fecha_nacimiento,
    vendido,
  } = selectCattle;

  return (
    <div className={styles.container}>
      <h2 className={styles.productCode}>{id_animal}</h2>

      <header className={styles.header}>
        <h3 className={styles.sectionTitle}>Detalles del animal</h3>

        <div className={styles.actions}>
          <button type="button" onClick={handleSell} className={styles.action}>
            <Banknote className={`${styles.icon} ${styles.iconPayment}`} />
            <span>Vender</span>
          </button>

          <button
            type="button"
            className={styles.action}
            onClick={openDeleteModal}
          >
            <Trash2 className={`${styles.icon} ${styles.iconDelete}`} />
            <span>Eliminar</span>
          </button>

          <Link
            to={`/ganaderia/editar/${id_animal}`}
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
            <span className={styles.label}>Nombre</span>
            <span className={styles.value}>{nombre}</span>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Tipo</span>
            <span className={styles.value}>{typeLabels[tipo] ?? tipo}</span>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Raza</span>
            <span className={styles.value}>{raza}</span>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Peso</span>
            <span className={styles.value}>{peso_inicial}</span>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Estado</span>
            <span className={styles.value}>{estado_salud}</span>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Origen</span>
            <span className={styles.value}>{origen_ciudad}</span>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Nacimiento</span>
            <span className={styles.value}>{fecha_nacimiento}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>vendido</span>
            <span className={styles.value}>{vendido}</span>
          </div>

          <div className={`${styles.row} ${styles.descriptionRow}`}>
            <span className={styles.label}>Observaciones</span>
            <p className={styles.description}>
              {observaciones || "Sin observaciones"}
            </p>
          </div>

          <div className={`${styles.row} ${styles.imageRow}`}>
            <span className={styles.label}>Foto</span>
            <DetailsImage
              imageSrc={
                url_img
                  ? url_img.startsWith("http")
                    ? url_img
                    : buildApiUrl(url_img)
                  : ""
              }
              alt={nombre}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default GanaderiaDetails;
