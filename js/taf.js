// TAF de concursos: testes, metas padrão (editáveis — cada edital tem a sua tabela) e treino progressivo.
// maior: true = quanto maior melhor; false = quanto menor melhor.
export const TESTES = [
  { id: 'corrida12', nome: 'Corrida de 12 minutos', ex: 'corrida', un: 'm', passo: 10, maior: true, meta: { M: 2400, F: 2000 },
    simulado: { tipo: 'tempo', seg: 720, pede: 'Distância percorrida (m)' },
    regra: 'Percorrer a maior distância em 12 minutos, podendo andar. Pista de 400 m: conte as voltas (1 volta = 400 m).' },
  { id: 'barra', nome: 'Barra fixa', ex: 'barra', un: 'reps', passo: 1, maior: true, meta: { M: 5, F: 3 },
    simulado: { tipo: 'contador', seg: 0 },
    regra: 'Pegada pronada, braços estendidos, queixo acima da barra a cada repetição, sem balanço. (Alguns editais usam isometria para mulheres — confira.)' },
  { id: 'flexao', nome: 'Flexão de braço', ex: 'flexao', un: 'reps', passo: 1, maior: true, meta: { M: 25, F: 15 },
    simulado: { tipo: 'contador', seg: 60 },
    regra: 'Corpo reto, descer até o peito chegar a ~10 cm do chão (ou cotovelos a 90°) e estender totalmente. Mulheres: alguns editais permitem joelhos no chão.' },
  { id: 'remador', nome: 'Abdominal remador (1 min)', ex: 'remador', un: 'reps', passo: 1, maior: true, meta: { M: 35, F: 30 },
    simulado: { tipo: 'contador', seg: 60 },
    regra: 'Em 1 minuto: de deitado com braços estendidos atrás da cabeça, sentar abraçando/ultrapassando os joelhos e voltar encostando as mãos no chão.' },
  { id: 'saltoDist', nome: 'Salto em distância', ex: 'saltoDist', un: 'm', passo: 0.01, maior: true, meta: { M: 2.0, F: 1.6 },
    simulado: { tipo: 'tentativas', seg: 0, pede: 'Melhor de 3 tentativas (m)' },
    regra: 'Parado, pés paralelos atrás da linha. Mede-se da linha até a marca mais próxima dela. Normalmente 2 ou 3 tentativas.' },
  { id: 'saltoAlt', nome: 'Salto em altura', ex: 'saltoAlt', un: 'm', passo: 0.01, maior: true, meta: { M: 1.2, F: 1.0 },
    simulado: { tipo: 'tentativas', seg: 0, pede: 'Altura transposta (m)' },
    regra: 'Transpor o sarrafo sem derrubá-lo, conforme a técnica permitida no edital. Geralmente 2 ou 3 tentativas por altura.' },
  { id: 'cintura', nome: 'Medida da cintura', ex: null, un: 'cm', passo: 0.5, maior: false, meta: { M: 102, F: 88 },
    regra: 'Fita na altura do umbigo (ou ponto médio entre a costela e o quadril), em pé, após expirar. Muitos editais usam como critério de saúde.' },
];

export const IMC_FAIXA = { min: 18.5, max: 29.9 };

const pace400 = (meta) => {
  const s = Math.round((720 * 400) / meta);
  return `${Math.floor(s / 60)}min${String(s % 60).padStart(2, '0')}s`;
};

// Treino da semana para cada teste, a partir da melhor marca e da meta
export function treinoTAF(id, semana, melhor, meta) {
  const m = Number(melhor) || 0;
  switch (id) {
    case 'corrida12':
      if (semana <= 2) return ['3× na semana: 20–25 min de trote leve (dá para conversar).', 'Ao final: 6× (1 min forte + 2 min leve).'];
      if (semana <= 4) return [`Intervalado: 6–8× 400 m no ritmo da meta (${pace400(meta)} cada), 1 min30 de descanso.`, '1× na semana: 30 min contínuos.'];
      return ['1× na semana: simulado completo de 12 min.', `1× intervalado 5× 600 m um pouco acima do ritmo (${pace400(meta * 1.05)} por 400 m).`, '1× trote leve 30 min.'];
    case 'barra':
      if (m < 1) return ['Negativas: suba com ajuda (cadeira) e desça em 5 s — 4× 3.', 'Isometria no alto (queixo acima) 4× 10 s.', 'Remada australiana (embaixo da mesa) 4× 8.'];
      return [`5 séries de ${Math.max(1, Math.round(m * 0.6))} repetições, 2 min de descanso.`, '+ 3 negativas lentas no final.', 'Treine 3× na semana, em dias alternados.'];
    case 'flexao': {
      const n = Math.max(3, Math.round(m * 0.6) + semana - 1);
      return [`5 séries de ${n} flexões, 1 min de descanso.`, `Pirâmide 1× na semana: 1-2-3-…-${Math.max(4, Math.ceil(m / 3))}-…-3-2-1.`, 'Prancha alta 3× 30 s para firmar o core.'];
    }
    case 'remador': {
      const ritmo = (60 / meta).toFixed(1);
      return [`Ritmo da meta: 1 repetição a cada ${ritmo} s.`, `4× 40 s no ritmo + 20 s de descanso (alvo ${Math.round((meta * 40) / 60)} reps em 40 s).`, '1× na semana: simulado de 1 minuto.'];
    }
    case 'saltoDist':
    case 'saltoAlt':
      return ['Pliometria 2× na semana: 4× 5 saltos máximos, 1 min de descanso.', 'Agachamento com salto 3× 10 e afundo 3× 10 por perna.', semana >= 4 ? 'Treine a técnica da prova: 6 tentativas valendo, com descanso.' : 'Trabalhe a aterrissagem: caia macio e estável.'];
    case 'cintura':
      return ['Siga o treino diário do casal (foco em abdômen) e o cardápio.', 'Meça sempre no mesmo horário, em jejum, 1× por semana.'];
    default:
      return [];
  }
}
