import { db } from "../db.js";
import { promisify } from "util";

export const getAgendamento = (_, res) => {
  const q = "SELECT * FROM agendamentos";

  db.query(q, (err, data) => {
    if (err) return res.json(err);

    return res.status(200).json(data);
  });
};

export const addAgendamento = (req, res) => {
  const { data_inicio, previsao_termino, cliente_id, servico_id } = req.body;

  db.beginTransaction((err) => {
    if (err) {
      console.error("Erro ao iniciar transação:", err);
      return res.json(err);
    }

    const q1 =
      "INSERT INTO agendamentos (`data_inicio`, `previsao_termino`, `cliente_id`, `servico_id`) VALUES (?, ?, ?,?)";
    const valuesServicos = [
      data_inicio,
      previsao_termino,
      cliente_id,
      servico_id,
    ];

    db.query(q1, valuesServicos, (err) => {
      if (err) {
        console.error("Erro ao inserir agendamento:", err);
        return db.rollback(() => res.json(err));
      }

      db.commit((err) => {
        if (err) {
          console.error("Erro ao fazer commit da transação:", err);
          return db.rollback(() => res.json(err));
        }

        return res.status(200).json("Agendamento feito com sucesso.");
      });
    });
  });
};

export const updateServico = async (req, res) => {
  const { nome, descricao, preco_medio } = req.body;
  const servicoId = req.params.id;

  try {
    await db.beginTransaction();

    const q1 =
      "UPDATE servicos SET `nome` = ?, `descricao` = ?, `preco_medio` = ? WHERE `id_Servico` = ?";
    const values1 = [nome, descricao, preco_medio, servicoId];

    await queryAsync(q1, values1);

    await db.commit();

    return res.status(200).json("Serviço atualizado com sucesso.");
  } catch (error) {
    console.error("Erro ao atualizar servico:", error);
    await db.rollback();
  }
};

export const deleteServico = (req, res) => {
  const servicoId = req.params.id;

  const q = "UPDATE servicos SET status = 'inativo' WHERE id_Servico = ?";
  db.query(q, [servicoId], (err) => {
    if (err) {
      console.error("Erro ao atualizar status do serviço:", err);
      return res.json(err);
    }

    return res.status(200).json("Status do serviço atualizado para inativo.");
  });
};

const queryAsync = promisify(db.query).bind(db);
