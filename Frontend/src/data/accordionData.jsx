import {
  AboutUs,
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
    description: <p>preguntas</p>,
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
