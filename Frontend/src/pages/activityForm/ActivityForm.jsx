import MainLayout from "@/components/templates/mainLayout/MainLayout";
import styles from "./ActivityForm.module.css";
import Button from "@/components/templates/button/Button";
import { ArrowLeft, Save } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import FormInput from "@/components/molecules/formInput/FormInput";
import FormTextarea from "@/components/atoms/formTextarea/FormTextarea";
import ImagePicker from "@/components/atoms/imagePicker/ImagePicker";
import { activityInputFields } from "@/data/activitiesData";
import { useLoader } from "@/context/loaderProvider/LoaderProvider";
import toast from "react-hot-toast";
import { buildApiUrl } from "@/utils/apiBase";
import { formatDate } from "@/utils/formatDate";
import { useUserStore } from "@/store/userStore";
import { hasRole } from "@/utils/auth";
import ConsumoForm from "@/components/organism/consumoForm/ConsumoForm";

const ActivityForm = ({ title }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [errors, setErrors] = useState({});
  const { toggleLoader } = useLoader();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const canView = hasRole(user, 1);

  const [formData, setFormData] = useState({
    idPerson: "",
    duration: "",
    activity: "",
    status: "1",
    dateInit: "",
    cost: "",
    description: "",
  });
  const [consumptionItems, setConsumptionItems] = useState([]);

  const { id } = useParams();
  const isEditMode = Boolean(id);

  const normalizeCostValue = (value) =>
    String(value ?? "").replace(/[^\d]/g, "");

  const validateForm = () => {
    const newErrors = {};

    if (!formData.idPerson) {
      newErrors.idPerson = "El ID del trabajador es obligatorio.";
    } else if (!/^[A-Za-z0-9\s]{1,}$/.test(formData.idPerson)) {
      newErrors.idPerson = "Solo numeros (hasta 6 digitos)";
    }

    if (!formData.duration.trim()) {
      newErrors.duration = "La duracion es obligatoria.";
    } else if (!/^.{3,40}$/.test(formData.duration.trim())) {
      newErrors.duration = "Minimo 3 caracteres";
    }

    if (!formData.activity.trim()) {
      newErrors.activity = "La actividad es obligatoria.";
    } else if (
      !/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]{3,}$/.test(formData.activity.trim())
    ) {
      newErrors.activity = "Solo letras y espacios (min 3 caracteres)";
    }

    if (!formData.status) {
      newErrors.status = "Selecciona un estado.";
    }

    if (
      formData.dateInit.trim() &&
      !/^\d{4}-\d{2}-\d{2}$/.test(formData.dateInit.trim())
    ) {
      newErrors.dateInit = "Formato esperado YYYY-MM-DD";
    }

    if (!formData.cost.trim()) {
      newErrors.cost = "El costo es obligatorio.";
    } else if (!/^\d{1,9}$/.test(formData.cost.trim())) {
      newErrors.cost = "Solo numeros (hasta 9 digitos)";
    }

    if (
      formData.description.trim() &&
      !/^.{3,500}$/.test(formData.description.trim())
    ) {
      newErrors.description = "Minimo 3 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // obtenemos los detalles del producto si estamos en modo edicion
  useEffect(() => {
    if (!isEditMode) return;

    const getDetails = async () => {
      try {
        toggleLoader(true);
        // Consulta el producto actual para editar con la ultima informacion guardada.
        const res = await fetch(buildApiUrl(`activity/getactivity/${id}`), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.message);
          return;
        }

        const actividades = data.data;

        console.log("Detalles de la actividad obtenidos:", actividades);
        setFormData({
          idPerson: String(actividades.id_trabajador ?? ""),
          duration: String(actividades.duracion ?? ""),
          activity: actividades.actividad ?? "",
          status: String(actividades.id_estado ?? ""),
          dateInit: formatDate(actividades.fecha_inicio),
          cost: normalizeCostValue(actividades.monto),
          description: actividades.observaciones ?? "",
        });

        setPreviewUrl(actividades.url_evidencia || "");
      } catch (error) {
        console.error("Error en getDetails:", error);
        toast.error("Ha ocurrido un error inesperado.");
      } finally {
        toggleLoader(false);
      }
    };

    getDetails();
  }, [id, isEditMode]);

  // validamos cada campo individualmente al salir de el, mostrando el error debajo del campo
  const handleBlur = (e) => {
    const { name } = e.target;
    const isValid = validateForm();

    if (isValid) return;

    setErrors((prev) => ({ [name]: prev[name] }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //envio final del formulario para crear o editar el producto dependiendo del modo
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    //validar que no haya consumos con cantidad vacia, si los hay se muestra un error y se detiene el proceso
    const hasIncompleteConsumption = consumptionItems.some(
      (item) => item.id_insumo && !String(item.cantidad ?? "").trim(),
    );

    if (hasIncompleteConsumption) {
      toast.error("Cada producto agregado en consumo debe tener una cantidad.");
      return;
    }

    // Normalizamos el arreglo para enviar solo los datos necesarios ademas de convertir las cantidades a numeros.
    const normalizedConsumptionItems = consumptionItems
      .map((item) => ({
        id_insumo: Number(item.id_insumo),
        cantidad: Number(item.cantidad),
      }))
      .filter((item) => item.id_insumo && item.cantidad);

    try {
      toggleLoader(true);

      const endpoint = isEditMode
        ? `activity/editactivity/${id}`
        : "activity/createactivity";
      const method = isEditMode ? "PUT" : "POST";

      // Convierte los valores del formulario al formato que espera la API de inventario.
      const res = await fetch(buildApiUrl(endpoint), {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id_trabajador: Number(formData.idPerson),
          duracion: String(formData.duration).trim(),
          actividad: formData.activity.trim(),
          id_estado: Number(formData.status),
          fecha_inicio: formData.dateInit || null,
          monto: Number(formData.cost),
          observaciones: formData.description.trim() || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      // acticidad guardada exitosamente, ahora procedemos a guardar el consumo si es que se agregaron items
      const savedActivity = data.data ?? {};
      const activityId = Number(savedActivity.id_registro ?? id);
      const shouldSyncConsumption =
        isEditMode || normalizedConsumptionItems.length > 0;

      if (shouldSyncConsumption) {
        const consumptionConfig = isEditMode
          ? {
              endpoint: `consumption/activity/${activityId}`,
              method: "PUT",
            }
          : {
              endpoint: "consumption/create",
              method: "POST",
            };

        const consumptionRes = await fetch(
          buildApiUrl(consumptionConfig.endpoint),
          {
            method: consumptionConfig.method,
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              id_actividad: activityId,
              id_responsable: Number(
                savedActivity.id_trabajador ?? formData.idPerson,
              ),
              items: normalizedConsumptionItems,
            }),
          },
        );

        const consumptionData = await consumptionRes.json();

        if (!consumptionRes.ok) {
          toast.error(
            `La actividad se guardó, pero el consumo no pudo procesarse: ${consumptionData.message}`,
          );
          setConsumptionItems([]);
          navigate("/actividades");
          return;
        }
      }

      setConsumptionItems([]);
      toast.success(data.message);
      navigate("/actividades");
    } catch (error) {
      console.error("error en actividad:", error);
      toast.error("Ha ocurrido un error inesperado.");
    } finally {
      toggleLoader(false);
    }
  };

  // manejamos el click en la imagen para abrir el selector de archivos
  const handleImageClick = () => {
    inputRef.current?.click();
  };

  // Función para manejar el cambio de imagen, creando una URL de objeto para mostrar una vista previa y liberando la URL anterior si existía.
  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <MainLayout>
      <section className={styles.page}>
        <button className={styles.titleGroup}>
          <Link to="/actividades" className={styles.back}>
            <ArrowLeft />
            <span>Volver</span>
          </Link>
        </button>
        <header>
          <h1 className={styles.title}>{title}</h1>
        </header>

        <section className={styles.card}>
          <h3 className={styles.sectionTitle}>Informacion</h3>

          <form className={styles.formLayout} onSubmit={handleSubmit}>
            <ImagePicker
              handleImageClick={handleImageClick}
              handleImageChange={handleImageChange}
              previewUrl={previewUrl}
              inputRef={inputRef}
            />

            <div className={styles.inputsGrid}>
              {activityInputFields.map((field) => (
                <FormInput
                  key={field.name}
                  label={field.label}
                  name={field.name}
                  placeholder={field.placeholder}
                  select={field?.select}
                  error={errors[field.name]}
                  disabled={field?.select && !canView}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  required={field?.required}
                  type={field?.type}
                  value={formData[field.name] ?? ""}
                />
              ))}
              <FormTextarea
                label="Descripcion"
                name="description"
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="Agrega una descripcion de la actividad"
                style={{ gridColumn: "1 / -1" }}
                value={formData.description}
              />
              <ConsumoForm
                activityId={id}
                consumptionItems={consumptionItems}
                isEditMode={isEditMode}
                setConsumptionItems={setConsumptionItems}
              />
            </div>

            <div className={styles.footerActions}>
              <Button type="three" buttonType="submit">
                <Save /> Guardar
              </Button>
            </div>
          </form>
        </section>
      </section>
    </MainLayout>
  );
};

export default ActivityForm;
