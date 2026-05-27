import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Header from '../../Components/Header';
import api from '../../services/api';

import './style.css';

function Cadastro() {
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');

  const handleCadastro = async (e) => {
    e.preventDefault();

    // Validações básicas
    if (!nome || !sobrenome || !email || !senha || !confirmarSenha) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (senha !== confirmarSenha) {
      alert('As senhas não coincidem!');
      return;
    }

    try {
      // Junta Nome e Sobrenome para enviar ao backend, conforme o esperado
      const response = await api.post('/usuarios/cadastrar', {
        nome: `${nome} ${sobrenome}`,
        email,
        senha,
        username
      });

      console.log(response.data);
      alert('Conta criada com sucesso!');
      
      // Redireciona para a tela de login
      navigate('/login');

    } catch (error) {
      console.log(error);
      if (error.response && error.response.data && error.response.data.erro) {
        alert(error.response.data.erro);
      } else {
        alert('Erro ao realizar o cadastro. Tente novamente.');
      }
    }
  };

  return (
    <>
      <Header />
      <div className="cadastro">
        <form className="cadastro-form" onSubmit={handleCadastro}>
          <h1>Criar Conta</h1>

          <div className="row">
            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input 
                type="text" 
                id="name" 
                placeholder="João" 
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>
            <div className="input-block">
              <label htmlFor="lastName">Sobrenome</label>
              <input 
                type="text" 
                id="lastName" 
                placeholder="Silva" 
                value={sobrenome}
                onChange={(e) => setSobrenome(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-block">
            <label htmlFor="user">Nome de usuário</label>
            <input 
              type="text" 
              id="user" 
              placeholder="@joaosilva" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="input-block">
            <label htmlFor="email">E-mail</label>
            <input 
              type="email" 
              id="email" 
              placeholder="seu@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
              required
            />
          </div>

          <div className="input-block">
            <label htmlFor="confirmPassword">Confirmar Senha</label>
            <input 
              type="password" 
              id="confirmPassword" 
              placeholder="********" 
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
            />
          </div>

          <div className="input-block">
            <label htmlFor="date">Data de Nascimento</label>
            <input 
              type="date" 
              id="date" 
              value={dataNascimento}
              onChange={(e) => setDataNascimento(e.target.value)}
            />
          </div>

          <button type="submit" className="submit-button">
            Criar Conta
          </button>

           <p className="login-link">
             Já possui conta?{' '}
             <span 
               className="entrarLaranja"
               onClick={() => navigate('/login')}
               style={{ cursor: 'pointer' }}
             >
               Entrar
             </span>
           </p>
        </form>
      </div>
    </>
  );
}

export default Cadastro;