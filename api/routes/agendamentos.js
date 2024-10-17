import express from "express";
import {
  addAgendamento,
  deleteAgendamento,
  getAgendamento,
  updateAgendamento,
  getAgendamentosByClienteId,
} from "../controllers/agendamento.js";

const router = express.Router();

router.get("/", getAgendamento);
router.get("/cliente/:clienteId", getAgendamentosByClienteId);
router.post("/", addAgendamento);
router.put("/:id", updateAgendamento);
router.delete("/:id", deleteAgendamento);

export default router;
