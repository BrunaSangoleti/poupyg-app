import { useState, useMemo } from 'react';
import type { TransacaoEx } from './mockData';

const formatarMoeda = (valor: number) =>
  valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ==========================================
// 1. HEADER (PageHeader)
// ==========================================
export const ExtratoHeader = ({ onNovaTransacao, onExportarCsv }: { onNovaTransacao: () => void, onExportarCsv: () => void }) => (
  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg">
    <div className="flex flex-col gap-space-xxs">
      <nav className="flex items-center gap-space-xs text-on-surface-variant font-label-caption text-label-caption">
        <span className="hover:text-on-surface cursor-pointer transition-colors">Poupyg</span>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-secondary font-semibold">Extrato</span>
      </nav>
      <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Extrato Financeiro</h1>
      <p className="font-body-md text-body-md text-on-surface-variant">Consolidado de movimentações bancárias, cartões e entradas</p>
    </div>
    <div className="flex items-center gap-space-sm self-start lg:self-center">
      <button onClick={onExportarCsv} className="group flex items-center gap-space-xs px-space-lg h-[50px] rounded-full bg-surface-container-lowest text-on-surface font-label-button text-label-button shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] hover:bg-surface-container-low transition-all duration-150" type="button">
        <span className="material-symbols-outlined text-[20px] text-on-surface-variant group-hover:text-on-surface transition-colors">file_download</span>
        <span>Exportar CSV</span>
      </button>
      <button
        onClick={onNovaTransacao}
        className="flex items-center gap-2 px-6 h-12 rounded-full bg-[#1A1A1A] text-white text-sm font-bold shadow-sm hover:bg-[#1A1A1A]/90 active:scale-[0.98] transition-all duration-150" type="button"
      >
        <span className="material-symbols-outlined text-[20px]">add</span>
        <span>Nova Transação</span>
      </button>
    </div>
  </div>
);

