const STOCK_ALERTS_STORAGE_KEY = "stock-alerts";
const STOCK_ALERTS_UPDATED_EVENT = "stock-alerts-updated";

export const getStockAlertsStorage = () => {
  try {
    // Lee las alertas persistidas para reutilizarlas en header y modal.
    return JSON.parse(localStorage.getItem(STOCK_ALERTS_STORAGE_KEY) ?? "[]");
  } catch (error) {
    console.error("Error al leer alertas de stock:", error);
    return [];
  }
};

export const setStockAlertsStorage = (alerts) => {
  // Guarda el estado mas reciente y notifica a los componentes suscritos.
  localStorage.setItem(STOCK_ALERTS_STORAGE_KEY, JSON.stringify(alerts));
  window.dispatchEvent(new Event(STOCK_ALERTS_UPDATED_EVENT));
};

export const subscribeToStockAlerts = (callback) => {
  // Permite reaccionar al cambio de alertas sin usar un store global.
  window.addEventListener(STOCK_ALERTS_UPDATED_EVENT, callback);

  return () => {
    window.removeEventListener(STOCK_ALERTS_UPDATED_EVENT, callback);
  };
};
