import { Maximize2 } from "lucide-react";
import { useModalStore } from "@/store/modalStore";
import styles from "./DetailsImage.module.css";

const DetailsImage = ({
  imageSrc = "",
  defaultImageSrc = "",
  alt = "Imagen",
  emptyLabel = "Sin imagen",
  variant = "card",
}) => {
  const { openImgEnlarge } = useModalStore();

  const resolvedImage = imageSrc || defaultImageSrc;
  const canEnlarge = Boolean(imageSrc);
  const wrapperClassName = `${styles.wrapper} ${
    variant === "avatar" ? styles.avatarWrapper : ""
  }`;
  const frameClassName = `${styles.frame} ${
    variant === "avatar" ? styles.avatarFrame : ""
  } ${canEnlarge ? styles.interactive : ""}`;

  const handleOpen = () => {
    if (!canEnlarge) return;

    openImgEnlarge({
      src: imageSrc,
      alt,
    });
  };

  return (
    <div className={wrapperClassName}>
      <div
        className={frameClassName}
        onClick={handleOpen}
        role={canEnlarge ? "button" : undefined}
        tabIndex={canEnlarge ? 0 : undefined}
        onKeyDown={(event) => {
          if (!canEnlarge) return;

          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleOpen();
          }
        }}
      >
        {resolvedImage ? (
          <img src={resolvedImage} alt={alt} loading="lazy" className={styles.image} />
        ) : (
          <span className={styles.placeholder}>{emptyLabel}</span>
        )}

        {canEnlarge ? (
          <div className={styles.overlay} aria-hidden="true">
            <Maximize2 className={styles.icon} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default DetailsImage;
