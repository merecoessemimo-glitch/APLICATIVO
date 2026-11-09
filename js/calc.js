// Cálculos de saúde e progresso (funções puras, testadas em tests/calc.test.mjs)

export const TOTAL_DIAS = 42; // 6 semanas

export const dataKey = (d = new Date()) => {
  const z = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
};

export const diasEntre = (a, b) => {
  const pa = new Date(a + 'T12:00:00'), pb = new Date(b + 'T12:00:00');
  return Math.round((pb - pa) / 86400000);
};

export function imc(pesoKg, alturaCm) {
  if (!pesoKg || !alturaCm) return null;
  const m = alturaCm / 100;
  return Math.round((pesoKg / (m * m)) * 10) / 10;
}

export function classeImc(v) {
  if (v == null) return '—';
  if (v < 18.5) return 'Abaixo do peso';
  if (v < 25) return 'Peso adequado';
  if (v < 30) return 'Sobrepeso';
  if (v < 35) return 'Obesidade grau I';
  if (v < 40) return 'Obesidade grau II';
  return 'Obesidade grau III';
}

// Mifflin-St Jeor
export function tmb({ sexo, peso, altura, idade }) {
  if (!peso || !altura || !idade) return null;
  const base = 10 * peso + 6.25 * altura - 5 * idade;
  return Math.round(sexo === 'M' ? base + 5 : base - 161);
}

// Gasto com atividade leve/moderada (1,375) menos 500 kcal; com piso de segurança
export function metaKcal(p) {
  const t = tmb(p);
  if (!t) return p.sexo === 'M' ? 1800 : 1500;
  const piso = p.sexo === 'M' ? 1500 : 1200;
  return Math.max(piso, Math.round((t * 1.375 - 500) / 10) * 10);
}

export const aguaMeta = (peso) => (peso ? Math.round((peso * 35) / 50) * 50 : 2000);
export const proteinaMeta = (peso) => (peso ? Math.round(peso * 1.6) : 100);

// Fator de porção relativo a um cardápio base de 1600 kcal
export function porcaoFator(kcal) {
  const f = Math.min(1.6, Math.max(0.8, kcal / 1600));
  return Math.round(f * 20) / 20;
}

// Tipos de dieta: limite de carboidrato líquido por refeição e por dia
export const DIETAS = {
  normal: { nome: 'Normal', emoji: '🍽️' },
  lowcarb: { nome: 'Low carb', emoji: '🥩' },
  ceto: { nome: 'Cetogênica', emoji: '🥑' },
};
export function limiteCarb(tipo = 'normal', diabetes = false) {
  if (tipo === 'ceto') return 10;
  if (tipo === 'lowcarb') return 25;
  return diabetes ? 45 : 60;
}
export function carbDia(tipo = 'normal', kcal = 1600) {
  if (tipo === 'ceto') return 30;
  if (tipo === 'lowcarb') return 100;
  return Math.round((kcal * 0.45) / 4);
}

// Carboidrato líquido por refeição principal
export function carbStatus(carbLiq, diabetes, tipo = 'normal') {
  const ok = limiteCarb(tipo, diabetes), atencao = Math.round(ok * 1.34);
  if (carbLiq <= ok) return 'ok';
  if (carbLiq <= atencao) return 'atencao';
  return 'alto';
}

// Jejum intermitente
export const PROTOCOLOS = { '12:12': 12, '14:10': 14, '16:8': 16, '18:6': 18 };
const hm2min = (s) => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
const min2hm = (t) => { t = ((t % 1440) + 1440) % 1440; return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`; };
export function janelaAlimentar(abre = '12:00', protocolo = '16:8') {
  const jejum = PROTOCOLOS[protocolo] || 16;
  return { abre, fecha: min2hm(hm2min(abre) + (24 - jejum) * 60) };
}
export function dentroJanela(hora, abre, fecha) {
  const h = hm2min(hora), a = hm2min(abre), f = hm2min(fecha);
  return a <= f ? h >= a && h <= f : h >= a || h <= f;
}
export function faseJejum(horas) {
  if (horas < 4) return '🍽️ Digestão: o corpo ainda usa a última refeição.';
  if (horas < 12) return '📉 Insulina caindo: o corpo começa a usar as reservas.';
  if (horas < 16) return '🔥 Queima de gordura em alta.';
  return '⚡ Cetose leve: gordura é o principal combustível.';
}
export const fmtHoras = (h) => `${Math.floor(h)}h${String(Math.floor((h % 1) * 60)).padStart(2, '0')}`;

// Glicemia capilar (mg/dL) antes do exercício
export function glicemiaAlerta(v) {
  if (v == null || isNaN(v)) return null;
  if (v < 70) return { nivel: 'hipo', msg: 'Hipoglicemia: NÃO treine. Consuma 15 g de carboidrato rápido e meça de novo em 15 min.' };
  if (v < 90) return { nivel: 'baixa', msg: 'Glicemia baixa para treinar: coma 15–30 g de carboidrato antes de começar.' };
  if (v <= 250) return { nivel: 'ok', msg: 'Faixa adequada para treinar. Leve água e um lanche por perto.' };
  return { nivel: 'alta', msg: 'Glicemia alta: evite treino intenso. Hidrate-se e siga a orientação do seu médico.' };
}

export function semanaDia(diaIdx) {
  const i = Math.max(0, Math.min(TOTAL_DIAS - 1, diaIdx));
  return { semana: Math.floor(i / 7) + 1, dia: (i % 7) + 1 };
}

export function relCinturaAltura(cintura, altura) {
  if (!cintura || !altura) return null;
  return Math.round((cintura / altura) * 100) / 100;
}

// Horários entre início e fim a cada N minutos ("HH:MM")
export function horariosIntervalo(inicio, fim, intervaloMin) {
  const toMin = (s) => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
  const out = [];
  const step = Math.max(15, Number(intervaloMin) || 90);
  for (let t = toMin(inicio); t <= toMin(fim); t += step) {
    out.push(`${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`);
  }
  return out;
}

// TAF: apto se atingiu a meta (maior melhor) ou ficou abaixo dela (menor melhor)
export function tafApto(valor, meta, maior = true) {
  if (valor == null || valor === '' || meta == null || meta === '') return null;
  return maior ? Number(valor) >= Number(meta) : Number(valor) <= Number(meta);
}

// Progresso até a meta (0 a 1)
export function tafProgresso(valor, meta, maior = true, inicial = null) {
  if (valor == null || !meta) return 0;
  if (maior) return Math.max(0, Math.min(1, valor / meta));
  const ini = inicial && inicial > meta ? inicial : meta * 1.25;
  return Math.max(0, Math.min(1, (ini - valor) / (ini - meta)));
}

export const imcApto = (v, min = 18.5, max = 29.9) => (v == null ? null : v >= min && v <= max);

// Sequência de dias seguidos com treino até hoje
export function sequencia(datas, hoje) {
  const set = new Set(datas);
  let n = 0;
  let d = new Date(hoje + 'T12:00:00');
  if (!set.has(hoje)) d.setDate(d.getDate() - 1);
  while (set.has(dataKey(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
