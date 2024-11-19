import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import { MdLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body, html {
    height: 100%;
    background-color: #f0f0f0;
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #0075ff;
`;

const Logo = styled.img`
  height: 75px;
`;

const UserIconContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const Container = styled.div`
  display: flex;
  gap: 50px;
  justify-content: center;
  background: linear-gradient(180deg, #0075ff 0%, #001a42 100%);
  min-height: 100vh;
`;

const Button = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 30px;
  margin-top: 10px;
  border: none;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  border-radius: 20px;
  cursor: pointer;
  height: 550px;

  img {
    height: 500px;
    width: 300px;
    object-fit: cover;
    border-radius: 15px;
  }

  &:hover {
    background-color: #0056b3;
  }
`;

const HomePage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <GlobalStyle />
      <Header>
        <Logo src="./assets/logo.png" alt="Logo" />
        <UserIconContainer onClick={handleLogout}>
          <MdLogout size={30} style={{ marginLeft: "10px", color: "white" }} />
        </UserIconContainer>
      </Header>

      <Container>
        <Button onClick={() => (window.location.href = "/clientes")}>
          Clientes
          <img src="./assets/clientes.png" alt="Clientes Icon" />
        </Button>
        <Button onClick={() => (window.location.href = "/servicos")}>
          Serviços
          <img src="./assets/servicos.png" alt="Serviços Icon" />
        </Button>
        <Button onClick={() => (window.location.href = "/agendamentos")}>
          Agendamentos
          <img src="./assets/calendario.jpg" alt="Agendamentos Icon" />
        </Button>
      </Container>
    </>
  );
};

export default HomePage;
