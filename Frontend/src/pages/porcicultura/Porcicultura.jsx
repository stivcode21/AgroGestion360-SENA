import MainLayout from "@/components/templates/mainLayout/MainLayout";
import Button from "@/components/templates/button/Button";
import styles from "./Porcicultura.module.css";
import { Plus, Search, Eye } from "lucide-react";
import { porciculturaData } from "@/data/porciculturaData";
import TableLayout, {
  tableClasses as tableStyles,
} from "@/components/templates/tableLayout/TableLayout";
import { useModalStore } from "@/store/modalStore";
import { Link } from "react-router-dom";

const Porcicultura = () => {
  const { setIsOpenModal, setSelectPig } = useModalStore();

  const openDetails = (id) => {
    setSelectPig(id);
    setIsOpenModal(true);
  };

  return (
    <MainLayout>
      <section className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.title}>Porcicultura</h1>
          <Link to="/porcicultura/registrar">
            <Button type="three">
              <Plus />
              Agregar
            </Button>
          </Link>
        </header>

        <section className={styles.listCard}>
          <div className={styles.actions}>
            <div className={styles.search}>
              <Search className={styles.icon} />
              <input type="text" placeholder="Buscar porcino" />
            </div>
          </div>

          <div className={styles.listWrapper}>
            <TableLayout
              headers={[
                "Porcino",
                "Raza",
                "Estado",
                "Peso",
                "Etapa",
                "Ultimo control",
                "",
              ]}
              columns="2.2fr 0.9fr 0.9fr 0.8fr 0.9fr 1fr 0.2fr"
              compactColumns="2fr 1fr 1fr 1fr 1fr 1fr 0.5fr"
            >
              {porciculturaData.map((item) => (
                <li key={item.id} className={tableStyles.row}>
                  <div className={tableStyles.itemInfo}>
                    <figure className={styles.pigThumb}>
                      <img src={item.avatar} alt={item.name} />
                    </figure>
                    <div>
                      <p className={styles.pigName}>{item.name}</p>
                      <span className={styles.pigTag}>{item.tag}</span>
                    </div>
                  </div>
                  <span className={styles.breed}>{item.breed}</span>
                  <span
                    className={`${styles.statusTag} ${styles[item.status]}`}
                  >
                    {item.statusLabel}
                  </span>
                  <span className={styles.weight}>{item.weight} kg</span>
                  <span className={styles.stage}>{item.stage}</span>
                  <span className={styles.lastCheck}>{item.lastCheck}</span>
                  <button
                    type="button"
                    className={tableStyles.actionButton}
                    aria-label={`Mas opciones para ${item.name}`}
                    onClick={() => openDetails(item.id)}
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

export default Porcicultura;
