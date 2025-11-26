import { Routes, Route } from "react-router-dom";
import Welcome from "@/pages/welcome/Welcome";
import Login from "@/pages/login/Login";
import Dashboard from "@/pages/dashboard/Dashboard";
import Inventario from "@/pages/inventario/Inventario";
import Trabajadores from "@/pages/trabajadores/Trabajadores";
import Actividades from "@/pages/actividades/Actividades";
import Ganaderia from "@/pages/ganaderia/Ganaderia";
import Porcicultura from "@/pages/porcicultura/Porcicultura";
import Reportes from "@/pages/reportes/Reportes";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/inventario" element={<Inventario />} />
      <Route path="/reportes" element={<Reportes />} />
      <Route path="/trabajadores" element={<Trabajadores />} />
      <Route path="/actividades" element={<Actividades />} />
      <Route path="/ganaderia" element={<Ganaderia />} />
      <Route path="/porcicultura" element={<Porcicultura />} />
    </Routes>
  );
};

export default AppRouter;
