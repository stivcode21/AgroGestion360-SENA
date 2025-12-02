import MainLayout from "@/components/templates/mainLayout/MainLayout";
import styles from "./Inventario.module.css";
import Button from "@/components/templates/button/Button";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { inventoryItems } from "@/data/inventoryData";

const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const Inventario = () => {
  return (
    <MainLayout>
      <section className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.title}>Insumos</h1>
          <Button type="three">
            <Plus />
            Agregar
          </Button>
        </header>

        <section className={styles.card}>
          <div className={styles.actions}>
            <div className={styles.search}>
              <Search className={styles.icon} />
              <input type="text" placeholder="Buscar" />
            </div>
            <button className={styles.filter} type="button">
              <SlidersHorizontal />
              Filtros
            </button>
          </div>

          <div className={styles.table}>
            <div className={styles.tableHead}>
              <span>Nombre</span>
              <span>Codigo</span>
              <span>Cantidad</span>
              <span>Tipo</span>
              <span>Precio uni</span>
              <span></span>
            </div>

            <ul className={styles.tableBody}>
              {inventoryItems.map((item) => (
                <li key={item.id} className={styles.row}>
                  <div className={styles.product}>
                    <figure className={styles.imageBox}>
                      <img src={item.image} alt={item.name} />
                    </figure>
                    <div>
                      <p className={styles.productName}>{item.name}</p>
                      <span className={styles.productBrand}>{item.brand}</span>
                    </div>
                  </div>
                  <span className={styles.cell}>{item.code}</span>
                  <span className={styles.cell}>{item.quantity}</span>
                  <span className={styles.type}>{item.type}</span>
                  <span className={styles.price}>
                    {currencyFormatter.format(item.price)}
                  </span>
                  <button
                    type="button"
                    className={styles.iconButton}
                    aria-label={`Ver detalles de ${item.name}`}
                  >
                    <Eye />
                  </button>
                </li>
              ))}
            </ul>

            <footer className={styles.tableFooter}>
              <span>Pagina 1</span>
              <div className={styles.pagination}>
                <button type="button" className={styles.iconButton} disabled>
                  <ChevronLeft />
                </button>
                <button type="button" className={styles.iconButton}>
                  <ChevronRight />
                </button>
              </div>
            </footer>
          </div>
        </section>
      </section>
    </MainLayout>
  );
};

export default Inventario;
