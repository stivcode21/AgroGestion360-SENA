import { Trash2, Pencil } from "lucide-react";
import styles from "./ProductDetails.module.css";
import { useModalStore } from "@/store/modalStore";
import { Link } from "react-router-dom";
import { formatDate } from "@/utils/formatDate";
import { buildApiUrl } from "@/utils/apiBase";
import toast from "react-hot-toast";
import { useLoader } from "@/context/loaderProvider/LoaderProvider";
import { useActionModal } from "@/context/actionModalProvider/ActionModalProvider";

const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const ProductDetails = () => {
  const { selectProduct, setSelectProduct, setIsOpenModal } = useModalStore();
  const { toggleLoader } = useLoader();
  const { openActionModal } = useActionModal();

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
        },
      );
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return;
      }

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
      <h2 className={styles.productCode}>{selectProduct.id_insumo}</h2>

      <header className={styles.header}>
        <h3 className={styles.sectionTitle}>Detalles</h3>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.action}
            onClick={openDeleteModal}
          >
            <Trash2 className={styles.icon} />
            <span>Eliminar</span>
          </button>
          <button
            type="button"
            className={styles.action}
            onClick={() => setIsOpenModal(false)}
          >
            <Link to={`/inventario/editar/${selectProduct.id_insumo}`}>
              <Pencil className={styles.icon} />
              <span>Editar</span>
            </Link>
          </button>
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
            <div className={styles.imageWrapper}>
              <div className={styles.imageCard}>
                {selectProduct.url_img ? (
                  <img
                    src={selectProduct.url_img}
                    alt={selectProduct.nombre}
                    loading="lazy"
                  />
                ) : (
                  <span className={styles.imageBadge}>Sin imagen</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;
