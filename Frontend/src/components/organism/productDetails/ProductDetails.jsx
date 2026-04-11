import { Trash2, Pencil } from "lucide-react";
import styles from "./ProductDetails.module.css";
import { useModalStore } from "@/store/modalStore";
import { Link } from "react-router-dom";
import { formatDate } from "@/utils/formatDate";
import { buildApiUrl } from "@/utils/apiBase";
import toast from "react-hot-toast";
import { useLoader } from "@/context/loaderProvider/LoaderProvider";
import { useActionModal } from "@/context/actionModalProvider/ActionModalProvider";
import { useDataStore } from "@/store/dataStore";
import DetailsImage from "@/components/templates/detailsImage/DetailsImage";
import { hasRole } from "@/utils/auth";
import { useUserStore } from "@/store/userStore";

const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const ProductDetails = () => {
  const { selectProduct, setSelectProduct, setIsOpenModal } = useModalStore();
  const { setProducts } = useDataStore();
  const { toggleLoader } = useLoader();
  const { openActionModal } = useActionModal();
  const { user } = useUserStore();
  const canView = hasRole(user, 1);

  const handleDeleteConfirm = async () => {
    if (!selectProduct?.id_insumo) return;

    try {
      toggleLoader(true);
      // Borra el producto seleccionado y cierra el detalle cuando el backend confirma la eliminacion.
      const res = await fetch(
        buildApiUrl(`product/delete/${selectProduct.id_insumo}`),
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

      setProducts((prev) =>
        prev.filter((item) => item.id_insumo !== selectProduct.id_insumo),
      );
      toast.success(data.message);
      setSelectProduct(null);
      setIsOpenModal(false);
    } catch (error) {
      console.error("Error al eliminar producto:", error);
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
      highlight: selectProduct?.nombre,
      description: "Esta accion eliminara el producto permanentemente.",
      onConfirm: handleDeleteConfirm,
    });
  };

  if (!selectProduct) {
    return (
      <div className={styles.container}>
        <p className={styles.empty}>No se encontraron datos del producto.</p>
      </div>
    );
  }

  const formattedPrice = currencyFormatter.format(
    selectProduct.precio_unitario || 0,
  );

  return (
    <div className={styles.container}>
      <h2 className={styles.productCode}>PRD-{selectProduct.id_insumo}</h2>

      <header className={styles.header}>
        <h3 className={styles.sectionTitle}>Detalles de producto</h3>

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
            to={`/inventario/editar/${selectProduct.id_insumo}`}
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
            <span className={styles.value}>{selectProduct.nombre}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Marca</span>
            <span className={styles.value}>{selectProduct.marca}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Tipo</span>
            <span className={styles.value}>{selectProduct.tipo}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Cantidad</span>
            <span className={styles.value}>{selectProduct.cantidad}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>U/medida</span>
            <span className={styles.value}>
              {selectProduct.unidad_medida || "N/A"}
            </span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Proveedor</span>
            <span className={styles.value}>
              {selectProduct.proveedor || "Ninguno"}
            </span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Precio unitario</span>
            <span className={styles.value}>{formattedPrice}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Fecha registro</span>
            <span className={styles.value}>
              {formatDate(selectProduct.fecha_registro) || "--"}
            </span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>fecha vencimiento</span>
            <span className={styles.value}>
              {formatDate(selectProduct.fecha_vencimiento) || "--"}
            </span>
          </div>
          <div className={`${styles.row} ${styles.descriptionRow}`}>
            <span className={styles.label}>Descripcion</span>
            <p className={styles.description}>
              {selectProduct.observaciones ||
                "Sin descripcion. Agrega detalles para este producto."}
            </p>
          </div>
          <div className={`${styles.row} ${styles.imageRow}`}>
            <span className={styles.label}>Imagen</span>
            <DetailsImage
              imageSrc={selectProduct.url_img}
              alt={selectProduct.nombre}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;
