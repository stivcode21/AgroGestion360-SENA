import { Trash2, Pencil } from "lucide-react";
import { inventoryItems } from "@/data/inventoryData";
import styles from "./ProductDetails.module.css";
import { useModalStore } from "@/store/modalStore";
import { Link } from "react-router-dom";

const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const ProductDetails = () => {
  const { selectProduct, setIsOpenModal } = useModalStore();
  const product = inventoryItems.find((item) => item.code === selectProduct);

  if (!product) {
    return (
      <div className={styles.container}>
        <p className={styles.empty}>No se encontraron datos del producto.</p>
      </div>
    );
  }

  const {
    code,
    name,
    brand,
    type,
    quantity,
    unit,
    price,
    registeredAt,
    updatedAt,
    description,
    image,
  } = product;

  const formattedPrice = currencyFormatter.format(price || 0);

  return (
    <div className={styles.container}>
      <h2 className={styles.productCode}>{code}</h2>

      <header className={styles.header}>
        <h3 className={styles.sectionTitle}>Detalles</h3>

        <div className={styles.actions}>
          <button type="button" className={styles.action}>
            <Trash2 className={styles.icon} />
            <span>Eliminar</span>
          </button>
          <button
            type="button"
            className={styles.action}
            onClick={() => setIsOpenModal(false)}
          >
            <Link to={`/inventario/editar/${code}`}>
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
            <span className={styles.value}>{name}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Marca</span>
            <span className={styles.value}>{brand}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Tipo</span>
            <span className={styles.value}>{type}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Cantidad</span>
            <span className={styles.value}>{quantity}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>U/medida</span>
            <span className={styles.value}>{unit || "N/A"}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Precio unitario</span>
            <span className={styles.value}>{formattedPrice}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Fecha registro</span>
            <span className={styles.value}>{registeredAt || "--"}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Ultima actualizacion</span>
            <span className={styles.value}>{updatedAt || "--"}</span>
          </div>
          <div className={`${styles.row} ${styles.descriptionRow}`}>
            <span className={styles.label}>Descripcion</span>
            <p className={styles.description}>
              {description ||
                "Sin descripcion. Agrega detalles para este producto."}
            </p>
          </div>
          <div className={`${styles.row} ${styles.imageRow}`}>
            <span className={styles.label}>Imagen</span>
            <div className={styles.imageWrapper}>
              <div className={styles.imageCard}>
                {image ? (
                  <img src={image} alt={name} loading="lazy" />
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
