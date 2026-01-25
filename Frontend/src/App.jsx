import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routing/AppRouter";
import { LoaderProvider } from "@/context/loaderProvider/LoaderProvider";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <LoaderProvider>
        <Toaster position="top-center" />
        <AppRouter />
      </LoaderProvider>
    </BrowserRouter>
  );
}

export default App;
