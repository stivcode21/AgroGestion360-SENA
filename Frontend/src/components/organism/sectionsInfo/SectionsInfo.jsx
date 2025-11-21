import { aboutInfo } from "@/data/accordionData";
import styles from "./SectionsInfo.module.css";

export const AboutUs = () => {
  return (
    <section className={styles.about_container}>
      <p className={styles.about_text}>
        Agrogestión360 nace como un proyecto creado con la visión de hacer más
        fácil y organizado el manejo de una finca. Es un sistema que permite a
        los dueños tener control total de sus actividades en un solo lugar:
        ganadería, porcicultura, piscicultura, inventarios, trabajadores,
        ingresos y ventas. También ofrece notificaciones y distintos niveles de
        acceso para administradores y empleados, lo que lo hace práctico y
        seguro. Esta es la versión 1.0, que ya cumple con lo esencial, pero la
        idea es que siga creciendo, mejorando y sumando nuevas funciones con el
        tiempo. Agrogestión360 no es solo un sistema, es el inicio de una
        herramienta pensada para evolucionar junto al campo.
      </p>
      <br />
      <p className={styles.about_text}>
        Nuestro objetivo es brindar una herramienta confiable que apoye a los
        productores en la toma de decisiones, optimice su tiempo y facilite el
        crecimiento de sus fincas. Creemos en la innovación al servicio del
        campo y en construir soluciones que aporten valor real a quienes día a
        día trabajan por alimentar al mundo.
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
