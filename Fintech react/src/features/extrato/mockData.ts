export type TipoTransacaoEx = 'Entrada' | 'Saida' | 'Investimento';
export type StatusTransacao = 'Concluído' | 'Pendente';

export interface TransacaoEx {
  id: string;
  descricao: string;
  categoria: string;
  conta: string;
  horario: string;
  dataGrupo: string;
  dataGrupoIcon: string;
  dataGrupoSub: string;
  dataIso: string;
  tipo: TipoTransacaoEx;
  status: StatusTransacao;
  valor: number;
  icon: string;
  bgClass: string;
  iconColorClass: string;
  textColorClass: string;
}

// Shape do DTO que vem do backend (Receita, Despesa e Investimento têm o mesmo shape)
export interface TransacaoApiDTO {
  id: string;
  descricao: string;
  valor: number;
  data?: string;
  categoria?: string;
  usuarioId?: string;
  nomeUsuario?: string;
}

// Config visual por tipo de transação
const configPorTipo: Record<TipoTransacaoEx, {
  icon: string;
  bgClass: string;
  iconColorClass: string;
  textColorClass: string;
  categoriaFallback: string;
  conta: string;
}> = {
  Entrada: {
    icon: 'payments',
    bgClass: 'bg-[#D8E2FF]',
    iconColorClass: 'text-[#1A1A1A]',
    textColorClass: 'text-[#1A1A1A]',
    categoriaFallback: 'Receita',
    conta: 'Conta Corrente',
  },
  Saida: {
    icon: 'shopping_cart',
    bgClass: 'bg-[#FFD8E4]',
    iconColorClass: 'text-[#1A1A1A]',
    textColorClass: 'text-error',
    categoriaFallback: 'Despesa',
    conta: 'Débito',
  },
  Investimento: {
    icon: 'finance_mode',
    bgClass: 'bg-[#D9F99D]',
    iconColorClass: 'text-[#1A1A1A]',
    textColorClass: 'text-[#1A1A1A]',
    categoriaFallback: 'Investimento',
    conta: 'Corretora',
  },
};

// Formata a data ISO para o label do grupo (ex: "Hoje, 10 de Setembro")
function formatarDataGrupo(dataIso: string): { label: string; icon: string } {
  const data = new Date(dataIso + 'T00:00:00'); // Trata data do BD
  const hoje = new Date();
  hoje.setHours(0,0,0,0);
  
  const ontem = new Date(hoje);
  ontem.setDate(hoje.getDate() - 1);

  const mesNome = data.toLocaleDateString('pt-BR', { month: 'long', timeZone: 'UTC' });
  const dia = data.getUTCDate();
  const mesCapital = mesNome.charAt(0).toUpperCase() + mesNome.slice(1);

  if (data.getTime() === hoje.getTime()) {
    return { label: `Hoje, ${dia} de ${mesCapital}`, icon: 'today' };
  } else if (data.getTime() === ontem.getTime()) {
    return { label: `Ontem, ${dia} de ${mesCapital}`, icon: 'history' };
  } else {
    return { label: `${dia} de ${mesCapital}`, icon: 'calendar_month' };
  }
}

// Converte um DTO vindo da API para o formato visual TransacaoEx
export function mapearTransacao(
  dto: TransacaoApiDTO,
  tipo: TipoTransacaoEx
): TransacaoEx {
  const config = configPorTipo[tipo];
  
  // Backend envia data ou usamos fallback para não quebrar a tela
  const dataReal = dto.data || new Date().toISOString().split('T')[0];
  const { label, icon: grupoIcon } = formatarDataGrupo(dataReal);
  
  return {
    id: dto.id,
    descricao: dto.descricao || '(sem descrição)',
    categoria: dto.categoria || config.categoriaFallback,
    conta: config.conta,
    horario: '', // Remover horário pois a API não retorna hora, só data
    dataGrupo: label,
    dataGrupoIcon: grupoIcon,
    dataGrupoSub: '',
    dataIso: dataReal,
    tipo,
    status: 'Concluído',
    valor: Number(dto.valor) || 0,
    icon: config.icon,
    bgClass: config.bgClass,
    iconColorClass: config.iconColorClass,
    textColorClass: config.textColorClass,
  };
}
