  import { useEffect, useState } from "react";
import { Search, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { buildApiUrl } from "@/utils/apiBase";
import { consumoInputFields } from "@/data/activitiesData";
import styles from "./ConsumoForm.module.css";
import { useActionModal } from "@/context/actionModalProvider/ActionModalProvider";
import previuIMG from "@/assets/img/previuProduct.jpg";

// Obtener configuraciones de campos desde el arreglo de configuración
const searchField =
  consumoInputFields.find((field) => field.name === "searchProduct") ?? {};
const amountField =
  consumoInputFields.find((field) => field.name === "amount") ?? {};

const ConsumoForm = ({
  activityId,
  consumptionItems = [],
  isEditMode = false,
  setConsumptionItems,
}) => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { openActionModal } = useActionModal();

  // Cargar consumos existentes al entrar en modo edición
  useEffect(() => {
    if (!isEditMode || !activityId) {
      setConsumptionItems([]);
      return;
    }

    const getConsumptionByActivity = async () => {
      try {
        const res = await fetch(
          buildApiUrl(`consumption/activity/${activityId}`),
          {
            method: "GET",
            credentials: "include",
          },
        );
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.message ?? "No se pudo cargar el consumo.");
          return;
        }

        setConsumptionItems(
          (data.data ?? []).map((item) => ({
            id_consumo: item.id_consumo,
            id_insumo: Number(item.id_insumo),
            nombre: item.nombre ?? "",
            marca: item.marca ?? "",
            unidad_medida: item.unidad_medida ?? "",
            stock_disponible: Number(item.stock_disponible ?? 0),
            cantidad: String(item.cantidad ?? ""),
          })),
        );
      } catch (error) {
        console.error("Error al obtener consumos:", error);
        toast.error("Ha ocurrido un error inesperado.");
      }
    };

    getConsumptionByActivity();
  }, [activityId, isEditMode, setConsumptionItems]);

  // Buscar productos cada 300ms mientras el usuario escribe en el campo de búsqueda
  useEffect(() => {
    const trimmedSearch = search.trim();

    if (!trimmedSearch) {
      setSearchResults([]);
      return undefined;
    }

    const timeoutId = setTimeout(async () => {
      try {
        const params = new URLSearchParams({ search: trimmedSearch });
        const res = await fetch(
          buildApiUrl(`product/filter/1?${params.toString()}`),
          {
            method: "GET",
            credentials: "include",
          },
        );
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.message ?? "No se pudieron buscar productos.");
          return;
        }

        setSearchResults(data.data ?? []);
      } catch (error) {
        console.error("Error al buscar productos:", error);
        toast.error("Ha ocurrido un error inesperado.");
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search]);

  // Agregar producto seleccionado a la lista de consumos
  const handleSelectProduct = (product) => {
    //
    setConsumptionItems((prev) => {
      const exists = prev.some(
        (item) => Number(item.id_insumo) === Number(product.id_insumo),
      );

      if (exists) {
        return prev;
      }

      return [
        ...prev,
        {
          id_consumo: product.id_consumo ?? null,
          id_insumo: Number(product.id_insumo),
          nombre: product.nombre ?? "",
          marca: product.marca ?? "",
          unidad_medida: product.unidad_medida ?? "",
          stock_disponible: Number(
            product.stock_disponible ?? product.cantidad ?? 0,
          ),
          cantidad: String(product.cantidad_consumida ?? ""),
        },
      ];
    });
    setSearch("");
    setSearchResults([]);
  };

  // Manejar cambios en la cantidad consumida, validando que no supere el stock disponible
  const handleQuantityChange = (idInsumo, value) => {
    const nextValue = value.replace(/[^\d]/g, "");
    const currentItem = consumptionItems.find(
      (item) => Number(item.id_insumo) === Number(idInsumo),
    );

    if (!currentItem) {
      return;
    }

    const requestedAmount = Number(nextValue || 0);
    const availableStock = Number(currentItem.stock_disponible ?? 0);

    if (nextValue && requestedAmount > availableStock) {
      toast.error(
        `${currentItem.nombre || "Ese insumo"} solo tiene ${availableStock} unidades disponibles.`,
      );
      return;
    }

    setConsumptionItems((prev) =>
      prev.map((item) =>
        Number(item.id_insumo) === Number(idInsumo)
          ? { ...item, cantidad: nextValue }
          : item,
      ),
    );
  };

  // Crear un conjunto de IDs de insumos ya seleccionados para filtrado eficiente
  const selectedProductIds = new Set(
    consumptionItems.map((item) => Number(item.id_insumo)),
  );

  // Filtrar resultados de búsqueda para no mostrar productos ya seleccionados
  const visibleResults = searchResults.filter(
    (item) => !selectedProductIds.has(Number(item.id_insumo)),
  );

  const handleRemoveConsumption = (idInsumo) => {
    setConsumptionItems((prev) =>
      prev.filter(
        (currentItem) => Number(currentItem.id_insumo) !== Number(idInsumo),
      ),
    );
  };

  const openDeleteConsumptionModal = (item) => {
    openActionModal({
      variant: "delete",
      title: "Quieres eliminar",
      highlight: item?.nombre || "este consumo",
      description:
        "Esta accion eliminara el consumo del formulario. Recuerda guardar para aplicar el cambio definitivamente.",
      onConfirm: () => handleRemoveConsumption(item.id_insumo),
    });
  };

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <div>
          <h3 className={styles.sectionTitle}>
            Consumo de insumo <span>(Opcional)</span>
          </h3>
        </div>
      </header>

      <div className={styles.searchBox}>
        <label htmlFor="searchProduct" className={styles.label}>
          {searchField.label || "Busca los productos consumidos"}
        </label>
        <div className={styles.searchInput}>
          <Search className={styles.searchIcon} />
          <input
            id="searchProduct"
            type="text"
            placeholder={searchField.placeholder || "Busca un producto"}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {/* lista de resultados de busqueda */}
        {search.trim() ? (
          <div className={styles.searchResults}>
            {visibleResults.length > 0 ? (
              visibleResults.map((product) => (
                <button
                  key={product.id_insumo}
                  type="button"
                  className={styles.resultItem}
                  onClick={() => handleSelectProduct(product)}
                >
                  <img
                    className={styles.avatar}
                    src={
                      product.url_img
                        ? product.url_img.startsWith("http")
                          ? product.url_img
                          : buildApiUrl(product.url_img)
                        : previuIMG
                    }
                    alt={product.nombre}
                  />

                  <span className={styles.resultText}>
                    <strong>{product.nombre}</strong>
                    <small>
                      {product.marca || "Sin marca"} · Stock {product.cantidad}
                    </small>
                  </span>
                </button>
              ))
            ) : (
              <p className={styles.helperText}>
                No se encontraron productos con esa búsqueda.
              </p>
            )}
          </div>
        ) : null}
      </div>

      <div className={styles.itemsBox}>
        {consumptionItems.length === 0
          ? null
          : consumptionItems.map((item) => (
              <article key={item.id_insumo} className={styles.itemCard}>
                <div className={styles.itemInfo}>
                  <strong>{item.nombre}</strong>
                  <span>
                    {item.marca || "Sin marca"} {"->"} {item.stock_disponible} ·
                    {item.unidad_medida ? ` ${item.unidad_medida}` : ""}
                  </span>
                </div>

                <div className={styles.itemActions}>
                  <div className={styles.quantityField}>
                    <label htmlFor={`amount-${item.id_insumo}`}>
                      {amountField.label || "Cantidad"}
                    </label>
                    <input
                      id={`amount-${item.id_insumo}`}
                      type="text"
                      inputMode="numeric"
                      placeholder={amountField.placeholder || "Ej. 3"}
                      value={item.cantidad}
                      onChange={(event) =>
                        handleQuantityChange(item.id_insumo, event.target.value)
                      }
                    />
                  </div>

                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={() => openDeleteConsumptionModal(item)}
                    aria-label={`Quitar ${item.nombre}`}
                  >
                    <Trash2 />
                  </button>
                </div>
              </article>
            ))}
      </div>
    </section>
  );
};

export default ConsumoForm;
