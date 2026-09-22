/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        /* =========================================================
           NOVOS TOKENS DE CORES (Baseados na nova identidade)
           ========================================================= */
        
        // --- NEUTROS & SURFACES (Clean SaaS Look) ---
        "background": "hsl(var(--color-background) / <alpha-value>)",               // slate-50 - Fundo geral levíssimo
        "surface": "hsl(var(--color-surface) / <alpha-value>)",                  // Branco puro
        "surface-bright": "hsl(var(--color-surface-bright) / <alpha-value>)",
        "surface-dim": "hsl(var(--color-surface-dim) / <alpha-value>)",              // slate-100
        "surface-container-lowest": "hsl(var(--color-surface-container-lowest) / <alpha-value>)",
        "surface-container-low": "hsl(var(--color-surface-container-low) / <alpha-value>)",    // slate-50 (usado em inputs/cards internos)
        "surface-container": "hsl(var(--color-surface-container) / <alpha-value>)",        // slate-100
        "surface-container-high": "hsl(var(--color-surface-container-high) / <alpha-value>)",   // slate-200
        "surface-container-highest": "hsl(var(--color-surface-container-highest) / <alpha-value>)",// slate-300
        "surface-variant": "hsl(var(--color-surface-variant) / <alpha-value>)",
        "surface-tint": "hsl(var(--color-surface-tint) / <alpha-value>)",             // Roxo (Primary) usado como base de tintura
        "inverse-surface": "hsl(var(--color-inverse-surface) / <alpha-value>)",          // slate-900
        "inverse-on-surface": "hsl(var(--color-inverse-on-surface) / <alpha-value>)",
        
        // --- TEXTOS (Auto Contraste) ---
        "on-background": "hsl(var(--color-on-background) / <alpha-value>)",            // slate-900 (Contraste excelente > 14:1)
        "on-surface": "hsl(var(--color-on-surface) / <alpha-value>)",
        "on-surface-variant": "hsl(var(--color-on-surface-variant) / <alpha-value>)",       // slate-600 (Textos descritivos)
        "outline": "hsl(var(--color-outline) / <alpha-value>)",                  // slate-400 (Bordas fortes)
        "outline-variant": "hsl(var(--color-outline-variant) / <alpha-value>)",          // slate-200 (Bordas fracas)

        // --- PRIMARY (Base: #713CBF - Roxo) ---
        "primary": "hsl(var(--color-primary) / <alpha-value>)",                  // CTA principal
        "on-primary": "hsl(var(--color-on-primary) / <alpha-value>)",               // Texto sobre Primary (WCAG Pass)
        "primary-container": "hsl(var(--color-primary-container) / <alpha-value>)",        // purple-100 (Fundos sutis)
        "on-primary-container": "hsl(var(--color-on-primary-container) / <alpha-value>)",     // purple-900 (Texto forte sobre fundo sutil)
        "primary-fixed": "hsl(var(--color-primary-fixed) / <alpha-value>)",
        "primary-fixed-dim": "hsl(var(--color-primary-fixed-dim) / <alpha-value>)",
        "on-primary-fixed": "hsl(var(--color-on-primary-fixed) / <alpha-value>)",
        "inverse-primary": "hsl(var(--color-inverse-primary) / <alpha-value>)",

        // --- SECONDARY (Base: #91C1C2 - Ciano) ---
        "secondary": "hsl(var(--color-secondary) / <alpha-value>)",                // Ajustado para #528586 (Tons mais escuros do Ciano para passar no WCAG para textos e ícones)
        "on-secondary": "hsl(var(--color-on-secondary) / <alpha-value>)",             
        "secondary-container": "hsl(var(--color-secondary-container) / <alpha-value>)",      // Ciano super claro para backgrounds (badges, hover)
        "on-secondary-container": "hsl(var(--color-on-secondary-container) / <alpha-value>)",   // Texto escuro sobre o fundo ciano
        "secondary-fixed": "hsl(var(--color-secondary-fixed) / <alpha-value>)",
        "secondary-fixed-dim": "hsl(var(--color-secondary-fixed-dim) / <alpha-value>)",
        "on-secondary-fixed": "hsl(var(--color-on-secondary-fixed) / <alpha-value>)",
        "on-secondary-fixed-variant": "hsl(var(--color-on-secondary-fixed-variant) / <alpha-value>)",

        // --- TERTIARY (Base: #943775 - Magenta) ---
        "tertiary": "hsl(var(--color-tertiary) / <alpha-value>)",                 // Botões alternativos e Gráficos
        "on-tertiary": "hsl(var(--color-on-tertiary) / <alpha-value>)",              // WCAG Pass
        "tertiary-container": "hsl(var(--color-tertiary-container) / <alpha-value>)",       // Fundo rosinha claro
        "on-tertiary-container": "hsl(var(--color-on-tertiary-container) / <alpha-value>)",    // Texto sobre fundo claro
        "tertiary-fixed": "hsl(var(--color-tertiary-fixed) / <alpha-value>)",
        "tertiary-fixed-dim": "hsl(var(--color-tertiary-fixed-dim) / <alpha-value>)",
        "on-tertiary-fixed": "hsl(var(--color-on-tertiary-fixed) / <alpha-value>)",
        "on-tertiary-fixed-variant": "hsl(var(--color-on-tertiary-fixed-variant) / <alpha-value>)",

        // --- ERROR / DESTRUCTIVE (Base: #6B021B - Bordô) ---
        "error": "hsl(var(--color-error) / <alpha-value>)",                    // Ações de exclusão / alertas graves
        "on-error": "hsl(var(--color-on-error) / <alpha-value>)",                 // Excelente Contraste (10:1)
        "error-container": "hsl(var(--color-error-container) / <alpha-value>)",          // Fundo de erro super claro
        "on-error-container": "hsl(var(--color-on-error-container) / <alpha-value>)",       // Texto erro
      },
      borderRadius: {
        DEFAULT: "1rem",
        lg: "2rem",
        xl: "3rem",
        full: "9999px",
      },
      spacing: {
        "space-3xl": "2.5rem",
        "gutter-mobile": "1rem",
        "space-4xl": "3.5rem",
        "space-xs": "0.5rem",
        "space-sm": "0.75rem",
        "space-xxs": "0.25rem",
        "space-xl": "1.5rem",
        "margin-mobile": "1rem",
        "space-lg": "1.25rem",
        "space-md": "1rem",
        "gutter-tablet": "1.5rem",
        "space-2xl": "2rem",
        "margin-tablet": "2rem",
      },
      fontFamily: {
        "body-lg": ["Inter", "sans-serif"],
        "headline-lg": ["Plus Jakarta Sans", "sans-serif"],
        "label-numeric-lg": ["Plus Jakarta Sans", "sans-serif"],
        "body-sm": ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "label-button": ["Inter", "sans-serif"],
        "display-hero": ["Plus Jakarta Sans", "sans-serif"],
        "label-caption": ["Inter", "sans-serif"],
        "label-numeric-md": ["Plus Jakarta Sans", "sans-serif"],
        "headline-sm": ["Plus Jakarta Sans", "sans-serif"],
        "headline-md": ["Plus Jakarta Sans", "sans-serif"],
        "display-hero-mobile": ["Plus Jakarta Sans", "sans-serif"],
      },
      fontSize: {
        "body-lg": ["16px", { lineHeight: "24px", letterSpacing: "-0.005em", fontWeight: "400" }],
        "headline-lg": ["28px", { lineHeight: "36px", letterSpacing: "-0.02em", fontWeight: "600" }],
        "label-numeric-lg": ["24px", { lineHeight: "30px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "body-sm": ["12px", { lineHeight: "16px", letterSpacing: "0.005em", fontWeight: "400" }],
        "body-md": ["14px", { lineHeight: "20px", letterSpacing: "0em", fontWeight: "400" }],
        "label-button": ["15px", { lineHeight: "20px", letterSpacing: "0.01em", fontWeight: "600" }],
        "display-hero": ["40px", { lineHeight: "48px", letterSpacing: "-0.03em", fontWeight: "700" }],
        "label-caption": ["11px", { lineHeight: "14px", letterSpacing: "0.03em", fontWeight: "500" }],
        "label-numeric-md": ["16px", { lineHeight: "22px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "headline-sm": ["18px", { lineHeight: "24px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "headline-md": ["22px", { lineHeight: "28px", letterSpacing: "-0.015em", fontWeight: "600" }],
        "display-hero-mobile": ["32px", { lineHeight: "40px", letterSpacing: "-0.025em", fontWeight: "700" }],
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'zoom-pan': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.05)' },
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
        'zoom-pan': 'zoom-pan 20s ease-in-out infinite alternate',
      },
    },
  },
  plugins: [],
}
