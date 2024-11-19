import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/homePage";
import ClientePage from "./pages/clientePage";
import ServicoPage from "./pages/servicoPage";
import AgendamentoPage from "./pages/agendamentoPage";
import LoginPage from "./pages/loginPage";

const App = () => {
  const isAuthenticated = !!localStorage.getItem("token"); // Verifica se há um token no localStorage

  return (
    <Router>
      <div>
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/home" /> : <LoginPage />}
          />
          <Route
            path="/home"
            element={isAuthenticated ? <HomePage /> : <Navigate to="/" />}
          />
          <Route
            path="/clientes"
            element={isAuthenticated ? <ClientePage /> : <Navigate to="/" />}
          />
          <Route
            path="/servicos"
            element={isAuthenticated ? <ServicoPage /> : <Navigate to="/" />}
          />
          <Route
            path="/agendamentos"
            element={
              isAuthenticated ? <AgendamentoPage /> : <Navigate to="/" />
            }
          />

          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
