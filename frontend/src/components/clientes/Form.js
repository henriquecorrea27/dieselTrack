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
  padding: 1rem;
  max-height: 90vh;
  overflow-y: auto;
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
  grid-template-columns: repeat(3, 1fr);
  grid-template-areas:
    "nome nome email"
    "telefone cpf_cnpj cep"
    "rua numero bairro"
    "cidade cidade estado"
    ". buttons buttons";
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

const Form = ({ getClientes, onEdit, setOnEdit, showPopup, togglePopup }) => {
  const ref = useRef(null);
  const [telefone, setTelefone] = useState("");
  const [cep, setCep] = useState("");

  const handleClosePopup = () => {
    setOnEdit(null);
    setTelefone("");
    setCep("");
    togglePopup();
  };

  useEffect(() => {
    if (onEdit && ref.current) {
      const cliente = ref.current;
      cliente.nome.value = onEdit.nome || "";
      cliente.email.value = onEdit.email || "";
      setTelefone(formatTelefone(onEdit.telefone || ""));
      cliente.cpf_cnpj.value = formatCpfCnpj(onEdit.cpf_cnpj || "");

      cliente.numero.value = onEdit.numero || "";
      cliente.rua.value = onEdit.rua || "";
      cliente.bairro.value = onEdit.bairro || "";
      cliente.cidade.value = onEdit.cidade || "";
      cliente.estado.value = onEdit.estado || "";
      setCep(formatCep(onEdit.cep || ""));
    }
  }, [onEdit]);

  const formatTelefone = (value) => {
    value = value.replace(/\D/g, ""); // Remove non-numeric characters

    if (value.length > 11) {
      value = value.slice(0, 11); // Limit to 11 digits
    }

    if (value.length === 11) {
      value = value.replace(/(\d{2})(\d{5})(\d{4})/, "($1)$2-$3");
    } else if (value.length === 10) {
      value = value.replace(/(\d{2})(\d{4})(\d{4})/, "($1)$2-$3");
    }

    return value;
  };

  const handleTelefoneChange = (e) => {
    const { value } = e.target;
    setTelefone(formatTelefone(value));
  };

  const formatCpfCnpj = (value) => {
    value = value.replace(/\D/g, ""); // Remove non-numeric characters

    if (value.length <= 11) {
      // CPF formatting
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else {
      // CNPJ formatting
      value = value.replace(/^(\d{2})(\d)/, "$1.$2");
      value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
      value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");
      value = value.replace(/(\d{4})(\d{1,2})$/, "$1-$2");
    }

    return value;
  };

  const handleCpfCnpjChange = (e) => {
    const { value } = e.target;
    e.target.value = formatCpfCnpj(value);
  };

  const formatCep = (value) => {
    value = value.replace(/\D/g, ""); // Remove non-numeric characters

    if (value.length > 8) {
      value = value.slice(0, 8); // Limit to 8 digits
    }

    value = value.replace(/(\d{2})(\d{3})(\d{3})/, "$1.$2-$3");

    return value;
  };

  const handleCepChange = (e) => {
    const { value } = e.target;
    setCep(formatCep(value));
  };

  const validateCep = (value) => {
    const cleanedValue = value.replace(/\D/g, "");
    return cleanedValue.length === 8;
  };

  const validateCpfCnpj = (value) => {
    const cleanedValue = value.replace(/\D/g, "");
    return cleanedValue.length === 11 || cleanedValue.length === 14;
  };

  const validateTelefone = (value) => {
    const cleanedValue = value.replace(/\D/g, "");
    return cleanedValue.length === 10 || cleanedValue.length === 11;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cliente = ref.current;

    if (
      !cliente.nome.value ||
      !cliente.email.value ||
      !telefone ||
      !cliente.cpf_cnpj.value ||
      !cliente.rua.value ||
      !cliente.numero.value ||
      !cliente.bairro.value ||
      !cliente.cidade.value ||
      !cliente.estado.value ||
      !cep
    ) {
      return toast.warn("Preencha todos os campos!");
    }

    if (!validateTelefone(telefone)) {
      toast.error("Insira um número de telefone válido.");
      return;
    }

    if (!validateCpfCnpj(cliente.cpf_cnpj.value)) {
      toast.error("Insira um CPF ou CNPJ válido.");
      return;
    }

    if (!validateCep(cep)) {
      toast.error("Insira um CEP válido.");
      return;
    }

    const clienteData = {
      nome: cliente.nome.value,
      email: cliente.email.value,
      telefone: telefone.replace(/\D/g, ""), // Remove non-numeric characters before sending to the backend
      cpf_cnpj: cliente.cpf_cnpj.value.replace(/\D/g, ""), // Remove non-numeric characters before sending to the backend
      endereco: {
        rua: cliente.rua.value,
        numero: cliente.numero.value,
        bairro: cliente.bairro.value,
        cidade: cliente.cidade.value,
        estado: cliente.estado.value,
        cep: cep.replace(/\D/g, ""), // Remove non-numeric characters
      },
    };

    try {
      if (onEdit) {
        await axios.put(
          `http://localhost:8800/clientes/${onEdit.id}`,
          clienteData
        );
        toast.success("Cliente atualizado com sucesso!");
      } else {
        await axios.post("http://localhost:8800/clientes/", clienteData);
        toast.success("Cliente cadastrado com sucesso!");
      }

      // Clear form fields
      cliente.nome.value = "";
      cliente.email.value = "";
      setTelefone("");
      cliente.cpf_cnpj.value = "";
      cliente.rua.value = "";
      cliente.numero.value = "";
      cliente.bairro.value = "";
      cliente.cidade.value = "";
      cliente.estado.value = "";
      setCep("");

      setOnEdit(null);
      getClientes();
      togglePopup(); // Fechar o popup após o cadastro
    } catch (error) {
      toast.error("Erro ao salvar cliente.");
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
              maxLength={255}
              onInput={(e) => {
                if (e.target.value.length > 255) {
                  e.target.value = e.target.value.slice(0, 255);
                }
              }}
            />
          </InputArea>
          <InputArea style={{ gridArea: "email" }}>
            <Label>E-mail</Label>
            <Input
              name="email"
              type="email"
              maxLength={255}
              onInput={(e) => {
                if (e.target.value.length > 255) {
                  e.target.value = e.target.value.slice(0, 255);
                }
              }}
            />
          </InputArea>
          <InputArea style={{ gridArea: "telefone" }}>
            <Label>Telefone</Label>
            <Input
              name="telefone"
              value={telefone}
              onChange={handleTelefoneChange}
              maxLength="15"
            />
          </InputArea>
          <InputArea style={{ gridArea: "cpf_cnpj" }}>
            <Label>CPF/CNPJ</Label>
            <Input
              name="cpf_cnpj"
              type="text"
              onChange={handleCpfCnpjChange}
              maxLength="18"
            />
          </InputArea>
          <InputArea style={{ gridArea: "rua" }}>
            <Label>Rua</Label>
            <Input
              name="rua"
              maxLength={255}
              onInput={(e) => {
                if (e.target.value.length > 255) {
                  e.target.value = e.target.value.slice(0, 255);
                }
              }}
            />
          </InputArea>
          <InputArea style={{ gridArea: "numero" }}>
            <Label>Número</Label>
            <Input
              name="numero"
              type="number"
              maxLength={10}
              onInput={(e) => {
                if (e.target.value.length > 10) {
                  e.target.value = e.target.value.slice(0, 10);
                }
              }}
            />
          </InputArea>
          <InputArea style={{ gridArea: "bairro" }}>
            <Label>Bairro</Label>
            <Input
              name="bairro"
              maxLength={100}
              onInput={(e) => {
                if (e.target.value.length > 100) {
                  e.target.value = e.target.value.slice(0, 100);
                }
              }}
            />
          </InputArea>
          <InputArea style={{ gridArea: "cep" }}>
            <Label>CEP</Label>
            <Input
              name="cep"
              value={cep}
              onChange={handleCepChange}
              maxLength="10"
            />
          </InputArea>
          <InputArea style={{ gridArea: "cidade" }}>
            <Label>Cidade</Label>
            <Input
              name="cidade"
              maxLength={100}
              onInput={(e) => {
                if (e.target.value.length > 100) {
                  e.target.value = e.target.value.slice(0, 100);
                }
              }}
            />
          </InputArea>
          <InputArea style={{ gridArea: "estado" }}>
            <Label>Estado</Label>
            <Input
              name="estado"
              maxLength={50}
              onInput={(e) => {
                if (e.target.value.length > 50) {
                  e.target.value = e.target.value.slice(0, 50);
                }
              }}
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
