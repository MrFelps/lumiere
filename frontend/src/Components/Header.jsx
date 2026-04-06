import logo from '../assets/logo-lumiere.png'
import './style.css'; 

function Header() {
  return (
    <header className="main-header">
      <div className="logo-container">
        <img src={logo} alt="Lumiere Sun Logo" className="logo-img" />
        <span className="logo-text">Lumière</span>
      </div>
    </header>
  );
}

export default Header;