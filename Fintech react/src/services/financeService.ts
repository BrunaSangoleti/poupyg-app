import { api } from './api';
import type { FinanceItem } from '../types';

export const financeService = {
  getReceitas: async (usuarioId: string): Promise<FinanceItem[]> => {
    const { data } = await api.get(`/receita`);
    return data.content || data || [];
  },
  getDespesas: async (usuarioId: string): Promise<FinanceItem[]> => {
    const { data } = await api.get(`/despesa`);
    return data.content || data || [];
  },
  getInvestimentos: async (usuarioId: string): Promise<FinanceItem[]> => {
    const { data } = await api.get(`/investimento`);
    return data.content || data || [];
  }
};
