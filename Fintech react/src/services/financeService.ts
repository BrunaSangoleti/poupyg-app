import { api } from './api';
import type { FinanceItem } from '../types';

export const financeService = {
  getReceitas: async (_usuarioId?: string): Promise<FinanceItem[]> => {
    const { data } = await api.get(`/receita`);
    return data.content || data || [];
  },
  getDespesas: async (_usuarioId?: string): Promise<FinanceItem[]> => {
    const { data } = await api.get(`/despesa`);
    return data.content || data || [];
  },
  getInvestimentos: async (_usuarioId?: string): Promise<FinanceItem[]> => {
    const { data } = await api.get(`/investimento`);
    return data.content || data || [];
  }
};
