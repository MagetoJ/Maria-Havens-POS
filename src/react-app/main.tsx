import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/react-app/contexts/AuthContext";
import "@/react-app/index.css";
import App from "@/react-app/App.tsx";
import Login from "@/react-app/pages/Login.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<App />} />
        </Routes>
      </Router>
    </AuthProvider>
  </StrictMode>
);
