import Welcome from "@/pages/welcome/Welcome";
import { Routes, Route } from "react-router-dom";
import Login from "@/pages/login/Login";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default AppRouter;
