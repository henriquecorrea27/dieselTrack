import { db } from "../db.js";

// No método getCliente
export const getCliente = (_, res) => {
  const q =
    "SELECT c.*, e.* FROM clientes c LEFT JOIN endereco e ON c.id_endereco = e.id_endereco";

  db.query(q, (err, data) => {
    if (err) return res.json(err);

    return res.status(200).json(data);
  });
};

export const addCliente = (req, res) => {
  const { nome, email, telefone, cpf_cnpj, endereco } = req.body;

  db.beginTransaction((err) => {
    if (err) {
      console.error("Erro ao iniciar transação:", err);
      return res.json(err);
    }

    const { rua, numero, bairro, cidade, estado, cep } = endereco;

    const q1 =
      "INSERT INTO endereco (`rua`, `numero`, `bairro`, `cidade`, `estado`, `cep`) VALUES (?, ?, ?, ?, ?, ?)";
    const valuesEndereco = [rua, numero, bairro, cidade, estado, cep];

    db.query(q1, valuesEndereco, (err, result) => {
      if (err) {
        console.error("Erro ao inserir endereço:", err);
        return db.rollback(() => res.json(err));
      }

      const idEndereco = result.insertId;

      const q2 =
        "INSERT INTO clientes (`nome`, `email`, `telefone`, `cpf_cnpj`, `id_endereco`) VALUES (?, ?, ?, ?, ?)";
      const valuesCliente = [nome, email, telefone, cpf_cnpj, idEndereco];

      db.query(q2, valuesCliente, (err) => {
        if (err) {
          console.error("Erro ao inserir cliente:", err);
          return db.rollback(() => res.json(err));
        }

        db.commit((err) => {
          if (err) {
            console.error("Erro ao fazer commit da transação:", err);
            return db.rollback(() => res.json(err));
          }

          return res
            .status(200)
            .json("Cliente e endereço cadastrados com sucesso.");
        });
      });
    });
  });
};

export const updateCliente = (req, res) => {
  const { nome, email, telefone, cpf_cnpj, endereco } = req.body;
  const clienteId = req.params.id;

  db.beginTransaction((err) => {
    if (err) {
      console.error("Erro ao iniciar transação:", err);
      return res.json(err);
    }

    const q1 =
      "UPDATE clientes SET `nome` = ?, `email` = ?, `telefone` = ?, `cpf_cnpj` = ? WHERE `id` = ?";
    const values1 = [nome, email, telefone, cpf_cnpj, clienteId];

    db.query(q1, values1, (err) => {
      if (err) {
        console.error("Erro ao atualizar cliente:", err);
        return db.rollback(() => res.json(err));
      }

      const q2 =
        "UPDATE endereco SET `rua` = ?, `numero` = ?, `bairro` = ?, `cidade` = ?, `estado` = ?, `cep` = ? WHERE `id_endereco` = ?";
      const values2 = [
        endereco.rua,
        endereco.numero,
        endereco.bairro,
        endereco.cidade,
        endereco.estado,
        endereco.cep,
        endereco.id_endereco,
      ];

      db.query(q2, values2, (err) => {
        if (err) {
          console.error("Erro ao atualizar endereço:", err);
          return db.rollback(() => res.json(err));
        }

        db.commit((err) => {
          if (err) {
            console.error("Erro ao fazer commit da transação:", err);
            return db.rollback(() => res.json(err));
          }

          return res
            .status(200)
            .json("Cliente e endereço atualizados com sucesso.");
        });
      });
    });
  });
};

export const deleteCliente = (req, res) => {
  const clienteId = req.params.id;

  const q = "UPDATE clientes SET status = 'inativo' WHERE id = ?";
  db.query(q, [clienteId], (err) => {
    if (err) {
      console.error("Erro ao atualizar status do cliente:", err);
      return res.json(err);
    }

    return res.status(200).json("Status do cliente atualizado para inativo.");
  });
};
