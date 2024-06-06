import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GlobalStyle from "./styles/global";
import Grid from "./components/Grid";
import Form from "./components/Form";
import DetailsModal from "./components/DetailsModal"; // Import the new DetailsModal component
import logoImage from "C:/Users/helen/Documents/DieselTrack/frontend/src/logo.png";

const Container = styled.div`
  width: 100%;
  max-width: 85vw;
  margin-top: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.img`
  width: 150px;
`;

const CadastroButton = styled.button`
  padding: 10px 20px;
  background-color: #fff;
  color: #015fd0;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  font-size: 15px;
`;

const Title = styled.h2`
  color: #fff;
  margin-left: 20px;
`;

function App() {
  const [clientes, setClientes] = useState([]);
  const [onEdit, setOnEdit] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [viewDetails, setViewDetails] = useState(null); // New state for viewing details

  const getClientes = async () => {
    try {
      const res = await axios.get("http://localhost:8800");
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

  return (
    <>
      <Container>
        <Title>CLIENTES</Title>
        <Logo src={logoImage} alt="Logo" />
        <CadastroButton onClick={togglePopup}>Cadastrar Cliente</CadastroButton>
      </Container>
      <Grid
        clientes={clientes}
        setClientes={setClientes}
        setOnEdit={handleEdit}
        setViewDetails={setViewDetails} // Pass setViewDetails to Grid
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
