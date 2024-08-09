import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { FaTrash, FaEdit, FaEye } from "react-icons/fa"; // Ícones de ação
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

const DetailsOverlay = styled(ConfirmOverlay)``;

const DetailsBox = styled(ConfirmBox)`
  text-align: left;
`;

const Grid = ({ clientes = [], setClientes, setOnEdit }) => {
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [viewDetails, setViewDetails] = useState(null);

  const handleEdit = (item) => {
    setOnEdit(item);
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:8800/clientes/${id}`);
      // Atualiza o status do cliente para inativo
      const updatedClientes = clientes.map((cliente) =>
        cliente.id === id ? { ...cliente, status: "inativo" } : cliente
      );
      setClientes(updatedClientes);
      toast.success(res.data);
      setConfirmDelete(null);
    } catch (error) {
      toast.error("Erro ao deletar cliente.");
      setConfirmDelete(null);
    }
  };

  const confirmDeleteClient = (id) => {
    setConfirmDelete(id);
  };

  const viewClientDetails = (cliente) => {
    setViewDetails(cliente);
  };

  const formatCpfCnpj = (value) => {
    value = value.replace(/\D/g, ""); // Remove non-numeric characters

    if (value.length <= 11) {
      // CPF formatting
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else {
      // CNPJ formatting
      value = value.replace(/^(\d{2})(\d)/, "$1.$2");
      value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
      value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");
      value = value.replace(/(\d{4})(\d{1,2})$/, "$1-$2");
    }

    return value;
  };

  const formatTelefone = (value) => {
    value = value.replace(/\D/g, ""); // Remove non-numeric characters

    if (value.length > 11) {
      value = value.slice(0, 11); // Limit to 11 digits
    }

    if (value.length === 11) {
      value = value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else if (value.length === 10) {
      value = value.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }

    return value;
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
      {viewDetails && (
        <DetailsOverlay onClick={() => setViewDetails(null)}>
          <DetailsBox onClick={(e) => e.stopPropagation()}>
            <h2>Detalhes do Cliente</h2>
            <p>
              <strong>Nome:</strong> {viewDetails.nome}
            </p>
            <p>
              <strong>Email:</strong> {viewDetails.email}
            </p>
            <p>
              <strong>Telefone:</strong> {formatTelefone(viewDetails.telefone)}
            </p>
            <p>
              <strong>CPF/CNPJ:</strong> {formatCpfCnpj(viewDetails.cpf_cnpj)}
            </p>

            <p>
              <strong>Rua</strong>: {viewDetails.rua}
            </p>
            <p>
              <strong>Número</strong>: {viewDetails.numero}
            </p>
            <p>
              <strong>Bairro</strong>: {viewDetails.bairro}
            </p>
            <p>
              <strong>Cidade</strong>: {viewDetails.cidade}
            </p>
            <p>
              <strong>Estado</strong>: {viewDetails.estado}
            </p>
            <p>
              <strong>CEP</strong>: {viewDetails.cep}
            </p>

            <ConfirmButton variant="no" onClick={() => setViewDetails(null)}>
              Fechar
            </ConfirmButton>
          </DetailsBox>
        </DetailsOverlay>
      )}
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th width="25%">Nome</Th>
              <Th width="30%">Email</Th>
              <Th onlyWeb width="19%">
                Telefone
              </Th>
              <Th onlyWeb width="20%">
                CPF/CNPJ
              </Th>
              <Th width="2%"></Th>
              <Th width="2%"></Th>
              <Th width="2%"></Th>
            </Tr>
          </Thead>
          <Tbody>
            {clientes
              .filter((cliente) => cliente.status === "ativo")
              .map((item, i) => (
                <Tr key={i}>
                  <Td width="25%">{item.nome}</Td>
                  <Td width="30%">{item.email}</Td>
                  <Td width="19%" onlyWeb>
                    {formatTelefone(item.telefone)}
                  </Td>
                  <Td width="20%" onlyWeb>
                    {formatCpfCnpj(item.cpf_cnpj)}
                  </Td>
                  <Td alignCenter width="2%">
                    <FaEdit onClick={() => handleEdit(item)} />
                  </Td>
                  <Td alignCenter width="2%">
                    <FaTrash onClick={() => confirmDeleteClient(item.id)} />
                  </Td>
                  <Td alignCenter width="2%">
                    <FaEye onClick={() => viewClientDetails(item)} />
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
