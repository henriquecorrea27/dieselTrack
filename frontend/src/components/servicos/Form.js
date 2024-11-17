import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";

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

const PopupContainer = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 0.313rem 0.938rem rgba(0, 0, 0, 0.3);
  width: auto;
  max-width: 90%;
`;

const Button = styled.button`
  padding: 0.625rem;
  cursor: pointer;
  border-radius: 0.313rem;
  border: none;
  color: white;
  height: 2.625rem;
  background-color: ${(props) =>
    props.variant === "close" ? "#ff5e5e" : "#2c73d2"};
`;

const FormContainer = styled.form`
  display: grid;
  gap: 2.5rem;
  background-color: #fff;
  padding: 1.25rem 2.5rem 1.25rem 1.25rem;
  box-shadow: 0px 0px 0.313rem #ccc;
  border-radius: 0.313rem;
  grid-template-columns: 1fr 1fr;
  grid-template-areas:
    "nome nome"
    "preco_medio preco_medio"
    "buttons buttons";
`;

const InputArea = styled.div`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  width: 100%;
  padding: 0 0.625rem;
  border: 0.0625rem solid #bbb;
  border-radius: 0.313rem;
  height: 2.5rem;
`;

const Label = styled.label``;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  grid-area: buttons;
`;

const Form = ({ getServicos, onEdit, setOnEdit, showPopup, togglePopup }) => {
  const ref = useRef(null);
  const [precoMedio, setPrecoMedio] = useState("");

  const handleClosePopup = () => {
    setOnEdit(null);
    togglePopup();
  };

  useEffect(() => {
    if (onEdit && ref.current) {
      const servico = ref.current;
      servico.nome.value = onEdit.nome || "";
      setPrecoMedio(
        onEdit.preco_medio ? formatarPreco(onEdit.preco_medio) : ""
      ); // Initialize with formatted value or empty
    } else {
      setPrecoMedio(""); // Reset when adding a new service
    }
  }, [onEdit]);

  const formatarPreco = (value) => {
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) {
      return ""; // Return empty if not a valid number
    }
    return `R$ ${numericValue.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
  };

  const handlePrecoChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove tudo que não for dígito

    // Limita o número de dígitos a no máximo 7
    if (value.length > 7) {
      value = value.slice(0, 7);
    }

    // Insere a vírgula para separar os centavos
    const formattedValue =
      value.slice(0, -2).replace(/\B(?=(\d{3})+(?!\d))/g, ".") +
      "," +
      value.slice(-2);

    setPrecoMedio(`R$ ${formattedValue}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const servico = ref.current;

    if (!servico.nome.value || !precoMedio) {
      return toast.warn("Preencha todos os campos!");
    }

    const servicoData = {
      nome: servico.nome.value,
      preco_medio: parseFloat(
        precoMedio
          .replace("R$", "") // Remove o prefixo "R$"
          .replace(/\./g, "") // Remove os pontos de separação de milhar
          .replace(",", ".") // Substitui a vírgula decimal por ponto
          .trim() // Remove espaços em branco extras
      ).toFixed(2),
    };

    try {
      if (onEdit) {
        await axios.put(
          `http://localhost:8800/servicos/${onEdit.id_Servico}`,
          servicoData
        );
        toast.success("Serviço atualizado com sucesso!");
      } else {
        await axios.post("http://localhost:8800/servicos/", servicoData);
        toast.success("Serviço cadastrado com sucesso!");
      }

      servico.nome.value = "";
      setPrecoMedio("");
      setOnEdit(null);
      getServicos();
      togglePopup();
    } catch (error) {
      toast.error("Erro ao salvar serviço.");
    }
  };

  if (!showPopup) {
    return null;
  }

  return (
    <Overlay>
      <PopupContainer>
        <FormContainer ref={ref} onSubmit={handleSubmit}>
          <InputArea style={{ gridArea: "nome" }}>
            <Label>Nome</Label>
            <Input
              name="nome"
              maxLength={200}
              onInput={(e) => {
                if (e.target.value.length > 200) {
                  e.target.value = e.target.value.slice(0, 200);
                }
              }}
            />
          </InputArea>
          <InputArea style={{ gridArea: "preco_medio" }}>
            <Label>Preço Médio</Label>
            <Input
              name="preco_medio"
              type="text"
              value={precoMedio}
              onChange={handlePrecoChange}
              placeholder="R$ 0,00" // Optional placeholder
            />
          </InputArea>
          <ButtonGroup>
            <Button type="button" variant="close" onClick={handleClosePopup}>
              FECHAR
            </Button>
            <Button type="submit">SALVAR</Button>
          </ButtonGroup>
        </FormContainer>
      </PopupContainer>
    </Overlay>
  );
};

export default Form;
