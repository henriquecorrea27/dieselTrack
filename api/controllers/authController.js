const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db.js");
const SECRET_KEY = process.env.SECRET_KEY;

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [user] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (!user)
      return res.status(400).json({ message: "Usuário não encontrado" });

    // Valide a senha usando bcrypt
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Senha inválida" });

    // Gere o token JWT
    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ message: "Login bem-sucedido", token });
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor", error });
  }
};

module.exports = { loginUser };
