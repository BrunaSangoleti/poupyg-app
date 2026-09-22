import { api } from './api';

export const authService = {
  login: async (email: string, senha: string):Promise<any> => {
    const { data } = await api.post('/usuarios/login', { email, senha });
    return data;
  }
};
