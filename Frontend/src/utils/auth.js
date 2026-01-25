import { buildApiUrl } from "./apiBase";

export const checkAuth = async () => {
  try {
    const res = await fetch(buildApiUrl("auth/dashboard"), {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) return false;

    const data = await res.json();
    return data?.user ? true : false;
  } catch (error) {
    return false;
  }
};
