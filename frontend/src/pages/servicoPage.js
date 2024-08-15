import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import GlobalStyle from "../styles/global";
import Grid from "../components/servicos/Grid";
import Form from "../components/servicos/Form";

const Container = styled.div`
  width: 100%;
  max-width: 89vw;
  margin-top: 1.875rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.img`
  width: 11%;
  margin-left: 2rem;
`;

const Voltar = styled.img`
  width: 3%;
  margin-left: 1.5rem;
`;

const CadastroButton = styled.button`
  padding: 0.625rem 1.25rem;
  background-color: #fff;
  color: #015fd0;
  border: none;
  border-radius: 0.313rem;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.938rem;
`;

const Title = styled.h2`
  color: #fff;
  margin-left: 1.25rem;
`;

function App() {
  const [servicos, setServicos] = useState([]);
  const [onEdit, setOnEdit] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const getServicos = async () => {
    try {
      const res = await axios.get("http://localhost:8800/servicos/");
      setServicos(res.data.sort((a, b) => (a.nome > b.nome ? 1 : -1)));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleEdit = (item) => {
    setOnEdit(item);
    togglePopup();
  };

  useEffect(() => {
    getServicos();
  }, []);

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Volta para a página anterior
  };

  return (
    <>
      <Container>
        <Voltar onClick={handleBack} src="./assets/voltar.png" alt="Voltar" />
        <Logo src="./assets/logo.png" alt="Logo" />
        <CadastroButton onClick={togglePopup}>Cadastrar Serviço</CadastroButton>
      </Container>
      <Grid
        servicos={servicos}
        setServicos={setServicos}
        setOnEdit={handleEdit}
      />
      <Form
        getServicos={getServicos}
        onEdit={onEdit}
        setOnEdit={setOnEdit}
        showPopup={showPopup}
        togglePopup={togglePopup}
      />
      <ToastContainer autoClose={3000} position="bottom-left" />
      <GlobalStyle />
    </>
  );
}

export default App;
