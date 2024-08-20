import { db } from "../db.js";
import { promisify } from "util";

// Obtém todos os agendamentos
// Obtém todos os agendamentos
export const getAgendamento = (_, res) => {
  const q = `
    SELECT a.*, c.nome AS cliente_nome, s.nome AS servico_nome 
    FROM agendamentos a
    JOIN clientes c ON a.cliente_id = c.id
    JOIN servicos s ON a.servico_id = s.id_Servico
  `;

  db.query(q, (err, data) => {
    if (err) {
      console.error("Erro ao buscar agendamentos:", err);
      return res.status(500).json({ error: "Erro ao buscar agendamentos." });
    }

    return res.status(200).json(data);
  });
};

// Adiciona um novo agendamento
export const addAgendamento = (req, res) => {
  const { data_inicio, previsao_termino, cliente_id, servico_id } = req.body;

  db.beginTransaction((err) => {
    if (err) {
      console.error("Erro ao iniciar transação:", err);
      return res.json(err);
    }

    const q1 = `
      INSERT INTO agendamentos 
      (data_inicio, previsao_termino, cliente_id, servico_id) 
      VALUES (?, ?, ?, ?)
    `;
    const valuesAgendamento = [
      data_inicio,
      previsao_termino,
      cliente_id,
      servico_id,
    ];

    db.query(q1, valuesAgendamento, (err) => {
      if (err) {
        console.error("Erro ao inserir agendamento:", err);
        return db.rollback(() => res.json(err));
      }

      db.commit((err) => {
        if (err) {
          console.error("Erro ao fazer commit da transação:", err);
          return db.rollback(() => res.json(err));
        }

        return res.status(200).json("Agendamento cadastrado com sucesso.");
      });
    });
  });
};

// Atualiza um agendamento existente
export const updateAgendamento = async (req, res) => {
  const { data_inicio, previsao_termino, cliente_id, servico_id } = req.body;
  const agendamentoId = req.params.id;

  try {
    await db.beginTransaction();

    const q1 = `
      UPDATE agendamentos 
      SET data_inicio = ?, previsao_termino = ?, cliente_id = ?, servico_id = ? 
      WHERE id = ?
    `;
    const values1 = [
      data_inicio,
      previsao_termino,
      cliente_id,
      servico_id,
      agendamentoId,
    ];

    await queryAsync(q1, values1);

    await db.commit();

    return res.status(200).json("Agendamento atualizado com sucesso.");
  } catch (error) {
    console.error("Erro ao atualizar agendamento:", error);
    await db.rollback();
    return res.json(error);
  }
};

// Deleta (desativa) um agendamento
export const deleteAgendamento = (req, res) => {
  const agendamentoId = req.params.id;

  const q = "DELETE FROM agendamentos WHERE id = ?";
  db.query(q, [agendamentoId], (err) => {
    if (err) {
      console.error("Erro ao excluir agendamento:", err);
      return res.json(err);
    }

    return res.status(200).json("Agendamento excluído com sucesso.");
  });
};

const queryAsync = promisify(db.query).bind(db);
