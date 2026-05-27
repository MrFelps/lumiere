import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'

// Importação das Páginas
import Cadastro from './pages/Cadastro'
import Login from './pages/Login'
import SelecaoGeneros from './pages/SelecaoGeneros'
import Notificacoes from "./pages/Notificacao/index" 
import Perfil from './pages/Perfil'
import LumiereIA from './pages/LumiereIA'
import Busca from './pages/Busca'
import DetalhesFilme from './pages/DetalhesFilme'
import Home from './pages/Home'
import Descobrir from './pages/Descobrir'
import Filmes from './pages/Filmes'
import EmAlta from './pages/EmAlta/index'
import Listas from './pages/Listas/index'
import DetalhesListas from './pages/DetalhesListas/index'

import './index.css'

const EmConstrucao = ({ titulo }) => (
  <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
    <div style={{ textAlign: 'center' }}>
      <h1 style={{ fontSize: '3rem', margin: '0 0 10px 0' }}>🚧</h1>
      <h2>Página "{titulo}" em construção</h2>
      <p style={{ color: '#888' }}>Em breve integraremos com a API do TMDB aqui.</p>
    </div>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="879927262248-4lkuh1tavoiagkc7sk6b6oeilevfvcqu.apps.googleusercontent.com">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />

          <Route path="/selecao-generos" element={<SelecaoGeneros />} />

          <Route path="/notificacoes" element={<Notificacoes />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/ia" element={<LumiereIA />} />
          <Route path="/busca" element={<Busca />} />
          <Route path="/filme/:id" element={<DetalhesFilme />} />

          <Route path="/home" element={<Home />} />
          <Route path="/descobrir" element={<Descobrir />} />
          <Route path="/filmes" element={<Filmes />} />
          <Route path="/em-alta" element={<EmAlta />} />
          <Route path="/listas" element={<Listas />} />
          <Route path="/lista/:id" element={<DetalhesListas />} />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
)