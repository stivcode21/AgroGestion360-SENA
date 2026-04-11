import { X } from "lucide-react";
import { useModalStore } from "@/store/modalStore";
import styles from "./ImgEnlarge.module.css";

const ImgEnlarge = () => {
  const { isImgEnlargeOpen, enlargedImage, closeImgEnlarge } = useModalStore();

  if (!isImgEnlargeOpen || !enlargedImage?.src) {
    return null;
  }

  const cardClassName = `${styles.card} ${
    enlargedImage?.variant === "invoice" ? styles.invoiceCard : ""
  }`;
  const imageBoxClassName = `${styles.imageBox} ${
    enlargedImage?.variant === "invoice" ? styles.invoiceImageBox : ""
  }`;
  const imageClassName = `${styles.image} ${
    enlargedImage?.variant === "invoice" ? styles.invoiceImage : ""
  }`;

  return (
    <div className={styles.backdrop} onClick={closeImgEnlarge}>
      <div className={cardClassName} onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          className={styles.closeButton}
          onClick={closeImgEnlarge}
          aria-label="Cerrar imagen ampliada"
        >
          <X />
        </button>

        <div className={imageBoxClassName}>
          <img
            src={enlargedImage.src}
            alt={enlargedImage.alt || "Imagen ampliada"}
            className={imageClassName}
          />
        </div>
      </div>
    </div>
  );
};

export default ImgEnlarge;
