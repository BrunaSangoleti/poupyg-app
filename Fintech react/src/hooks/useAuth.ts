import { useNavigate } from 'react-router-dom';
import type { User } from '../types';

export const useAuth = () => {
  const navigate = useNavigate();

  const getUsuario = (): User | null => {
    const usuarioSalvo = localStorage.getItem('usuario');
    if (usuarioSalvo) {
      try {
        return JSON.parse(usuarioSalvo) as User;
      } catch {
        return null;
      }
    }
    return null;
  };

  const getUsuarioId = () => localStorage.getItem('usuarioId');
  const isAuthenticated = () => !!localStorage.getItem('token');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('usuario');
    navigate('/');
  };

  return {
    getUsuario,
    getUsuarioId,
    isAuthenticated,
    logout
  };
};