// ==========================================
// 2. FILTROS E CONTROLES (Barra Superior)
// ==========================================
export const ExtratoFiltros = ({
    termo, setTermo, filtroAtivo, setFiltroAtivo,
    mesesDisponiveis = [], mesFiltro, setMesFiltro,
    categoriasDisponiveis = [], categoriaFiltro, setCategoriaFiltro
}: {
    termo: string, setTermo: (t: string) => void,
    filtroAtivo: string, setFiltroAtivo: (f: string) => void,
    mesesDisponiveis?: string[], mesFiltro?: string, setMesFiltro?: (m: string) => void,
    categoriasDisponiveis?: string[], categoriaFiltro?: string, setCategoriaFiltro?: (c: string) => void
}) => {
  const pills = [
    { id: 'Todos', label: 'Todas' },
    { id: 'Entrada', label: 'Entradas' },
    { id: 'Saida', label: 'Saídas' },
    { id: 'Investimento', label: 'Investimentos' }
  ];

  const mesesOptions = ['Todos os Meses', ...mesesDisponiveis];
  const catOptions = ['Todas as Categorias', ...categoriasDisponiveis];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-black/5 flex flex-col gap-4">
      <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4">
        <div className="flex-1 flex items-center gap-2 bg-[#1A1A1A]/5 px-4 py-3 rounded-2xl transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-[#1A1A1A]/20">
          <span className="material-symbols-outlined text-[20px] text-[#1A1A1A]/40">search</span>
          <input
            value={termo} onChange={e => setTermo(e.target.value)}
            className="w-full bg-transparent border-0 outline-none text-base text-[#1A1A1A] placeholder:text-[#1A1A1A]/40"
            placeholder="Buscar por descrição, estabelecimento ou valor..." type="text"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 relative z-20">
          {mesFiltro !== undefined && setMesFiltro && (
            <Dropdown 
              label={mesFiltro === 'Todos os Meses' ? 'Este Mês' : mesFiltro} 
              icon="calendar_today" 
              options={mesesOptions}
              value={mesFiltro}
              onChange={setMesFiltro}
            />
          )}
          {categoriaFiltro !== undefined && setCategoriaFiltro && (
            <Dropdown 
              label={categoriaFiltro === 'Todas as Categorias' ? 'Todas as Categorias' : categoriaFiltro} 
              icon="category" 
              options={catOptions}
              value={categoriaFiltro}
              onChange={setCategoriaFiltro}
            />
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-black/5">
        <div className="flex items-center gap-2">
          <span className="text-[#1A1A1A]/60 text-xs font-bold uppercase tracking-wider mr-2">Filtrar:</span>
          {pills.map(p => (
            <button key={p.id} onClick={() => setFiltroAtivo(p.id)} type="button"
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                filtroAtivo === p.id
                ? 'bg-[#1A1A1A] text-white shadow-sm'
                : 'bg-[#1A1A1A]/5 hover:bg-[#1A1A1A]/10 text-[#1A1A1A]/60 hover:text-[#1A1A1A]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-[#1A1A1A]/60 text-sm font-bold">
          <span className="w-2 h-2 rounded-full bg-[#D9F99D] animate-pulse"></span>
          <span>Atualizado em tempo real</span>
        </div>
      </div>
    </div>
  );
};

const Dropdown = ({ label, icon, options, value, onChange }: { label: string, icon: string, options: string[], value: string, onChange: (v: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        className="flex items-center gap-2 bg-[#1A1A1A]/5 hover:bg-[#1A1A1A]/10 px-4 py-2.5 rounded-2xl text-[#1A1A1A] text-sm transition-colors" 
        type="button"
      >
        <span className="material-symbols-outlined text-[18px] text-[#1A1A1A]/50">{icon}</span>
        <span className="font-bold">{label}</span>
        <span className="material-symbols-outlined text-[18px] text-[#1A1A1A]/50">{isOpen ? 'expand_less' : 'expand_more'}</span>
      </button>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 min-w-[200px] max-h-64 overflow-y-auto bg-white rounded-2xl shadow-lg border border-black/5 py-2 flex flex-col gap-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {options.map(opt => (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              className={`text-left px-4 py-2 text-sm font-bold hover:bg-[#1A1A1A]/5 transition-colors ${value === opt ? 'text-[#1A1A1A] bg-[#1A1A1A]/5' : 'text-[#1A1A1A]/60'}`}
              type="button"
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 3. CARDS DE RESUMO DO PERÍODO
// ==========================================
export const ExtratoResumoCards = ({
    entradas, saidas, saldo
}: {
    entradas: number, saidas: number, saldo: number
}) => {
    const pSaldo = entradas > 0 ? (saldo / entradas) * 100 : 0;

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
        {/* Entradas */}
        <div className="bg-[#D8E2FF] rounded-3xl p-6 shadow-none flex flex-col justify-between gap-6 relative overflow-hidden group transition-all duration-200">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-[#1A1A1A]/70 uppercase tracking-wider">Entradas do Período</span>
              <span className="text-4xl font-bold text-[#1A1A1A] tracking-tight">R$ {formatarMoeda(entradas)}</span>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#1A1A1A]/10 flex items-center justify-center text-[#1A1A1A]">
              <span className="material-symbols-outlined text-[24px]">arrow_downward</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#1A1A1A]/10 text-[#1A1A1A] text-xs font-semibold">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> Receitas
            </span>
            <span className="text-sm font-medium text-[#1A1A1A]/70">do período</span>
          </div>
        </div>

        {/* Saídas */}
        <div className="bg-[#FFD8E4] rounded-3xl p-6 shadow-none flex flex-col justify-between gap-6 relative overflow-hidden group transition-all duration-200">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-[#1A1A1A]/70 uppercase tracking-wider">Saídas do Período</span>
              <span className="text-4xl font-bold text-[#1A1A1A] tracking-tight">R$ {formatarMoeda(saidas)}</span>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#1A1A1A]/10 flex items-center justify-center text-[#1A1A1A]">
              <span className="material-symbols-outlined text-[24px]">arrow_upward</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#1A1A1A]/10 text-[#1A1A1A] text-xs font-semibold">
              <span className="material-symbols-outlined text-[14px]">arrow_downward</span> Despesas
            </span>
            <span className="text-sm font-medium text-[#1A1A1A]/70">do período</span>
          </div>
        </div>

        {/* Saldo Líquido */}
        <div className="bg-[#FDE68A] rounded-3xl p-6 shadow-none flex flex-col justify-between gap-6 relative overflow-hidden group transition-all duration-200">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-[#1A1A1A]/70 uppercase tracking-wider">Saldo Líquido</span>
              <span className={`text-4xl font-bold tracking-tight text-[#1A1A1A]`}>
                {saldo >= 0 ? '+' : '-'} R$ {formatarMoeda(Math.abs(saldo))}
              </span>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#1A1A1A]/10 flex items-center justify-center text-[#1A1A1A]">
              <span className="material-symbols-outlined text-[24px]">savings</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#1A1A1A]/10 text-[#1A1A1A] text-xs font-semibold">
                {saldo >= 0 ? 'Superávit' : 'Déficit'}
              </span>
              <span className="text-sm font-medium text-[#1A1A1A]/70">{pSaldo.toFixed(1)}% economizado</span>
            </div>
            <div className="w-16 h-2 bg-[#1A1A1A]/10 rounded-full overflow-hidden flex">
              <div className="bg-[#1A1A1A] h-full rounded-full" style={{ width: `${Math.max(0, Math.min(100, pSaldo))}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    );
};

// ==========================================
// 4. MODAL DE EDIÇÃO INLINE
// ==========================================
interface ModalEdicaoProps {
  item: TransacaoEx;
  salvando: boolean;
  onSalvar: (id: string, tipo: TransacaoEx['tipo'], descricao: string, valor: number) => void;
  onCancelar: () => void;
}

const ModalEdicao = ({ item, salvando, onSalvar, onCancelar }: ModalEdicaoProps) => {
  const [descricao, setDescricao] = useState(item.descricao);
  const [valor, setValor] = useState(String(item.valor));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-surface-container-lowest rounded-2xl shadow-xl w-full max-w-md mx-space-md flex flex-col gap-space-lg p-space-xl animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.bgClass} ${item.iconColorClass}`}>
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
            </div>
            <div className="flex flex-col">
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Editar Transação</h3>
              <span className="font-body-sm text-body-sm text-on-surface-variant">{item.categoria}</span>
            </div>
          </div>
          <button
            onClick={onCancelar}
            className="p-space-xs rounded-full text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Campos */}
        <div className="flex flex-col gap-space-md">
          <div className="flex flex-col gap-space-xs">
            <label className="font-label-button text-body-sm text-on-surface font-semibold">Descrição</label>
            <div className="h-[52px] px-space-md rounded-xl bg-surface-container-low flex items-center shadow-inner focus-within:ring-2 focus-within:ring-secondary/20 transition-all">
              <input
                className="w-full bg-transparent border-0 outline-none font-body-md text-body-md text-on-surface"
                type="text"
                value={descricao}
                onChange={e => setDescricao(e.target.value)}
                placeholder="Descrição da transação"
                autoFocus
              />
            </div>
          </div>

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
                placeholder="0,00"
              />
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="flex items-center justify-end gap-space-sm pt-space-xs border-t border-surface-container-low">
          <button
            onClick={onCancelar}
            disabled={salvando}
            className="px-space-lg py-space-sm h-10 rounded-full text-on-surface-variant hover:bg-surface-container-low font-label-button text-label-button transition-all disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSalvar(item.id, item.tipo, descricao, parseFloat(valor))}
            disabled={salvando || !descricao.trim() || !valor || parseFloat(valor) <= 0}
            className="px-space-xl py-space-sm h-10 rounded-full bg-primary text-on-primary font-label-button text-label-button font-semibold hover:opacity-90 active:scale-[0.98] transition-all shadow-sm flex items-center gap-space-xs disabled:opacity-50"
          >
            {salvando ? (
              <>
                <div className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                <span>Salvando...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">save</span>
                <span>Salvar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 5. TABELA DE TRANSAÇÕES Agrupada
// ==========================================
interface ExtratoTableProps {
  transacoes: TransacaoEx[];
  onEditar: (item: TransacaoEx) => void;
  onExcluir: (id: string, tipo: TransacaoEx['tipo']) => void;
  excluindoId?: string | null;
}

export const ExtratoTable = ({ transacoes, onEditar, onExcluir, excluindoId }: ExtratoTableProps) => {
  const grupos = useMemo(() => {
    const map = new Map<string, TransacaoEx[]>();
    transacoes.forEach(t => {
      const g = map.get(t.dataGrupo) || [];
      g.push(t);
      map.set(t.dataGrupo, g);
    });
    return Array.from(map.entries());
  }, [transacoes]);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-black/5 overflow-hidden flex flex-col gap-2">
      <div className="p-6 flex items-center justify-between bg-white border-b border-black/5">
        <div className="flex items-center gap-2">
          <h2 className="text-xl text-[#1A1A1A] font-bold tracking-tight">Transações Registradas</h2>
          <span className="px-3 py-1 rounded-full bg-[#1A1A1A]/5 text-[#1A1A1A]/70 text-xs font-bold">
            {transacoes.length} itens
          </span>
        </div>
      </div>

      <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-white text-[#1A1A1A]/60 text-xs uppercase tracking-wider font-semibold">
        <div className="col-span-1 flex items-center gap-2">
          <span>Tipo</span>
        </div>
        <div className="col-span-5">Descrição & Categoria</div>
        <div className="col-span-2">Conta / Origem</div>
        <div className="col-span-2 text-center">Status</div>
        <div className="col-span-2 text-right">Valor & Ações</div>
      </div>

      {grupos.length > 0 ? grupos.map(([nomeGrupo, itens]) => (
        <div key={nomeGrupo} className="flex flex-col">
          <div className="px-6 py-2 bg-[#FDFBF7] flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#1A1A1A]/50">{itens[0]?.dataGrupoIcon || 'calendar_today'}</span>
            <span className="text-sm text-[#1A1A1A] font-bold tracking-tight">{nomeGrupo}</span>
            <span className="text-[#1A1A1A]/50 text-xs">• {itens.length} lançamentos</span>
          </div>

          {itens.map(item => {
            const excluindo = excluindoId === item.id;
            return (
              <div
                key={item.id}
                className={`group grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 hover:bg-black/[0.02] transition-colors duration-150 items-center ${excluindo ? 'opacity-40 pointer-events-none' : ''}`}
              >
                <div className="col-span-1 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${item.bgClass} ${item.iconColorClass}`}>
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  </div>
                </div>
                <div className="col-span-5 flex flex-col min-w-0">
                  <span className="text-base text-[#1A1A1A] font-bold truncate group-hover:text-[#1A1A1A]/70 transition-colors">
                    {item.descricao}
                  </span>
                  <div className="flex items-center gap-2 text-[#1A1A1A]/60 text-sm">
                    <span>{item.categoria}</span><span>•</span><span>{item.horario}</span>
                  </div>
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${item.tipo === 'Saida' ? 'bg-[#FFD8E4]' : 'bg-[#D8E2FF]'}`}></span>
                  <span className="text-sm text-[#1A1A1A] font-medium truncate">{item.conta}</span>
                </div>
                <div className="col-span-2 flex justify-center">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                    item.status === 'Concluído' ? 'bg-[#D9F99D] text-[#1A1A1A]' : 'bg-[#FDE68A] text-[#1A1A1A]'
                  }`}>
                    <span className="material-symbols-outlined text-[13px]">
                      {item.status === 'Concluído' ? 'check_circle' : 'schedule'}
                    </span>
                    {item.status}
                  </span>
                </div>
                <div className="col-span-2 flex items-center justify-end gap-2">
                  <span className={`text-base font-bold whitespace-nowrap ${item.textColorClass}`}>
                    {item.tipo === 'Saida' ? '- ' : '+ '}R$ {formatarMoeda(item.valor)}
                  </span>
                  {/* Botões de ação — visíveis no hover */}
                  <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                    <button
                      onClick={() => onEditar(item)}
                      className="p-1 rounded-full text-[#1A1A1A]/50 hover:bg-[#1A1A1A]/5 hover:text-[#1A1A1A] transition-colors"
                      title="Editar"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button
                      onClick={() => onExcluir(item.id, item.tipo)}
                      disabled={excluindo}
                      className="p-1 rounded-full text-[#1A1A1A]/50 hover:bg-[#FFD8E4] hover:text-[#1A1A1A] transition-colors disabled:opacity-40"
                      title="Excluir"
                    >
                      {excluindo
                        ? <div className="w-[18px] h-[18px] border-2 border-error/30 border-t-error rounded-full animate-spin" />
                        : <span className="material-symbols-outlined text-[18px]">delete</span>
                      }
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )) : (
        <div className="p-space-2xl text-center text-on-surface-variant font-body-md">
          Nenhuma transação encontrada com os filtros atuais.
        </div>
      )}
    </div>
  );
};

// ==========================================
// 6. PAGINAÇÃO
// ==========================================
export const ExtratoPaginacao = ({ total }: { total: number }) => (
  <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md py-space-sm">
    <div className="flex items-center gap-space-md">
      <span className="font-body-sm text-body-sm text-on-surface-variant">
        Exibindo <span className="font-semibold text-on-surface">1-{Math.min(20, total)}</span> de <span className="font-semibold text-on-surface">{total}</span>
      </span>
    </div>
    <div className="flex items-center gap-space-xxs">
      <button className="flex items-center gap-space-xxs px-space-sm py-1.5 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors font-label-button text-body-sm" type="button">
        <span className="material-symbols-outlined text-[18px]">chevron_left</span><span>Anterior</span>
      </button>
      <button className="w-9 h-9 flex items-center justify-center rounded-full bg-primary text-on-primary font-label-button text-body-sm font-semibold shadow-sm" type="button">1</button>
      <button className="flex items-center gap-space-xxs px-space-sm py-1.5 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors font-label-button text-body-sm" type="button">
        <span>Próximo</span><span className="material-symbols-outlined text-[18px]">chevron_right</span>
      </button>
    </div>
  </div>
);

// Exporta o modal de edição para uso na página pai
export { ModalEdicao };
