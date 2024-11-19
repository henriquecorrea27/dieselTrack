import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/homePage";
import ClientePage from "./pages/clientePage";
import ServicoPage from "./pages/servicoPage";
import AgendamentoPage from "./pages/agendamentoPage";
import LoginPage from "./pages/loginPage";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/home"
          element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/clientes"
          element={isAuthenticated ? <ClientePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/servicos"
          element={isAuthenticated ? <ServicoPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/agendamentos"
          element={
            isAuthenticated ? <AgendamentoPage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/login"
          element={<LoginPage onLogin={() => setIsAuthenticated(true)} />}
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
