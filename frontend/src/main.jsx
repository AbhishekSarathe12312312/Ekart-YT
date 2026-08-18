import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
// Import both store and persistor from your Redux configuration file
import { store, persistor } from "./redux/store.js";
import { PersistGate } from "redux-persist/integration/react";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <PersistGate loading={null} persistor={persistor}>
          <App />
          <ToastContainer
            autoClose={500}
            position="top-right"
            theme="dark"
            toastClassName="!bg-gray-900 !border !border-gray-700 !text-white !rounded-xl !shadow-lg"
            bodyClassName="!text-sm !font-medium"
            progressClassName="!bg-white"
          />
        </PersistGate>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
