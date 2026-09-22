import { useState, useEffect, useCallback, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Modal from '../components/Modal';
import { api } from '../services/api';

import { mapearTransacao } from '../features/extrato/mockData';
import type { TransacaoEx, TransacaoApiDTO, TipoTransacaoEx } from '../features/extrato/mockData';
import {
    ExtratoHeader,
    ExtratoFiltros,
    ExtratoResumoCards,
    ExtratoTable,
    ExtratoPaginacao,
    ModalEdicao,
} from '../features/extrato/components';

// Mapeia o tipo visual para o endpoint da API
const endpointPorTipo: Record<TipoTransacaoEx, string> = {
    Entrada: '/receita',
    Saida: '/despesa',
    Investimento: '/investimento',
};

export const Movimentacoes = () => {
    const { isAuthenticated } = useAuth();

    const [transacoes, setTransacoes] = useState<TransacaoEx[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    const [totalEntradas, setTotalEntradas] = useState(0);
    const [totalSaidas, setTotalSaidas] = useState(0);

    const [termo, setTermo] = useState('');
    const [filtroAtivo, setFiltroAtivo] = useState('Todos');
    const [mesFiltro, setMesFiltro] = useState('Todos os Meses');
    const [categoriaFiltro, setCategoriaFiltro] = useState('Todas as Categorias');

    // Modal de Nova Transação
    const [modalConfig, setModalConfig] = useState<{
        open: boolean;
        type: 'receita' | 'despesa' | 'investimento';
    }>({ open: false, type: 'despesa' });

    // Estado de edição
    const [itemEditando, setItemEditando] = useState<TransacaoEx | null>(null);
    const [salvando, setSalvando] = useState(false);

    // Estado de exclusão (guarda o id sendo excluído para spinner)
    const [excluindoId, setExcluindoId] = useState<string | null>(null);

    if (!isAuthenticated()) {
        return <Navigate to="/" replace />;
    }

    // ─── Carregar dados da API ──────────────────────────────────────────────────
    const carregarTransacoes = useCallback(async () => {
        try {
            setLoading(true);
            setErro(null);

            const [resReceitas, resDespesas, resInvestimentos] = await Promise.all([
                api.get<TransacaoApiDTO[]>('/receita'),
                api.get<TransacaoApiDTO[]>('/despesa'),
                api.get<TransacaoApiDTO[]>('/investimento'),
            ]);

            const receitas     = Array.isArray(resReceitas.data)      ? resReceitas.data      : [];
            const despesas     = Array.isArray(resDespesas.data)      ? resDespesas.data      : [];
            const investimentos = Array.isArray(resInvestimentos.data) ? resInvestimentos.data : [];

            setTotalEntradas(receitas.reduce((s, r) => s + (Number(r.valor) || 0), 0));
            setTotalSaidas(despesas.reduce((s, d) => s + (Number(d.valor) || 0), 0));

            setTransacoes([
                ...receitas.map(r => mapearTransacao(r, 'Entrada')),
                ...despesas.map(d => mapearTransacao(d, 'Saida')),
                ...investimentos.map(i => mapearTransacao(i, 'Investimento')),
            ]);
        } catch (err) {
            console.error('Erro ao carregar transações:', err);
            setErro('Não foi possível carregar as transações. Verifique se o servidor está rodando.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { carregarTransacoes(); }, [carregarTransacoes]);

    // ─── Editar ─────────────────────────────────────────────────────────────────
    const handleEditar = (item: TransacaoEx) => {
        setItemEditando(item);
    };

    const handleSalvarEdicao = async (
        id: string,
        tipo: TipoTransacaoEx,
        descricao: string,
        valor: number
    ) => {
        if (!descricao.trim() || valor <= 0) return;
        setSalvando(true);
        try {
            const endpoint = endpointPorTipo[tipo];
            await api.put(`${endpoint}/${id}`, { descricao, valor });
            setItemEditando(null);
            await carregarTransacoes(); // Recarrega lista atualizada
        } catch (err) {
            console.error('Erro ao editar transação:', err);
            alert('Não foi possível salvar as alterações. Tente novamente.');
        } finally {
            setSalvando(false);
        }
    };

    // ─── Excluir ────────────────────────────────────────────────────────────────
    const handleExcluir = async (id: string, tipo: TipoTransacaoEx) => {
        const confirmou = window.confirm('Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.');
        if (!confirmou) return;

        setExcluindoId(id);
        try {
            const endpoint = endpointPorTipo[tipo];
            await api.delete(`${endpoint}/${id}`);
            // Remove otimisticamente da lista sem precisar recarregar tudo
            setTransacoes(prev => prev.filter(t => t.id !== id));
            // Recalcula totais
            setTransacoes(prev => {
                const entradas = prev.filter(t => t.tipo === 'Entrada').reduce((s, t) => s + t.valor, 0);
                const saidas   = prev.filter(t => t.tipo === 'Saida').reduce((s, t) => s + t.valor, 0);
                setTotalEntradas(entradas);
                setTotalSaidas(saidas);
                return prev;
            });
        } catch (err) {
            console.error('Erro ao excluir transação:', err);
            alert('Não foi possível excluir a transação. Tente novamente.');
            await carregarTransacoes(); // Restaura lista caso dê erro
        } finally {
            setExcluindoId(null);
        }
    };

    // ─── Filtros ────────────────────────────────────────────────────────────────
    
    // Lista dinâmica de meses disponíveis (ex: "09/2026")
    const mesesDisponiveis = useMemo(() => {
        const meses = new Set<string>();
        transacoes.forEach(t => {
            if (t.dataIso) {
                const parts = t.dataIso.split('-');
                if (parts.length >= 2) meses.add(`${parts[1]}/${parts[0]}`);
            }
        });
        return Array.from(meses).sort((a, b) => b.localeCompare(a)); // decrescente
    }, [transacoes]);

    // Lista dinâmica de categorias disponíveis
    const categoriasDisponiveis = useMemo(() => {
        const cats = new Set<string>();
        transacoes.forEach(t => {
            if (t.categoria) cats.add(t.categoria);
        });
        return Array.from(cats).sort();
    }, [transacoes]);

    const transacoesFiltradas = transacoes.filter(t => {
        if (
            termo &&
            !t.descricao.toLowerCase().includes(termo.toLowerCase()) &&
            !t.categoria.toLowerCase().includes(termo.toLowerCase())
        ) return false;
        
        if (filtroAtivo === 'Entrada'     && t.tipo !== 'Entrada')     return false;
        if (filtroAtivo === 'Saida'       && t.tipo !== 'Saida')       return false;
        if (filtroAtivo === 'Investimento'&& t.tipo !== 'Investimento') return false;
        
        // Filtro de mês (ex: "09/2026")
        if (mesFiltro !== 'Todos os Meses' && t.dataIso) {
            const parts = t.dataIso.split('-');
            const mesTransacao = `${parts[1]}/${parts[0]}`;
            if (mesTransacao !== mesFiltro) return false;
        }

        // Filtro de categoria
        if (categoriaFiltro !== 'Todas as Categorias' && t.categoria !== categoriaFiltro) return false;

        return true;
    });

    const abrirModal  = () => setModalConfig({ open: true, type: 'despesa' });
    const fecharModal = () => setModalConfig(prev => ({ ...prev, open: false }));

    const handleModalSuccess = () => {
        fecharModal();
        carregarTransacoes();
    };

    const handleExportarCsv = useCallback(() => {
        if (transacoesFiltradas.length === 0) {
            alert("Não há transações para exportar com os filtros atuais.");
            return;
        }

        const headers = ["Data", "Descrição", "Categoria", "Tipo", "Valor"];
        const rows = transacoesFiltradas.map(t => [
            `"${t.dataGrupo}"`,
            `"${t.descricao}"`,
            `"${t.categoria}"`,
            `"${t.tipo}"`,
            `"${t.valor.toFixed(2)}"`
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(e => e.join(","))
        ].join("\n");

        const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "extrato_financeiro.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [transacoesFiltradas]);

    // ─── Loading screen ──────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="flex w-full items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-space-md text-on-surface-variant">
                    <div className="w-8 h-8 border-4 border-surface-container border-t-secondary rounded-full animate-spin" />
                    <span className="font-body-md text-body-md">Carregando transações...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full gap-space-2xl px-space-2xl py-space-2xl animate-fade-in-up">

            <ExtratoHeader onNovaTransacao={abrirModal} onExportarCsv={handleExportarCsv} />

            {erro && (
                <div className="flex items-center gap-space-sm px-space-lg py-space-md rounded-xl bg-error-container/40 text-on-error-container font-body-md text-body-md">
                    <span className="material-symbols-outlined text-[20px]">error_outline</span>
                    <span>{erro}</span>
                </div>
            )}

            <ExtratoFiltros
                termo={termo} setTermo={setTermo}
                filtroAtivo={filtroAtivo} setFiltroAtivo={setFiltroAtivo}
                mesesDisponiveis={mesesDisponiveis}
                mesFiltro={mesFiltro} setMesFiltro={setMesFiltro}
                categoriasDisponiveis={categoriasDisponiveis}
                categoriaFiltro={categoriaFiltro} setCategoriaFiltro={setCategoriaFiltro}
            />

            <ExtratoResumoCards
                entradas={totalEntradas}
                saidas={totalSaidas}
                saldo={totalEntradas - totalSaidas}
            />

            <ExtratoTable
                transacoes={transacoesFiltradas}
                onEditar={handleEditar}
                onExcluir={handleExcluir}
                excluindoId={excluindoId}
            />

            <ExtratoPaginacao total={transacoesFiltradas.length} />

            {/* Modal de Nova Transação */}
            <Modal
                isOpen={modalConfig.open}
                onClose={fecharModal}
                initialType={modalConfig.type}
                onSuccess={handleModalSuccess}
            />

            {/* Modal de Edição inline */}
            {itemEditando && (
                <ModalEdicao
                    item={itemEditando}
                    salvando={salvando}
                    onSalvar={handleSalvarEdicao}
                    onCancelar={() => setItemEditando(null)}
                />
            )}
        </div>
    );
};