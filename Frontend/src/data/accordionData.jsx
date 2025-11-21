import {
  AboutUs,
  Faq,
  Features,
} from "../components/organism/sectionsInfo/SectionsInfo";
import {
  Building2,
  ChartNoAxesCombined,
  ChartPie,
  LayoutListIcon,
  MessageCircleQuestionMark,
  Users,
} from "lucide-react";
import panels from "@/assets/icons/panels.svg";
import template from "@/assets/icons/template.svg";
import tree from "@/assets/icons/tree.svg";

import cow from "@/assets/icons/cow.svg";
import pig from "@/assets/icons/pig.svg";
import notes from "@/assets/icons/notes.svg";

export const options = [
  {
    title: "Sobre nosotros",
    icon: <Building2 />,
    description: <AboutUs />,
  },
  {
    title: "Caracteristicas",
    icon: <ChartPie />,
    description: <Features />,
  },
  {
    title: "Preguntas frecuentes",
    icon: <MessageCircleQuestionMark />,
    description: <Faq />,
  },
];

export const aboutInfo = [
  {
    svg: panels,
    title: "Control total y centralizado",
    shortDescription: "Gestiona toda tu finca desde un solo lugar",
  },
  {
    svg: template,
    title: "Gestión inteligente y segura",
    shortDescription:
      "Roles de usuarios, permisos un manejo eficiente del equipo",
  },
  {
    svg: tree,
    title: "Evolución e innovación segura",
    shortDescription:
      "versión 1.0 en constante mejora y expansión de funciones",
  },
];

export const featureInfo = [
  {
    svg: <ChartNoAxesCombined />,
    title: "Informes y analisis",
    description: "Gestiona toda tu finca desde un solo lugar",
  },
  {
    svg: <LayoutListIcon />,
    title: "Inventario de insumos",
    description: "Visualización de reporte y descarga de reportes",
  },
  {
    svg: <Users />,
    title: "Trabajadores",
    description: "Registro de pagos, control y gestión de trabajadores",
  },
  {
    svg: cow,
    title: "Ganaderia",
    description: "Registro de nacimientos, vacunacion, ventas, compras etc.",
  },
  {
    svg: pig,
    title: "Porcicultura",
    description: "Registro de nacimientos, vacunacion, ventas, compras etc.",
  },
  {
    svg: notes,
    title: "Mantenimiento",
    description: "Control de gastos y registro de mantenimiento",
  },
];

export const faq = [
  {
    title: "¿Qué es Agrogestión360?",
    description:
      "Es una plataforma digital diseñada para ayudar a los productores a gestionar de forma organizada y sencilla las diferentes actividades de su finca: ganadería, porcicultura, piscicultura, inventarios, personal, ingresos y ventas, todo en un mismo lugar.",
  },
  {
    title: "¿Qué puedo hacer con Agrogestión360?",
    description:
      "Puedes registrar y controlar tu ganado, cerdos o peces, llevar inventarios de insumos, organizar la información de tus trabajadores, gestionar ventas, ingresos y recibir notificaciones importantes sobre las actividades de tu finca.",
  },
  {
    title: "¿Necesito internet para usar Agrogestión360?",
    description:
      "Actualmente se requiere conexión a internet para ingresar al sistema y sincronizar los datos. Sin embargo, estamos trabajando en funciones offline.",
  },
  {
    title: "¿En qué dispositivos funciona Agrogestión360?",
    description:
      "Funciona en computadores, tablets y celulares con conexión a internet, lo que te permite consultar la información de tu finca desde cualquier lugar.",
  },
  {
    title: "¿Necesito conocimientos técnicos para usar la aplicación?",
    description:
      "No. Agrogestión360 está diseñada para ser práctica y fácil de usar. Además, ofrecemos soporte y guías para que saques el máximo provecho de la plataforma.",
  },
  {
    title: "¿Tendrán nuevas funciones en el futuro?",
    description:
      "Sí. Esta es la versión 1.0, pero el proyecto seguirá creciendo con actualizaciones, mejoras y nuevas herramientas pensadas en las necesidades de los productores.",
  },
  {
    title:
      "¿Puedo usar la aplicación si tengo poco conocimiento de tecnología?",
    description:
      "Claro que sí. La plataforma está diseñada para ser intuitiva y contamos con tutoriales y asistencia personalizada.",
  },
  {
    title: "¿Cómo puedo obtener soporte si tengo un problema?",
    description:
      "Puedes comunicarte con nuestro equipo de soporte a través del chat integrado, correo electrónico o WhatsApp.",
  },
];
