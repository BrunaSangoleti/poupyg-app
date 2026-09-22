import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { 
    PerfilHeader, 
    PerfilTabs, 
    PerfilAvatar, 
    PerfilDangerZone 
} from '../features/perfil/components';

interface Usuario {
    id: string; // O backend retorna 'id' como UUID no DTO
    nome: string;
    email: string;
    telefone: string;
    cpf: string;
}

export const Perfil = () => {
    const navigate = useNavigate();
    const [abaAtiva, setAbaAtiva] = useState('dados');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    // Dados originais
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    
    // Dados do form editável
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        telefone: ''
    });

    const carregarDados = async () => {
        try {
            setLoading(true);
            // Endpoit correto no backend: GET /api/usuarios/me
            const response = await api.get(`/usuarios/me`);
            const userRes = response.data;

            if (userRes) {
                setUsuario(userRes);
                setFormData({
                    nome: userRes.nome || '',
                    email: userRes.email || '',
                    telefone: userRes.telefone || ''
                });
            }
        } catch (err) {
            console.error("Erro ao carregar dados do perfil:", err);
        } finally {
            setLoading(false);
        }
    };

    const salvarPerfil = async () => {
        if (!usuario) return;
        setSaving(true);

        try {
            // Utilizamos o novo UsuarioUpdateDTO no backend, que exige apenas nome, telefone e cpf.
            // O e-mail e a senha são ignorados por segurança para não trancar o projeto de demonstração.
            const payload = {
                nome: formData.nome,
                telefone: formData.telefone,
                cpf: usuario.cpf
            };

            await api.put(`/usuarios/me`, payload);
            
            // Atualizar o estado local após sucesso
            setUsuario({ ...usuario, nome: formData.nome, email: formData.email, telefone: formData.telefone });
            
            // Atualizar o localStorage para que o restante da aplicação veja o nome novo
            const authUserString = localStorage.getItem('usuario');
            if (authUserString) {
                const authUser = JSON.parse(authUserString);
                authUser.nome = formData.nome;
                localStorage.setItem('usuario', JSON.stringify(authUser));
                // Avisar a Sidebar que o usuário mudou
                window.dispatchEvent(new Event('usuarioUpdated'));
            }
            alert("Perfil salvo com sucesso!");
        } catch (err) {
            console.error("Erro ao atualizar perfil:", err);
            alert("Erro ao salvar alterações. O backend pode estar recusando a atualização (Validação do DTO).");
        } finally {
            setSaving(false);
        }
    };

    const descartarAlteracoes = () => {
        if (usuario) {
            setFormData({
                ...formData,
                nome: usuario.nome,
                email: usuario.email,
                telefone: usuario.telefone || ''
            });
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    useEffect(() => { carregarDados(); }, []);

    if (loading) {
        return (
            <div className="flex flex-col w-full px-space-2xl py-space-2xl max-w-6xl mx-auto items-center justify-center min-h-[50vh]">
                <div className="w-8 h-8 border-4 border-surface-container border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full animate-fade-in-up">
            <div className="flex flex-col gap-space-xl max-w-6xl mx-auto w-full px-space-2xl py-space-2xl">
                
                <PerfilHeader />
                <PerfilTabs abaAtiva={abaAtiva} setAbaAtiva={setAbaAtiva} />

                {abaAtiva === 'dados' && (
                    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-black/5 flex flex-col gap-8">
                        <PerfilAvatar nome={formData.nome} />
                        
                        <div className="h-px w-full bg-black/5"></div>
                        
                        {/* Formulário Interativo */}
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <div>
                                    <h3 className="text-xl font-bold text-[#1A1A1A]">Informações Pessoais & Conta</h3>
                                    <p className="text-sm text-[#1A1A1A]/70">Gerencie os dados do seu perfil público e informações de contato.</p>
                                </div>
                                
                                {/* Banner de Aviso do Portfólio */}
                                <div className="flex items-start gap-3 bg-[#FDE68A]/30 border border-[#FDE68A] p-4 rounded-2xl">
                                    <span className="material-symbols-outlined text-[#1A1A1A] shrink-0 mt-0.5">admin_panel_settings</span>
                                    <p className="text-sm text-[#1A1A1A]/80 leading-relaxed">
                                        <strong className="text-[#1A1A1A] font-bold">Modo Portfólio:</strong> Em nosso ambiente de demonstração, a alteração de credenciais de acesso (E-mail e Senha) está bloqueada para garantir a estabilidade do sistema para todos os visitantes. Apenas o administrador pode fazer essa modificação.
                                    </p>
                                </div>
                            </div>
                            
                            <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-2" onSubmit={e => e.preventDefault()}>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-bold text-[#1A1A1A]">Nome Completo</label>
                                    <div className="h-[52px] px-4 rounded-2xl bg-[#1A1A1A]/5 flex items-center shadow-none focus-within:ring-2 focus-within:ring-[#1A1A1A]/20 transition-all">
                                        <input className="w-full bg-transparent border-0 outline-none text-base text-[#1A1A1A] font-medium" type="text" 
                                            value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-bold text-[#1A1A1A]">Telefone / WhatsApp</label>
                                    <div className="h-[52px] px-4 rounded-2xl bg-[#1A1A1A]/5 flex items-center gap-2 shadow-none focus-within:ring-2 focus-within:ring-[#1A1A1A]/20 transition-all">
                                        <span className="material-symbols-outlined text-[#1A1A1A]/40 text-[20px]">phone</span>
                                        <input className="w-full bg-transparent border-0 outline-none text-base text-[#1A1A1A] font-medium" type="tel" 
                                            value={formData.telefone} onChange={e => setFormData({...formData, telefone: e.target.value})} />
                                    </div>
                                </div>

                                {/* Campos de Auth Bloqueados */}
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-bold text-[#1A1A1A]">E-mail Principal</label>
                                    </div>
                                    <div className="h-[52px] px-4 rounded-2xl bg-[#1A1A1A]/[0.02] flex items-center justify-between gap-2 cursor-not-allowed border border-black/5">
                                        <input className="w-full bg-transparent border-0 outline-none text-base text-[#1A1A1A]/50 font-medium cursor-not-allowed" type="email" 
                                            disabled value={formData.email} />
                                        <span className="material-symbols-outlined text-[#1A1A1A]/30 text-[18px]">lock</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-bold text-[#1A1A1A]">Senha de Acesso</label>
                                    <div className="h-[52px] px-4 rounded-2xl bg-[#1A1A1A]/[0.02] flex items-center gap-2 cursor-not-allowed border border-black/5">
                                        <input className="w-full bg-transparent border-0 outline-none text-base text-[#1A1A1A]/50 font-medium cursor-not-allowed" type="password" 
                                            disabled value="*************" />
                                        <span className="material-symbols-outlined text-[#1A1A1A]/30 text-[18px]">lock</span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1 md:col-span-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-bold text-[#1A1A1A]">CPF (Cadastro de Pessoa Física)</label>
                                        <span className="text-xs text-[#1A1A1A]/50 flex items-center gap-1 font-bold">
                                            <span className="material-symbols-outlined text-[13px]">shield</span>
                                            Protegido por LGPD
                                        </span>
                                    </div>
                                    <div className="h-[52px] px-4 rounded-2xl bg-[#1A1A1A]/[0.02] flex items-center justify-between gap-2 cursor-not-allowed border border-black/5">
                                        <input className="w-full bg-transparent border-0 outline-none text-base text-[#1A1A1A]/50 font-mono tracking-wider cursor-not-allowed" 
                                            disabled type="text" value={usuario?.cpf ? `***.${usuario.cpf.substring(3,6)}.${usuario.cpf.substring(6,9)}-**` : '***.***.***-**'} />
                                        <span className="material-symbols-outlined text-[#1A1A1A]/30 text-[18px]">verified</span>
                                    </div>
                                </div>
                            </form>
                        </div>


                        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-2 text-[#1A1A1A]/60 text-sm">
                                <span className="material-symbols-outlined text-[16px]">history</span>
                                <span>Última alteração feita recentemente</span>
                            </div>
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <button 
                                    onClick={descartarAlteracoes}
                                    className="flex-1 sm:flex-initial px-6 py-2.5 h-12 rounded-full text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-[#1A1A1A]/5 text-sm font-bold transition-all" type="button">
                                    Descartar Alterações
                                </button>
                                <button 
                                    onClick={salvarPerfil}
                                    disabled={saving}
                                    className="flex-1 sm:flex-initial px-8 py-2.5 h-12 rounded-full bg-[#D9F99D] text-[#1A1A1A] text-sm font-bold hover:bg-[#D9F99D]/80 transition-all flex items-center justify-center gap-2 disabled:opacity-50" type="button">
                                    <span className="material-symbols-outlined text-[18px]">save</span>
                                    <span>{saving ? 'Salvando...' : 'Salvar Alterações'}</span>
                                </button>
                            </div>
                        </div>

                        <PerfilDangerZone onLogout={handleLogout} />
                    </div>
                )}
                
                {/* Abas Vazias ou placeholders para futuras implementações */}
                {abaAtiva !== 'dados' && (
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-black/5 text-center text-[#1A1A1A]/60 text-base h-48 flex items-center justify-center">
                        Conteúdo da aba "{abaAtiva}" em desenvolvimento...
                    </div>
                )}

            </div>
        </div>
    );
};