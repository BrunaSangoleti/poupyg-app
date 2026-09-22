import './styles/global.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Dashboard } from './features/dashboard/Dashboard';
import { Perfil } from './pages/Perfil';
import { Investimento } from './pages/Investimento';
import { Movimentacoes } from './pages/Movimentacoes';
import Layout from './components/Layout';
import { NotFound } from './components/NotFound';
import { Login } from './features/auth/Login';

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota pública — Login sem Sidebar */}
        <Route path="/" element={<Login />} />

        {/* Rotas protegidas — Layout com Sidebar */}
        <Route element={<Layout />}>
          <Route path="/home"          element={<Dashboard />}    />
          <Route path="/movimentacoes" element={<Movimentacoes />} />
          <Route path="/investimento"  element={<Investimento />}  />
          <Route path="/perfil"        element={<Perfil />}        />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
