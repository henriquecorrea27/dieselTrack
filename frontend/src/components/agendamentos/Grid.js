import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { FaTrash, FaEdit } from "react-icons/fa"; // Ícones de ação
import { toast } from "react-toastify";

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
      // Atualiza o status do serviço para inativo
      const updatedAgendamentos = agendamentos.map((agendamento) =>
        agendamento.id === id
          ? { ...agendamento, status: "inativo" }
          : agendamento
      );
      setAgendamentos(updatedAgendamentos);
      toast.success(res.data);
      setConfirmDelete(null);
    } catch (error) {
      toast.error("Erro ao deletar agendamento.");
      setConfirmDelete(null);
    }
  };

  const confirmDeleteAgendamento = (id) => {
    setConfirmDelete(id);
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
              <Th width="2%"></Th>
              <Th width="2%"></Th>
            </Tr>
          </Thead>
          <Tbody>
            {agendamentos
              .filter((agendamento) => agendamento.status === "ativo")
              .map((item, i) => (
                <Tr key={i}>
                  <Td width="20%">{item.data_inicio}</Td>
                  <Td width="20%">{item.previsao_termino}</Td>
                  <Td width="20%" onlyWeb>
                    {item.cliente}
                  </Td>
                  <Td width="20%" onlyWeb>
                    {item.servico}
                  </Td>
                  <Td alignCenter width="2%">
                    <FaEdit onClick={() => handleEdit(item)} />
                  </Td>
                  <Td alignCenter width="2%">
                    <FaTrash
                      onClick={() => confirmDeleteAgendamento(item.id)}
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
