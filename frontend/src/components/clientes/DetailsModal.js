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
  border-radius: 0.5rem;
  padding: 1.25rem;
  box-shadow: 0 0.313rem 0.938rem rgba(0, 0, 0, 0.3);
  width: 65vw;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const Button = styled.button`
  position: sticky;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 0.625rem;
  cursor: pointer;
  border-radius: 0.313rem;
  border: none;
  color: white;
  background-color: #2c73d2;
  z-index: 1100;
`;

const StrikeThrough = styled.span`
  color: #999;
`;

const formatarData = (data) => {
  const dateObj = new Date(data);
  return dateObj.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatarTelefone = (value) => {
  value = value.replace(/\D/g, "");
  if (value.length > 11) {
    value = value.slice(0, 11);
  }
  if (value.length === 11) {
    value = value.replace(/(\d{2})(\d{5})(\d{4})/, "($1)$2-$3");
  } else if (value.length === 10) {
    value = value.replace(/(\d{2})(\d{4})(\d{4})/, "($1)$2-$3");
  }
  return value;
};

const formatarCpfCnpj = (value) => {
  value = value.replace(/\D/g, "");
  if (value.length <= 11) {
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  } else {
    value = value.replace(/^(\d{2})(\d)/, "$1.$2");
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");
    value = value.replace(/(\d{4})(\d{1,2})$/, "$1-$2");
  }
  return value;
};

const formatarCep = (value) => {
  value = value.replace(/\D/g, "");
  if (value.length > 8) {
    value = value.slice(0, 8);
  }
  value = value.replace(/(\d{2})(\d{3})(\d{3})/, "$1.$2-$3");
  return value;
};

const DetailsModal = ({ cliente, onClose }) => {
  if (!cliente) return null;

  return (
    <Overlay>
      <ModalContainer>
        <Content>
          <h2>Detalhes do Cliente</h2>
          <p>
            <strong>Nome:</strong> {cliente.nome}
          </p>
          <p>
            <strong>Email:</strong> {cliente.email}
          </p>
          <p>
            <strong>Telefone:</strong> {formatarTelefone(cliente.telefone)}
          </p>
          <p>
            <strong>CPF/CNPJ:</strong> {formatarCpfCnpj(cliente.cpf_cnpj)}
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
            <strong>CEP:</strong> {formatarCep(cliente.cep)}
          </p>

          <h3>Agendamentos</h3>
          {cliente.agendamentos.length > 0 ? (
            cliente.agendamentos.map((agendamento) => (
              <div key={agendamento.id}>
                <p>
                  <strong>Serviço:</strong> {agendamento.nome_servico}
                </p>

                <p>
                  <strong>Data Ínicio:</strong>{" "}
                  {formatarData(agendamento.data_inicio)}
                </p>
                <p>
                  <strong>Data Término:</strong>{" "}
                  {agendamento.data_termino ? (
                    formatarData(agendamento.data_termino)
                  ) : (
                    <StrikeThrough>Em andamento</StrikeThrough>
                  )}
                </p>

                <hr />
              </div>
            ))
          ) : (
            <p>Nenhum agendamento encontrado para este cliente.</p>
          )}
        </Content>

        <Button onClick={onClose}>Fechar</Button>
      </ModalContainer>
    </Overlay>
  );
};

export default DetailsModal;
