import { useState, useEffect } from 'react';
import { api } from '../services/api';

type TipoTransacao = 'receita' | 'despesa' | 'investimento';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialType?: TipoTransacao;
    onSuccess: () => void;
}

export const CATEGORIAS_INVESTIMENTO = [
    { id: 'Renda Fixa', icon: 'account_balance', label: 'Renda Fixa' },
    { id: 'Ações',      icon: 'show_chart',       label: 'Ações' },
    { id: 'FIIs',       icon: 'domain',           label: 'FIIs' },
    { id: 'Cripto',     icon: 'currency_bitcoin', label: 'Cripto' },
    { id: 'Outros',     icon: 'savings',          label: 'Outros' },
] as const;

export const CATEGORIAS_DESPESA = [
    { id: 'Moradia',     icon: 'home',             label: 'Moradia' },
    { id: 'Alimentação', icon: 'restaurant',       label: 'Alimentação' },
    { id: 'Transporte',  icon: 'directions_car',   label: 'Transporte' },
    { id: 'Saúde',       icon: 'medical_services', label: 'Saúde' },
    { id: 'Outros',      icon: 'receipt_long',     label: 'Outros' },
] as const;

export const CATEGORIAS_RECEITA = [
    { id: 'Salário',     icon: 'payments',         label: 'Salário' },
    { id: 'Freelance',   icon: 'computer',         label: 'Freelance' },
    { id: 'Rendimentos', icon: 'trending_up',      label: 'Rendimentos' },
    { id: 'Vendas',      icon: 'storefront',       label: 'Vendas' },
    { id: 'Outros',      icon: 'wallet',           label: 'Outros' },
] as const;

export type CategoriaInvestimento = typeof CATEGORIAS_INVESTIMENTO[number]['id'];
export type CategoriaDespesa = typeof CATEGORIAS_DESPESA[number]['id'];
export type CategoriaReceita = typeof CATEGORIAS_RECEITA[number]['id'];

export type CategoriaGeral = CategoriaInvestimento | CategoriaDespesa | CategoriaReceita;


