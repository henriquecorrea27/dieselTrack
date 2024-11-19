import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body, html {
    font-family: 'Poppins', sans-serif;
    height: 100%;
    margin: 0;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #0075ff;
  width: 100%;
`;

const FormContainer = styled.div`
  background-color: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #0075ff;
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-size: 1rem;
  margin-bottom: 8px;
  text-align: left;
  display: block;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Logo = styled.img`
  height: 100px;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #0075ff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const EyeIcon = styled.div`
  position: absolute;
  right: 10px;
  top: 38px;
  cursor: pointer;
`;

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8800/auth/login", {
        email,
        senha,
      });

      localStorage.setItem("token", response.data.token);
      onLogin();
      navigate("/home");
    } catch (error) {
      alert(error.response?.data?.error || "Erro ao fazer login");
    }
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <Logo src="./assets/logo.png" alt="Logo" />
        <FormContainer>
          <Title>Login</Title>
          <form onSubmit={handleLogin}>
            <div>
              <Label htmlFor="email">Email:</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div style={{ position: "relative" }}>
              <Label htmlFor="senha">Senha:</Label>
              <Input
                type={showPassword ? "text" : "password"}
                id="senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
              <EyeIcon onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </EyeIcon>
            </div>
            <Button type="submit">Entrar</Button>
          </form>
        </FormContainer>
      </Container>
    </>
  );
};

export default LoginPage;
