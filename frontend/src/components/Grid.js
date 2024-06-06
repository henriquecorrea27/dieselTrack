import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { FaTrash, FaEdit, FaEye } from "react-icons/fa"; // Adicione o ícone de visualização
import { toast } from "react-toastify";

const Table = styled.table`
  width: 85vw;
  height: 70vh;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0px 0px 5px #ccc;
  border-radius: 5px;
  margin: 20px;
  word-break: break-all;
  overflow-y: auto; /* Enable vertical scroll */
`;

export const Thead = styled.thead``;
export const Tbody = styled.tbody``;
export const Tr = styled.tr``;
export const Th = styled.th`
  text-align: start;
  border-bottom: inset;
  padding-bottom: 5px;

  @media (max-width: 500px) {
    ${(props) => props.onlyWeb && "display: none"}
  }
`;
export const Td = styled.td`
  padding-top: 15px;
  text-align: ${(props) => (props.alignCenter ? "center" : "start")};
  width: ${(props) => (props.width ? props.width : "auto")};

  @media (max-width: 500px) {
    ${(props) => props.onlyWeb && "display: none"}
  }
`;

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

const ConfirmBox = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  width: 300px;
  max-width: 90%;
  text-align: center;
`;

const ConfirmButton = styled.button`
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
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
      const res = await axios.delete(`http://localhost:8800/${id}`);
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
            {viewDetails.endereco ? (
              <>
                <p>
                  <strong>Endereço:</strong>
                </p>
                <p>Rua: {viewDetails.endereco.rua}</p>
                <p>Número: {viewDetails.endereco.numero}</p>
                <p>Bairro: {viewDetails.endereco.bairro}</p>
                <p>Cidade: {viewDetails.endereco.cidade}</p>
                <p>Estado: {viewDetails.endereco.estado}</p>
                <p>CEP: {viewDetails.endereco.cep}</p>
              </>
            ) : (
              <p>
                <strong>Endereço:</strong> Não disponível
              </p>
            )}
            <ConfirmButton variant="no" onClick={() => setViewDetails(null)}>
              Fechar
            </ConfirmButton>
          </DetailsBox>
        </DetailsOverlay>
      )}
      <Table>
        <Thead>
          <Tr>
            <Th>Nome</Th>
            <Th>Email</Th>
            <Th onlyWeb>Telefone</Th>
            <Th onlyWeb>CPF/CNPJ</Th>
            <Th></Th>
            <Th></Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {clientes
            .filter((cliente) => cliente.status === "ativo")
            .map((item, i) => (
              <Tr key={i}>
                <Td width="25%">{item.nome}</Td>
                <Td width="30%">{item.email}</Td>
                <Td width="15%" onlyWeb>
                  {formatTelefone(item.telefone)}
                </Td>
                <Td width="15%" onlyWeb>
                  {formatCpfCnpj(item.cpf_cnpj)}
                </Td>
                <Td alignCenter width="5%">
                  <FaEdit onClick={() => handleEdit(item)} />
                </Td>
                <Td alignCenter width="5%">
                  <FaTrash onClick={() => confirmDeleteClient(item.id)} />
                </Td>
                <Td alignCenter width="5%">
                  <FaEye onClick={() => viewClientDetails(item)} />
                </Td>
              </Tr>
            ))}
        </Tbody>
      </Table>
    </>
  );
};

export default Grid;
