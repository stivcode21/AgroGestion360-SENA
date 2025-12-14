import { Routes, Route } from "react-router-dom";
import Welcome from "@/pages/welcome/Welcome";
import Login from "@/pages/login/Login";
import Dashboard from "@/pages/dashboard/Dashboard";
import Inventario from "@/pages/inventario/Inventario";
import Workers from "../pages/workers/Workers";
import Actividades from "@/pages/actividades/Actividades";
import Ganaderia from "@/pages/ganaderia/Ganaderia";
import Porcicultura from "@/pages/porcicultura/Porcicultura";
import Reportes from "@/pages/reportes/Reportes";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import ProductRegister from "@/pages/productRegister/ProductRegister";
import ProductEdit from "@/pages/productEdit/ProductEdit";
import WorkerRegister from "@/pages/workerRegister/WorkerRegister";

const AppRouter = () => {
  // const navigate = useNavigate();
  // const { isLogin, setIsLogin } = useAuthStore();

  // useEffect(() => {
  //   if (isLogin) {
  //     navigate("/dashboard")
  //   } else
  // }, []);

  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/inventario" element={<Inventario />} />
      <Route path="/inventario/registrar" element={<ProductRegister />} />
      <Route path="/inventario/editar/:id" element={<ProductEdit />} />
      <Route path="/reportes" element={<Reportes />} />
      <Route path="/trabajadores" element={<Workers />} />
      <Route path="/trabajadores/registrar" element={<WorkerRegister />} />
      <Route path="/actividades" element={<Actividades />} />
      <Route path="/ganaderia" element={<Ganaderia />} />
      <Route path="/porcicultura" element={<Porcicultura />} />
    </Routes>
  );
};

export default AppRouter;
