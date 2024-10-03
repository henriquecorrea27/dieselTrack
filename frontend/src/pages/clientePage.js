import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import GlobalStyle from "../styles/global";
import Grid from "../components/clientes/Grid";
import Form from "../components/clientes/Form";
import DetailsModal from "../components/clientes/DetailsModal";

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
`;

function App() {
  const [clientes, setClientes] = useState([]);
  const [onEdit, setOnEdit] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [viewDetails, setViewDetails] = useState(null);

  const getClientes = async () => {
    try {
      const res = await axios.get("http://localhost:8800/clientes/");
      setClientes(res.data.sort((a, b) => (a.nome > b.nome ? 1 : -1)));
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
    getClientes();
  }, []);

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <Container>
        <Voltar onClick={handleBack} src="./assets/voltar.png" alt="Voltar" />
        <Logo src="./assets/logo.png" alt="Logo" />
        <CadastroButton onClick={togglePopup}>Cadastrar Cliente</CadastroButton>
      </Container>
      <Grid
        clientes={clientes}
        setClientes={setClientes}
        setOnEdit={handleEdit}
        setViewDetails={setViewDetails}
      />
      <Form
        getClientes={getClientes}
        onEdit={onEdit}
        setOnEdit={setOnEdit}
        showPopup={showPopup}
        togglePopup={togglePopup}
      />
      {viewDetails && (
        <DetailsModal
          cliente={viewDetails}
          onClose={() => setViewDetails(null)}
        />
      )}
      <ToastContainer autoClose={3000} position="bottom-left" />
      <GlobalStyle />
    </>
  );
}

export default App;
