import express from "express";
import {
  criar_agendamento,
  deletar_agendamento,
  listar_agendamentos,
  edita_agendamento,
  concluir_agendamento,
} from "../controllers/agendamento.js";

const router = express.Router();

router.get("/", listar_agendamentos);
router.post("/", criar_agendamento);
router.put("/:id", edita_agendamento);
router.put("/concluir/:id", concluir_agendamento);
router.delete("/:id", deletar_agendamento);

export default router;