const Modal = ({ isOpen, onClose, initialType = 'despesa', onSuccess }: ModalProps) => {
    const [tipo, setTipo] = useState<TipoTransacao>(initialType);
    const [descricao, setDescricao] = useState('');
    const [valor, setValor] = useState('');
    const [dataStr, setDataStr] = useState(new Date().toISOString().split('T')[0]);
    const [categoria, setCategoria] = useState<CategoriaGeral>('Outros');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setTipo(initialType);
            setDescricao('');
            setValor('');
            setDataStr(new Date().toISOString().split('T')[0]);
            if (initialType === 'investimento') setCategoria('Renda Fixa');
            else if (initialType === 'despesa') setCategoria('Outros');
            else setCategoria('Salário');
        }
    }, [isOpen, initialType]);

    const handleSalvar = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!descricao.trim() || !valor || parseFloat(valor) <= 0 || !dataStr) {
            alert('Preencha a descrição, data e um valor maior que zero.');
            return;
        }

        setIsLoading(true);
        try {
            await api.post(`/${tipo}`, {
                descricao,
                valor: parseFloat(valor),
                data: dataStr,
                categoria,
            });

            onSuccess();
            onClose();
        } catch (error) {
            console.error('Erro na requisição:', error);
            alert('Erro de conexão com o servidor. Verifique o console.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    const getColorClass = (t: string) => {
        if (t === 'receita') return 'bg-[#FDE68A] text-[#1A1A1A] font-bold shadow-sm';
        if (t === 'despesa') return 'bg-[#FFD8E4] text-[#1A1A1A] font-bold shadow-sm';
        return 'bg-[#D9F99D] text-[#1A1A1A] font-bold shadow-sm';
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-black/5 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-6 pt-6 pb-2">
                    <h2 className="text-2xl text-[#1A1A1A] font-bold">Nova Transação</h2>
                    <p className="text-sm text-[#1A1A1A]/70">Preencha os detalhes do lançamento.</p>
                </div>

                <form onSubmit={handleSalvar} className="flex flex-col gap-6 px-6 pb-6">

                    {/* Seletor de Tipo */}
                    <div className="flex bg-[#1A1A1A]/5 p-1 rounded-2xl gap-1">
                        {(['receita', 'despesa', 'investimento'] as const).map(t => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => setTipo(t)}
                                className={`flex-1 py-2 text-sm capitalize rounded-xl transition-all ${
                                    tipo === t
                                        ? getColorClass(t)
                                        : 'text-[#1A1A1A]/60 font-bold hover:bg-[#1A1A1A]/5'
                                }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-col gap-4">

                        {/* Seletor de Categoria */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-[#1A1A1A]/60 uppercase tracking-wider">
                                Categoria
                            </label>
                            <div className="grid grid-cols-5 gap-2">
                                {(tipo === 'investimento' ? CATEGORIAS_INVESTIMENTO : 
                                  tipo === 'despesa' ? CATEGORIAS_DESPESA : CATEGORIAS_RECEITA).map(cat => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => setCategoria(cat.id as CategoriaGeral)}
                                        className={`flex flex-col items-center gap-1 py-2 px-1 rounded-xl transition-all text-center ${
                                            categoria === cat.id
                                                ? 'bg-[#1A1A1A] text-white shadow-sm'
                                                : 'bg-[#1A1A1A]/5 text-[#1A1A1A]/60 hover:bg-[#1A1A1A]/10 font-bold'
                                        }`}
                                    >
                                        <span className="material-symbols-outlined text-[20px]">{cat.icon}</span>
                                        <span className="text-[10px] font-bold leading-tight line-clamp-1">{cat.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Data e Valor (Grid) */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-[#1A1A1A]/60 uppercase tracking-wider">
                                    Data
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={dataStr}
                                    onChange={e => setDataStr(e.target.value)}
                                    className="w-full h-14 px-4 rounded-2xl text-lg font-bold text-[#1A1A1A] bg-[#1A1A1A]/5 outline-none transition-all focus:ring-2 focus:ring-[#1A1A1A]/20"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-[#1A1A1A]/60 uppercase tracking-wider">
                                    Valor (R$)
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="0.01"
                                    step="0.01"
                                    placeholder="0,00"
                                    value={valor}
                                    onChange={e => setValor(e.target.value)}
                                    className="w-full h-14 px-4 rounded-2xl text-2xl font-bold text-[#1A1A1A] placeholder:text-[#1A1A1A]/30 bg-[#1A1A1A]/5 outline-none transition-all focus:ring-2 focus:ring-[#1A1A1A]/20"
                                />
                            </div>
                        </div>

                        {/* Descrição */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-[#1A1A1A]/60 uppercase tracking-wider">
                                Descrição
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="Descreva esta transação"
                                value={descricao}
                                onChange={e => setDescricao(e.target.value)}
                                className="w-full h-12 px-4 rounded-2xl text-base font-bold text-[#1A1A1A] placeholder:text-[#1A1A1A]/30 bg-[#1A1A1A]/5 outline-none transition-all focus:ring-2 focus:ring-[#1A1A1A]/20"
                            />
                        </div>
                    </div>

                    {/* Ações */}
                    <div className="flex items-center gap-4 pt-4 mt-2 border-t border-black/5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 h-12 rounded-full text-sm font-bold text-[#1A1A1A]/60 hover:bg-[#1A1A1A]/5 hover:text-[#1A1A1A] transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 h-12 rounded-full text-sm font-bold bg-[#1A1A1A] text-white hover:bg-[#1A1A1A]/90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isLoading
                                ? <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                                : <span className="material-symbols-outlined text-[20px]">check</span>
                            }
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Modal;