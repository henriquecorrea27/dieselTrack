import { db } from "../db.js";
import { promisify } from "util";
import nodemailer from "nodemailer";

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

// Configuração do nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "henrique.correia600@gmail.com",
    pass: "eclp xfpm gazc kdph",
  },
});

// Função para enviar email
function sendAppointmentEmail(clienteEmail, agendamento) {
  const mailOptions = {
    from: "henrique.correia600@gmail.com",
    to: clienteEmail,
    subject: "Agendamento Confirmado!",
    text: `Olá, seu agendamento foi feito na data: ${agendamento.data_inicio}.
Detalhes do serviço: ${agendamento.servico_nome}.
Previsão de Término: ${agendamento.previsao_termino}.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Erro ao enviar email:", error);
    } else {
      console.log("Email enviado:", info.response);
    }
  });
}

function sendCompletionEmail(clienteEmail, agendamento) {
  const mailOptions = {
    from: "henrique.correia600@gmail.com",
    to: clienteEmail,
    subject: "Serviço Concluído!",
    text: `Olá, informamos que o serviço ${agendamento.servico_nome} foi concluído na data ${agendamento.data_termino}. Obrigado por contar conosco!`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Erro ao enviar email de conclusão:", error);
    } else {
      console.log("Email de conclusão enviado:", info.response);
    }
  });
}

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

    db.query(q1, valuesAgendamento, (err, result) => {
      if (err) {
        console.error("Erro ao inserir agendamento:", err);
        return db.rollback(() => res.json(err));
      }

      // Buscando o email do cliente
      const q2 = "SELECT email FROM clientes WHERE id = ?";
      db.query(q2, [cliente_id], (err, clienteData) => {
        if (err) {
          console.error("Erro ao buscar cliente:", err);
          return db.rollback(() => res.json(err));
        }

        const clienteEmail = clienteData[0].email;

        // Buscando o nome do serviço
        const q3 = "SELECT nome FROM servicos WHERE id_Servico = ?";
        db.query(q3, [servico_id], (err, servicoData) => {
          if (err) {
            console.error("Erro ao buscar nome do serviço:", err);
            return db.rollback(() => res.json(err));
          }

          const servicoNome = servicoData[0].nome;

          // Commit da transação
          db.commit((err) => {
            if (err) {
              console.error("Erro ao fazer commit da transação:", err);
              return db.rollback(() => res.json(err));
            }

            // Enviar o email para o cliente após o commit
            sendAppointmentEmail(clienteEmail, {
              data_inicio,
              servico_nome: servicoNome, // Passar o nome do serviço
              previsao_termino,
            });

            return res.status(200).json("Agendamento cadastrado com sucesso.");
          });
        });
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

export const completeAgendamento = (req, res) => {
  const agendamentoId = req.params.id;
  const currentDate = new Date().toISOString().split("T")[0]; // Obter data atual no formato "YYYY-MM-DD"
  const q =
    "UPDATE agendamentos SET status = 'concluido', data_termino = ? WHERE id = ?";

  db.query(q, [currentDate, agendamentoId], (err) => {
    if (err) {
      console.error("Erro ao concluir agendamento:", err);
      return res.status(500).json({ error: "Erro ao concluir agendamento." });
    }

    const q2 = `
      SELECT c.email, s.nome AS servico_nome 
      FROM agendamentos a
      JOIN clientes c ON a.cliente_id = c.id
      JOIN servicos s ON a.servico_id = s.id_Servico
      WHERE a.id = ?
    `;
    db.query(q2, [agendamentoId], (err, result) => {
      if (err) {
        console.error("Erro ao buscar dados do cliente e serviço:", err);
        return res.status(500).json({ error: "Erro ao buscar dados." });
      }

      const { email: clienteEmail, servico_nome } = result[0];
      sendCompletionEmail(clienteEmail, {
        servico_nome,
        data_termino: currentDate,
      });

      return res.status(200).json("Agendamento marcado como concluído.");
    });
  });
};

const queryAsync = promisify(db.query).bind(db);
