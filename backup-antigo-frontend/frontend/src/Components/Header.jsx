import './style.css'; 

function Header() {
  return (
    <header className="main-header">
      <div className="logo-container">
        <img src="/logo-lumiere.png" alt="Lumiere Sun Logo" className="logo-img" />
        <span className="logo-text">Lumière</span>
      </div>
    </header>
  );
}

export default Header;