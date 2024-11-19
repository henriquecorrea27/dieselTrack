import { db } from "../db.js";
import { promisify } from "util";

export const listar_servicos = (_, res) => {
  const q = "SELECT * FROM servicos";

  db.query(q, (err, data) => {
    if (err) return res.json(err);

    return res.status(200).json(data);
  });
};

export const criar_servico = (req, res) => {
  const { nome, preco_medio } = req.body;

  db.beginTransaction((err) => {
    if (err) {
      console.error("Erro ao iniciar transação:", err);
      return res.json(err);
    }

    const q1 = "INSERT INTO servicos (`nome`, `preco_medio`) VALUES (?, ?)";
    const valuesServicos = [nome, preco_medio];

    db.query(q1, valuesServicos, (err) => {
      if (err) {
        console.error("Erro ao inserir servico:", err);
        return db.rollback(() => res.json(err));
      }

      db.commit((err) => {
        if (err) {
          console.error("Erro ao fazer commit da transação:", err);
          return db.rollback(() => res.json(err));
        }

        return res.status(200).json("Serviço cadastrado com sucesso.");
      });
    });
  });
};

export const editar_servico = async (req, res) => {
  const { nome, preco_medio } = req.body;
  const servicoId = req.params.id;

  try {
    await db.beginTransaction();

    const q1 =
      "UPDATE servicos SET `nome` = ?, `preco_medio` = ? WHERE `id_Servico` = ?";
    const values1 = [nome, preco_medio, servicoId];

    await queryAsync(q1, values1);

    await db.commit();

    return res.status(200).json("Serviço atualizado com sucesso.");
  } catch (error) {
    console.error("Erro ao atualizar servico:", error);
    await db.rollback();
  }
};

export const deletar_servico = (req, res) => {
  const servicoId = req.params.id;

  const q = "UPDATE servicos SET status = 'inativo' WHERE id_Servico = ?";
  db.query(q, [servicoId], (err) => {
    if (err) {
      console.error("Erro ao atualizar status do serviço:", err);
      return res.json(err);
    }

    return res.status(200).json("Serviço excluído com sucesso.");
  });
};

const queryAsync = promisify(db.query).bind(db);
