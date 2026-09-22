import { useState, useEffect, useCallback, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Modal from '../components/Modal';
import { api } from '../services/api';
import type { CategoriaInvestimento } from '../components/Modal';

import { mapearInvestimento, calcularAlocacao } from '../features/investimentos/mockData';
import type { AtivoReal, InvestimentoApiDTO } from '../features/investimentos/mockData';

import {
    InvestimentoHeader,
    InvestimentoMetrics,
    InvestimentoAssetTable,
    InvestimentoAllocationDonut,
    ModalEdicaoInvestimento,
} from '../features/investimentos/components';

export const Investimento = () => {
    const { isAuthenticated } = useAuth();

    const [ativos, setAtivos] = useState<AtivoReal[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    const [modalConfig, setModalConfig] = useState<{ open: boolean, type: 'investimento' }>({ open: false, type: 'investimento' });
    const [modalAberto, setModalAberto] = useState(false);

    // Estado de edição
    const [ativoEditando, setAtivoEditando] = useState<AtivoReal | null>(null);
    const [salvando, setSalvando] = useState(false);

    // Estado de exclusão
    const [excluindoId, setExcluindoId] = useState<string | null>(null);

    if (!isAuthenticated()) {
        return <Navigate to="/" replace />;
    }

    // ─── Carregar investimentos ─────────────────────────────────────────────────
    const carregarInvestimentos = useCallback(async () => {
        try {
            setLoading(true);
            setErro(null);
            const res = await api.get<InvestimentoApiDTO[]>('/investimento');
            const data = Array.isArray(res.data) ? res.data : [];
            setAtivos(data.map(mapearInvestimento));
        } catch (err) {
            console.error('Erro ao carregar investimentos:', err);
            setErro('Não foi possível carregar seus investimentos.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { carregarInvestimentos(); }, [carregarInvestimentos]);

    // ─── Métricas calculadas ────────────────────────────────────────────────────
    const totalAplicado = ativos.reduce((s, a) => s + a.valor, 0);
    const alocacoes = calcularAlocacao(ativos);
    const maiorCategoria = alocacoes.length > 0 ? alocacoes[0].categoria : '—';

    // ─── Editar ─────────────────────────────────────────────────────────────────
    const handleSalvarEdicao = async (
        id: string,
        categoria: CategoriaInvestimento,
        descricao: string,
        valor: number
    ) => {
        if (!descricao.trim() || valor <= 0) return;
        setSalvando(true);
        try {
            await api.put(`/investimento/${id}`, {
                descricao,
                categoria,
                valor,
            });
            setAtivoEditando(null);
            await carregarInvestimentos();
        } catch (err) {
            console.error('Erro ao editar investimento:', err);
            alert('Não foi possível salvar as alterações.');
        } finally {
            setSalvando(false);
        }
    };

    // ─── Excluir ────────────────────────────────────────────────────────────────
    const handleExcluir = async (id: string) => {
        const confirmou = window.confirm('Tem certeza que deseja excluir este investimento?');
        if (!confirmou) return;

        setExcluindoId(id);
        try {
            await api.delete(`/investimento/${id}`);
            setAtivos(prev => prev.filter(a => a.id !== id));
        } catch (err) {
            console.error('Erro ao excluir investimento:', err);
            alert('Não foi possível excluir o investimento.');
            await carregarInvestimentos();
        } finally {
            setExcluindoId(null);
        }
    };

    return (
        <div className="flex flex-col w-full gap-space-2xl px-space-2xl py-space-2xl animate-fade-in-up">

            <InvestimentoHeader onNovoAporte={() => setModalAberto(true)} />

            {erro && (
                <div className="flex items-center gap-space-sm px-space-lg py-space-md rounded-xl bg-error-container/40 text-on-error-container font-body-md text-body-md">
                    <span className="material-symbols-outlined text-[20px]">error_outline</span>
                    <span>{erro}</span>
                </div>
            )}

            {/* Cards de métricas — calculados dos dados reais */}
            <InvestimentoMetrics
                totalAplicado={totalAplicado}
                totalAtivos={ativos.length}
                maiorCategoria={maiorCategoria}
                loading={loading}
            />

            {/* Layout principal Split 65/35 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">

                {/* Coluna Esquerda — Tabela de Ativos */}
                <div className="lg:col-span-8 flex flex-col gap-space-xl">
                    <InvestimentoAssetTable
                        ativos={ativos}
                        onEditar={setAtivoEditando}
                        onExcluir={handleExcluir}
                        excluindoId={excluindoId}
                    />
                </div>

                {/* Coluna Direita — Donut de Alocação */}
                <div className="lg:col-span-4 flex flex-col gap-space-xl">
                    <InvestimentoAllocationDonut
                        alocacoes={alocacoes}
                        total={totalAplicado}
                    />
                </div>
            </div>

            {/* Modal de Novo Aporte */}
            <Modal
                isOpen={modalAberto}
                onClose={() => setModalAberto(false)}
                initialType="investimento"
                onSuccess={carregarInvestimentos}
            />

            {/* Modal de Edição */}
            {ativoEditando && (
                <ModalEdicaoInvestimento
                    ativo={ativoEditando}
                    salvando={salvando}
                    onSalvar={handleSalvarEdicao}
                    onCancelar={() => setAtivoEditando(null)}
                />
            )}
        </div>
    );
};