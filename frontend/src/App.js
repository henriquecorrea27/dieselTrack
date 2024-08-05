// client/src/App.js
import React from "react";
import { Route, BrowserRouter } from "react-router-dom";
import HomePage from "./pages/homePage";
import ClientePage from "./pages/clientePage";
import ServicoPage from "./pages/servicoPage";
import AgendamentoPage from "./pages/agendamentoPage";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/clientes" component={ClientePage} />
        <Route path="/servicos" component={ServicoPage} />
        <Route path="/agendamentos" component={AgendamentoPage} />
      </Switch>
    </Router>
  );
}

export default App;
