import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useFinanceSummary } from '../../hooks/useFinanceSummary';
import { useAuth } from '../../hooks/useAuth';
import Modal from '../../components/Modal';
import type { FinanceItem } from '../../types';

// Formata data atual em PT-BR
const formatarData = (): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  }).format(new Date());
};

// Formata moeda PT-BR
const brl = (value: number) =>
  value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Mapa de ícone/cor por tipo de transação (chaves em minúsculo = uso local)
const tipoConfig: Record<string, { icon: string; bg: string; text: string }> = {
  receita:      { icon: 'arrow_upward',  bg: 'bg-[#D8E2FF]', text: 'text-[#1A1A1A]' },
  despesa:      { icon: 'arrow_downward', bg: 'bg-[#FFD8E4]', text: 'text-[#1A1A1A]' },
  investimento: { icon: 'trending_up',   bg: 'bg-[#D9F99D]', text: 'text-[#1A1A1A]' },
};

type FiltroType = 'Todas' | 'Entradas' | 'Saídas' | 'Investimentos';

// Tipo local em minúsculo — não confundir com TransactionType do backend (maiúsculo)
type TipoLocal = 'receita' | 'despesa' | 'investimento';
interface TransacaoLocal extends Omit<FinanceItem, 'tipo'> {
  tipo: TipoLocal;
}

interface ModalConfig {
  open: boolean;
  endpoint: string;
  label: string;
  placeholder: string;
}

