import { aboutInfo } from "@/data/accordionData";
import styles from "./SectionsInfo.module.css";

export const AboutUs = () => {
  return (
    <section className={styles.about_container}>
      <p className={styles.about_text}>
        AgroGestion360 nace con la idea de organizar la operacion diaria de una
        finca en un solo sistema. Hoy permite gestionar inventario,
        trabajadores, actividades, ganaderia, notificaciones y reportes desde
        una misma plataforma, reduciendo procesos manuales y mejorando el
        seguimiento de la informacion importante.
      </p>
      <br />
      <p className={styles.about_text}>
        El sistema diferencia accesos entre dueño y administrador, incorpora
        estadisticas reales en el dashboard, alertas de stock bajo, historial
        operativo y generacion de reportes PDF. Esta primera version estable
        esta pensada para ofrecer una base funcional, clara y confiable para la
        gestion agropecuaria actual.
      </p>

      <article className={styles.about_flexbox}>
        {aboutInfo.map((item, i) => (
          <section className={styles.about_box} key={i}>
            <i className={styles.about_icon}>
              <img src={item.svg} alt={`svg ${i}`} aria-hidden="true" />
            </i>
            <h3 className={styles.about_title}>{item.title}</h3>
            <p className={styles.about_description}>{item.shortDescription}</p>
          </section>
        ))}
      </article>
    </section>
  );
};

// [...Array(6)].map((_, i) => (

// |---------------------------------Features-----------------------------------------|
import { featureInfo } from "@/data/accordionData";

export const Features = () => {
  return (
    <article className={styles.feature_container}>
      {featureInfo.map((item, i) => (
        <section className={styles.feature_card} key={i}>
          <header className={styles.feature_header}>
            <i className={styles.feature_icon}>
              {typeof item.svg === "string" ? (
                <img src={item.svg} alt={`svg ${i}`} aria-hidden="true" />
              ) : (
                item.svg
              )}
            </i>
          </header>
          <section className={styles.feature_description}>
            <h3 className={styles.feature_title}>{item.title}</h3>
            <p className={styles.feature_text}>{item.description}</p>
          </section>
        </section>
      ))}
    </article>
  );
};

// |---------------------------------Faq-----------------------------------------|
import { faq } from "@/data/accordionData";

export const Faq = () => {
  return (
    <article className={styles.faq_container}>
      {faq.map((item, i) => (
        <section key={i}>
          <h3 className={styles.faq_title}>{item.title}</h3>
          <p className={styles.faq_description}>{item.description}</p>
        </section>
      ))}
    </article>
  );
};
