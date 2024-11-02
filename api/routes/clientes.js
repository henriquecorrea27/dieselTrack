import express from "express";
import {
  addCliente,
  deleteCliente,
  getCliente,
  updateCliente,
  getAgendamentosCliente,
} from "../controllers/cliente.js";

const router = express.Router();

router.get("/", getCliente);
router.get("/:id", getAgendamentosCliente);
router.post("/", addCliente);
router.put("/:id", updateCliente);
router.delete("/:id", deleteCliente);

export default router;
