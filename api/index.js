import express from "express";
import clientRoutes from "./routes/clientes.js";
import serviceRoutes from "./routes/servicos.js"; // Importando as rotas de serviço
import agendamentoRoutes from "./routes/agendamentos.js"; // Importando as rotas de serviço
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/clientes", clientRoutes); // Rotas de clientes
app.use("/servicos", serviceRoutes); // Rotas de serviços
app.use("/agendamentos", agendamentoRoutes); // Rotas de serviços

app.listen(8800);
