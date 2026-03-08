import MainLayout from "@/components/templates/mainLayout/MainLayout";
import styles from "./Inventario.module.css";
import Button from "@/components/templates/button/Button";
import { ChevronDown, Eye, Filter, Plus, Search } from "lucide-react";
import { useModalStore } from "@/store/modalStore";
import TableLayout, {
  tableClasses as tableStyles,
} from "@/components/templates/tableLayout/TableLayout";
import { Link } from "react-router-dom";
import { useState } from "react";
import FiltersBox from "../../components/molecules/filtersBox/FiltersBox";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useLoader } from "@/context/loaderProvider/LoaderProvider";
import { buildApiUrl } from "@/utils/apiBase";
import previuIMG from "@/assets/img/previuIMG.webp";

const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const Inventario = () => {
  const { setIsOpenModal, setSelectProduct } = useModalStore();
  const [state, setState] = useState(false);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);

  const { toggleLoader } = useLoader();

  const OpenModal = (product) => {
    setIsOpenModal(true);
    setSelectProduct(product);
  };

  useEffect(() => {
    const getProducts = async () => {
      try {
        toggleLoader(true);
        const res = await fetch(buildApiUrl("product/list/1"), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.message);
          return;
        }

        setProducts(data.data);
      } catch (error) {
        console.error("Error en getProducts:", error);
        toast.error("Ha ocurrido un error inesperado.");
      } finally {
        toggleLoader(false);
      }
    };
    getProducts();
  }, []);

  return (
    <MainLayout>
      <section className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.title}>Insumos</h1>
          <Link to={`/inventario/registrar`}>
            <Button type="three">
              <Plus />
              Agregar
            </Button>
          </Link>
        </header>

        <section className={styles.card}>
          <div className={styles.actions}>
            <div className={styles.search}>
              <Search className={styles.icon} />
              <input type="text" placeholder="Buscar" />
            </div>
            <button
              className={styles.filter}
              type="button"
              onClick={() => setState(!state)}
            >
              <Filter />
              Filtros
              <ChevronDown />
            </button>
            {state && <FiltersBox />}
          </div>

          <div className={styles.tableWrapper}>
            <TableLayout
              headers={[
                "Nombre",
                "Codigo",
                "Cantidad",
                "Tipo",
                "Precio uni",
                "",
              ]}
              columns="2.3fr 1fr 0.7fr 0.8fr 0.7fr 0.25fr"
              compactColumns="2fr 1fr 1fr 1fr 1fr 0.5fr"
              setPage={setPage}
              setProducts={setProducts}
              page={page}
              endpoint="product/list"
            >
              {products.map((item) => (
                <li key={item.id_insumo} className={tableStyles.row}>
                  <div className={tableStyles.itemInfo}>
                    <figure className={tableStyles.thumbnail}>
                      <img src={item?.image || previuIMG} alt={item.nombre} />
                    </figure>
                    <div>
                      <p className={tableStyles.title}>{item.nombre}</p>
                      <span className={tableStyles.subtitle}>{item.marca}</span>
                    </div>
                  </div>
                  <span
                    className={tableStyles.value}
                  >{`PRD-${item.id_insumo}`}</span>
                  <span className={tableStyles.value}>{item.cantidad}</span>
                  <span className={tableStyles.tag}>{item.tipo}</span>
                  <span className={tableStyles.emphasis}>
                    {currencyFormatter.format(item.precio_unitario)}
                  </span>
                  <button
                    type="button"
                    className={tableStyles.actionButton}
                    onClick={() => OpenModal(item)}
                    aria-label={`Ver detalles de ${item.nombre}`}
                  >
                    <Eye />
                  </button>
                </li>
              ))}
            </TableLayout>
          </div>
        </section>
      </section>
    </MainLayout>
  );
};

export default Inventario;
