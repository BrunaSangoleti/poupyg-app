import { useState, useEffect } from 'react';
import { financeService } from '../services/financeService';
import type { FinanceItem, SummaryData } from '../types';

export const useFinanceSummary = () => {
  const [receitas, setReceitas] = useState<FinanceItem[]>([]);
  const [despesas, setDespesas] = useState<FinanceItem[]>([]);
  const [investimentos, setInvestimentos] = useState<FinanceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [summary, setSummary] = useState<SummaryData>({
    totalInvestimentos: 0,
    totalReceitas: 0,
    totalDespesas: 0,
    saldoAtual: 0,
  });

  const loadData = async () => {
    const usuarioId = localStorage.getItem('usuarioId');
    if (!usuarioId) {
      setError('Usuário não identificado.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const [resReceitas, resDespesas, resInvest] = await Promise.all([
        financeService.getReceitas(usuarioId).catch(() => []),
        financeService.getDespesas(usuarioId).catch(() => []),
        financeService.getInvestimentos(usuarioId).catch(() => []),
      ]);

      setReceitas(resReceitas);
      setDespesas(resDespesas);
      setInvestimentos(resInvest);

      const totalRec = resReceitas.reduce((acc, curr) => acc + Number(curr.valor || curr.price || 0), 0);
      const totalDesp = resDespesas.reduce((acc, curr) => acc + Number(curr.valor || curr.price || 0), 0);
      const totalInv = resInvest.reduce((acc, curr) => acc + Number(curr.valor || curr.price || 0), 0);

      setSummary({
        totalReceitas: totalRec,
        totalDespesas: totalDesp,
        totalInvestimentos: totalInv,
        saldoAtual: totalRec - totalDesp,
      });

    } catch (err) {
      setError('Erro ao carregar os dados financeiros.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return { receitas, despesas, investimentos, summary, loading, error, reload: loadData };
};
