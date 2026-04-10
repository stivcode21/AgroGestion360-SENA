import { X } from "lucide-react";
import { useModalStore } from "@/store/modalStore";
import styles from "./ImgEnlarge.module.css";

const ImgEnlarge = () => {
  const { isImgEnlargeOpen, enlargedImage, closeImgEnlarge } = useModalStore();

  if (!isImgEnlargeOpen || !enlargedImage?.src) {
    return null;
  }

  return (
    <div className={styles.backdrop} onClick={closeImgEnlarge}>
      <div className={styles.card} onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          className={styles.closeButton}
          onClick={closeImgEnlarge}
          aria-label="Cerrar imagen ampliada"
        >
          <X />
        </button>

        <div className={styles.imageBox}>
          <img
            src={enlargedImage.src}
            alt={enlargedImage.alt || "Imagen ampliada"}
            className={styles.image}
          />
        </div>
      </div>
    </div>
  );
};

export default ImgEnlarge;