export const Dashboard = () => {
  const { getUsuario, isAuthenticated } = useAuth();
  const usuario = getUsuario();
  const { receitas, despesas, investimentos, summary, loading, error, reload } = useFinanceSummary();

  const [saldoVisivel, setSaldoVisivel] = useState(true);
  const [filtroAtivo, setFiltroAtivo] = useState<FiltroType>('Todas');
  const [modalConfig, setModalConfig] = useState<{ open: boolean, type: TipoLocal }>({
    open: false, type: 'despesa'
  });

  if (!isAuthenticated()) return <Navigate to="/" replace />;

  // Combina todas as transações com tipo local em minúsculo
  const todasTransacoes: TransacaoLocal[] = [
    ...receitas.map(i => ({ ...i, tipo: 'receita'      as TipoLocal })),
    ...despesas.map(i => ({ ...i, tipo: 'despesa'      as TipoLocal })),
    ...investimentos.map(i => ({ ...i, tipo: 'investimento' as TipoLocal })),
  ];

  const transacoesFiltradas = todasTransacoes.filter(t => {
    if (filtroAtivo === 'Entradas')      return t.tipo === 'receita';
    if (filtroAtivo === 'Saídas')        return t.tipo === 'despesa';
    if (filtroAtivo === 'Investimentos') return t.tipo === 'investimento';
    return true;
  });

  // Top 5 transações mais recentes para a tabela do dashboard
  const transacoesRecentes = transacoesFiltradas.slice(0, 5);

  const filtros: FiltroType[] = ['Todas', 'Entradas', 'Saídas', 'Investimentos'];

  const abrirModal = (tipo: TipoLocal) => {
    setModalConfig({ open: true, type: tipo });
  };

  const fecharModal = () => setModalConfig(prev => ({ ...prev, open: false }));

  return (
    <div className="flex flex-col w-full gap-space-2xl px-space-2xl py-space-2xl animate-fade-in-up">

      {/* ─── Header da Área Principal ─── */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg">
        <div className="flex flex-col gap-space-xxs">
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
            Olá, {usuario?.nome?.split(' ')[0] || 'Usuário'} 👋
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-space-xs flex-wrap">
            <span className="capitalize">{formatarData()}</span>
            <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
            <span className="font-semibold text-secondary">Resumo financeiro consolidado</span>
          </p>
        </div>

        {/* Ações do header */}
        <div className="flex items-center gap-space-sm flex-wrap">
          <button
            onClick={() => abrirModal('receita')}
            className="h-12 px-6 bg-[#1A1A1A] text-white hover:bg-[#1A1A1A]/90 rounded-full text-sm font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>Nova Transação</span>
          </button>
        </div>
      </section>

      {/* ─── Mensagem de Erro Global ─── */}
      {error && (
        <div className="bg-error-container text-on-error-container px-space-md py-space-sm rounded-xl text-body-md font-body-md">
          {error}
        </div>
      )}

      {/* ─── Loading ─── */}
      {loading && (
        <div className="flex items-center justify-center py-space-4xl">
          <span className="material-symbols-outlined text-on-surface-variant animate-spin text-[32px]">progress_activity</span>
        </div>
      )}

      {!loading && (
        <>
          {/* ─── Grid Superior: 4 Cards de Resumo ─── */}
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-lg">

            {/* Card 1: Saldo */}
            <div className="bg-[#FDE68A] rounded-3xl p-6 shadow-none flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/20 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between z-10">
                <span className="text-sm font-medium text-[#1A1A1A]/70">Saldo Geral Disponível</span>
                <button
                  onClick={() => setSaldoVisivel(v => !v)}
                  className="text-[#1A1A1A]/70 hover:text-[#1A1A1A] transition-colors p-1 rounded-full"
                  aria-label={saldoVisivel ? 'Ocultar saldo' : 'Exibir saldo'}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {saldoVisivel ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
              <div className="my-6 z-10">
                <div className="flex items-baseline gap-2">
                  <span className="text-xl text-[#1A1A1A]/70 font-medium">R$</span>
                  <span className="text-4xl font-bold text-[#1A1A1A] tracking-tight">
                    {saldoVisivel ? brl(summary.saldoAtual) : '••••••'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 z-10">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${summary.saldoAtual >= 0 ? 'bg-[#1A1A1A]/10 text-[#1A1A1A]' : 'bg-[#1A1A1A]/10 text-[#1A1A1A]'}`}>
                  <span className="material-symbols-outlined text-[14px]">{summary.saldoAtual >= 0 ? 'trending_up' : 'trending_down'}</span>
                  {summary.saldoAtual >= 0 ? 'Positivo' : 'Negativo'}
                </span>
              </div>
            </div>

            {/* Card 2: Receitas */}
            <div className="bg-[#D8E2FF] rounded-3xl p-6 shadow-none flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#1A1A1A]/70">Receitas do Mês</span>
                <div className="w-10 h-10 rounded-xl bg-[#1A1A1A]/10 text-[#1A1A1A] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">arrow_upward</span>
                </div>
              </div>
              <div className="my-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-xl text-[#1A1A1A]/70 font-medium">R$</span>
                  <span className="text-4xl font-bold text-[#1A1A1A] tracking-tight">{brl(summary.totalReceitas)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#1A1A1A]/40" />
                <span className="text-sm font-medium text-[#1A1A1A]/70">
                  {receitas.length} lançamento{receitas.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Card 3: Despesas */}
            <div className="bg-[#FFD8E4] rounded-3xl p-6 shadow-none flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#1A1A1A]/70">Despesas do Mês</span>
                <div className="w-10 h-10 rounded-xl bg-[#1A1A1A]/10 text-[#1A1A1A] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">arrow_downward</span>
                </div>
              </div>
              <div className="my-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-xl text-[#1A1A1A]/70 font-medium">R$</span>
                  <span className="text-4xl font-bold text-[#1A1A1A] tracking-tight">{brl(summary.totalDespesas)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 bg-[#1A1A1A]/10 text-[#1A1A1A] px-2 py-1 rounded-full text-xs font-semibold">
                  <span className="material-symbols-outlined text-[14px]">receipt_long</span>
                  {despesas.length} registro{despesas.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Card 4: Investimentos */}
            <div className="bg-[#D9F99D] rounded-3xl p-6 shadow-none flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#1A1A1A]/70">Total Investido</span>
                <div className="w-10 h-10 rounded-xl bg-[#1A1A1A]/10 text-[#1A1A1A] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">savings</span>
                </div>
              </div>
              <div className="my-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-xl text-[#1A1A1A]/70 font-medium">R$</span>
                  <span className="text-4xl font-bold text-[#1A1A1A] tracking-tight">{brl(summary.totalInvestimentos)}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#1A1A1A]/70">
                  {investimentos.length} aporte{investimentos.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </section>

          {/* ─── Grid Inferior: 65% / 35% ─── */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">

            {/* ── Coluna 65% — Tabela de Transações ── */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 shadow-sm border border-black/5 flex flex-col gap-6">
              
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">Transações Recentes</h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Fluxo consolidado de débitos e créditos</p>
                </div>
                <div className="flex items-center gap-space-xs">
                  <div className="flex items-center bg-surface-container-low p-1 rounded-full font-label-caption text-label-caption">
                    {filtros.map(f => (
                      <button
                        key={f}
                        onClick={() => setFiltroAtivo(f)}
                        className={`px-space-sm py-1 rounded-full transition-all ${
                          filtroAtivo === f
                            ? 'bg-[#1A1A1A] text-white'
                            : 'text-[#1A1A1A]/60 hover:text-[#1A1A1A]'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tabela */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low/30 font-label-caption text-label-caption text-on-surface-variant">
                      <th className="py-2 px-3 rounded-l-lg">STATUS</th>
                      <th className="py-2 px-3">DESCRIÇÃO</th>
                      <th className="py-2 px-3 text-right rounded-r-lg">VALOR</th>
                    </tr>
                  </thead>
                  <tbody className="font-body-md text-body-md">
                    {transacoesRecentes.length > 0 ? (
                      transacoesRecentes.map((item, idx) => {
                        const cfg = tipoConfig[item.tipo] || tipoConfig.receita;
                        const valor = Number(item.valor || item.price || 0);
                        const isReceita = item.tipo === 'receita';
                        const isInvest = item.tipo === 'investimento';
                        return (
                          <tr key={`${item.tipo}-${item.id ?? idx}`} className="hover:bg-surface-container-low/40 transition-colors">
                            <td className="py-3 px-3">
                              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text} capitalize`}>
                                <span className="material-symbols-outlined text-[14px]">{cfg.icon}</span>
                                {item.tipo}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <span className="text-on-surface font-semibold block truncate max-w-[220px]">
                                {item.descricao || 'Sem descrição'}
                              </span>
                            </td>
                            <td className={`py-3 px-3 text-right font-bold whitespace-nowrap ${
                              isReceita ? 'text-[#1A1A1A]' : isInvest ? 'text-[#1A1A1A]' : 'text-error'
                            }`}>
                              {isReceita ? '+' : isInvest ? '' : '-'} R$ {brl(valor)}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={3} className="py-space-2xl text-center font-body-md text-body-md text-on-surface-variant">
                          Nenhuma transação encontrada.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between pt-space-xs">
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Mostrando {transacoesRecentes.length} de {transacoesFiltradas.length} movimentações
                </span>
                <a href="/movimentacoes" className="font-label-button text-label-button text-secondary hover:underline flex items-center gap-1">
                  <span>Ver extrato completo</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_right_alt</span>
                </a>
              </div>
            </div>

            {/* ── Coluna 35% — Ações Rápidas + Top Gastos ── */}
            <div className="lg:col-span-4 flex flex-col gap-space-lg">
              
              {/* Lançamento Rápido */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-black/5 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-headline-sm text-headline-sm text-[#1A1A1A]">Lançamento Rápido</h2>
                  <span className="font-label-caption text-label-caption text-[#1A1A1A]/70 bg-surface-container-low px-2 py-0.5 rounded-full">Atalhos</span>
                </div>
                <div className="flex flex-col gap-2">

                  {/* Adicionar Gasto */}
                  <button
                    onClick={() => abrirModal('despesa')}
                    className="w-full h-16 px-4 bg-surface-container-lowest hover:bg-[#FFD8E4] text-[#1A1A1A] rounded-2xl flex items-center justify-between transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white text-[#1A1A1A] flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                        <span className="material-symbols-outlined text-[20px]">remove</span>
                      </div>
                      <div className="text-left">
                        <span className="font-label-button text-label-button text-[#1A1A1A] block leading-tight">Adicionar Gasto</span>
                        <span className="font-body-sm text-body-sm text-[#1A1A1A]/60">Débito, boleto ou cartão</span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[#1A1A1A]/40 group-hover:translate-x-0.5 transition-transform text-[20px]">chevron_right</span>
                  </button>

                  {/* Adicionar Renda */}
                  <button
                    onClick={() => abrirModal('receita')}
                    className="w-full h-16 px-4 bg-surface-container-lowest hover:bg-[#D8E2FF] text-[#1A1A1A] rounded-2xl flex items-center justify-between transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white text-[#1A1A1A] flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                        <span className="material-symbols-outlined text-[20px]">attach_money</span>
                      </div>
                      <div className="text-left">
                        <span className="font-label-button text-label-button text-[#1A1A1A] block leading-tight">Adicionar Renda</span>
                        <span className="font-body-sm text-body-sm text-[#1A1A1A]/60">Pix, salário ou extras</span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[#1A1A1A]/40 group-hover:translate-x-0.5 transition-transform text-[20px]">chevron_right</span>
                  </button>

                  {/* Adicionar Investimento */}
                  <button
                    onClick={() => abrirModal('investimento')}
                    className="w-full h-16 px-4 bg-surface-container-lowest hover:bg-[#D9F99D] text-[#1A1A1A] rounded-2xl flex items-center justify-between transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white text-[#1A1A1A] flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                        <span className="material-symbols-outlined text-[20px]">query_stats</span>
                      </div>
                      <div className="text-left">
                        <span className="font-label-button text-label-button text-[#1A1A1A] block leading-tight">Adicionar Aporte</span>
                        <span className="font-body-sm text-body-sm text-[#1A1A1A]/60">Tesouro, FIIs ou Ações</span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[#1A1A1A]/40 group-hover:translate-x-0.5 transition-transform text-[20px]">chevron_right</span>
                  </button>
                </div>
              </div>

              {/* Top 3 Maiores Gastos */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-black/5 flex flex-col gap-6">
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-[#1A1A1A]">Top 3 Maiores Gastos</h2>
                  <p className="font-body-sm text-body-sm text-[#1A1A1A]/70">Seus maiores débitos registrados</p>
                </div>
                <div className="flex flex-col gap-4">
                  {[...despesas]
                    .sort((a, b) => Number(b.valor || 0) - Number(a.valor || 0))
                    .slice(0, 3)
                    .map((gasto, idx) => (
                      <div key={gasto.id ?? idx} className="flex flex-col gap-2">
                        <div className="flex items-center justify-between font-body-sm text-body-sm">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#FFD8E4]" />
                            <span className="text-[#1A1A1A] font-medium truncate max-w-[130px]">
                              {gasto.descricao || 'Sem descrição'}
                            </span>
                          </div>
                          <span className="text-[#1A1A1A] font-bold">R$ {brl(Number(gasto.valor || 0))}</span>
                        </div>
                        {/* Barra proporcional */}
                        <div className="w-full h-2 bg-surface-container-low rounded-full overflow-hidden">
                          <div
                            className="bg-[#FFD8E4] h-full rounded-full"
                            style={{
                              width: `${summary.totalDespesas > 0
                                ? Math.min(100, (Number(gasto.valor || 0) / summary.totalDespesas) * 100)
                                : 0}%`
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  {despesas.length === 0 && (
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Nenhum gasto registrado.</p>
                  )}
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* ─── Modal de Nova Transação ─── */}
      <Modal
        isOpen={modalConfig.open}
        onClose={fecharModal}
        initialType={modalConfig.type}
        onSuccess={reload}
      />
    </div>
  );
};
