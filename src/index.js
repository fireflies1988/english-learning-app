import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./styles/font.css";
import App from "./App";
import { AuthProvider } from "./context/AuthProvider";
import { SnackbarProvider } from "notistack";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>

  <AuthProvider>
    <SnackbarProvider maxSnack={3}>
      <App />
    </SnackbarProvider>
  </AuthProvider>

  // </React.StrictMode>
);
