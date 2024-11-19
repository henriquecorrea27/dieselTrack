import express from "express";
import {
  criar_servico,
  deletar_servico,
  listar_servicos,
  editar_servico,
} from "../controllers/servico.js";

const router = express.Router();

router.get("/", listar_servicos);
router.post("/", criar_servico);
router.put("/:id", editar_servico);
router.delete("/:id", deletar_servico);

export default router;
