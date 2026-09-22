export interface User {
  codigo?: number;
  email: string;
  cpf: string;
  nome: string;
  telefone: string;
}

export type TransactionType = 'RECEITA' | 'DESPESA' | 'INVESTIMENTO';

export interface FinanceItem {
  id?: number;
  descricao: string;
  valor: number;
  price?: number; // Backend compatibility
  data?: string;
  tipo?: TransactionType;
}

export interface SummaryData {
  totalInvestimentos: number;
  totalReceitas: number;
  totalDespesas: number;
  saldoAtual: number;
}

export interface AuthPayload {
  token: string;
  user: User;
  usuarioId: string;
}
