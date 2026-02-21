import styles from "./FiltersBox.module.css";
import {
  ArrowUpDown,
  Calendar,
  ListFilter,
  Search,
  SlidersHorizontal,
  Tag,
  ToggleLeft,
} from "lucide-react";

const FiltersBox = () => {
  return (
    <div className={styles.container}>
      <div className={styles.body}>
        <p className={styles.sectionTitle}>Filtros</p>
        <div className={styles.list}>
          <button className={styles.filterButton} type="button">
            <Search />
            Buscar
          </button>
          <button className={styles.filterButton} type="button">
            <Calendar />
            Fecha
          </button>
          <button className={styles.filterButton} type="button">
            <ToggleLeft />
            Estado
          </button>
          <button className={styles.filterButton} type="button">
            <Tag />
            Categoría
          </button>
          <button className={styles.filterButton} type="button">
            <ListFilter />
            Rango
          </button>
          <button className={styles.filterButton} type="button">
            <ArrowUpDown />
            Ordenar
          </button>
          <button className={styles.filterButton} type="button">
            <SlidersHorizontal />
            Avanzado
          </button>
        </div>
      </div>
    </div>
  );
};

export default FiltersBox;
