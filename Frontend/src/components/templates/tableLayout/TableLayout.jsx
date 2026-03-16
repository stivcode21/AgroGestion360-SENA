import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./TableLayout.module.css";
import toast from "react-hot-toast";
import { useLoader } from "@/context/loaderProvider/LoaderProvider";
import { buildApiUrl } from "@/utils/apiBase";

const TableLayout = ({
  headers,
  columns,
  compactColumns,
  children,
  page,
  setPage,
  setProducts,
  endpoint,
  queryParams = {},
}) => {
  const resolvedHeaders = headers ?? [];
  const resolvedColumns = columns;
  const resolvedCompactColumns = compactColumns ?? columns;

  const { toggleLoader } = useLoader();

  const changePage = async (isNextPage) => {
    const nextPage = isNextPage ? page + 1 : page - 1;
    if (nextPage < 1) return;

    try {
      toggleLoader(true);
      const searchParams = new URLSearchParams();

      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.set(key, value);
        }
      });

      const queryString = searchParams.toString();
      const url = queryString
        ? buildApiUrl(`${endpoint}/${nextPage}?${queryString}`)
        : buildApiUrl(`${endpoint}/${nextPage}`);

      const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      setProducts(data.data);
      setPage(nextPage);
    } catch (error) {
      console.error("Error en inicio de sesion:", error);
      toast.error("Ha ocurrido un error inesperado.");
    } finally {
      toggleLoader(false);
    }
  };

  return (
    <div
      className={styles.table}
      style={{
        "--table-columns": resolvedColumns,
        "--table-columns-compact": resolvedCompactColumns,
      }}
    >
      <div className={styles.tableHead}>
        {resolvedHeaders.map((header, index) => (
          <span key={`${header}-${index}`}>{header}</span>
        ))}
      </div>

      <ul className={styles.tableBody}>{children}</ul>

      <footer className={styles.tableFooter}>
        <span>{`Pagina ${page}`}</span>
        <div className={styles.pagination}>
          <button
            type="button"
            className={styles.actionButton}
            disabled={page <= 1}
            onClick={() => changePage(false)}
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            onClick={() => changePage(true)}
            className={styles.actionButton}
          >
            <ChevronRight />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default TableLayout;

export const tableClasses = styles;
