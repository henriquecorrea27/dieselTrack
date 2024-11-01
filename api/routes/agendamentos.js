import express from "express";
import {
  addAgendamento,
  deleteAgendamento,
  getAgendamento,
  updateAgendamento,
  completeAgendamento,
} from "../controllers/agendamento.js";

const router = express.Router();

router.get("/", getAgendamento);
router.post("/", addAgendamento);
router.put("/:id", updateAgendamento);
router.put("/concluir/:id", completeAgendamento);
router.delete("/:id", deleteAgendamento);

export default router;
