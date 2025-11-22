import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routing/AppRouter";
import { useThemeStore } from "./store/ThemeStore";
import { useEffect } from "react";

function App() {
  const { isLightMode } = useThemeStore();

  useEffect(() => {
    document.body.className = isLightMode ? "light-mode" : "dark-mode";
  }, [isLightMode]);

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
