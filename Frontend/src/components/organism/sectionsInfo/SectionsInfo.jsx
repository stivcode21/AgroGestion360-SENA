import { aboutInfo } from "@/data/accordionData";
import styles from "./SectionsInfo.module.css";

export const AboutUs = () => {
  return (
    <section>
      <p className={styles.text}>
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
      <p className={styles.text}>
        Nuestro objetivo es brindar una herramienta confiable que apoye a los
        productores en la toma de decisiones, optimice su tiempo y facilite el
        crecimiento de sus fincas. Creemos en la innovación al servicio del
        campo y en construir soluciones que aporten valor real a quienes día a
        día trabajan por alimentar al mundo.
      </p>

      <section className={styles.flexbox}>
        {aboutInfo.map((item, i) => (
          <article className={styles.box} key={i}>
            <i className={styles.icon}>
              <img src={item.svg} alt={`svg ${i}`} aria-hidden="true" />
            </i>
            <h3 className={styles.title}>{item.title}</h3>
            <p className={styles.description}>{item.shortDescription}</p>
          </article>
        ))}
      </section>
    </section>
  );
};

// |---------------------------------Features-----------------------------------------|

export const Features = () => {
  return <p>hola mundo</p>;
};
