import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { FaTrash, FaEdit, FaEye } from "react-icons/fa";
import { toast } from "react-toastify";
import DetailsModal from "./DetailsModal";

const TableContainer = styled.div`
  width: 85vw;
  height: 70vh;
  max-width: 100%;
  background-color: #fff;
  padding: 1.25rem;
  box-shadow: 0 0 0.3125rem #ccc;
  border-radius: 0.3125rem;
  margin: 1.25rem;
  overflow-y: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;

  th,
  td {
    padding: 0.625rem;
    text-align: left;
    border: 0.0625rem solid #ddd;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const Thead = styled.thead`
  display: table;
  width: 100%;
  table-layout: fixed;
`;

const Tbody = styled.tbody`
  display: block;
  overflow-y: auto;
  max-height: calc(70vh - 3.75rem);
`;

const Tr = styled.tr`
  display: table;
  width: 100%;
  table-layout: fixed;
`;

const Th = styled.th`
  text-align: start;
  padding-bottom: 0.3125rem;
  background-color: #f5f5f5;
`;

const Td = styled.td`
  text-align: ${(props) => (props.alignCenter ? "center" : "start")};
  width: ${(props) => (props.width ? props.width : "auto")};
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
  padding: 1.25rem;
  border-radius: 0.3125rem;
  box-shadow: 0 0 0.3125rem rgba(0, 0, 0, 0.3);
  width: 25%;
  max-width: 90%;
  text-align: center;
`;

const ConfirmButton = styled.button`
  padding: 0.625rem;
  margin: 0.3125rem;
  border-radius: 0.3125rem;
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
  width: 60vw;
  ma-height: 80vh;
  overflow-y: auto;
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

  const viewClientDetails = async (cliente) => {
    try {
      const { data: agendamentos } = await axios.get(
        `http://localhost:8800/clientes/${cliente.id}`
      );
      setViewDetails({ ...cliente, agendamentos });
    } catch (error) {
      toast.error("Erro ao buscar agendamentos.");
      console.error("Erro ao buscar agendamentos", error);
    }
  };

  const formatTelefone = (telefone) => {
    // Formatação de telefone (exemplo)
    return telefone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  };

  const formatCpfCnpj = (cpf_cnpj) => {
    // Formatação de CPF/CNPJ (exemplo)
    return cpf_cnpj.length === 11
      ? cpf_cnpj.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
      : cpf_cnpj.replace(
          /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
          "$1.$2.$3/$4-$5"
        );
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
        <DetailsModal
          cliente={viewDetails}
          onClose={() => setViewDetails(null)}
        />
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
