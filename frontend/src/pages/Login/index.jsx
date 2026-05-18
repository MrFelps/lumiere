import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import Header from '../../Components/Header';
import api from '../../services/api';

import './style.css';

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleSuccess = (credentialResponse) => {

    console.log("Login com Google Sucesso:", credentialResponse);

    const details = jwtDecode(credentialResponse.credential);

    console.log("Dados do Usuário:", details);
  };

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const response = await api.post('/usuarios/login', {
        email,
        senha
      });

      console.log(response.data);

      localStorage.setItem('token', response.data.token);

      alert('Login realizado com sucesso!');

      navigate('/perfil');

    } catch (error) {

      console.log(error);

      alert('Email ou senha inválidos');
    }
  };

  return (
    <>
      <Header />

      <div className="login">

        <form className="login-form" onSubmit={handleLogin}>

          <h1>Entrar</h1>

          <div className="input-block">

            <label htmlFor="email">E-mail</label>

            <input
              type="email"
              id="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

          </div>

          <div className="input-block">

            <label htmlFor="password">Senha</label>

            <input
              type="password"
              id="password"
              placeholder="********"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />

          </div>

          <label className="remember-me-container">

            <input type="checkbox" id="lembrar-me" />

            <span>Lembrar-me</span>

          </label>

          <button type="submit" className="submit-button">
            Entrar
          </button>

          <div className="separator">ou</div>

          <div className="google-button-container">

            <GoogleLogin
              onSuccess={handleSuccess}
              onError={() => console.log('Login Falhou')}
              theme="filled_black"
              shape="rectangular"
            />

          </div>

          <p className="login-link">

            Não possui conta?

            <span
              className="cadastrarLaranja"
              onClick={() => navigate('/cadastro')}
              style={{ cursor: 'pointer' }}
            >
              Cadastrar
            </span>

          </p>

        </form>

      </div>
    </>
  );
}

export default Login;