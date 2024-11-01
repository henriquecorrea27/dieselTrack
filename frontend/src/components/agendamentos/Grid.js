import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { FaTrash, FaEdit, FaCheck } from "react-icons/fa"; // Ícones de ação
import { toast } from "react-toastify";
import { format } from "date-fns";

// Container da tabela com rolagem vertical e largura responsiva
const TableContainer = styled.div`
  width: 85vw;
  height: 70vh;
  max-width: 100%;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0px 0px 5px #ccc;
  border-radius: 5px;
  margin: 20px;
  overflow-y: auto; /* Rolagem vertical */

  @media (max-width: 768px) {
    width: 100vw;
  }
`;

// Estilização da tabela com layout fixo para colunas
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed; /* Garante largura fixa para as colunas */

  th,
  td {
    padding: 10px;
    text-align: left;
    border: 1px solid #ddd;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap; /* Evita quebra de linha */
  }

  thead th {
    background-color: #f5f5f5;
    font-weight: bold;
  }

  tbody tr:hover {
    background-color: #f9f9f9;
  }
`;

// Estilização para cabeçalho da tabela
const Thead = styled.thead`
  display: table;
  width: 100%;
  table-layout: fixed; /* Garante largura fixa para as colunas */
`;

// Estilização para corpo da tabela com rolagem vertical
const Tbody = styled.tbody`
  display: block;
  overflow-y: auto; /* Permite rolagem vertical */
  max-height: calc(
    70vh - 60px
  ); /* Altura do corpo da tabela, ajustando para incluir padding e cabeçalho */
`;

// Estilização das linhas da tabela
const Tr = styled.tr`
  display: table;
  width: 100%;
  table-layout: fixed; /* Garante largura fixa para as colunas */
`;

// Estilização das células de cabeçalho
const Th = styled.th`
  text-align: start;
  padding-bottom: 5px;
  background-color: #f5f5f5;

  @media (max-width: 500px) {
    ${(props) => props.onlyWeb && "display: none"}
  }
`;

// Estilização das células de dados
const Td = styled.td`
  text-align: ${(props) => (props.alignCenter ? "center" : "start")};
  width: ${(props) => (props.width ? props.width : "auto")};

  @media (max-width: 500px) {
    ${(props) => props.onlyWeb && "display: none"}
  }
`;

// Estilização da sobreposição para confirmação
const ConfirmOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

// Estilização da caixa de confirmação
const ConfirmBox = styled.div`
  background: white;
  padding: 1.25rem;
  border-radius: 0.5rem;
  box-shadow: 0 0.313rem 0.938rem rgba(0, 0, 0, 0.3);
  width: 25%;
  max-width: 90%;
  text-align: center;
`;

// Estilização dos botões de confirmação
const ConfirmButton = styled.button`
  padding: 0.625rem;
  margin: 0.313rem;
  border-radius: 0.313rem;
  border: none;
  cursor: pointer;
  color: white;
  ${(props) =>
    props.variant === "yes"
      ? "background-color: #2c73d2;"
      : "background-color: #ff5e5e;"}
`;

const Grid = ({ agendamentos = [], setAgendamentos, setOnEdit }) => {
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleEdit = (item) => {
    setOnEdit(item);
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:8800/agendamentos/${id}`
      );
      const updatedAgendamentos = agendamentos.filter(
        (agendamento) => agendamento.id !== id
      );
      setAgendamentos(updatedAgendamentos);
      toast.success(res.data);
      setConfirmDelete(null);
    } catch (error) {
      toast.error("Erro ao deletar agendamento.");
      setConfirmDelete(null);
    }
  };

  const completeService = async (id) => {
    try {
      const currentDate = new Date().toISOString().split("T")[0];
      await axios.put(`http://localhost:8800/agendamentos/concluir/${id}`, {
        data_termino: currentDate,
      });

      const updatedAgendamentos = agendamentos.map((agendamento) =>
        agendamento.id === id
          ? { ...agendamento, data_termino: currentDate }
          : agendamento
      );
      setAgendamentos(updatedAgendamentos);
      toast.success("Serviço concluído com sucesso!");
    } catch (error) {
      toast.error("Erro ao concluir o serviço.");
    }
  };

  const confirmDeleteAgendamento = (id) => {
    setConfirmDelete(id);
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), "dd/MM/yyyy");
  };

  return (
    <>
      {confirmDelete && (
        <ConfirmOverlay>
          <ConfirmBox>
            <p>Tem certeza que deseja deletar?</p>
            <ConfirmButton
              variant="yes"
              onClick={() => handleDelete(confirmDelete)}
            >
              Sim
            </ConfirmButton>
            <ConfirmButton variant="no" onClick={() => setConfirmDelete(null)}>
              Não
            </ConfirmButton>
          </ConfirmBox>
        </ConfirmOverlay>
      )}
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th width="20%">Data Inicio</Th>
              <Th width="20%">Data Prevista de Termino</Th>
              <Th onlyWeb width="20%">
                Cliente
              </Th>
              <Th onlyWeb width="20%">
                Serviço
              </Th>
              <Th width="2%">Concluir</Th>
              <Th width="2%"></Th>
              <Th width="2%"></Th>
            </Tr>
          </Thead>
          <Tbody>
            {agendamentos.map((item, i) => (
              <Tr key={i} isCompleted={item.data_termino}>
                {" "}
                {/* Define o estilo da linha conforme o status */}
                <Td width="20%">{formatDate(item.data_inicio)}</Td>
                <Td width="20%">{formatDate(item.previsao_termino)}</Td>
                <Td width="20%" onlyWeb>
                  {item.cliente_nome}
                </Td>
                <Td width="20%" onlyWeb>
                  {item.servico_nome}
                </Td>
                <Td alignCenter width="2%">
                  <FaCheck
                    onClick={() => completeService(item.id)}
                    style={{
                      pointerEvents: item.data_termino ? "none" : "auto",
                      opacity: item.data_termino ? "0.3" : "1",
                    }}
                  />
                </Td>
                <Td alignCenter width="2%">
                  <FaEdit
                    onClick={() => handleEdit(item)}
                    style={{
                      pointerEvents: item.data_termino ? "none" : "auto",
                      opacity: item.data_termino ? "0.3" : "1",
                    }}
                  />
                </Td>
                <Td alignCenter width="2%">
                  <FaTrash
                    onClick={() => confirmDeleteAgendamento(item.id)}
                    style={{
                      pointerEvents: item.data_termino ? "none" : "auto",
                      opacity: item.data_termino ? "0.3" : "1",
                    }}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Grid;
