import { Building2, ChartPie, MessageCircleQuestionMark } from "lucide-react";
import panels from "@/assets/panels.svg";
import template from "@/assets/template.svg";
import tree from "@/assets/tree.svg";
import {
  AboutUs,
  Features,
} from "../components/organism/sectionsInfo/SectionsInfo";

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
