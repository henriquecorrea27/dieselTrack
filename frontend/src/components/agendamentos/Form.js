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
    "data_inicio data_inicio"
    "previsao_termino previsao_termino"
    "cliente cliente"
    "servico servico"
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

const Select = styled.select`
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

const Form = ({
  getAgendamentos,
  onEdit,
  setOnEdit,
  showPopup,
  togglePopup,
}) => {
  const ref = useRef(null);
  const [clientes, setClientes] = useState([]);
  const [servicos, setServicos] = useState([]);

  const handleClosePopup = () => {
    setOnEdit(null);
    togglePopup();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientesResponse, servicosResponse] = await Promise.all([
          axios.get("http://localhost:8800/clientes"),
          axios.get("http://localhost:8800/servicos"),
        ]);

        const clientesAtivos = clientesResponse.data.filter(
          (cliente) => cliente.status === "ativo"
        );
        const servicosAtivos = servicosResponse.data.filter(
          (servico) => servico.status === "ativo"
        );

        setClientes(clientesAtivos);
        setServicos(servicosAtivos);
      } catch (error) {
        toast.error("Erro ao carregar clientes ou serviços.");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (onEdit && ref.current) {
      const agendamento = ref.current;

      const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      };

      agendamento.data_inicio.value = formatDate(onEdit.data_inicio || "");
      agendamento.previsao_termino.value = formatDate(
        onEdit.previsao_termino || ""
      );
      agendamento.cliente.value = onEdit.cliente_id || "";
      agendamento.servico.value = onEdit.servico_id || "";
    }
  }, [onEdit]);

  const isValidDate = (dateString) => {
    const [day, month, year] = dateString.split("/");
    const date = new Date(`${year}-${month}-${day}`);
    return (
      date instanceof Date &&
      !isNaN(date) &&
      day > 0 &&
      day <= 31 &&
      month > 0 &&
      month <= 12
    );
  };

  const convertDateToISO = (dateString) => {
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
  };

  const isEndDateAfterStartDate = (startDate, endDate) => {
    return (
      new Date(convertDateToISO(endDate)) >
      new Date(convertDateToISO(startDate))
    );
  };

  const handleDateChange = (e) => {
    const { value } = e.target;
    const formattedValue = value
      .replace(/\D/g, "") // Remove qualquer caractere não numérico
      .slice(0, 8); // Limita a 8 caracteres (ddmmyyyy)

    let formattedDate = formattedValue;
    if (formattedValue.length >= 2) {
      formattedDate = `${formattedValue.slice(0, 2)}/${formattedValue.slice(
        2
      )}`;
    }
    if (formattedValue.length >= 4) {
      formattedDate = `${formattedDate.slice(0, 5)}/${formattedDate.slice(5)}`;
    }

    e.target.value = formattedDate;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    if ((name === "data_inicio" || name === "previsao_termino") && value) {
      if (!isValidDate(value)) {
        toast.error(
          "Data inválida. Por favor, insira uma data válida no formato dd/mm/yyyy."
        );
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const agendamento = ref.current;

    if (
      !agendamento.data_inicio.value ||
      !agendamento.previsao_termino.value ||
      !agendamento.cliente.value ||
      !agendamento.servico.value
    ) {
      return toast.warn("Preencha todos os campos!");
    }

    if (!isValidDate(agendamento.data_inicio.value)) {
      return toast.error(
        "Insira uma data de início válida no formato dd/MM/yyyy."
      );
    }

    if (!isValidDate(agendamento.previsao_termino.value)) {
      return toast.error(
        "Insira uma data prevista de conclusão válida no formato dd/MM/yyyy."
      );
    }

    if (
      !isEndDateAfterStartDate(
        agendamento.data_inicio.value,
        agendamento.previsao_termino.value
      )
    ) {
      return toast.error(
        "A data de término deve ser maior do que a data de início."
      );
    }

    const agendamentoData = {
      data_inicio: convertDateToISO(agendamento.data_inicio.value),
      previsao_termino: convertDateToISO(agendamento.previsao_termino.value),
      cliente_id: agendamento.cliente.value,
      servico_id: agendamento.servico.value,
    };

    try {
      if (onEdit) {
        await axios.put(
          `http://localhost:8800/agendamentos/${onEdit.id}`,
          agendamentoData
        );
        toast.success("Agendamento atualizado com sucesso!");
      } else {
        await axios.post(
          "http://localhost:8800/agendamentos/",
          agendamentoData
        );
        toast.success("Agendamento criado com sucesso!");
      }

      agendamento.data_inicio.value = "";
      agendamento.previsao_termino.value = "";
      agendamento.cliente.value = "";
      agendamento.servico.value = "";
      setOnEdit(null);
      getAgendamentos();
      togglePopup();
    } catch (error) {
      toast.error("Erro ao salvar agendamento.");
    }
  };

  if (!showPopup) {
    return null;
  }

  return (
    <Overlay>
      <PopupContainer>
        <FormContainer ref={ref} onSubmit={handleSubmit}>
          <InputArea style={{ gridArea: "data_inicio" }}>
            <Label>Data de Inicio</Label>
            <Input
              name="data_inicio"
              onChange={handleDateChange} // Chamando a função de formatação de data
              onBlur={handleBlur} // Chamando a validação ao perder o foco
            />
          </InputArea>
          <InputArea style={{ gridArea: "previsao_termino" }}>
            <Label>Data Prevista de Conclusão</Label>
            <Input
              name="previsao_termino"
              onChange={handleDateChange} // Chamando a função de formatação de data
              onBlur={handleBlur} // Chamando a validação ao perder o foco
              type="text"
            />
          </InputArea>
          <InputArea style={{ gridArea: "cliente" }}>
            <Label>Cliente</Label>
            <Select name="cliente">
              <option value="">Selecione o Cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nome}
                </option>
              ))}
            </Select>
          </InputArea>
          <InputArea style={{ gridArea: "servico" }}>
            <Label>Serviço</Label>
            <Select name="servico">
              <option value="">Selecione o Serviço</option>
              {servicos.map((servico) => (
                <option key={servico.id_Servico} value={servico.id_Servico}>
                  {servico.nome}
                </option>
              ))}
            </Select>
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
