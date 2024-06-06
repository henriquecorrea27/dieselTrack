import React from "react";
import styled from "styled-components";

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
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 600px;
`;

const Button = styled.button`
  padding: 10px;
  margin-top: 20px;
  cursor: pointer;
  border-radius: 5px;
  border: none;
  color: white;
  background-color: #2c73d2;
`;

const DetailsModal = ({ cliente, onClose }) => {
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
        {cliente.endereco && (
          <>
            <h3>Endereço</h3>
            <p>
              <strong>Rua:</strong> {cliente.endereco.rua}
            </p>
            <p>
              <strong>Número:</strong> {cliente.endereco.numero}
            </p>
            <p>
              <strong>Bairro:</strong> {cliente.endereco.bairro}
            </p>
            <p>
              <strong>Cidade:</strong> {cliente.endereco.cidade}
            </p>
            <p>
              <strong>Estado:</strong> {cliente.endereco.estado}
            </p>
            <p>
              <strong>CEP:</strong> {cliente.endereco.cep}
            </p>
          </>
        )}
        <Button onClick={onClose}>Fechar</Button>
      </ModalContainer>
    </Overlay>
  );
};

export default DetailsModal;
