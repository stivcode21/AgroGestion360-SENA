import { Routes, Route, useLocation } from "react-router-dom";
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
import { useNavigate } from "react-router-dom";
import ProductForm from "@/pages/productForm/ProductForm";
import WorkerForm from "@/pages/workerForm/WorkerForm";
import ActivityForm from "@/pages/activityForm/ActivityForm";
import GanaderiaForm from "@/pages/ganaderiaForm/GanaderiaForm";
import PorciculturaForm from "@/pages/porciculturaForm/PorciculturaForm";
import { checkAuth } from "../utils/auth";

const AppRouter = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // useEffect(() => {
  //   const verifySession = async () => {
  //     const loggedIn = await checkAuth();
  //     const publicRoutes = ["/", "/login"];
  //     const isPublic = publicRoutes.includes(location.pathname);

  //     if (!loggedIn) {
  //       if (!isPublic) {
  //         navigate("/login", { replace: true });
  //       }
  //       return;
  //     }
  

  //     if (isPublic) {
  //       navigate("/dashboard", { replace: true });
  //     }
  //   };
  //   verifySession();
  // }, [location.pathname, navigate]);

  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/inventario" element={<Inventario />} />
      <Route
        path="/inventario/registrar"
        element={<ProductForm title="Registrar producto" />}
      />
      <Route
        path="/inventario/editar/:id"
        element={<ProductForm title="Editar Producto" />}
      />
      <Route path="/reportes" element={<Reportes />} />
      <Route path="/trabajadores" element={<Workers />} />
      <Route
        path="/trabajadores/registrar"
        element={<WorkerForm title="Registrar trabajador" />}
      />
      <Route
        path="/trabajadores/editar/:id"
        element={<WorkerForm title="Editar trabajador" />}
      />
      <Route path="/actividades" element={<Actividades />} />
      <Route
        path="/actividades/registrar"
        element={<ActivityForm title="Registrar actividad" />}
      />
      <Route
        path="/actividades/editar/:id"
        element={<ActivityForm title="Editar actividad" />}
      />
      <Route path="/ganaderia" element={<Ganaderia />} />
      <Route
        path="/ganaderia/registrar"
        element={<GanaderiaForm title="Registrar animal" />}
      />
      <Route
        path="/ganaderia/editar/:id"
        element={<GanaderiaForm title="Editar animal" />}
      />
      <Route path="/porcicultura" element={<Porcicultura />} />
      <Route
        path="/porcicultura/registrar"
        element={<PorciculturaForm title="Registrar porcino" />}
      />
      <Route
        path="/porcicultura/editar/:id"
        element={<PorciculturaForm title="Editar porcino" />}
      />
    </Routes>
  );
};

export default AppRouter;
