import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logoImage from '../assets/Gemini_Generated_Image_2yamgd2yamgd2yam-removebg-preview.png';
import { useAuth } from '../hooks/useAuth';

interface NavItem {
  label: string;
  path: string;
  icon: string;
}

const navItems: NavItem[] = [
  { label: 'Visão Geral',    path: '/home',          icon: 'grid_view'    },
  { label: 'Extrato',        path: '/movimentacoes', icon: 'receipt_long' },
  { label: 'Investimentos',  path: '/investimento',  icon: 'trending_up'  },
  { label: 'Meu Perfil',     path: '/perfil',        icon: 'person'       },
];

export const Sidebar = () => {
  const { getUsuario, logout } = useAuth();
  const [usuario, setUsuario] = React.useState(getUsuario());
  const navigate = useNavigate();
  const [avatar, setAvatar] = React.useState<string | null>(localStorage.getItem('user_avatar'));

  React.useEffect(() => {
    const handleAvatarUpdate = () => setAvatar(localStorage.getItem('user_avatar'));
    const handleUsuarioUpdate = () => setUsuario(getUsuario());
    
    window.addEventListener('avatarUpdated', handleAvatarUpdate);
    window.addEventListener('usuarioUpdated', handleUsuarioUpdate);
    
    return () => {
      window.removeEventListener('avatarUpdated', handleAvatarUpdate);
      window.removeEventListener('usuarioUpdated', handleUsuarioUpdate);
    };
  }, []);

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#1A1A1A] z-50 flex flex-col justify-between py-space-xl px-space-md shadow-none border-r border-black/10">
      
      {/* ── Topo: Logo + Nav ── */}
      <div className="flex flex-col gap-space-xl">
        
        {/* Logo */}
        <div
          className="flex justify-center items-center w-full px-space-xs cursor-pointer mb-space-sm"
          onClick={() => navigate('/home')}
          title="Ir para o Dashboard"
        >
          <img
            src={logoImage}
            alt="Logo Poupyg"
            className="h-20 sm:h-24 lg:h-28 w-auto max-w-[90%] object-contain"
          />
        </div>

        {/* Links de Navegação */}
        <nav className="flex flex-col gap-space-xxs">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-space-sm px-space-md py-space-sm rounded-2xl font-label-button text-label-button transition-all ` +
                (isActive
                  ? 'bg-white text-[#1A1A1A] font-bold shadow-sm'
                  : 'text-gray-400 hover:bg-white/10 hover:text-white')
              }
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* 🔹 Rodapé: Perfil do Usuário 🔹 */}
      <div className="bg-white/5 rounded-2xl p-space-sm flex items-center justify-between gap-space-xs">
        <div className="flex items-center gap-space-xs min-w-0">
          {/* Avatar com inicial do nome ou imagem salva */}
          <div className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0 font-semibold text-sm overflow-hidden">
            {avatar ? (
              <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              usuario?.nome?.charAt(0).toUpperCase() || 'U'
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-label-button text-label-button text-white truncate leading-tight">
              {usuario?.nome?.split(' ')[0] || 'Usuário'}
            </span>
            <span className="font-body-sm text-body-sm text-gray-400 truncate leading-tight">
              {usuario?.email || ''}
            </span>
          </div>
        </div>

        {/* Botão Logout */}
        <button
          aria-label="Sair"
          onClick={() => {
            logout();
            navigate('/');
          }}
          className="text-gray-400 hover:text-white hover:bg-white/10 p-1.5 rounded-xl transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
        </button>
      </div>
    </aside>
  );
};
