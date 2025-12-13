import { Camera } from "lucide-react";
import Button from "@/components/templates/button/Button";
import styles from "./ImagePicker.module.css";

const ImagePicker = ({
  handleImageClick,
  handleImageChange,
  previewUrl,
  inputRef,
}) => {
  return (
    <section className={styles.boxHeader}>
      <div className={styles.uploadIconBox} onClick={handleImageClick}>
        <figure className={styles.figure}>
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="imagen-seleccionada"
              className={styles.imagenPreviu}
            />
          ) : (
            <Camera className={styles.cameraIcon} />
          )}
          <input
            type="file"
            name="foto"
            id="foto"
            accept="image/*"
            ref={inputRef}
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </figure>
      </div>
      <div className={styles.uploader}>
        <div className={styles.uploadInfo}>
          <h4>Imagen</h4>
          <p>Min 400x400px, PNG o JPG</p>
        </div>
        <Button type="three" onClick={handleImageClick}>
          Seleccionar
        </Button>
      </div>
    </section>
  );
};

export default ImagePicker;
