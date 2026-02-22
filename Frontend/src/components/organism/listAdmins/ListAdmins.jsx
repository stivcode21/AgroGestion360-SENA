import styles from "./ListAdmins.module.css";
import AdminCard from "@/components/molecules/adminCard/AdminCard";
import { adminsData } from "@/data/adminsData";
import { Link } from "react-router-dom";
import Button from "@/components/templates/button/Button";
import { Plus } from "lucide-react";

const ListAdmins = () => {
  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>Administradores</h2>
          <p className={styles.description}>
            Gestiona los perfiles de administracion con una vista rapida en
            cards.
          </p>
        </div>
        <Link to={`/admin/registrar`}>
          <Button type="three">
            <Plus />
            Agregar
          </Button>
        </Link>
      </header>

      <section className={styles.grid}>
        {adminsData.map((admin) => (
          <AdminCard key={admin.id} admin={admin} />
        ))}
      </section>
    </section>
  );
};

export default ListAdmins;
