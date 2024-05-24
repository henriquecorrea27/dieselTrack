import express from "express";
import {
  addCliente,
  deleteCliente,
  getCliente,
  updateCliente,
} from "../controllers/client.js";

const router = express.Router();

router.get("/", getCliente);
router.post("/", addCliente);
router.put("/:id", updateCliente);
router.delete("/:id", deleteCliente);

export default router;
