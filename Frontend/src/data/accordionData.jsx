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
  Bell,
  MessageCircleQuestionMark,
  Users,
} from "lucide-react";
import panels from "@/assets/icons/panels.svg";
import template from "@/assets/icons/template.svg";
import tree from "@/assets/icons/tree.svg";

import cow from "@/assets/icons/cow.svg";
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
    title: "Operacion centralizada",
    shortDescription:
      "AgroGestion360 concentra inventario, trabajadores, actividades, ganaderia y reportes en una sola plataforma.",
  },
  {
    svg: template,
    title: "Gestion segura por roles",
    shortDescription:
      "El sistema diferencia accesos entre dueño y administrador para proteger acciones sensibles y organizar mejor el trabajo.",
  },
  {
    svg: tree,
    title: "Version estable y escalable",
    shortDescription:
      "La version 1.0 deja una base funcional lista para crecer con nuevos modulos y mejoras del entorno agropecuario.",
  },
];

export const featureInfo = [
  {
    svg: <ChartNoAxesCombined />,
    title: "Dashboard y estadisticas",
    description:
      "Muestra resumenes reales del sistema con cards, top trabajadores y actividad operativa semanal.",
  },
  {
    svg: <LayoutListIcon />,
    title: "Inventario de insumos",
    description:
      "Permite registrar, editar, filtrar, visualizar detalles y recibir alertas por stock bajo.",
  },
  {
    svg: <Users />,
    title: "Trabajadores",
    description:
      "Gestiona el personal, su informacion base, su estado y su relacion con las actividades registradas.",
  },
  {
    svg: cow,
    title: "Ganaderia",
    description:
      "Administra animales, vacunaciones, ventas, historial sanitario y seguimiento detallado por registro.",
  },
  {
    svg: notes,
    title: "Actividades y reportes",
    description:
      "Controla actividades, consumos de insumo, pagos, facturas y generacion de reportes PDF del sistema.",
  },
  {
    svg: <Bell />,
    title: "Notificaciones",
    description:
      "Integra solicitudes internas y alertas de stock bajo para mantener visible lo que requiere atencion inmediata.",
  },
];

export const faq = [
  {
    title: "¿Qué es Agrogestión360?",
    description:
      "Es una aplicacion web enfocada en la gestion operativa de fincas. Integra inventario, trabajadores, actividades, ganaderia, reportes y notificaciones desde un mismo entorno.",
  },
  {
    title: "¿Qué puedo hacer con Agrogestión360?",
    description:
      "Puedes administrar insumos, registrar trabajadores, crear actividades, asociar consumos, gestionar ganado, registrar ventas de animales, controlar vacunaciones y generar reportes PDF.",
  },
  {
    title: "¿Qué notificaciones maneja el sistema?",
    description:
      "Actualmente muestra solicitudes internas y alertas de stock bajo en inventario para ayudarte a reaccionar a tiempo frente a compras necesarias.",
  },
  {
    title: "¿Cómo se controlan los permisos dentro de la aplicacion?",
    description:
      "AgroGestion360 usa roles para mostrar o restringir acciones sensibles. Por ejemplo, algunas eliminaciones o vistas administrativas solo estan disponibles para el dueño del sistema.",
  },
  {
    title: "¿Qué reportes genera Agrogestión360?",
    description:
      "La version actual genera reportes de inventario, nomina por actividades y ventas de animales, ademas de facturas PDF para pagos de actividades.",
  },
  {
    title: "¿Necesito internet para usar Agrogestión360?",
    description:
      "Si. La aplicacion depende de una API y de una base de datos PostgreSQL, por lo que necesita conexion para consultar y guardar informacion.",
  },
  {
    title: "¿En qué estado se encuentra el proyecto?",
    description:
      "AgroGestion360 se encuentra en una primera version estable, con una base funcional completa para la operacion actual del sistema.",
  },
];
