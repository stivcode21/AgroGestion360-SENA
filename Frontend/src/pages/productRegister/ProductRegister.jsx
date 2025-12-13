import MainLayout from "@/components/templates/mainLayout/MainLayout";
import styles from "./ProductRegister.module.css";
import Button from "@/components/templates/button/Button";
import { ArrowLeft, Save } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import FormInput from "@/components/atoms/formInput/FormInput";
import FormTextarea from "@/components/atoms/formTextarea/FormTextarea";
import ImagePicker from "@/components/atoms/imagePicker/ImagePicker";

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
        <button className={styles.titleGroup}>
          <Link to="/inventario" className={styles.back}>
            <ArrowLeft />
            <span>Volver</span>
          </Link>
        </button>
        <header>
          <h1 className={styles.title}>Registrar producto</h1>
        </header>

        <section className={styles.card}>
          <h3 className={styles.sectionTitle}>Informacion</h3>

          <div className={styles.formLayout}>
            <ImagePicker
              handleImageClick={handleImageClick}
              handleImageChange={handleImageChange}
              previewUrl={previewUrl}
              inputRef={inputRef}
            />

            <div className={styles.inputsGrid}>
              {inputFields.map((field) => (
                <FormInput
                  key={field.name}
                  label={field.label}
                  name={field.name}
                  placeholder={field.placeholder}
                />
              ))}
              <FormTextarea
                label="Descripcion"
                name="description"
                placeholder="Agrega una descripcion del producto"
                style={{ gridColumn: "1 / -1" }}
              />
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
