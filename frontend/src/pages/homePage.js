import React from "react";
import styled from "styled-components";

const Logo = styled.img``;
const Container = styled.div``;
const ButtonClientes = styled.button``;
const ButtonServicos = styled.button``;
const ButtonAgendamentos = styled.button``;

const HomePage = () => {
  return (
    <Container>
      <Logo src="./assets/logo.png" alt="Logo" />
      <ButtonClientes onClick={() => (window.location.href = "/clientes")}>
        Clientes
      </ButtonClientes>
      <ButtonServicos onClick={() => (window.location.href = "/servicos")}>
        Serviços
      </ButtonServicos>
      <ButtonAgendamentos
        onClick={() => (window.location.href = "/agendamentos")}
      >
        Agendamentos
      </ButtonAgendamentos>
    </Container>
  );
};

export default HomePage;
