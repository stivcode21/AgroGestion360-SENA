import MainLayout from "@/components/templates/mainLayout/MainLayout";
import styles from "./Trabajadores.module.css";
import Button from "@/components/templates/button/Button";
import { ChevronDown, Eye, Filter, Plus, Search } from "lucide-react";
import TableLayout, {
  tableClasses as tableStyles,
} from "@/components/templates/tableLayout/TableLayout";
import { workersData } from "@/data/workersData";
import { useModalStore } from "@/store/modalStore";

const Trabajadores = () => {
  const { setIsOpenModal, setSelectWoker } = useModalStore();

  const OpenModal = (id) => {
    setIsOpenModal(true);
    setSelectWoker(id);
  };

  return (
    <MainLayout>
      <section className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.title}>Trabajadores</h1>
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
              <Filter />
              Filtros
              <ChevronDown />
            </button>
          </div>

          <div className={styles.tableWrapper}>
            <TableLayout type="Trabajadores">
              {workersData.map((item) => (
                <li key={item.id} className={tableStyles.row}>
                  <div className={tableStyles.itemInfo}>
                    <figure className={styles.thumbnail}>
                      <img src={item.avatar} alt={item.name} />
                    </figure>
                    <div>
                      <p className={tableStyles.title}>{item.name}</p>
                      <span className={tableStyles.subtitle}>
                        {item.document}
                      </span>
                    </div>
                  </div>
                  <span className={tableStyles.value}>{item.role}</span>
                  <span className={tableStyles.tag}>{item.status}</span>
                  <span className={tableStyles.emphasis}>
                    {item.activities}
                  </span>
                  <span className={tableStyles.value}>{item.phone}</span>
                  <button
                    type="button"
                    className={tableStyles.actionButton}
                    onClick={() => OpenModal(item.id)}
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

export default Trabajadores;
