// client/src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/homePage";
import ClientePage from "./pages/clientePage";
import ServicoPage from "./pages/servicoPage";
import AgendamentoPage from "./pages/agendamentoPage";

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/clientes" element={<ClientePage />} />
          <Route path="/servicos" element={<ServicoPage />} />
          <Route path="/agendamentos" element={<AgendamentoPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
