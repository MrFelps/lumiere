import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import Header from '../../Components/Header';
import './style.css';

function Login() {
  const navigate = useNavigate();

  const handleSuccess = (credentialResponse) => {
    console.log("Login com Google Sucesso:", credentialResponse);
    const details = jwtDecode(credentialResponse.credential);
    console.log("Dados do Usuário:", details);
  };

  return (
    <>
      <Header />
      <div className="login">
        <form className="login-form">
          <h1>Entrar</h1>
          
          <div className="input-block">
            <label htmlFor="email">E-mail</label>
            <input type="email" id="email" placeholder="seu@email.com" />
          </div>

          <div className="input-block">
            <label htmlFor="password">Senha</label>
            <input type="password" id="password" placeholder="********" />
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

          <p className="login-link">Não possui conta? 
            <span className="cadastrarLaranja" onClick={() => navigate('/cadastro')} style={{ cursor: 'pointer' }}>Cadastrar</span>
          </p>
        </form>
      </div>
    </>
  );
}

export default Login;