import { useState } from 'react';
import type { AtivoReal, CategoriaAtivo, AlocacaoCategoria } from './mockData';

const formatarMoeda = (valor: number) =>
  valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ==========================================
// 1. HEADER
// ==========================================
export const InvestimentoHeader = ({ onNovoAporte }: { onNovoAporte: () => void }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-lg">
    <div className="flex flex-col gap-space-xs">
      <div className="flex items-center gap-space-xs font-label-caption text-label-caption uppercase tracking-wider text-on-surface-variant font-medium">
        <span>Poupyg</span>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-primary font-semibold">Investimentos</span>
      </div>
      <div className="flex flex-col">
        <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">Meus Investimentos</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">Acompanhamento de aportes e distribuição por categoria</p>
      </div>
    </div>
    <button
      onClick={onNovoAporte}
      className="flex items-center gap-2 px-6 h-12 rounded-full bg-[#1A1A1A] text-white text-sm font-bold shadow-sm hover:bg-[#1A1A1A]/90 active:scale-[0.98] transition-all self-start"
      type="button"
    >
      <span className="material-symbols-outlined text-[20px]">add</span>
      <span>Novo Aporte</span>
    </button>
  </div>
);

// ==========================================
// 2. METRICS GRID
// ==========================================
export const InvestimentoMetrics = ({
  totalAplicado,
  totalAtivos,
  maiorCategoria,
  loading,
}: {
  totalAplicado: number;
  totalAtivos: number;
  maiorCategoria: string;
  loading: boolean;
}) => {
  const shimmer = 'bg-surface-container-low animate-pulse rounded-lg h-7 w-32';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* Card 1: Total Investido */}
      <div className="flex flex-col justify-between p-6 rounded-3xl bg-[#D9F99D] shadow-none transition-transform hover:-translate-y-0.5 duration-200">
        <div className="flex items-start justify-between">
          <span className="text-sm font-medium uppercase tracking-wider text-[#1A1A1A]/70">Total Investido</span>
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1A1A1A]/10 text-[#1A1A1A]">
            <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-1">
          {loading ? <div className={shimmer} /> : (
            <span className="text-4xl font-bold text-[#1A1A1A]">R$ {formatarMoeda(totalAplicado)}</span>
          )}
          <span className="text-sm font-medium text-[#1A1A1A]/70">valor total aportado</span>
        </div>
      </div>

      {/* Card 2: Ativos cadastrados */}
      <div className="flex flex-col justify-between p-6 rounded-3xl bg-[#FDE68A] shadow-none transition-transform hover:-translate-y-0.5 duration-200">
        <div className="flex items-start justify-between">
          <span className="text-sm font-medium uppercase tracking-wider text-[#1A1A1A]/70">Ativos Cadastrados</span>
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1A1A1A]/10 text-[#1A1A1A]">
            <span className="material-symbols-outlined text-[20px]">bar_chart</span>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-1">
          {loading ? <div className={shimmer} /> : (
            <span className="text-4xl font-bold text-[#1A1A1A]">{totalAtivos}</span>
          )}
          <span className="text-sm font-medium text-[#1A1A1A]/70">lançamentos registrados</span>
        </div>
      </div>

      {/* Card 3: Principal categoria */}
      <div className="flex flex-col justify-between p-6 rounded-3xl bg-[#D8E2FF] shadow-none transition-transform hover:-translate-y-0.5 duration-200">
        <div className="flex items-start justify-between">
          <span className="text-sm font-medium uppercase tracking-wider text-[#1A1A1A]/70">Maior Alocação</span>
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1A1A1A]/10 text-[#1A1A1A]">
            <span className="material-symbols-outlined text-[20px]">pie_chart</span>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-1">
          {loading ? <div className={shimmer} /> : (
            <span className="text-4xl font-bold text-[#1A1A1A]">{maiorCategoria || '—'}</span>
          )}
          <span className="text-sm font-medium text-[#1A1A1A]/70">categoria com mais aportes</span>
        </div>
      </div>

      {/* Card 4: Diversificação */}
      <div className="flex flex-col justify-between p-6 rounded-3xl bg-[#FFD8E4] shadow-none transition-transform hover:-translate-y-0.5 duration-200">
        <div className="flex items-start justify-between">
          <span className="text-sm font-medium uppercase tracking-wider text-[#1A1A1A]/70">Diversificação</span>
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1A1A1A]/10 text-[#1A1A1A]">
            <span className="material-symbols-outlined text-[20px]">donut_large</span>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-1">
          {loading ? <div className={shimmer} /> : (
            <span className="text-4xl font-bold text-[#1A1A1A]">{totalAtivos > 0 ? `${Math.min(totalAtivos, 5)} / 5` : '0 / 5'}</span>
          )}
          <span className="text-sm font-medium text-[#1A1A1A]/70">categorias utilizadas</span>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. TABELA DE ATIVOS (dados reais da API)
// ==========================================
const CATEGORIA_CONFIG: Record<string, { icon: string; bgClass: string; textClass: string; badgeClass: string }> = {
  'Renda Fixa':  { icon: 'account_balance', bgClass: 'bg-[#D8E2FF]', textClass: 'text-[#1A1A1A]', badgeClass: 'text-[#1A1A1A]' },
  'Ações':       { icon: 'show_chart',       bgClass: 'bg-[#FFD8E4]', textClass: 'text-[#1A1A1A]', badgeClass: 'text-[#1A1A1A]' },
  'FIIs':        { icon: 'domain',           bgClass: 'bg-[#D9F99D]', textClass: 'text-[#1A1A1A]', badgeClass: 'text-[#1A1A1A]' },
  'Cripto':      { icon: 'currency_bitcoin', bgClass: 'bg-[#FDE68A]', textClass: 'text-[#1A1A1A]', badgeClass: 'text-[#1A1A1A]' },
  'Outros':      { icon: 'savings',          bgClass: 'bg-[#E5E7EB]', textClass: 'text-[#1A1A1A]', badgeClass: 'text-[#1A1A1A]' },
};

interface InvestimentoAssetTableProps {
  ativos: AtivoReal[];
  onEditar: (ativo: AtivoReal) => void;
  onExcluir: (id: string) => void;
  excluindoId?: string | null;
}

export const InvestimentoAssetTable = ({ ativos, onEditar, onExcluir, excluindoId }: InvestimentoAssetTableProps) => {
  const [filtro, setFiltro] = useState<CategoriaAtivo>('Todos');
  const categorias: CategoriaAtivo[] = ['Todos', 'Renda Fixa', 'Ações', 'FIIs', 'Cripto', 'Outros'];

  const ativosFiltrados = filtro === 'Todos' ? ativos : ativos.filter(a => a.categoria === filtro);

  return (
    <div className="flex flex-col p-6 rounded-3xl bg-white shadow-sm border border-black/5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#1A1A1A]">Ativos em Carteira</h2>
          <p className="text-sm text-[#1A1A1A]/70">{ativos.length} aportes registrados</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {categorias.map(cat => (
            <button
              key={cat}
              onClick={() => setFiltro(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                filtro === cat ? 'bg-[#1A1A1A] text-white' : 'bg-[#1A1A1A]/5 text-[#1A1A1A]/70 hover:text-[#1A1A1A]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {ativosFiltrados.length === 0 ? (
        <div className="py-12 text-center text-[#1A1A1A]/60 text-base">
          {ativos.length === 0 ? 'Nenhum investimento cadastrado ainda. Clique em "Novo Aporte" para começar!' : 'Nenhum ativo nessa categoria.'}
        </div>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FDFBF7] text-[#1A1A1A]/60 text-xs uppercase tracking-wider">
                <th className="py-3 px-4 rounded-l-xl font-bold">Ativo / Descrição</th>
                <th className="py-3 px-4 font-bold">Categoria</th>
                <th className="py-3 px-4 font-bold text-right">Valor Aportado</th>
                <th className="py-3 px-3 rounded-r-xl text-center w-20">Ações</th>
              </tr>
            </thead>
            <tbody className="text-[#1A1A1A] text-sm">
              {ativosFiltrados.map(ativo => {
                const cfg = CATEGORIA_CONFIG[ativo.categoria] || CATEGORIA_CONFIG['Outros'];
                const excluindo = excluindoId === ativo.id;
                return (
                  <tr key={ativo.id} className={`hover:bg-black/[0.02] transition-colors group ${excluindo ? 'opacity-40 pointer-events-none' : ''}`}>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${cfg.bgClass} ${cfg.textClass}`}>
                          <span className="material-symbols-outlined text-[20px]">{cfg.icon}</span>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-base font-bold text-[#1A1A1A] truncate group-hover:text-[#1A1A1A]/70 transition-colors">{ativo.descricao}</span>
                          <span className="text-sm text-[#1A1A1A]/60 truncate">Aporte registrado</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${cfg.bgClass} ${cfg.textClass}`}>
                        {ativo.categoria}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right text-base text-[#1A1A1A] font-bold">
                      R$ {formatarMoeda(ativo.valor)}
                    </td>
                    <td className="py-4 px-3 text-center">
                      <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEditar(ativo)}
                          className="p-1 rounded-full text-[#1A1A1A]/50 hover:bg-[#1A1A1A]/5 hover:text-[#1A1A1A] transition-colors"
                          title="Editar"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button
                          onClick={() => onExcluir(ativo.id)}
                          disabled={excluindo}
                          className="p-1 rounded-full text-[#1A1A1A]/50 hover:bg-[#FFD8E4] hover:text-[#1A1A1A] transition-colors"
                          title="Excluir"
                        >
                          {excluindo
                            ? <div className="w-[18px] h-[18px] border-2 border-error/30 border-t-error rounded-full animate-spin" />
                            : <span className="material-symbols-outlined text-[18px]">delete</span>
                          }
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 4. DONUT DE ALOCAÇÃO (dados reais)
// ==========================================
const DONUT_STROKE_CLASSES: Record<string, string> = {
  'Renda Fixa': 'stroke-primary',
  'Ações':      'stroke-secondary',
  'FIIs':       'stroke-tertiary',
  'Cripto':     'stroke-error',
  'Outros':     'stroke-surface-variant',
};
const LEGEND_COLORS: Record<string, string> = {
  'Renda Fixa': 'bg-primary',
  'Ações':      'bg-secondary',
  'FIIs':       'bg-tertiary',
  'Cripto':     'bg-error',
  'Outros':     'bg-surface-variant',
};

export const InvestimentoAllocationDonut = ({ alocacoes, total }: { alocacoes: AlocacaoCategoria[]; total: number }) => {
  const circunferencia = 2 * Math.PI * 38; // ~238.76

  // Calcula strokeDasharray e strokeDashoffset para cada fatia
  let offset = 0;
  const fatias = alocacoes.map(a => {
    const comprimento = (a.percentual / 100) * circunferencia;
    const fatia = { ...a, comprimento, offset };
    offset += comprimento;
    return fatia;
  });

  return (
    <div className="flex flex-col p-6 rounded-3xl bg-white shadow-sm border border-black/5">
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-[#1A1A1A]">Distribuição da Carteira</h2>
          <span className="text-sm text-[#1A1A1A]/70">Alocação por categorias</span>
        </div>
        <span className="px-3 py-1 rounded-full bg-[#1A1A1A]/5 text-[#1A1A1A]/70 text-xs font-bold">
          {alocacoes.length} {alocacoes.length === 1 ? 'categoria' : 'categorias'}
        </span>
      </div>

      {alocacoes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-[#1A1A1A]/50 text-center gap-2">
          <span className="material-symbols-outlined text-[40px] opacity-30">donut_large</span>
          <span className="text-sm">Cadastre investimentos para ver a distribuição</span>
        </div>
      ) : (
        <>
          <div className="relative flex items-center justify-center my-4">
              <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                {/* Fundo */}
                <circle cx="50" cy="50" fill="none" r="38" stroke="currentColor" strokeWidth="12" className="text-surface-variant/20" />
                {/* Fatias */}
                {fatias.map(f => (
                  <circle
                    key={f.categoria}
                    cx="50" cy="50"
                    fill="none"
                    r="38"
                    strokeDasharray={`${f.comprimento} ${circunferencia}`}
                    strokeDashoffset={-f.offset}
                    strokeWidth="12"
                    className={`transition-all duration-700 ${DONUT_STROKE_CLASSES[f.categoria] || 'stroke-surface-variant'}`}
                  />
                ))}
              </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-xs uppercase tracking-wider text-[#1A1A1A]/70 font-bold">Total</span>
              <span className="text-xl font-bold text-[#1A1A1A] leading-tight">
                R$ {formatarMoeda(total)}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-4 pt-2">
            {alocacoes.map(a => (
              <LegendItem
                key={a.categoria}
                title={a.categoria}
                perc={`${a.percentual.toFixed(1)}%`}
                val={formatarMoeda(a.valor)}
                color={LEGEND_COLORS[a.categoria] || 'bg-[#E5E7EB]'}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const LegendItem = ({ title, perc, val, color }: { title: string; perc: string; val: string; color: string }) => (
  <div className="flex items-center justify-between p-2 rounded-xl hover:bg-black/[0.02] transition-colors">
    <div className="flex items-center gap-2">
      <span className={`w-3 h-3 rounded-full ${color}`}></span>
      <span className="text-sm font-bold text-[#1A1A1A]">{title}</span>
    </div>
    <div className="flex items-center gap-2 text-sm font-bold">
      <span className="text-[#1A1A1A]/60">{perc}</span>
      <span className="text-[#1A1A1A]">R$ {val}</span>
    </div>
  </div>
);

// ==========================================
// 5. MODAL DE EDIÇÃO DE INVESTIMENTO
// ==========================================
import type { CategoriaInvestimento } from '../../components/Modal';
import { CATEGORIAS_INVESTIMENTO } from '../../components/Modal';

interface ModalEdicaoInvProps {
  ativo: AtivoReal;
  salvando: boolean;
  onSalvar: (id: string, categoria: CategoriaInvestimento, descricao: string, valor: number) => void;
  onCancelar: () => void;
}

export const ModalEdicaoInvestimento = ({ ativo, salvando, onSalvar, onCancelar }: ModalEdicaoInvProps) => {
  const [descricao, setDescricao] = useState(ativo.descricao);
  const [valor, setValor] = useState(String(ativo.valor));
  const [categoria, setCategoria] = useState<CategoriaInvestimento>(ativo.categoria as CategoriaInvestimento);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-surface-container-lowest rounded-2xl shadow-xl w-full max-w-md mx-space-md flex flex-col gap-space-lg p-space-xl animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between">
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Editar Investimento</h3>
          <button onClick={onCancelar} className="p-space-xs rounded-full text-on-surface-variant hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-space-md">
          {/* Categoria */}
          <div className="flex flex-col gap-space-xs">
            <label className="font-label-caption text-label-caption text-on-surface-variant uppercase tracking-wider">Categoria</label>
            <div className="grid grid-cols-5 gap-space-xs">
              {CATEGORIAS_INVESTIMENTO.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoria(cat.id)}
                  className={`flex flex-col items-center gap-1 py-space-sm px-space-xs rounded-xl transition-all text-center ${
                    categoria === cat.id
                      ? 'bg-secondary text-on-secondary shadow-sm'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{cat.icon}</span>
                  <span className="font-label-caption text-[10px] leading-tight">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Descrição */}
          <div className="flex flex-col gap-space-xs">
            <label className="font-label-button text-body-sm text-on-surface font-semibold">Descrição</label>
            <div className="h-[52px] px-space-md rounded-xl bg-surface-container-low flex items-center shadow-inner focus-within:ring-2 focus-within:ring-secondary/20 transition-all">
              <input
                className="w-full bg-transparent border-0 outline-none font-body-md text-body-md text-on-surface"
                type="text"
                value={descricao}
                onChange={e => setDescricao(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          {/* Valor */}
          <div className="flex flex-col gap-space-xs">
            <label className="font-label-button text-body-sm text-on-surface font-semibold">Valor (R$)</label>
            <div className="h-[52px] px-space-md rounded-xl bg-surface-container-low flex items-center gap-space-xs shadow-inner focus-within:ring-2 focus-within:ring-secondary/20 transition-all">
              <span className="font-label-numeric-md text-secondary font-bold">R$</span>
              <input
                className="w-full bg-transparent border-0 outline-none font-body-md text-body-md text-on-surface"
                type="number"
                min="0.01"
                step="0.01"
                value={valor}
                onChange={e => setValor(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-space-sm pt-space-xs border-t border-surface-container-low">
          <button onClick={onCancelar} disabled={salvando} className="px-space-lg py-space-sm h-10 rounded-full text-on-surface-variant hover:bg-surface-container-low font-label-button text-label-button transition-all disabled:opacity-50">
            Cancelar
          </button>
          <button
            onClick={() => onSalvar(ativo.id, categoria, descricao, parseFloat(valor))}
            disabled={salvando || !descricao.trim() || !valor || parseFloat(valor) <= 0}
            className="px-space-xl py-space-sm h-10 rounded-full bg-primary text-on-primary font-label-button text-label-button font-semibold hover:opacity-90 active:scale-[0.98] transition-all shadow-sm flex items-center gap-space-xs disabled:opacity-50"
          >
            {salvando ? (
              <><div className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" /><span>Salvando...</span></>
            ) : (
              <><span className="material-symbols-outlined text-[18px]">save</span><span>Salvar</span></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
