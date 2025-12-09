import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./TableLayout.module.css";

const TableLayout = ({ type, children }) => {
  const isInventory = type === "Inventario";

  return (
    <div className={styles.table}>
      <div className={styles.tableHead}>
        <span>Nombre</span>
        <span>{isInventory ? "Codigo" : "Rol"}</span>
        <span>{isInventory ? "Cantidad" : "Estado"}</span>
        <span>{isInventory ? "Tipo" : "Actividades"}</span>
        <span>{isInventory ? "Precio uni" : "Celular"}</span>
        <span></span>
      </div>

      <ul className={styles.tableBody}>{children}</ul>

      <footer className={styles.tableFooter}>
        <span>Pagina 1</span>
        <div className={styles.pagination}>
          <button type="button" className={styles.actionButton} disabled>
            <ChevronLeft />
          </button>
          <button type="button" className={styles.actionButton}>
            <ChevronRight />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default TableLayout;

export const tableClasses = styles;
