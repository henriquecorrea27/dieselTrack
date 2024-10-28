import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios"; // Para fazer as requisições

const Overlay = styled.div`
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

const ModalContainer = styled.div`
  background: white;
  border-radius: 0.5rem;
  padding: 1.25rem;
  box-shadow: 0 0.313rem 0.938rem rgba(0, 0, 0, 0.3);
  width: 85vw;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
`;

const Button = styled.button`
  padding: 0.625rem;
  margin-top: 1.25rem;
  cursor: pointer;
  border-radius: 0.313rem;
  border: none;
  color: white;
  background-color: #2c73d2;
`;

const DetailsModal = ({ cliente, onClose }) => {
  const [agendamentos, setAgendamentos] = useState([]);

  useEffect(() => {
    if (cliente) {
      // Faz a requisição para buscar os agendamentos do cliente
      axios
        .get(`/agendamentos/cliente/${cliente.id}`)
        .then((res) => setAgendamentos(res.data))
        .catch((err) => console.error("Erro ao buscar agendamentos", err));
    }
  }, [cliente]);

  if (!cliente) return null;

  return (
    <Overlay>
      <ModalContainer>
        <h2>Detalhes do Cliente</h2>
        <p>
          <strong>Nome:</strong> {cliente.nome}
        </p>
        <p>
          <strong>Email:</strong> {cliente.email}
        </p>
        <p>
          <strong>Telefone:</strong> {cliente.telefone}
        </p>
        <p>
          <strong>CPF/CNPJ:</strong> {cliente.cpf_cnpj}
        </p>
        <h3>Endereço</h3>
        <p>
          <strong>Rua:</strong> {cliente.rua}
        </p>
        <p>
          <strong>Número:</strong> {cliente.numero}
        </p>
        <p>
          <strong>Bairro:</strong> {cliente.bairro}
        </p>
        <p>
          <strong>Cidade:</strong> {cliente.cidade}
        </p>
        <p>
          <strong>Estado:</strong> {cliente.estado}
        </p>
        <p>
          <strong>CEP:</strong> {cliente.cep}
        </p>

        <h3>Agendamentos</h3>
        {agendamentos.length > 0 ? (
          agendamentos.map((agendamento) => (
            <div key={agendamento.id}>
              <p>
                <strong>Serviço:</strong> {agendamento.servico_nome}
              </p>
              <p>
                <strong>Data de Início:</strong> {agendamento.data_inicio}
              </p>
              <p>
                <strong>Data de Término:</strong> {agendamento.data_termino}
              </p>
              <hr />
            </div>
          ))
        ) : (
          <p>Nenhum agendamento encontrado para este cliente.</p>
        )}

        <Button onClick={onClose}>Fechar</Button>
      </ModalContainer>
    </Overlay>
  );
};

export default DetailsModal;
