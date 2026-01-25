// Use env var for API base; fallback keeps local dev working.
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001/api";
const normalizedBaseUrl = API_BASE_URL.replace(/\/+$/, "");

export const buildApiUrl = (path = "") => {
  const normalizedPath = String(path).replace(/^\/+/, "");
  return `${normalizedBaseUrl}/${normalizedPath}`;
};
