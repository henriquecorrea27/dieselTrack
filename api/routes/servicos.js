import express from "express";
import {
  addServico,
  deleteServico,
  getServico,
  updateServico,
} from "../controllers/servico.js";

const router = express.Router();

router.get("/", getServico);
router.post("/", addServico);
router.put("/:id", updateServico);
router.delete("/:id", deleteServico);

export default router;
