import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Components/Header';
import './style.css';

const GENEROS = [
  { id: 1, nome: 'Terror', img: 'https://images.pexels.com/photos/5435307/pexels-photo-5435307.jpeg?auto=compress&cs=tinysrgb&w=500' },
  { id: 2, nome: 'Comédia', img: 'https://images.pexels.com/photos/4348556/pexels-photo-4348556.jpeg?auto=compress&cs=tinysrgb&w=500' }, 
  { id: 3, nome: 'Romance', img: 'https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg?auto=compress&cs=tinysrgb&w=500' },
  { id: 4, nome: 'Ação', img: 'https://images.pexels.com/photos/2085831/pexels-photo-2085831.jpeg?auto=compress&cs=tinysrgb&w=500' },
  { id: 5, nome: 'Ficção Científica', img: 'https://images.pexels.com/photos/2156/sky-earth-space-working.jpg?auto=compress&cs=tinysrgb&w=500' },
  { id: 6, nome: 'Drama', img: 'https://images.pexels.com/photos/2510428/pexels-photo-2510428.jpeg?auto=compress&cs=tinysrgb&w=500' }, 
  { id: 7, nome: 'Aventura', img: 'https://images.pexels.com/photos/235922/pexels-photo-235922.jpeg?auto=compress&cs=tinysrgb&w=500' },
  { id: 8, nome: 'Fantasia', img: 'https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&w=500' },
];

function SelecaoGeneros() {
  const [selecionados, setSelecionados] = useState([]);
  const navigate = useNavigate();

  const toggleGenero = (id) => {
    if (selecionados.includes(id)) {
      setSelecionados(selecionados.filter(item => item !== id));
    } else {
      setSelecionados([...selecionados, id]);
    }
  };

  return (
    <div className="onboarding-container">
      <Header />
      
      <main className="onboarding-main">
        <h1 className="onboarding-title">Quais tipos de filmes você gosta?</h1>
        <p className="onboarding-subtitle">Selecione seus gêneros favoritos para personalizar sua experiência</p>
        <div className="onboarding-grid">
          {GENEROS.map((genero) => (
            <div 
             key={genero.id} 
            className={`genero-item ${selecionados.includes(genero.id) ? 'selected' : ''}`}
            onClick={() => toggleGenero(genero.id)}>
            <img src={genero.img} alt={genero.nome} />
            {selecionados.includes(genero.id) && <div className="check-badge">✓</div>}
  <div className="genero-label">
    <span>{genero.nome}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="onboarding-actions">
          <button 
            className="btn-primary" 
            onClick={() => navigate('/home')}
            disabled={selecionados.length === 0}
          >
            Continuar
          </button>
          <button className="btn-ghost" onClick={() => navigate('/notificacoes')}>Pular</button>
        </div>

        <p className="onboarding-footer">{selecionados.length} gêneros selecionados</p>
      </main>
    </div>
  );
}

export default SelecaoGeneros;