// Plano progressivo de 6 semanas (HIIT em circuito + foco em abdômen)
// work/rest em segundos por exercício; rounds = voltas no circuito.
export const SEMANAS = [
  { n: 1, fase: 'Adaptação',   work: 30, rest: 30, rounds: 2, meta: 'Aprender os movimentos e criar o hábito.' },
  { n: 2, fase: 'Base',        work: 35, rest: 25, rounds: 3, meta: 'Mais voltas, mesmo ritmo confortável.' },
  { n: 3, fase: 'Construção',  work: 40, rest: 20, rounds: 3, meta: 'Entram burpee e agachamento com salto.' },
  { n: 4, fase: 'Aceleração',  work: 40, rest: 20, rounds: 4, meta: 'Quatro voltas: a queima de gordura aumenta.' },
  { n: 5, fase: 'Queima',      work: 45, rest: 15, rounds: 4, meta: 'Descanso curto, coração lá em cima.' },
  { n: 6, fase: 'Trincar',     work: 50, rest: 10, rounds: 4, meta: 'Reta final: máxima intensidade!' },
];

// Exercício avançado entra a partir da semana `desde`; antes usa `senao`.
const adv = (id, desde, senao) => ({ id, desde, senao });

const DIAS = [
  { nome: 'Queima Total', emoji: '🔥', foco: 'Corpo inteiro + abdômen',
    lista: ['polichinelo', 'agachamento', 'mountain', 'flexao', 'crunch', 'prancha'] },
  { nome: 'Abdômen Trincado', emoji: '🎯', foco: 'Abdômen superior, inferior e oblíquos',
    lista: ['crunch', 'bicicleta', 'elevacao', 'tesoura', 'prancha', 'pranchaLateral', adv('deadbug', 2, 'crunch'), adv('russian', 2, 'bicicleta')] },
  { nome: 'Pernas & Glúteo', emoji: '🍑', foco: 'Pernas, glúteos e cardio',
    lista: ['skipping', 'agachamento', 'afundo', 'ponte', 'polichinelo', adv('agachSalto', 3, 'agachamento'), 'superman'] },
  { nome: 'Core 360°', emoji: '🧱', foco: 'Estabilidade e cintura',
    lista: ['prancha', 'mountain', 'russian', 'superman', 'pranchaLateral', 'bicicleta', 'deadbug'] },
  { nome: 'HIIT Queima', emoji: '⚡', foco: 'Alta intensidade para perder gordura',
    lista: [adv('burpee', 3, 'polichinelo'), 'skipping', adv('agachSalto', 3, 'agachamento'), 'mountain', 'flexao', 'elevacao'] },
  { nome: 'Abdômen Final', emoji: '💎', foco: 'Definição do abdômen',
    lista: ['crunch', 'tesoura', 'bicicleta', 'elevacao', 'russian', 'prancha', adv('burpee', 4, 'mountain')] },
  { nome: 'Descanso Ativo', emoji: '🌿', foco: 'Caminhada juntos + alongamento', descanso: true,
    lista: ['caminhada', 'cobra'] },
];

export const AQUECIMENTO = ['polichinelo', 'skipping'];
export const ALONGAMENTO = ['cobra'];

export function treinoDoDia(diaIdx, leve = false) {
  const i = Math.max(0, Math.min(41, diaIdx));
  const sem = SEMANAS[Math.floor(i / 7)];
  const d = DIAS[i % 7];
  const exercicios = d.lista.map((e) => (typeof e === 'string' ? e : sem.n >= e.desde ? e.id : e.senao));
  let { work, rest, rounds } = sem;
  if (leve) { work = Math.max(20, work - 10); rest = rest + 10; }
  const total = d.descanso ? 35 * 60 : 60 + (work + rest) * exercicios.length * rounds + 30;
  return {
    idx: i, semana: sem.n, fase: sem.fase, metaSemana: sem.meta, diaSemana: (i % 7) + 1,
    tipo: d.descanso ? 'descanso' : 'treino', nome: d.nome, emoji: d.emoji, foco: d.foco,
    exercicios, work, rest, rounds, minutos: Math.round(total / 60),
  };
}

export const FRASES = [
  'Um casal que treina junto, vence junto. 💑',
  'Não é sobre ser perfeito, é sobre não desistir hoje.',
  'Cada gota de suor é um passo para o abdômen trincado.',
  'Disciplina é lembrar do que vocês querem.',
  '6 semanas passam de qualquer jeito. Façam valer!',
  'Água, treino, prato colorido: o trio do sucesso.',
  'Um incentiva o outro: hoje é dia de cuidar de quem você ama.',
];
