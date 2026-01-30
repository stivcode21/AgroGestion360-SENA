import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./TableLayout.module.css";

const TableLayout = ({ headers, columns, compactColumns, children }) => {
  const resolvedHeaders = headers ?? [];
  const resolvedColumns = columns;
  const resolvedCompactColumns = compactColumns ?? columns;

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
