import MainLayout from "@/components/templates/mainLayout/MainLayout";
import styles from "./ProductRegister.module.css";
import Button from "@/components/templates/button/Button";
import { ArrowLeft, Camera, Save } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const inputFields = [
  { name: "name", label: "Nombre *", placeholder: "Ej. Fumigador mochila" },
  { name: "brand", label: "Marca *", placeholder: "Ej. Truper" },
  { name: "type", label: "Tipo *", placeholder: "Selecciona un tipo" },
  { name: "quantity", label: "Cantidad *", placeholder: "Ej. 10" },
  { name: "unit", label: "Unidad de medida *", placeholder: "Ej. 20L" },
  { name: "price", label: "Precio unitario *", placeholder: "Ej. 120000" },
  { name: "expiration", label: "Fecha vencimiento", placeholder: "DD-MM-AA" },
  { name: "supplier", label: "Proveedor", placeholder: "Ej. Agroinsumos S.A." },
];

const ProductRegister = () => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const handleImageClick = () => {
    // Relacionamos el input con la imagen
    inputRef.current?.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Limpia URL previa para no dejar referencias colgando
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  useEffect(() => {
    // Limpia al desmontar
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <MainLayout>
      <section className={styles.page}>
        <header className={styles.header}>
          <div className={styles.titleGroup}>
            <Link to="/inventario" className={styles.back}>
              <ArrowLeft />
              <span>Volver</span>
            </Link>
          </div>
        </header>

        <section>
          <h1 className={styles.title}>Registrar producto</h1>
        </section>

        <section className={styles.card}>
          <h3 className={styles.sectionTitle}>Informacion</h3>

          <div className={styles.formLayout}>
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

            <div className={styles.inputsGrid}>
              {inputFields.map((field) => (
                <label key={field.name} className={styles.field}>
                  <span className={styles.label}>{field.label}</span>
                  <input
                    className={styles.input}
                    name={field.name}
                    placeholder={field.placeholder}
                  />
                </label>
              ))}
              <label className={styles.field} style={{ gridColumn: "1 / -1" }}>
                <span className={styles.label}>Descripcion</span>
                <textarea
                  className={styles.textarea}
                  name="description"
                  placeholder="Agrega una descripcion del producto"
                />
              </label>
            </div>
          </div>

          <div className={styles.footerActions}>
            <Button type="three">
              <Save /> Guardar
            </Button>
          </div>
        </section>
      </section>
    </MainLayout>
  );
};

export default ProductRegister;
