// src/components/molecules/Accordion/Accordion.jsx
import { useState } from "react";
import styles from "./Accordion.module.css";

const Accordion = ({ items }) => {
  const [openItem, setOpenItem] = useState(0);

  const toggleItem = (index) =>
    setOpenItem((current) => (current === index ? null : index));

  return (
    <section className={styles.accordion}>
      {items.map(({ title, icon, description }, index) => (
        <article
          key={`${title}-${index}`}
          className={`${styles.accordionItem} ${
            index === openItem ? styles.open : ""
          } ${index < openItem ? styles.completed : ""}`}
        >
          <button
            type="button"
            className={styles.accordionHeader}
            onClick={() => toggleItem(index)}
            aria-expanded={index === openItem}
          >
            <span>
              <span className={styles.icon}>{icon}</span>
              <h3 className={styles.title}>{title}</h3>
            </span>
            <span className={styles.arrow} aria-hidden="true">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 9L12 15L5 9"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </button>
          <div className={styles.description} aria-hidden={index !== openItem}>
            {description}
          </div>
        </article>
      ))}
    </section>
  );
};

export default Accordion;
