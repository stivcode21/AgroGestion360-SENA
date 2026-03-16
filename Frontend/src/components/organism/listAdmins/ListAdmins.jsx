import styles from "./ListAdmins.module.css";
import AdminCard from "@/components/molecules/adminCard/AdminCard";
import { Link } from "react-router-dom";
import Button from "@/components/templates/button/Button";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLoader } from "@/context/loaderProvider/LoaderProvider";
import { buildApiUrl } from "@/utils/apiBase";

const ListAdmins = () => {
  const [admins, setAdmins] = useState();
  const { toggleLoader } = useLoader();

  useEffect(() => {
    const getAdmins = async () => {
      try {
        toggleLoader(true);
        const res = await fetch(buildApiUrl("auth/admins/list"), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.message);
          return;
        }

        setAdmins(data.admins);
      } catch (error) {
        console.error("Error en getProducts:", error);
        toast.error("Ha ocurrido un error inesperado.");
      } finally {
        toggleLoader(false);
      }
    };
    getAdmins();
  }, []);

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
        {admins?.map((admin) => (
          <AdminCard key={admin.id_usuario} admin={admin} />
        ))}
      </section>
    </section>
  );
};

export default ListAdmins;
