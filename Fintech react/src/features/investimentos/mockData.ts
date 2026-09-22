export type CategoriaAtivo = 'Todos' | 'Renda Fixa' | 'Ações' | 'FIIs' | 'Cripto' | 'Outros';

// Shape do DTO retornado pelo backend
export interface InvestimentoApiDTO {
  id: string;
  descricao: string;
  categoria?: string;
  data?: string;
  valor: number;
  usuarioId?: string;
  nomeUsuario?: string;
}

// Shape visual usado pelos componentes
export interface AtivoReal {
  id: string;
  descricao: string;
  categoria: CategoriaAtivo;
  valor: number;
}

// Dados agrupados por categoria para o gráfico donut
export interface AlocacaoCategoria {
  categoria: string;
  valor: number;
  percentual: number;
}

// Converte um DTO da API para o formato visual AtivoReal
export function mapearInvestimento(dto: InvestimentoApiDTO): AtivoReal {
  return {
    id: dto.id,
    descricao: dto.descricao || '(sem descrição)',
    categoria: (dto.categoria || 'Outros') as CategoriaAtivo,
    valor: Number(dto.valor) || 0,
  };
}

// Calcula a alocação percentual por categoria a partir da lista de ativos
export function calcularAlocacao(ativos: AtivoReal[]): AlocacaoCategoria[] {
  const total = ativos.reduce((s, a) => s + a.valor, 0);
  if (total === 0) return [];

  const mapa = new Map<string, number>();
  ativos.forEach(a => {
    mapa.set(a.categoria, (mapa.get(a.categoria) || 0) + a.valor);
  });

  return Array.from(mapa.entries())
    .map(([categoria, valor]) => ({
      categoria,
      valor,
      percentual: (valor / total) * 100,
    }))
    .sort((a, b) => b.valor - a.valor); // Maior para menor
}
