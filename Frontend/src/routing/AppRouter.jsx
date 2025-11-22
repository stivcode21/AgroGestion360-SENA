import Welcome from "@/pages/welcome/Welcome";
import { Routes, Route } from "react-router-dom";
import Login from "@/pages/login/Login";
import MainLayout from "../components/templates/mainLayout/MainLayout";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/test" element={<MainLayout />} />
    </Routes>
  );
};

export default AppRouter;
