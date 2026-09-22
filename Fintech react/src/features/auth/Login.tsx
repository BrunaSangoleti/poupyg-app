import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import logoImage from '../../assets/Gemini_Generated_Image_2yamgd2yamgd2yam-removebg-preview.png';
import bgImage from '../../assets/pig_backgorund.jpg';
import mascotPig from '../../assets/mascote-pig.png';



// ── Schema de validação Zod ──
const loginSchema = z.object({
  email: z.string().min(1, 'O e-mail é obrigatório').email('Digite um e-mail válido'),
  senha: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showColdStart, setShowColdStart] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const coldStartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setApiError(null);
    setShowColdStart(false);

    // Aviso de cold-start após 5s
    coldStartTimerRef.current = setTimeout(() => setShowColdStart(true), 5000);

    try {
      const responseData = await authService.login(data.email, data.senha);
      localStorage.setItem('token', responseData.token);
      localStorage.setItem('usuarioId', responseData.id);
      localStorage.setItem('usuario', JSON.stringify(responseData));
      navigate('/home');
    } catch (error: any) {
      const status = error.response?.status;
      if (status === 401) setApiError('E-mail ou senha incorretos. Tente novamente.');
      else if (status === 404) setApiError('Serviço de autenticação indisponível. Tente mais tarde.');
      else setApiError('Não foi possível conectar ao servidor. Verifique sua conexão.');
    } finally {
      setIsLoading(false);
      setShowColdStart(false);
      if (coldStartTimerRef.current) clearTimeout(coldStartTimerRef.current);
    }
  };

  return (
    /* ── Layout Principal (Root) ── */
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden bg-surface">

      {/* ── COLUNA ESQUERDA: Branding (Oculto no mobile) ── */}
      <div className="hidden md:flex flex-col w-1/2 relative justify-between p-6 lg:p-10 bg-inverse-surface overflow-hidden select-none">
        
        {/* Fundo e Efeitos */}
        <div className="absolute inset-0 z-0">
          <img src={bgImage} alt="Background" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 backdrop-blur-sm"></div>
        </div>
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-primary-fixed opacity-40 blur-3xl pointer-events-none z-0"></div>
        <div className="absolute top-1/2 -right-24 w-72 h-72 rounded-full bg-secondary-fixed opacity-40 blur-3xl pointer-events-none z-0"></div>
        <div className="absolute -bottom-24 left-1/4 w-64 h-64 rounded-full bg-tertiary-fixed opacity-30 blur-2xl pointer-events-none z-0"></div>

        {/* Topo: Logo */}
        <div className="relative z-10 flex items-center justify-start">
          <img src={logoImage} alt="Poupyg" className="h-16 lg:h-20 w-auto object-contain drop-shadow-md" />
        </div>

        {/* Centro: Composição e Textos Escalonados para Caber */}
        <div className="relative z-10 flex flex-col items-center justify-center max-w-xl mx-auto w-full my-auto scale-90 lg:scale-100 origin-center">
          
          {/* Ilustração/Cards em escala menor */}
          <div className="relative w-full aspect-[16/11] max-w-lg flex items-center justify-center opacity-0 animate-fade-in-up">
            <svg className="absolute inset-0 w-full h-full text-secondary-fixed/30 scale-110" fill="none" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
              <path d="M 40 260 C 100 240, 140 180, 200 170 C 260 160, 300 110, 370 70" stroke="currentColor" strokeDasharray="6 6" strokeLinecap="round" strokeWidth="3"></path>
              <path d="M 40 220 C 110 210, 160 140, 230 130 C 290 120, 320 80, 380 40" stroke="url(#paint0_linear)" strokeLinecap="round" strokeWidth="4"></path>
              <defs>
                <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear" x1="40" x2="380" y1="220" y2="40">
                  <stop stopColor="currentColor" stopOpacity="0.3"></stop>
                  <stop offset="1" stopColor="currentColor"></stop>
                </linearGradient>
              </defs>
            </svg>

            {/* Card Superior Direito */}
            <div className="absolute top-2 right-0 bg-white/10 backdrop-blur-md p-4 rounded-2xl shadow-xl w-48 border border-white/10">
              <div className="flex items-center justify-between mb-1">
                <span className="font-label-caption text-xs text-secondary-fixed uppercase tracking-wider font-bold">Crescimento</span>
                <span className="material-symbols-outlined text-secondary-fixed text-lg">trending_up</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-label-numeric-lg text-2xl text-white font-bold">+28.4%</span>
              </div>
            </div>

            {/* Card Central */}
            <div className="relative z-20 w-72 sm:w-80 bg-gradient-to-tr from-white/5 to-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-2xl">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="font-label-caption text-xs text-white/70 uppercase tracking-widest font-semibold mb-1">Total Guardado</p>
                  <h3 className="font-headline-lg text-3xl sm:text-4xl text-white font-bold tracking-tight">R$ 42.850<span className="text-xl text-white/60 font-normal">,00</span></h3>
                </div>
              </div>
              <div className="h-8 w-full flex items-end gap-2 pt-2">
                <div className="flex-1 bg-white/20 h-3 rounded-full"></div>
                <div className="flex-1 bg-white/30 h-5 rounded-full"></div>
                <div className="flex-1 bg-white/40 h-4 rounded-full"></div>
                <div className="flex-1 bg-secondary-fixed/60 h-6 rounded-full"></div>
                <div className="flex-1 bg-secondary-fixed h-8 rounded-full"></div>
              </div>
            </div>

            {/* Card Inferior Esquerdo */}
            <div className="absolute -bottom-4 left-0 bg-white/10 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-lg flex items-center gap-3 w-64">
              <div className="w-10 h-10 rounded-lg bg-tertiary-fixed/20 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-tertiary-fixed text-xl">savings</span>
              </div>
              <div className="min-w-0">
                <p className="font-headline-sm text-base text-white font-semibold truncate">Meta de Reserva</p>
                <p className="font-body-sm text-xs text-white/70">92% concluída com êxito</p>
              </div>
            </div>
          </div>

          {/* Textos reduzidos */}
          <div className="text-center mt-6 max-w-xl opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h1 className="font-display-hero-mobile text-3xl lg:text-4xl text-white font-bold tracking-tight leading-snug">
              Organize suas finanças. <br />
              <span className="bg-gradient-to-r from-white to-primary-fixed bg-clip-text text-transparent">Conquiste seus sonhos.</span>
            </h1>
            <p className="mt-4 font-body-lg text-sm lg:text-base text-white/80 leading-relaxed">
              O Poupyg transforma a maneira como você lida com dinheiro. Simples, inteligente e feito para o seu dia a dia.
            </p>
          </div>
        </div>

        {/* Rodapé do Lado Esquerdo */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center gap-2">
            <span className="font-body-sm text-xs text-white/80">Comunidade Poupyg: +10k usuários ativos</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-body-sm text-xs font-semibold text-white">4.9/5 estrelas ⭐</span>
          </div>
        </div>
      </div>

      {/* ── COLUNA DIREITA: Formulário (Sem Scrollbar, Flex Center) ── */}
      <div className="flex-1 md:w-1/2 flex flex-col justify-center items-center h-full relative bg-surface px-6 z-10">
        
        {/* Contêiner restrito max-w-md com paddings compactos */}
        <div className="w-full max-w-md flex flex-col gap-4 lg:gap-5 animate-fade-in-up z-10" style={{ animationDelay: '0.1s' }}>

          {/* Logo mobile */}
          <div className="flex md:hidden justify-center items-center w-full mb-2">
            <img src={logoImage} alt="Logo" className="h-16 w-auto max-w-full object-contain" />
          </div>

          <div className="flex flex-col gap-1">
            <h2 className="font-headline-lg text-2xl lg:text-3xl text-on-surface tracking-tight">
              Continue de onde parou
            </h2>
            <p className="font-body-lg text-sm text-on-surface-variant">
              Faça login para acessar sua conta.
            </p>
          </div>

          {/* Card de Demonstração (Compacto) */}
          <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/40 flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary text-lg">info</span>
              <span className="font-label-button text-sm text-on-surface">Acesso de demonstração</span>
            </div>
            <div className="flex flex-col pl-6 font-body-lg text-xs sm:text-sm text-on-surface-variant">
              <span><strong className="text-on-surface">E-mail:</strong> frieren@email.com</span>
              <span><strong className="text-on-surface">Senha:</strong> senha123</span>
            </div>
          </div>

          {/* Formulário (Gaps reduzidos) */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>

            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="font-label-caption text-xs text-on-surface-variant uppercase tracking-wider">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                disabled={isLoading}
                placeholder="seu@email.com"
                aria-invalid={errors.email ? 'true' : 'false'}
                className={`w-full h-12 px-4 rounded-lg font-body-lg text-sm lg:text-base text-on-surface placeholder:text-on-surface-variant/60 bg-surface-container-low outline-none transition-all focus:ring-2 focus:ring-secondary/30 disabled:opacity-60 ${errors.email ? 'ring-2 ring-error' : ''}`}
              />
              {errors.email && (
                <span className="font-body-sm text-xs text-error flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[14px]">error</span>
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="senha" className="font-label-caption text-xs text-on-surface-variant uppercase tracking-wider">
                Senha
              </label>
              <div className="relative">
                <input
                  id="senha"
                  type={showPassword ? "text" : "password"}
                  {...register('senha')}
                  disabled={isLoading}
                  placeholder="••••••••"
                  aria-invalid={errors.senha ? 'true' : 'false'}
                  className={`w-full h-12 pl-4 pr-12 rounded-lg font-body-lg text-sm lg:text-base text-on-surface placeholder:text-on-surface-variant/60 bg-surface-container-low outline-none transition-all focus:ring-2 focus:ring-secondary/30 disabled:opacity-60 ${errors.senha ? 'ring-2 ring-error' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 h-12 px-3 flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
              {errors.senha && (
                <span className="font-body-sm text-xs text-error flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[14px]">error</span>
                  {errors.senha.message}
                </span>
              )}
            </div>

            {apiError && (
              <div className="p-2.5 rounded-lg bg-error-container text-on-error-container font-body-sm text-xs sm:text-sm flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base shrink-0">warning</span>
                {apiError}
              </div>
            )}

            {showColdStart && (
              <div className="p-2.5 rounded-lg bg-surface-container border border-outline-variant font-body-sm text-xs text-on-surface-variant flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base shrink-0 text-secondary">hourglass_top</span>
                O servidor está acordando... Pode levar até 50s.
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              aria-busy={isLoading}
              className="w-full h-12 mt-1 bg-primary text-on-primary hover:opacity-90 rounded-lg font-label-button text-sm sm:text-base flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined text-xl animate-spin">progress_activity</span>
                  Entrando...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-xl">login</span>
                  Entrar na minha conta
                </>
              )}
            </button>
          </form>
        </div>

        {/* Mascote Absoluto, fixado bottom/right, mas limitado para evitar overflow */}
        <img 
          src={mascotPig} 
          alt="Mascote Poupyg" 
          className="absolute bottom-0 right-0 max-h-24 sm:max-h-32 lg:max-h-40 pointer-events-none drop-shadow-xl z-0" 
        />
      </div>
    </div>
  );
};
