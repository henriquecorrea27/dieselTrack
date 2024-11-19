import { db } from "../db.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = "token_dieseltrack";

export const login = (req, res) => {
  const { email, senha } = req.body;

  db.query("SELECT * FROM usuario WHERE email = ?", [email], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro no servidor" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Usuário ou senha inválidos" });
    }

    const usuario = results[0];

    if (usuario.senha !== senha) {
      return res.status(401).json({ error: "Usuário ou senha inválidos" });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({ message: "Login realizado com sucesso", token });
  });
};
