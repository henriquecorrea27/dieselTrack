import axios from "axios";
import React, { useEffect, useRef } from "react";
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
  grid-template-columns: 1fr 1fr 1fr; 
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-areas: 
    "nome nome descricao"
    "preco_medio preco_medio descricao"; 
}
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
  grid-area: buttons; /* Posiciona este grupo na área de "buttons" */
`;

const Form = ({ getServicos, onEdit, setOnEdit, showPopup, togglePopup }) => {
  const ref = useRef(null);

  const handleClosePopup = () => {
    setOnEdit(null);
    togglePopup();
  };

  useEffect(() => {
    if (onEdit && ref.current) {
      const servico = ref.current;
      servico.nome.value = onEdit.nome || "";
      servico.descricao.value = onEdit.descricao || "";
      servico.preco_medio.value = onEdit.preco_medio || "";
    }
  }, [onEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const servico = ref.current;

    if (
      !servico.nome.value ||
      !servico.descricao.value ||
      !servico.preco_medio.value
    ) {
      return toast.warn("Preencha todos os campos!");
    }

    const servicoData = {
      nome: servico.nome.value,
      descricao: servico.descricao.value,
      preco_medio: servico.preco_medio.value,
    };

    try {
      if (onEdit) {
        await axios.put(
          `http://localhost:8800/servicos/${onEdit.id_Servico}`,
          servicoData
        );
        toast.success("Servico atualizado com sucesso!");
      } else {
        await axios.post("http://localhost:8800/servicos/", servicoData);
        toast.success("Servico cadastrado com sucesso!");
      }

      // Clear form fields
      servico.nome.value = "";
      servico.descricao.value = "";
      servico.preco_medio.value = "";
      setOnEdit(null);
      getServicos();
      togglePopup(); // Fechar o popup após o cadastro
    } catch (error) {
      toast.error("Erro ao salvar servico.");
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
            <Input name="nome" />
          </InputArea>
          <InputArea style={{ gridArea: "descricao" }}>
            <Label>Descrição</Label>
            <Input name="descricao" type="text" />
          </InputArea>
          <InputArea style={{ gridArea: "preco_medio" }}>
            <Label>Preço Médio</Label>
            <Input name="preco_medio" type="number" />
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
