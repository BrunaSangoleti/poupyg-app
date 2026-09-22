import React, { useState } from 'react';

// ==========================================
// 1. HEADER
// ==========================================
export const PerfilHeader = () => (
  <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md pt-space-xs">
    <div className="flex flex-col gap-space-xs">
      <div className="flex items-center gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
        <span className="hover:text-on-surface cursor-pointer transition-colors">Poupyg</span>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-on-surface font-medium">Configurações</span>
      </div>
      <div className="flex flex-col">
        <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
          Configurações da Conta
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
          Gerencie suas informações pessoais, segurança, preferências do aplicativo e integrações
        </p>
      </div>
    </div>
    <div className="flex items-center self-start md:self-auto gap-space-xs px-space-md py-space-xs bg-surface-container-low rounded-full shadow-sm">
      <span className="material-symbols-outlined text-secondary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
      <span className="font-label-caption text-label-caption font-semibold text-on-surface tracking-wide uppercase">
        Conta Verificada • Plano Pro
      </span>
    </div>
  </div>
);

// ==========================================
// 2. TABS
// ==========================================
export const PerfilTabs = ({ abaAtiva, setAbaAtiva }: { abaAtiva: string, setAbaAtiva: (aba: string) => void }) => {
  const abas = [
    { id: 'dados', icon: 'person', label: 'Dados Pessoais' },
    { id: 'seguranca', icon: 'lock_reset', label: 'Segurança & Acesso' },
    { id: 'notificacoes', icon: 'notifications_active', label: 'Notificações & Alertas' },
    { id: 'preferencias', icon: 'tune', label: 'Preferências do App' }
  ];

  return (
    <div className="bg-white rounded-3xl p-2 shadow-sm border border-black/5 overflow-x-auto scrollbar-hide">
      <nav aria-label="Abas de Configuração" className="flex items-center gap-1 min-w-max">
        {abas.map(aba => (
          <button 
            key={aba.id}
            onClick={() => setAbaAtiva(aba.id)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-150 ${
              abaAtiva === aba.id 
                ? 'bg-[#1A1A1A] text-white shadow-sm' 
                : 'text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-[#1A1A1A]/5'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{aba.icon}</span>
            <span>{aba.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

// ==========================================
// 3. AVATAR
// ==========================================
export const PerfilAvatar = ({ nome }: { nome: string }) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(localStorage.getItem('user_avatar'));

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setAvatarUrl(base64);
        localStorage.setItem('user_avatar', base64);
        // Force a window dispatch if we want other components (like Sidebar) to pick it up, 
        // though just updating here is fine for the demo.
        window.dispatchEvent(new Event('avatarUpdated'));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl(null);
    localStorage.removeItem('user_avatar');
    window.dispatchEvent(new Event('avatarUpdated'));
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
      <div className="flex items-center gap-6 min-w-0">
        <div className="relative group">
          <div className="w-[84px] h-[84px] rounded-full object-cover flex-shrink-0 bg-[#D8E2FF] text-[#1A1A1A] flex items-center justify-center text-3xl font-bold uppercase overflow-hidden">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              nome ? nome.charAt(0) : 'U'
            )}
          </div>
          <label className="absolute inset-0 bg-[#1A1A1A]/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
            <span className="material-symbols-outlined text-white text-[22px]">photo_camera</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>
        <div className="flex flex-col min-w-0">
          <h2 className="text-xl text-[#1A1A1A] font-bold truncate">{nome || 'Carregando...'}</h2>
          <p className="text-base text-[#1A1A1A]/70 truncate">Membro Poupyg</p>
          <span className="text-xs text-[#1A1A1A]/50 mt-1">PNG, JPG ou WEBP até 5MB</span>
        </div>
      </div>
      <div className="flex items-center gap-2 self-stretch sm:self-auto">
        <label className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 h-10 rounded-full bg-[#1A1A1A] text-white hover:bg-[#1A1A1A]/90 text-sm font-bold transition-all cursor-pointer">
          <span className="material-symbols-outlined text-[18px]">upload</span>
          <span>Alterar foto</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
        </label>
        <button 
          onClick={handleRemoveAvatar}
          className="px-4 py-2.5 h-10 rounded-full text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-[#FFD8E4] text-sm font-bold transition-colors"
        >
          Remover
        </button>
      </div>
    </div>
  );
};


// ==========================================
// 5. SECURITY & LOGOUT (Antiga Zona de Perigo)
// ==========================================
export const PerfilDangerZone = ({ onLogout }: { onLogout: () => void }) => (
  <div className="rounded-3xl bg-[#FDFBF7] p-6 md:p-8 flex flex-col gap-6 shadow-sm border border-black/5">
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-full bg-[#1A1A1A]/10 flex items-center justify-center flex-shrink-0 text-[#1A1A1A]">
        <span className="material-symbols-outlined text-[22px]">logout</span>
      </div>
      <div className="flex flex-col">
        <h3 className="text-xl text-[#1A1A1A] font-bold">Segurança & Acesso</h3>
        <p className="text-base text-[#1A1A1A]/70 mt-0.5">
          Gerencie o acesso à sua conta e encerre sua sessão em segurança.
        </p>
      </div>
    </div>
    
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-3xl bg-white gap-4 shadow-sm border border-black/5">
        <div className="flex flex-col">
          <h4 className="text-sm font-bold text-[#1A1A1A]">Encerrar Sessão</h4>
          <p className="text-sm text-[#1A1A1A]/70">Desconecta sua conta com segurança deste navegador.</p>
        </div>
        <button onClick={onLogout} className="self-start sm:self-auto px-6 py-2.5 h-10 rounded-full bg-[#1A1A1A] text-white hover:bg-[#1A1A1A]/90 text-sm font-bold transition-all flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-[18px]">logout</span>
          <span>Sair da Conta</span>
        </button>
      </div>
    </div>
  </div>
);
