import { buildApiUrl } from "./apiBase";

export const hasRole = (user, roleId) => {
  return Number(user?.id_rol) === Number(roleId);
};

export const checkAuth = async () => {
  try {
    // Verifica si la cookie de sesion sigue vigente antes de entrar a rutas privadas.
    const res = await fetch(buildApiUrl("auth/verify"), {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) return false;

    const data = await res.json();
    return data;
  } catch (error) {
    return false;
  }
};
