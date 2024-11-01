import express from "express";
import clientRoutes from "./routes/clientes.js";
import serviceRoutes from "./routes/servicos.js";
import agendamentoRoutes from "./routes/agendamentos.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/clientes", clientRoutes);
app.use("/servicos", serviceRoutes);
app.use("/agendamentos", agendamentoRoutes);

app.listen(8800);
