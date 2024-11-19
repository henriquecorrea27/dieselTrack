import express from "express";
import {
  criar_cliente,
  deletar_cliente,
  listar_clientes,
  editar_cliente,
  mostrar_historico,
} from "../controllers/cliente.js";

const router = express.Router();

router.get("/", listar_clientes);
router.get("/:id", mostrar_historico);
router.post("/", criar_cliente);
router.put("/:id", editar_cliente);
router.delete("/:id", deletar_cliente);

export default router;
