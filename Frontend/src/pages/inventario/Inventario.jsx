import MainLayout from "@/components/templates/mainLayout/MainLayout";
import styles from "./Inventario.module.css";
import Button from "@/components/templates/button/Button";
import { ChevronDown, Eye, Filter, Plus, Search } from "lucide-react";
import { inventoryItems } from "@/data/inventoryData";
import { useModalStore } from "@/store/modalStore";
import TableLayout, {
  tableClasses as tableStyles,
} from "@/components/templates/tableLayout/TableLayout";
import { Link } from "react-router-dom";
import { useState } from "react";
import FiltersBox from "../../components/molecules/filtersBox/FiltersBox";

const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const Inventario = () => {
  const { setIsOpenModal, setSelectProduct } = useModalStore();
  const [state, setState] = useState(false);

  const OpenModal = (id) => {
    setIsOpenModal(true);
    setSelectProduct(id);
  };

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
            >
              {inventoryItems.map((item) => (
                <li key={item.id} className={tableStyles.row}>
                  <div className={tableStyles.itemInfo}>
                    <figure className={tableStyles.thumbnail}>
                      <img src={item.image} alt={item.name} />
                    </figure>
                    <div>
                      <p className={tableStyles.title}>{item.name}</p>
                      <span className={tableStyles.subtitle}>{item.brand}</span>
                    </div>
                  </div>
                  <span className={tableStyles.value}>{item.code}</span>
                  <span className={tableStyles.value}>{item.quantity}</span>
                  <span className={tableStyles.tag}>{item.type}</span>
                  <span className={tableStyles.emphasis}>
                    {currencyFormatter.format(item.price)}
                  </span>
                  <button
                    type="button"
                    className={tableStyles.actionButton}
                    onClick={() => OpenModal(item.code)}
                    aria-label={`Ver detalles de ${item.name}`}
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
