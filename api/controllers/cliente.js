import { db } from "../db.js";
import { promisify } from "util";
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

export const updateCliente = async (req, res) => {
  const { nome, email, telefone, cpf_cnpj, endereco } = req.body;
  const clienteId = req.params.id;

  try {
    await db.beginTransaction();

    const q1 =
      "UPDATE clientes SET `nome` = ?, `email` = ?, `telefone` = ?, `cpf_cnpj` = ? WHERE `id` = ?";
    const values1 = [nome, email, telefone, cpf_cnpj, clienteId];

    await queryAsync(q1, values1);

    const { rua, numero, bairro, cidade, estado, cep } = endereco;

    const id_endereco = await getId_Endereco(clienteId);
    const q2 =
      "UPDATE endereco SET `rua` = ?, `numero` = ?, `bairro` = ?, `cidade` = ?, `estado` = ?, `cep` = ? WHERE `id_endereco` = ?";
    const values2 = [rua, numero, bairro, cidade, estado, cep, id_endereco];

    await queryAsync(q2, values2);

    await db.commit();

    return res.status(200).json("Cliente e endereço atualizados com sucesso.");
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    await db.rollback();
    return res.status(500).json("Erro ao atualizar cliente e endereço.");
  }
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

const queryAsync = promisify(db.query).bind(db);

export async function getId_Endereco(id) {
  const q1 = "select id_endereco from clientes where id = ?";
  const idcliente = id;

  try {
    const result = await queryAsync(q1, idcliente);
    if (result.length > 0) {
      return result[0].id_endereco;
    } else {
      throw new Error("Endereço não encontrado");
    }
  } catch (err) {
    console.error("Erro ao obter id do endereço:", err);
    throw err;
  }
}

export const getAgendamentosCliente = (req, res) => {
  const clienteId = req.params.id;
  const query = `SELECT  
      s.nome AS nome_servico, 
      data_inicio,
      data_termino
    FROM agendamentos a
    JOIN servicos s ON a.servico_id = s.id_Servico
    WHERE a.cliente_id = ?`;

  db.query(query, [clienteId], (err, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(data || []);
  });
};
