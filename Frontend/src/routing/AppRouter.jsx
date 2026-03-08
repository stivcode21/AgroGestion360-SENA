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
import AdminForm from "@/pages/adminForm/AdminForm";
import { checkAuth } from "@/utils/auth";
import Settings from "../pages/settings/Settings";

const AppRouter = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const verifySession = async () => {
      const data = await checkAuth();
      const loggedIn = data?.user ? true : false;
      const publicRoutes = ["/", "/login"];
      const isPublic = publicRoutes.includes(location.pathname);

      if (!loggedIn) {
        if (!isPublic) {
          navigate("/login", { replace: true });
        }
        return;
      }

      if (isPublic) {
        navigate("/dashboard", { replace: true });
      }
    };
    verifySession();
  }, [location.pathname, navigate]);

  return (
    <Routes>
      {/*  rutas de navegacion  */}
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/inventario" element={<Inventario />} />
      <Route path="/reportes" element={<Reportes />} />
      <Route path="/trabajadores" element={<Workers />} />
      <Route path="/actividades" element={<Actividades />} />
      <Route path="/ganaderia" element={<Ganaderia />} />
      <Route path="/porcicultura" element={<Porcicultura />} />

      {/*  subrutas para crear nuevos registros  */}
      <Route
        path="/actividades/registrar"
        element={<ActivityForm title="Registrar actividad" />}
      />
      <Route
        path="/trabajadores/registrar"
        element={<WorkerForm title="Registrar trabajador" />}
      />
      <Route
        path="/ganaderia/registrar"
        element={<GanaderiaForm title="Registrar animal" />}
      />
      <Route
        path="/inventario/registrar"
        element={<ProductForm title="Registrar producto" />}
      />
      <Route
        path="/porcicultura/registrar"
        element={<PorciculturaForm title="Registrar porcino" />}
      />
      <Route
        path="/admin/registrar"
        element={<AdminForm title="Registrar administrador" />}
      />

      {/* rutas dinamicas el id se obtiene de la url */}
      <Route
        path="/trabajadores/editar/:id"
        element={<WorkerForm title="Editar trabajador" />}
      />
      <Route
        path="/actividades/editar/:id"
        element={<ActivityForm title="Editar actividad" />}
      />
      <Route
        path="/ganaderia/editar/:id"
        element={<GanaderiaForm title="Editar animal" />}
      />
      <Route
        path="/porcicultura/editar/:id"
        element={<PorciculturaForm title="Editar porcino" />}
      />
      <Route
        path="/inventario/editar/:id"
        element={<ProductForm title="Editar Producto" />}
      />
      <Route
        path="/admin/editar/:id"
        element={<AdminForm title="Editar administrador" />}
      />
    </Routes>
  );
};

export default AppRouter;
