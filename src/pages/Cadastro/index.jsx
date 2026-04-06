import Header from '../../Components/Header'
import {useNavigate} from 'react-router-dom';
import './style.css'

function Cadastro() {
  const navigate = useNavigate();
  return (
    <>
      <Header />
      <div className="cadastro">
        <form className="cadastro-form">
          <h1>Criar Conta</h1>

          <div className="row">
            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input type="text" id="name" placeholder="João" />
            </div>
            <div className="input-block">
              <label htmlFor="lastName">Sobrenome</label>
              <input type="text" id="lastName" placeholder="Silva" />
            </div>
          </div>

          <div className="input-block">
            <label htmlFor="user">Nome de usuário</label>
            <input type="text" id="user" placeholder="@joaosilva" />
          </div>

          <div className="input-block">
            <label htmlFor="email">E-mail</label>
            <input type="email" id="email" placeholder="seu@email.com" />
          </div>

          <div className="input-block">
            <label htmlFor="password">Senha</label>
            <input type="password" id="password" placeholder="********" />
          </div>

          <div className="input-block">
            <label htmlFor="confirmPassword">Confirmar Senha</label>
            <input type="password" id="confirmPassword" placeholder="********" />
          </div>

          <div className="input-block">
            <label htmlFor="date">Data de Nascimento</label>
            <input type="date" id="date" />
          </div>

          <button type="submit" className="submit-button">
            Criar Conta
          </button>

           <p className="login-link">Já possui conta? <span className="entrarLaranja"onClick={()=> navigate('/login')}style={{cursor: 'pointer'}}>Entrar</span></p>
        </form>
      </div>
    </>
  )
}

export default Cadastro