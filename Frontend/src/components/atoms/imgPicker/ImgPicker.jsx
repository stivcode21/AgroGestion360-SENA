import { Camera } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Button from "@/components/templates/button/Button";
import { buildApiUrl } from "@/utils/apiBase";
import { useLoader } from "@/context/loaderProvider/LoaderProvider";
import toast from "react-hot-toast";
import styles from "./ImgPicker.module.css";

const ImgPicker = ({
  urlValue = "",
  setUrlState,
  title = "Imagen",
  description = "Min 400x400px, PNG o JPG",
}) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(urlValue);
  const { toggleLoader } = useLoader();

  // Si el padre cambia la URL guardada, la vista previa tambien se actualiza.
  useEffect(() => {
    setPreviewUrl(urlValue || "");
  }, [urlValue]);

  const handleImageClick = () => {
    inputRef.current?.click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Selecciona una imagen valida.");
      return;
    }

    try {
      toggleLoader(true);

      // El backend espera el archivo en un FormData con la llave "image".
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(buildApiUrl("image/upload"), {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message ?? "No se pudo subir la imagen.");
        return;
      }

      // Guarda la URL final en el estado del formulario padre.
      setUrlState(data.url);
      setPreviewUrl(data.url);
      toast.success("Imagen subida correctamente.");
    } catch (error) {
      console.error("Error al subir imagen:", error);
      toast.error("Ha ocurrido un error inesperado.");
    } finally {
      if (inputRef.current) {
        inputRef.current.value = "";
      }

      toggleLoader(false);
    }
  };

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
            name="image"
            id="image"
            accept="image/*"
            ref={inputRef}
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </figure>
      </div>
      <div className={styles.uploader}>
        <div className={styles.uploadInfo}>
          <h4>{title}</h4>
          <p>{description}</p>
          {previewUrl ? (
            <span className={styles.statusText}>cargada correctamente.</span>
          ) : null}
        </div>
        <Button type="three" onClick={handleImageClick}>
          Seleccionar
        </Button>
      </div>
    </section>
  );
};

export default ImgPicker;
