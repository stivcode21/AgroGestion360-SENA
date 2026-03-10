import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routing/AppRouter";
import { LoaderProvider } from "@/context/loaderProvider/LoaderProvider";
import { Toaster } from "react-hot-toast";
import { ActionModalProvider } from "@/context/actionModalProvider/ActionModalProvider";

function App() {
  return (
    <BrowserRouter>
      <LoaderProvider>
        <ActionModalProvider>
          <Toaster position="top-center" />
          <AppRouter />
        </ActionModalProvider>
      </LoaderProvider>
    </BrowserRouter>
  );
}

export default App;
