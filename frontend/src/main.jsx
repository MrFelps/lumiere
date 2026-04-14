import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import Cadastro from './pages/Cadastro'
import Login from './pages/Login'
import './index.css'
import SelecaoGeneros from './pages/SelecaoGeneros';
import Notificacoes from "./pages/Notificacao/index";
import Perfil from './pages/Perfil';

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

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
)