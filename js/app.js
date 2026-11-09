import * as C from './calc.js';
import { EXERCICIOS, figura } from './exercicios.js';
import { SEMANAS, treinoDoDia, AQUECIMENTO, ALONGAMENTO, FRASES } from './plano.js';
import { ALIMENTOS, CATEGORIAS, RECEITAS, REFEICOES, calcPrato, faixaPreco, LIMITE_ECONOMICO, DICAS_ECONOMIA, LISTA_ECONOMICA } from './nutricao.js';
import { TESTES, IMC_FAIXA, treinoTAF } from './taf.js';

const $ = (s, el = document) => el.querySelector(s);
const KEY = 'casalfit:v1';
const PIDS = ['arthur', 'talita'];
const COR = { arthur: '#4da3ff', talita: '#ff5ca8' };
const hoje = () => C.dataKey();
const r0 = (n) => Math.round(n);
const r1 = (n) => Math.round(n * 10) / 10;
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone;

// ---------- Estado ----------
function perfilPadrao(id) {
  const base = { idade: '', altura: '', peso: '', pesoMeta: '', cintura: '', abdomen: '', modo: 'normal',
    horaTreino: '07:00', aguaIni: '08:00', aguaFim: '21:00', aguaInt: 90, remedios: [], glicHorarios: [],
    dieta: 'normal', jejum: { ativo: false, protocolo: '16:8', abre: '12:00' }, avisoRefeicao: true,
    refeicoes: { cafe: '07:30', almoco: '12:30', lanche: '16:00', jantar: '19:30' } };
  return id === 'arthur'
    ? { ...base, nome: 'Arthur Emanuel', sexo: 'M', diabetes: false }
    : { ...base, nome: 'Talita Valle', sexo: 'F', diabetes: true, glicHorarios: ['07:00', '14:30', '21:30'],
        remedios: [{ id: 'm1', nome: 'Medicação da diabetes', dose: 'conforme receita', horarios: ['08:00', '20:00'] }] };
}
const logPadrao = () => ({ dia: 0, treinos: [], agua: {}, peso: [], glic: [], rem: {}, jejum: { inicio: null, hist: [] } });
const novoEstado = () => ({
  v: 1, inicio: hoje(), ativo: 'arthur', aba: 'casal', dietaSub: 'cardapio', filtroRef: 'todas',
  montagem: [], pratos: [], som: true, voz: true, disparados: {}, economico: false, soBaratos: false, cardapio: {},
  taf: { arthur: { metas: {}, res: [] }, talita: { metas: {}, res: [] } }, sync: { codigo: null }, atualizado: 0,
  people: { arthur: perfilPadrao('arthur'), talita: perfilPadrao('talita') },
  logs: { arthur: logPadrao(), talita: logPadrao() },
});
function normalizar(s) {
  const n = { ...novoEstado(), ...s };
  for (const pid of PIDS) {
    n.people[pid] = { ...perfilPadrao(pid), ...n.people[pid] };
    n.logs[pid] = { ...logPadrao(), ...n.logs[pid] };
    n.taf[pid] = n.taf[pid] || { metas: {}, res: [] };
  }
  n.sync = n.sync || { codigo: null };
  return n;
}
function carregar() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY));
    if (s && s.v === 1) return normalizar(s);
  } catch {}
  return novoEstado();
}
let S = carregar();
const gravarLocal = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} };
const salvar = () => { S.atualizado = Date.now(); gravarLocal(); agendarPush(); };

const P = (pid = S.ativo) => S.people[pid];
const L = (pid = S.ativo) => S.logs[pid];
const primeiro = (pid) => esc(P(pid).nome.split(' ')[0] || pid);
const pesoAtual = (pid) => { const l = L(pid).peso; return l.length ? l[l.length - 1].kg : Number(P(pid).peso) || null; };
const perfilCalc = (pid) => { const p = P(pid); return { sexo: p.sexo, peso: pesoAtual(pid), altura: Number(p.altura), idade: Number(p.idade) }; };
const kcalMeta = (pid) => C.metaKcal(perfilCalc(pid));
const fator = (pid) => C.porcaoFator(kcalMeta(pid));
const diaCasal = () => Math.max(0, Math.min(41, C.diasEntre(S.inicio, hoje())));

// ---------- Utilidades visuais ----------
function anel(pct, cor, centro, sub = '', tam = 92) {
  const r = 38, c = 2 * Math.PI * r, v = Math.max(0, Math.min(1, pct));
  return `<svg viewBox="0 0 100 100" width="${tam}" height="${tam}" class="anel">
    <circle cx="50" cy="50" r="${r}" fill="none" stroke="currentColor" stroke-opacity=".12" stroke-width="10"/>
    <circle cx="50" cy="50" r="${r}" fill="none" stroke="${cor}" stroke-width="10" stroke-linecap="round"
      stroke-dasharray="${c * v} ${c}" transform="rotate(-90 50 50)"/>
    <text x="50" y="${sub ? 50 : 56}" text-anchor="middle" font-size="20" font-weight="800" fill="currentColor">${centro}</text>
    ${sub ? `<text x="50" y="67" text-anchor="middle" font-size="10" fill="currentColor" opacity=".7">${sub}</text>` : ''}
  </svg>`;
}

function barra(pct, cor) {
  return `<div class="barra"><i style="width:${Math.min(100, Math.max(0, pct * 100))}%;background:${cor}"></i></div>`;
}

// Prato desenhado por código: ½ vegetais, ¼ proteína, ¼ carboidrato + tigelinha de extras
function pratoSVG(itens, tam = 220) {
  const cx = 100, cy = 100, R = 70;
  const grupos = { veg: [], prot: [], carb: [], extra: [] };
  for (const [id, g] of itens) {
    const a = ALIMENTOS[id]; if (!a) continue;
    const k = ['veg', 'prot', 'carb'].includes(a.cat) ? a.cat : 'extra';
    const n = Math.max(1, Math.min(4, Math.round(g / 45)));
    for (let i = 0; i < n; i++) grupos[k].push(a.emoji);
  }
  const rad = (d) => (d * Math.PI) / 180;
  const pol = (r, d) => [cx + r * Math.cos(rad(d)), cy + r * Math.sin(rad(d))];
  const setor = (a0, a1, cor, cheio) => {
    const [x0, y0] = pol(R, a0), [x1, y1] = pol(R, a1);
    return `<path d="M${cx},${cy} L${x0},${y0} A${R},${R} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1},${y1} Z" fill="${cor}" fill-opacity="${cheio ? 0.32 : 0.08}" stroke="#fff" stroke-opacity=".7" stroke-width="2"/>`;
  };
  const emojis = (lista, a0, a1) => {
    const pos = [];
    for (const r of [22, 42, 58]) {
      const n = r === 22 ? 1 : r === 42 ? 3 : 4;
      const span = a1 - a0;
      const qtd = Math.max(1, Math.round((n * span) / 180));
      for (let i = 0; i < qtd; i++) pos.push(pol(r, a0 + (span * (i + 0.5)) / qtd));
    }
    pos.sort((p, q) => Math.hypot(q[0] - cx, q[1] - cy) - Math.hypot(p[0] - cx, p[1] - cy));
    return lista.slice(0, pos.length).map((e, i) => `<text x="${pos[i][0]}" y="${pos[i][1] + 6}" font-size="17" text-anchor="middle">${e}</text>`).join('');
  };
  // Lanche só com fruta/laticínio/oleaginosa: vira uma tigela cheia
  if (!grupos.veg.length && !grupos.prot.length && !grupos.carb.length && grupos.extra.length) {
    return `<svg viewBox="0 0 205 200" width="100%" style="max-width:${tam}px" class="prato">
      <circle cx="${cx + 3}" cy="${cy + 5}" r="88" fill="#000" opacity=".25"/>
      <circle cx="${cx}" cy="${cy}" r="88" fill="#fbfaf7"/><circle cx="${cx}" cy="${cy}" r="74" fill="#f1eee8"/>
      <circle cx="${cx}" cy="${cy}" r="${R}" fill="${CATEGORIAS.fruta.cor}" fill-opacity=".25"/>
      ${emojis(grupos.extra.concat(grupos.extra), 0, 360)}
    </svg>`;
  }
  const extra = grupos.extra.length
    ? `<circle cx="178" cy="26" r="20" fill="#fff" fill-opacity=".9" stroke="#ddd"/><circle cx="178" cy="26" r="15" fill="#f4efe6"/>
       ${grupos.extra.slice(0, 3).map((e, i) => `<text x="${170 + (i % 2) * 14}" y="${30 + (i > 1 ? 9 : 0) - (i < 2 ? 4 : 0)}" font-size="12" text-anchor="middle">${e}</text>`).join('')}`
    : '';
  return `<svg viewBox="0 0 205 200" width="100%" style="max-width:${tam}px" class="prato">
    <circle cx="${cx + 3}" cy="${cy + 5}" r="92" fill="#000" opacity=".25"/>
    <circle cx="${cx}" cy="${cy}" r="92" fill="#fbfaf7"/>
    <circle cx="${cx}" cy="${cy}" r="80" fill="#f1eee8"/>
    <circle cx="${cx}" cy="${cy}" r="${R + 2}" fill="#fff"/>
    ${setor(90, 270, CATEGORIAS.veg.cor, grupos.veg.length)}
    ${setor(270, 360, CATEGORIAS.prot.cor, grupos.prot.length)}
    ${setor(0, 90, CATEGORIAS.carb.cor, grupos.carb.length)}
    ${emojis(grupos.veg, 90, 270)}${emojis(grupos.prot, 270, 360)}${emojis(grupos.carb, 0, 90)}
    ${extra}
  </svg>`;
}

const STATUS_TXT = { ok: '✅ Carboidrato adequado', atencao: '⚠️ Carboidrato no limite', alto: '⛔ Carboidrato alto' };

// ---------- Topo e navegação ----------
function renderTopo() {
  document.documentElement.style.setProperty('--cor', COR[S.ativo]);
  $('#pessoas').innerHTML = PIDS.map((pid) =>
    `<button class="chip-pessoa ${S.ativo === pid ? 'on' : ''}" style="--c:${COR[pid]}" data-a="pessoa" data-pid="${pid}">
      <span class="av">${primeiro(pid)[0]}</span>${primeiro(pid)}</button>`).join('');
  document.querySelectorAll('.tabbar button').forEach((b) => b.classList.toggle('on', b.dataset.aba === S.aba));
}

function render() {
  renderTopo();
  $('#app').innerHTML = VIEWS[S.aba]();
}

// ---------- Tela: Casal ----------
function cardPessoa(pid) {
  const p = P(pid), l = L(pid), t = treinoDoDia(l.dia, p.modo === 'leve');
  const atual = pesoAtual(pid), ini = Number(p.peso) || null;
  const perdeu = atual && ini ? r1(ini - atual) : null;
  const agua = l.agua[hoje()] || 0, meta = C.aguaMeta(atual);
  const treinou = l.treinos.some((x) => x.data === hoje());
  const seq = C.sequencia(l.treinos.map((x) => x.data), hoje());
  const fim = l.dia >= 42;
  return `<div class="card pessoa" style="--c:${COR[pid]}">
    <div class="linha">
      ${anel(l.dia / 42, COR[pid], `${Math.min(l.dia, 42)}`, 'de 42')}
      <div class="flex1">
        <h3>${esc(p.nome)}</h3>
        <p class="mut">${fim ? '🏆 Desafio concluído!' : `Semana ${t.semana} · ${t.emoji} ${t.nome}`}</p>
        <div class="tags">
          <span class="tag">${treinou ? '✅ Treinou hoje' : '⏳ Treino pendente'}</span>
          <span class="tag">🔥 ${seq} dia${seq === 1 ? '' : 's'} seguidos</span>
          ${l.jejum?.inicio ? `<span class="tag">⏳ jejum ${C.fmtHoras((Date.now() - l.jejum.inicio) / 3600000)}</span>` : ''}
          ${perdeu != null ? `<span class="tag">${perdeu >= 0 ? '⬇️' : '⬆️'} ${Math.abs(perdeu)} kg</span>` : ''}
        </div>
      </div>
    </div>
    <div class="agua-mini">💧 ${agua} / ${meta} ml ${barra(agua / meta, COR[pid])}</div>
    <div class="botoes">
      <button class="btn" data-a="irTreino" data-pid="${pid}">${treinou ? 'Ver treino' : '▶ Treinar'}</button>
      <button class="btn sec" data-a="agua" data-pid="${pid}" data-ml="250">+250 ml 💧</button>
    </div>
  </div>`;
}

function remediosHoje(pid) {
  const p = P(pid), feitos = L(pid).rem[hoje()] || {};
  const itens = p.remedios.flatMap((r) => r.horarios.map((h) => ({ k: r.id + h, h, nome: r.nome, dose: r.dose })))
    .sort((a, b) => a.h.localeCompare(b.h));
  if (!itens.length) return '';
  return `<div class="rem-bloco"><b style="color:${COR[pid]}">${primeiro(pid)}</b>
    ${itens.map((i) => `<label class="check ${feitos[i.k] ? 'ok' : ''}"><input type="checkbox" data-a="rem" data-pid="${pid}" data-k="${i.k}" ${feitos[i.k] ? 'checked' : ''}>
      <span>${i.h} · 💊 ${esc(i.nome)} <small>${esc(i.dose)}</small></span></label>`).join('')}</div>`;
}

function viewCasal() {
  const d = diaCasal();
  const total = PIDS.reduce((s, pid) => s + L(pid).treinos.length, 0);
  const perdido = PIDS.reduce((s, pid) => { const a = pesoAtual(pid), i = Number(P(pid).peso); return s + (a && i ? i - a : 0); }, 0);
  const incompleto = PIDS.filter((pid) => !P(pid).peso || !P(pid).altura);
  const rem = PIDS.map(remediosHoje).join('');
  return `
  <section class="hero">
    <p class="mut">Projeto 6 semanas</p>
    <h1>Arthur <span class="cor-a">&</span> Talita</h1>
    <p>Dia <b>${d + 1}</b> de 42 · Semana <b>${Math.floor(d / 7) + 1}</b> — ${SEMANAS[Math.floor(d / 7)].fase}</p>
    ${barra((d + 1) / 42, 'linear-gradient(90deg,#4da3ff,#ff5ca8)')}
    <p class="frase">“${FRASES[d % FRASES.length]}”</p>
  </section>
  ${!standalone ? `<div class="card aviso">📲 <b>Instale o app:</b> ${isIOS ? 'no Safari toque em Compartilhar ⬆️ → “Adicionar à Tela de Início”.' : 'menu ⋮ do Chrome → “Instalar app” / “Adicionar à tela inicial”.'} Assim os avisos funcionam melhor.</div>` : ''}
  ${incompleto.length ? `<div class="card aviso" data-a="aba" data-aba="perfil">⚠️ Preencha peso e altura de <b>${incompleto.map(primeiro).join(' e ')}</b> no Perfil para calcular metas de água, calorias e porções. Toque aqui.</div>` : ''}
  ${PIDS.map(cardPessoa).join('')}
  <div class="card stats">
    <div><b>${total}</b><span>treinos do casal</span></div>
    <div><b>${r1(Math.max(0, perdido))} kg</b><span>perdidos juntos</span></div>
    <div><b>${r0((total / 84) * 100)}%</b><span>do desafio</span></div>
  </div>
  ${rem ? `<div class="card"><h3>💊 Remédios de hoje</h3>${rem}</div>` : ''}
  <div class="card"><h3>🍽️ Hoje no cardápio</h3>${cardapioResumo()}
    <button class="btn sec full" data-a="aba" data-aba="dieta">Ver pratos e porções</button></div>`;
}

const reais = (n) => 'R$ ' + n.toFixed(2).replace('.', ',');
const custoBase = (r) => calcPrato(r.itens).custo;
const ehEconomica = (r) => custoBase(r) <= LIMITE_ECONOMICO;
const cabeNaDieta = (r, pid = S.ativo) => { const d = P(pid).dieta || 'normal'; return d === 'normal' || calcPrato(r.itens).carbLiq <= C.limiteCarb(d, P(pid).diabetes) * 1.1; };
function cardapioDoDia() {
  const d = diaCasal(), escolha = S.cardapio[hoje()] || {};
  return Object.keys(REFEICOES).map((ref, k) => {
    const daRef = RECEITAS.filter((r) => r.ref === ref);
    const naDieta = daRef.filter((r) => cabeNaDieta(r));
    const eco = naDieta.filter((r) => !S.economico || ehEconomica(r));
    const lista = eco.length ? eco : naDieta.length ? naDieta : daRef;
    const r = lista.find((x) => x.id === escolha[ref]) || lista[(d + k) % lista.length];
    return { ref, r, lista };
  });
}
const cardapioResumo = () => `<ul class="lista-simples">${cardapioDoDia().map(({ ref, r }) =>
  `<li data-a="receita" data-id="${r.id}"><span>${REFEICOES[ref]}</span><b>${r.nome}</b></li>`).join('')}</ul>`;

// ---------- Tela: Treino ----------
function viewTreino() {
  const pid = S.ativo, p = P(pid), l = L(pid);
  if (l.dia >= 42) {
    return `<section class="hero"><h1>🏆 Parabéns, ${primeiro(pid)}!</h1>
      <p>Você concluiu as 6 semanas (${l.treinos.length} treinos). Registre o peso e as medidas finais no Perfil.</p>
      <button class="btn" data-a="recomecar">Começar novo ciclo de 6 semanas</button></section>${biblioteca()}`;
  }
  const t = treinoDoDia(l.dia, p.modo === 'leve');
  const treinou = l.treinos.some((x) => x.data === hoje());
  const ultG = l.glic[l.glic.length - 1];
  const alerta = ultG && ultG.data === hoje() ? C.glicemiaAlerta(ultG.v) : null;
  return `
  <section class="hero">
    <p class="mut">${esc(p.nome)} · Semana ${t.semana} — ${t.fase} · Dia ${t.diaSemana}/7</p>
    <h1>${t.emoji} ${t.nome}</h1>
    <p>${t.foco}</p>
    <div class="tags">
      ${t.tipo === 'treino' ? `<span class="tag">⏱️ ~${t.minutos} min</span><span class="tag">💥 ${t.work}s treino</span><span class="tag">😮‍💨 ${t.rest}s descanso</span><span class="tag">🔁 ${t.rounds} voltas</span>` : '<span class="tag">🚶 30–40 min de caminhada</span>'}
      ${p.modo === 'leve' ? '<span class="tag">🌱 Modo leve</span>' : ''}
    </div>
    <p class="mut small">${t.metaSemana}</p>
    ${treinou ? '<p class="ok-msg">✅ Treino de hoje já registrado. Mandou bem!</p>' : ''}
  </section>
  ${p.diabetes ? `<div class="card glic">
    <h3>🩸 Antes de treinar: glicemia</h3>
    <p class="mut small">Ideal entre 90 e 250 mg/dL. Tenha um lanche com carboidrato por perto.</p>
    <div class="linha"><input type="number" inputmode="numeric" id="glicTreino" placeholder="mg/dL" class="inp">
      <button class="btn" data-a="glic" data-src="glicTreino" data-mom="Antes do treino">Registrar</button></div>
    ${alerta ? `<p class="alerta ${alerta.nivel}">${ultG.v} mg/dL — ${alerta.msg}</p>` : ''}
  </div>` : ''}
  <div class="card">
    <h3>${t.tipo === 'treino' ? 'Circuito de hoje' : 'Descanso ativo'}</h3>
    ${t.tipo === 'treino' ? `<p class="mut small">Aquecimento (1 min) → ${t.rounds}× circuito → alongamento</p>` : ''}
    <div class="ex-lista">${t.exercicios.map((id, i) => `
      <button class="ex-item" data-a="verEx" data-id="${id}">
        <div class="ex-fig">${figura(id, { cor: COR[pid], tam: 120 })}</div>
        <div><b>${i + 1}. ${EXERCICIOS[id].nome}</b><span>${EXERCICIOS[id].grupo}</span>
        <small>${t.tipo === 'treino' ? `${t.work}s · toque para ver como fazer` : 'toque para ver'}</small></div>
      </button>`).join('')}</div>
    <div class="botoes">
      ${t.tipo === 'treino' ? '<button class="btn grande" data-a="iniciar">▶ Iniciar treino guiado</button>' : ''}
      <button class="btn sec" data-a="feito">${t.tipo === 'treino' ? 'Já fiz, marcar como feito' : '✅ Concluir descanso ativo'}</button>
    </div>
  </div>
  <div class="card"><h3>🗺️ Jornada de ${primeiro(pid)}</h3>
    <div class="jornada">${Array.from({ length: 6 }, (_, s) => `<div class="sem"><span>S${s + 1}</span>${Array.from({ length: 7 }, (_, d) => {
      const i = s * 7 + d, td = treinoDoDia(i);
      const cls = i < l.dia ? 'feito' : i === l.dia ? 'atual' : '';
      return `<button class="dia ${cls}" data-a="verDia" data-d="${i}" title="${td.nome}">${i < l.dia ? '✓' : td.emoji}</button>`;
    }).join('')}</div>`).join('')}</div>
  </div>
  ${biblioteca()}`;
}

const biblioteca = () => `<div class="card"><h3>📚 Biblioteca de exercícios</h3><div class="grade-ex">
  ${Object.entries(EXERCICIOS).map(([id, e]) => `<button class="mini" data-a="verEx" data-id="${id}">${figura(id, { cor: COR[S.ativo], tam: 140, animar: false })}<span>${e.nome}</span></button>`).join('')}
</div></div>`;

function modalExercicio(id) {
  const e = EXERCICIOS[id];
  abrirModal(`<h2>${e.emoji} ${e.nome}</h2><p class="mut">${e.grupo}</p>
    <div class="fig-grande">${figura(id, { cor: COR[S.ativo], tam: 360 })}</div>
    <h4>Como fazer</h4><ol>${e.como.map((c) => `<li>${c}</li>`).join('')}</ol>
    <h4>Evite</h4><ul>${e.erros.map((c) => `<li>${c}</li>`).join('')}</ul>
    <p class="dica">🌱 <b>Versão leve:</b> ${e.leve}</p>`);
}

function modalDia(i) {
  const t = treinoDoDia(i, P().modo === 'leve');
  abrirModal(`<p class="mut">Semana ${t.semana} · Dia ${t.diaSemana} — ${t.fase}</p><h2>${t.emoji} ${t.nome}</h2><p>${t.foco}</p>
    ${t.tipo === 'treino' ? `<p class="tags"><span class="tag">${t.work}s/${t.rest}s</span><span class="tag">${t.rounds} voltas</span><span class="tag">~${t.minutos} min</span></p>` : ''}
    <ol>${t.exercicios.map((id) => `<li>${EXERCICIOS[id].nome}</li>`).join('')}</ol>`);
}

// ---------- Player do treino ----------
let PL = null, wake = null, timer = null;

function montarSequencia(t) {
  const seq = [{ id: AQUECIMENTO[0], fase: 'prep', t: 10, label: 'Prepare-se' }];
  AQUECIMENTO.forEach((id) => seq.push({ id, fase: 'aquec', t: 30, label: 'Aquecimento' }));
  const n = t.exercicios.length;
  for (let r = 1; r <= t.rounds; r++) {
    t.exercicios.forEach((id, i) => {
      seq.push({ id, fase: 'work', t: t.work, label: 'Treine!', r, i });
      const ultimo = i === n - 1;
      if (!(ultimo && r === t.rounds)) {
        seq.push({ id: ultimo ? t.exercicios[0] : t.exercicios[i + 1], fase: 'rest', t: ultimo ? Math.max(45, t.rest) : t.rest,
          label: ultimo ? 'Descanso entre voltas' : 'Descanso', r, i });
      }
    });
  }
  ALONGAMENTO.forEach((id) => seq.push({ id, fase: 'along', t: 40, label: 'Alongamento' }));
  return seq;
}

function iniciarTreino() {
  const t = treinoDoDia(L().dia, P().modo === 'leve');
  const seq = montarSequencia(t);
  PL = { seq, i: 0, t, fim: Date.now() + seq[0].t * 1000, restoPausa: 0, pausado: false, inicio: Date.now(), ultSeg: -1 };
  $('#player').hidden = false;
  document.body.classList.add('travado');
  navigator.wakeLock?.request('screen').then((w) => (wake = w)).catch(() => {});
  audioCtx();
  renderPlayer();
  falar(`Vamos lá! ${t.nome}. Primeiro, ${EXERCICIOS[seq[1].id].nome}.`);
  clearInterval(timer);
  timer = setInterval(tick, 200);
}

const FASE_COR = { prep: '#ffb347', aquec: '#ffb347', work: '#3ddc84', rest: '#4da3ff', along: '#b28dff' };

function renderPlayer() {
  const s = PL.seq[PL.i], e = EXERCICIOS[s.id];
  const prox = PL.seq.slice(PL.i + 1).find((x) => x.fase !== 'rest');
  const info = s.r ? `Volta ${s.r}/${PL.t.rounds} · ${s.i + 1}/${PL.t.exercicios.length}` : s.label;
  $('#player').innerHTML = `
    <div class="pl-topo"><button class="ic" data-a="sairPlayer">✕</button><span>${info}</span>
      <button class="ic" data-a="somToggle">${S.voz ? '🔊' : '🔇'}</button></div>
    <div class="pl-prog">${barra(PL.i / PL.seq.length, FASE_COR[s.fase])}</div>
    <div class="pl-fase" style="color:${FASE_COR[s.fase]}">${s.fase === 'rest' ? `${s.label} · a seguir:` : s.label}</div>
    <h2 class="pl-nome">${e.nome}</h2>
    <div class="pl-fig">${figura(s.id, { cor: s.fase === 'rest' ? '#4da3ff' : COR[S.ativo], tam: 420 })}</div>
    <div class="pl-tempo" id="plTempo" style="--fc:${FASE_COR[s.fase]}"></div>
    <p class="pl-dica">${s.fase === 'rest' ? e.como[0] : s.id === 'pranchaLateral' && s.fase === 'work' ? 'Troque de lado na metade do tempo' : e.como[1] || e.como[0]}</p>
    <div class="pl-ctrl">
      <button class="ic g" data-a="plVoltar">⏮</button>
      <button class="ic g play" data-a="plPausa">${PL.pausado ? '▶' : '⏸'}</button>
      <button class="ic g" data-a="plPular">⏭</button>
    </div>
    ${prox && s.fase !== 'rest' ? `<p class="pl-prox">Depois: ${EXERCICIOS[prox.id].nome}</p>` : ''}`;
  PL.ultSeg = -1;
  tick(true);
}

function tick(forcar) {
  if (!PL) return;
  const s = PL.seq[PL.i];
  const resto = PL.pausado ? PL.restoPausa : Math.max(0, PL.fim - Date.now());
  const seg = Math.ceil(resto / 1000);
  if (seg !== PL.ultSeg || forcar === true) {
    PL.ultSeg = seg;
    const el = $('#plTempo');
    if (el) el.innerHTML = anel(resto / 1000 / s.t, FASE_COR[s.fase], `${seg}`, 'seg', 190);
    if (!PL.pausado && seg <= 3 && seg > 0 && forcar !== true) bip(660, 0.12);
    if (!PL.pausado && s.id === 'pranchaLateral' && s.fase === 'work' && seg === Math.floor(s.t / 2)) falar('Troque de lado');
  }
  if (!PL.pausado && resto <= 0) proximo(1);
}

function proximo(dir) {
  PL.i += dir;
  if (PL.i < 0) PL.i = 0;
  if (PL.i >= PL.seq.length) return concluirPlayer();
  const s = PL.seq[PL.i];
  PL.fim = Date.now() + s.t * 1000;
  PL.pausado = false;
  bip(s.fase === 'work' ? 990 : 520, 0.3);
  vibrar([150]);
  const nome = EXERCICIOS[s.id].nome;
  falar(s.fase === 'work' ? `${nome}. Vai!` : s.fase === 'rest' ? `Descanse. A seguir, ${nome}` : `${s.label}: ${nome}`);
  renderPlayer();
}

function fecharPlayer() {
  clearInterval(timer);
  PL = null;
  $('#player').hidden = true;
  $('#player').innerHTML = '';
  document.body.classList.remove('travado');
  wake?.release?.().catch(() => {});
  wake = null;
  speechSynthesis?.cancel?.();
}

function concluirPlayer() {
  const min = Math.max(1, r0((Date.now() - PL.inicio) / 60000));
  fecharPlayer();
  falar('Treino concluído! Parabéns!');
  bip(880, 0.2); setTimeout(() => bip(1180, 0.35), 220);
  modalQuemTreinou(min);
}

function modalQuemTreinou(min = null) {
  abrirModal(`<div class="centro"><div class="festa">🎉💪🔥</div><h2>Treino concluído!</h2>
    <p>Quem treinou? Os dois avançam um dia na jornada.</p>
    ${PIDS.map((pid) => `<label class="check grande"><input type="checkbox" name="quem" value="${pid}" checked> <span style="color:${COR[pid]}"><b>${esc(P(pid).nome)}</b> — dia ${Math.min(42, L(pid).dia + 1)} de 42</span></label>`).join('')}
    <button class="btn grande full" data-a="salvarTreino" data-min="${min ?? ''}">Salvar e avançar ✅</button></div>`);
}

function salvarTreino(min) {
  const quem = [...document.querySelectorAll('input[name=quem]:checked')].map((i) => i.value);
  if (!quem.length) return toast('Marque quem treinou');
  quem.forEach((pid) => {
    const l = L(pid);
    if (l.dia >= 42) return;
    l.treinos.push({ dia: l.dia, data: hoje(), min: min ? Number(min) : treinoDoDia(l.dia).minutos });
    l.dia += 1;
  });
  salvar(); fecharModal(); render();
  toast(`Boa! ${quem.map(primeiro).join(' e ')} avançaram na jornada 🚀`);
}

// ---------- Áudio, voz, vibração ----------
let AC = null;
const audioCtx = () => { try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); AC.resume?.(); } catch {} return AC; };
function bip(freq = 880, dur = 0.15) {
  if (!S.som) return;
  const ac = audioCtx(); if (!ac) return;
  const o = ac.createOscillator(), g = ac.createGain();
  o.frequency.value = freq; o.type = 'sine';
  g.gain.setValueAtTime(0.25, ac.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + dur);
  o.connect(g).connect(ac.destination); o.start(); o.stop(ac.currentTime + dur);
}
function falar(txt) {
  if (!S.voz || !('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(txt);
  u.lang = 'pt-BR'; u.rate = 1.05;
  const v = speechSynthesis.getVoices().find((x) => x.lang?.toLowerCase().startsWith('pt'));
  if (v) u.voice = v;
  speechSynthesis.speak(u);
}
const vibrar = (p) => navigator.vibrate?.(p);

// ---------- Tela: Dieta ----------
function viewDieta() {
  const pid = S.ativo, p = P(pid), kcal = kcalMeta(pid), f = fator(pid);
  const sub = S.dietaSub;
  return `
  <section class="hero">
    <p class="mut">Plano alimentar de ${primeiro(pid)}</p>
    <h1>🍽️ Prato do Casal</h1>
    <div class="metas">
      <div><b>${kcal}</b><span>kcal/dia</span></div>
      <div><b>${C.proteinaMeta(pesoAtual(pid))} g</b><span>proteína/dia</span></div>
      <div><b>até ${C.limiteCarb(p.dieta, p.diabetes)} g</b><span>carbo/refeição</span></div>
      <div><b>${C.carbDia(p.dieta, kcal)} g</b><span>carbo/dia (${C.DIETAS[p.dieta].nome})</span></div>
      <div><b>×${f.toFixed(2)}</b><span>fator porção</span></div>
    </div>
    ${p.diabetes ? '<p class="dica">🩸 <b>Talita (diabetes):</b> prefira carboidratos integrais e de baixo índice glicêmico, comece a refeição pelos vegetais, depois proteína e por último o carboidrato. Não pule refeições e siga a orientação do seu médico/nutricionista.</p>' : ''}
  </section>
  ${dietaSeletor(pid)}
  <label class="check eco"><input type="checkbox" data-g="economico" ${S.economico ? 'checked' : ''}> <span>💰 <b>Modo econômico</b> — só pratos baratos (até ${reais(LIMITE_ECONOMICO)} por prato)</span></label>
  <div class="seg">
    ${[['cardapio', '📅 Cardápio do dia'], ['receitas', '📖 Receitas'], ['montar', '🧩 Montar prato']].map(([k, n]) =>
      `<button class="${sub === k ? 'on' : ''}" data-a="dietaSub" data-s="${k}">${n}</button>`).join('')}
  </div>
  ${sub === 'cardapio' ? dietaCardapio() : sub === 'receitas' ? dietaReceitas() : dietaMontar()}`;
}

function cardReceita(r) {
  const pid = S.ativo, t = calcPrato(r.itens, fator(pid));
  const st = C.carbStatus(t.carbLiq, P(pid).diabetes, P(pid).dieta);
  return `<button class="card receita" data-a="receita" data-id="${r.id}">
    <div class="rec-prato">${pratoSVG(r.itens, 150)}</div>
    <div class="flex1"><small class="mut">${REFEICOES[r.ref]}</small><h4>${r.nome}</h4>
      <div class="tags"><span class="tag preco">💰 ${reais(t.custo)}</span><span class="tag">${r0(t.kcal)} kcal</span><span class="tag">${r0(t.g)} g</span><span class="tag st-${st}">${r0(t.carbLiq)} g carbo</span>
      ${r.tags.map((x) => `<span class="tag fraca">${x}</span>`).join('')}</div></div>
  </button>`;
}

function dietaCardapio() {
  const cd = cardapioDoDia();
  const tot = (pid) => cd.reduce((s, { r }) => { const t = calcPrato(r.itens, fator(pid)); s.kcal += t.kcal; s.carb += t.carbLiq; s.prot += t.prot; s.custo += t.custo; return s; }, { kcal: 0, carb: 0, prot: 0, custo: 0 });
  const custoCasal = PIDS.reduce((s, pid) => s + tot(pid).custo, 0);
  return `<div class="card"><h3>📅 Dieta de hoje</h3>
    <p class="mut small">Escolha o prato de cada refeição na lista. O total do dia é recalculado com as porções de cada um.</p>
    ${PIDS.map((pid) => { const t = tot(pid), meta = kcalMeta(pid); return `<p><b style="color:${COR[pid]}">${primeiro(pid)}:</b> ${r0(t.kcal)} de ${meta} kcal · ${r0(t.carb)} g carbo líquido · ${r0(t.prot)} g proteína</p>${barra(t.kcal / meta, COR[pid])}`; }).join('')}
    <p class="custo">💰 Custo estimado do dia para o casal: <b>${reais(custoCasal)}</b> · ≈ ${reais(custoCasal * 30)}/mês</p>
    <p class="mut small">Completem com água, café/chá sem açúcar e vegetais à vontade.</p></div>
    ${cd.map(({ ref, r, lista }) => `<div class="ref-bloco"><div class="ref-topo"><b>${REFEICOES[ref]}</b>
      <select class="inp" data-f="cardSel" data-ref="${ref}">${lista.map((x) => `<option value="${x.id}" ${x.id === r.id ? 'selected' : ''}>${x.nome} (${reais(custoBase(x))})</option>`).join('')}</select></div>
      ${cardReceita(r)}</div>`).join('')}
    <details class="card" ${S.economico ? 'open' : ''}><summary><b>💡 Comer bem gastando pouco</b></summary>
      <ul class="dicas-eco">${DICAS_ECONOMIA.map(([e, t]) => `<li><span>${e}</span>${t}</li>`).join('')}</ul>
      <h4>🛒 Lista de compras econômica da semana (2 pessoas)</h4>
      <table class="tabela"><tbody>${LISTA_ECONOMICA.map(([i, q, v]) => `<tr><td>${i}</td><td>${q}</td><td>${reais(v)}</td></tr>`).join('')}</tbody>
      <tfoot><tr><td><b>Total estimado</b></td><td></td><td><b>${reais(LISTA_ECONOMICA.reduce((s, x) => s + x[2], 0))}</b></td></tr></tfoot></table>
      <p class="mut small">Preços médios estimados; variam por cidade e época. Compare no mercado e na feira.</p>
    </details>`;
}

function dietaReceitas() {
  const f = S.filtroRef;
  const lista = RECEITAS.filter((r) => f === 'todas' || (f === 'eco' ? ehEconomica(r) : f === 'dieta' ? cabeNaDieta(r) : r.ref === f));
  return `<div class="chips">${[['todas', 'Todas'], ['dieta', '🥑 Na minha dieta'], ['eco', '💰 Econômicas'], ...Object.entries(REFEICOES)].map(([k, n]) =>
    `<button class="chip ${f === k ? 'on' : ''}" data-a="filtroRef" data-f="${k}">${n}</button>`).join('')}</div>
    ${lista.map(cardReceita).join('')}`;
}

function modalReceita(id) {
  const r = RECEITAS.find((x) => x.id === id);
  const fs = Object.fromEntries(PIDS.map((pid) => [pid, fator(pid)]));
  const tots = Object.fromEntries(PIDS.map((pid) => [pid, calcPrato(r.itens, fs[pid])]));
  abrirModal(`<small class="mut">${REFEICOES[r.ref]}</small><h2>${r.nome}</h2>
    <div class="centro">${pratoSVG(r.itens, 300)}</div>
    <div class="legenda">${['veg', 'prot', 'carb'].map((c) => `<span><i style="background:${CATEGORIAS[c].cor}"></i>${CATEGORIAS[c].nome} ${CATEGORIAS[c].dica}</span>`).join('')}</div>
    <table class="tabela"><thead><tr><th>Ingrediente</th>${PIDS.map((pid) => `<th style="color:${COR[pid]}">${primeiro(pid)}</th>`).join('')}</tr></thead>
    <tbody>${r.itens.map(([a, g]) => `<tr><td>${ALIMENTOS[a].emoji} ${ALIMENTOS[a].nome}<br><small class="mut">${ALIMENTOS[a].medida}</small></td>
      ${PIDS.map((pid) => `<td><b>${r0(g * fs[pid])} g</b></td>`).join('')}</tr>`).join('')}</tbody>
    <tfoot>
      <tr><td>Peso do prato</td>${PIDS.map((pid) => `<td>${r0(tots[pid].g)} g</td>`).join('')}</tr>
      <tr><td>Calorias</td>${PIDS.map((pid) => `<td>${r0(tots[pid].kcal)} kcal</td>`).join('')}</tr>
      <tr><td>Carboidrato (líquido)</td>${PIDS.map((pid) => `<td>${r0(tots[pid].carb)} g (${r0(tots[pid].carbLiq)} g)</td>`).join('')}</tr>
      <tr><td>Proteína</td>${PIDS.map((pid) => `<td>${r0(tots[pid].prot)} g</td>`).join('')}</tr>
      <tr><td>Fibras</td>${PIDS.map((pid) => `<td>${r1(tots[pid].fibra)} g</td>`).join('')}</tr>
      <tr><td>💰 Custo estimado</td>${PIDS.map((pid) => `<td>${reais(tots[pid].custo)}</td>`).join('')}</tr>
    </tfoot></table>
    ${PIDS.filter((pid) => P(pid).diabetes).map((pid) => `<p class="alerta ${C.carbStatus(tots[pid].carbLiq, true, P(pid).dieta) === 'ok' ? 'ok' : 'baixa'}">${primeiro(pid)}: ${STATUS_TXT[C.carbStatus(tots[pid].carbLiq, true, P(pid).dieta)]} para diabetes.</p>`).join('')}
    <h4>👩‍🍳 Modo de preparo</h4><p>${r.preparo}</p>
    <button class="btn sec full" data-a="usarReceita" data-id="${r.id}">Abrir no montador de prato</button>`);
}

function dietaMontar() {
  const pid = S.ativo, itens = S.montagem, t = calcPrato(itens);
  const st = C.carbStatus(t.carbLiq, P(pid).diabetes, P(pid).dieta);
  const gCat = (c) => itens.filter(([id]) => ALIMENTOS[id]?.cat === c).reduce((s, [, g]) => s + Number(g), 0);
  const veg = gCat('veg'), prot = gCat('prot'), carb = gCat('carb');
  const checks = [
    [veg >= prot + carb && veg > 0, 'Metade do prato com vegetais'],
    [prot > 0, 'Tem proteína (saciedade e músculo)'],
    [st === 'ok', `Carboidrato até ${C.limiteCarb(P(pid).dieta, P(pid).diabetes)} g (${C.DIETAS[P(pid).dieta].nome}${P(pid).diabetes ? ', diabetes' : ''})`],
    [t.fibra >= 8, 'Pelo menos 8 g de fibras'],
  ];
  return `<div class="card">
    <h3>🧩 Montador de prato</h3>
    <p class="mut small">Escolha os alimentos e ajuste os gramas. O prato é desenhado na hora seguindo o método do prato: ½ vegetais, ¼ proteína, ¼ carboidrato.</p>
    <div class="centro">${pratoSVG(itens, 280)}</div>
    <div class="metas pequenas"><div><b>${r0(t.g)} g</b><span>peso</span></div><div><b>${r0(t.kcal)}</b><span>kcal</span></div>
      <div><b class="st-${st}">${r0(t.carbLiq)} g</b><span>carbo líq.</span></div><div><b>${r0(t.prot)} g</b><span>proteína</span></div><div><b>${reais(t.custo)}</b><span>custo</span></div></div>
    <ul class="checks">${checks.map(([ok, txt]) => `<li class="${ok ? 'ok' : ''}">${ok ? '✅' : '⬜'} ${txt}</li>`).join('')}</ul>
    ${itens.length ? `<div class="montagem">${itens.map(([id, g], i) => `<div class="m-item"><span>${ALIMENTOS[id].emoji} ${ALIMENTOS[id].nome}</span>
      <input type="number" inputmode="numeric" class="inp g" value="${g}" data-f="mg" data-i="${i}"> g
      <button class="ic" data-a="mRem" data-i="${i}">🗑️</button></div>`).join('')}</div>` : ''}
    <label class="check"><input type="checkbox" data-g="soBaratos" ${S.soBaratos ? 'checked' : ''}> <span>💰 Mostrar só alimentos baratos ($ = até R$ 20/kg)</span></label>
    <div class="add-ali">${Object.entries(CATEGORIAS).map(([c, info]) => `
      <details><summary><i style="background:${info.cor}"></i>${info.nome} <small class="mut">${info.dica}</small></summary>
      <div class="ali-grade">${Object.entries(ALIMENTOS).filter(([, a]) => a.cat === c && (!S.soBaratos || faixaPreco(a.rs) === '$')).map(([id, a]) =>
        `<button class="chip" data-a="mAdd" data-id="${id}">${a.emoji} ${a.nome}<small>${a.medida} · <b class="pr">${faixaPreco(a.rs)}</b></small></button>`).join('')}</div></details>`).join('')}</div>
    <div class="botoes">
      <button class="btn" data-a="mSalvar" ${itens.length ? '' : 'disabled'}>💾 Salvar prato</button>
      <button class="btn sec" data-a="mLimpar">Limpar</button>
    </div>
  </div>
  ${S.pratos.length ? `<div class="card"><h3>⭐ Pratos salvos</h3>${S.pratos.map((pr, i) => {
    const tt = calcPrato(pr.itens);
    return `<div class="m-item"><span>${esc(pr.nome)} <small class="mut">${r0(tt.kcal)} kcal · ${r0(tt.carbLiq)} g carbo</small></span>
      <button class="ic" data-a="mCarregar" data-i="${i}">📂</button><button class="ic" data-a="mDel" data-i="${i}">🗑️</button></div>`;
  }).join('')}</div>` : ''}`;
}

// ---------- Tela: Diário (água, remédios, glicemia, avisos) ----------
function agenda(pid) {
  const p = P(pid), nome = primeiro(pid), meta = C.aguaMeta(pesoAtual(pid));
  const it = [];
  if (p.horaTreino) it.push({ k: 'treino', hora: p.horaTreino, ic: '🏋️', tit: `Hora do treino, ${nome}!`, corpo: 'Abra o Casal Fit e faça o treino do dia. Bora trincar esse abdômen!' });
  C.horariosIntervalo(p.aguaIni || '08:00', p.aguaFim || '21:00', p.aguaInt).forEach((h) =>
    it.push({ k: 'agua' + h, hora: h, ic: '💧', tit: `Beba água, ${nome}`, corpo: `Um copo de 250 ml agora. Meta do dia: ${meta} ml.` }));
  p.remedios.forEach((r) => r.horarios.forEach((h) =>
    it.push({ k: 'rem' + r.id + h, hora: h, ic: '💊', tit: `${r.nome} — ${nome}`, corpo: r.dose ? `Dose: ${r.dose}` : 'Hora do remédio' })));
  if (p.diabetes) (p.glicHorarios || []).forEach((h) =>
    it.push({ k: 'glic' + h, hora: h, ic: '🩸', tit: `Medir a glicemia, ${nome}`, corpo: 'Faça a medição na ponta do dedo e registre o valor no app (aba Diário).' }));
  const jan = p.jejum?.ativo ? C.janelaAlimentar(p.jejum.abre, p.jejum.protocolo) : null;
  if (p.avisoRefeicao !== false) Object.entries(p.refeicoes || {}).forEach(([ref, h]) => {
    if (!h || (jan && !C.dentroJanela(h, jan.abre, jan.fecha))) return;
    it.push({ k: 'ref' + ref, hora: h, ic: '🍽️', tit: `Hora do ${NOME_REF[ref]}, ${nome}!`, corpo: 'Veja o prato do dia no app. Comece pelos vegetais, depois a proteína.' });
  });
  if (jan) {
    it.push({ k: 'jjabre', hora: jan.abre, ic: '🟢', tit: `Janela de comer aberta, ${nome}`, corpo: `Pode comer até ${jan.fecha}.` });
    it.push({ k: 'jjfecha', hora: jan.fecha, ic: '⏳', tit: `Começa o jejum, ${nome}`, corpo: `Jejum até ${jan.abre}. Água, café e chá sem açúcar liberados.` });
  }
  return it.sort((a, b) => a.hora.localeCompare(b.hora));
}

function copoSVG(pct, cor) {
  const h = 100 * Math.min(1, pct);
  return `<svg viewBox="0 0 80 120" width="80" height="120"><defs><clipPath id="copo"><path d="M10 8 L70 8 L62 112 L18 112 Z"/></clipPath></defs>
    <rect x="0" y="${112 - h}" width="80" height="${h + 4}" fill="${cor}" opacity=".85" clip-path="url(#copo)"/>
    <path d="M10 8 L70 8 L62 112 L18 112 Z" fill="none" stroke="currentColor" stroke-opacity=".5" stroke-width="3" stroke-linejoin="round"/></svg>`;
}

function viewDiario() {
  const pid = S.ativo, p = P(pid), l = L(pid);
  const agua = l.agua[hoje()] || 0, meta = C.aguaMeta(pesoAtual(pid));
  const perm = 'Notification' in window ? Notification.permission : 'indisponivel';
  const agora = new Date().toTimeString().slice(0, 5);
  const ag = agenda(pid);
  return `
  <section class="hero"><p class="mut">Dia a dia de ${esc(p.nome)}</p><h1>📋 Diário</h1></section>
  <div class="card agua">
    <h3>💧 Água hoje</h3>
    <div class="linha">${copoSVG(agua / meta, COR[pid])}
      <div class="flex1"><p class="grandao">${agua} <small>/ ${meta} ml</small></p>${barra(agua / meta, COR[pid])}
        <p class="mut small">${agua >= meta ? '🎉 Meta batida!' : `Faltam ${meta - agua} ml (~${Math.ceil((meta - agua) / 250)} copos)`}</p></div></div>
    <div class="botoes">${[200, 250, 500].map((ml) => `<button class="btn sec" data-a="agua" data-pid="${pid}" data-ml="${ml}">+${ml}</button>`).join('')}
      <button class="btn sec" data-a="agua" data-pid="${pid}" data-ml="-250">−250</button></div>
  </div>
  ${p.remedios.length ? `<div class="card"><h3>💊 Remédios de hoje</h3>${remediosHoje(pid)}</div>` : ''}
  ${cardJejum(pid)}
  ${p.diabetes ? `<div class="card glic"><h3>🩸 Glicemia</h3>
    <label class="small mut">⏰ Alarmes para medir a glicemia (horários separados por vírgula)<input class="inp" data-gh="1" value="${(p.glicHorarios || []).join(', ')}" placeholder="07:00, 14:30, 21:30"></label>
    <p class="small">Hoje: ${(p.glicHorarios || []).map((h) => { const feito = l.glic.some((g) => g.data === hoje() && Math.abs((Number(g.hora.slice(0, 2)) * 60 + Number(g.hora.slice(3))) - (Number(h.slice(0, 2)) * 60 + Number(h.slice(3)))) <= 90); return `<span class="tag ${feito ? 'st-ok' : ''}">${feito ? '✅' : '⏰'} ${h}</span>`; }).join(' ') || '<span class="mut">sem alarmes</span>'}</p>
    <div class="linha wrap"><input type="number" inputmode="numeric" id="glicDia" class="inp" placeholder="mg/dL">
      <select id="glicMom" class="inp">${['Jejum', 'Antes do treino', 'Depois do treino', '2h após almoço', '2h após jantar', 'Antes de dormir'].map((m) => `<option>${m}</option>`).join('')}</select>
      <button class="btn" data-a="glic" data-src="glicDia">Registrar</button></div>
    ${l.glic.length ? `<ul class="lista-simples">${l.glic.slice(-8).reverse().map((g) => { const a = C.glicemiaAlerta(g.v);
      return `<li><span>${g.data.split('-').reverse().slice(0, 2).join('/')} ${g.hora} · ${esc(g.mom)}</span><b class="nv-${a.nivel}">${g.v} mg/dL</b></li>`; }).join('')}</ul>` : '<p class="mut small">Nenhum registro ainda.</p>'}
  </div>` : ''}
  <div class="card">
    <h3>⏰ Alarmes e avisos</h3>
    ${perm === 'granted' ? '<p class="ok-msg">✅ Notificações ativadas neste aparelho.</p>'
      : perm === 'indisponivel' ? `<p class="dica">${isIOS ? 'No iPhone, instale o app na Tela de Início (Safari → Compartilhar → Adicionar à Tela de Início) e abra por lá para ativar notificações.' : 'Este navegador não suporta notificações.'}</p>`
      : '<button class="btn full" data-a="permissao">🔔 Ativar notificações</button>'}
    <p class="small">⏰ <b>Alarmes no celular:</b> os botões abaixo colocam no calendário do celular todos os horários — remédios, glicemia, água, refeições, jejum e treino — com alarme que toca <b>mesmo com o celular bloqueado e o app fechado</b>. Baixe de novo sempre que mudar algum horário.</p>
    <p class="mut small">Com o app aberto ou em segundo plano, os avisos também aparecem como notificação.</p>
    <div class="botoes"><button class="btn" data-a="ics" data-quem="${pid}">📅 Lembretes de ${primeiro(pid)}</button>
      <button class="btn sec" data-a="ics" data-quem="ambos">📅 Do casal</button></div>
    <h4>Agenda de hoje</h4>
    <ul class="agenda">${ag.map((a) => `<li class="${a.hora < agora ? 'passou' : ''}"><b>${a.hora}</b> ${a.ic} ${esc(a.tit)}</li>`).join('')}</ul>
  </div>
  <div class="card">
    <h3>⚙️ Horários de ${primeiro(pid)}</h3>
    <div class="form">
      <label>🏋️ Horário do treino<input type="time" class="inp" data-f="horaTreino" value="${p.horaTreino}"></label>
      <label>💧 Água — começa<input type="time" class="inp" data-f="aguaIni" value="${p.aguaIni}"></label>
      <label>💧 Água — termina<input type="time" class="inp" data-f="aguaFim" value="${p.aguaFim}"></label>
      <label>💧 Lembrar a cada (min)<input type="number" class="inp" data-f="aguaInt" value="${p.aguaInt}" min="15" step="15"></label>
    </div>
    <h4>🍽️ Horários das refeições</h4>
    <label class="check"><input type="checkbox" data-f="avisoRefeicao" ${p.avisoRefeicao !== false ? 'checked' : ''}> <span>Avisar na hora de comer${p.jejum?.ativo ? ' (só dentro da janela do jejum)' : ''}</span></label>
    <div class="form">${Object.entries(REFEICOES).map(([k, n]) => `<label>${n}<input type="time" class="inp" data-refh="${k}" value="${p.refeicoes?.[k] || ''}"></label>`).join('')}</div>
    <h4>💊 Remédios</h4>
    ${p.remedios.map((r, i) => `<div class="m-item"><span><b>${esc(r.nome)}</b> <small class="mut">${esc(r.dose)} · ${r.horarios.join(', ')}</small></span><button class="ic" data-a="remDel" data-i="${i}">🗑️</button></div>`).join('') || '<p class="mut small">Nenhum remédio cadastrado.</p>'}
    <div class="form">
      <label>Nome<input id="remNome" class="inp" placeholder="Ex.: Metformina"></label>
      <label>Dose<input id="remDose" class="inp" placeholder="Ex.: 500 mg após o café"></label>
      <label>Horários<input id="remHoras" class="inp" placeholder="08:00, 20:00"></label>
    </div>
    <button class="btn sec full" data-a="remAdd">+ Adicionar remédio</button>
  </div>
  <div class="card"><h3>🔊 Som do treino</h3>
    <label class="check"><input type="checkbox" data-g="som" ${S.som ? 'checked' : ''}> Bipes de contagem</label>
    <label class="check"><input type="checkbox" data-g="voz" ${S.voz ? 'checked' : ''}> Voz guia (fala o exercício)</label></div>`;
}

// ---------- Tela: Perfil ----------
function graficoPeso(pid) {
  const p = P(pid), l = L(pid);
  const pts = [...(p.peso ? [{ data: S.inicio, kg: Number(p.peso) }] : []), ...l.peso];
  if (pts.length < 2) return '<p class="mut small">Registre o peso semanalmente para ver o gráfico de evolução.</p>';
  const meta = Number(p.pesoMeta) || null;
  const vals = pts.map((x) => x.kg).concat(meta ? [meta] : []);
  const min = Math.min(...vals) - 1, max = Math.max(...vals) + 1;
  const W = 320, H = 150, pad = 28;
  const x = (i) => pad + (i * (W - pad * 1.5)) / (pts.length - 1);
  const y = (v) => 10 + ((max - v) * (H - 30)) / (max - min);
  const d = pts.map((pt, i) => `${i ? 'L' : 'M'}${x(i)},${y(pt.kg)}`).join(' ');
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" class="grafico">
    ${meta ? `<line x1="${pad}" x2="${W - 6}" y1="${y(meta)}" y2="${y(meta)}" stroke="#3ddc84" stroke-dasharray="5 5"/><text x="${W - 8}" y="${y(meta) - 4}" text-anchor="end" font-size="10" fill="#3ddc84">meta ${meta} kg</text>` : ''}
    <path d="${d} L${x(pts.length - 1)},${H - 18} L${x(0)},${H - 18} Z" fill="${COR[pid]}" opacity=".12"/>
    <path d="${d}" fill="none" stroke="${COR[pid]}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
    ${pts.map((pt, i) => `<circle cx="${x(i)}" cy="${y(pt.kg)}" r="4" fill="${COR[pid]}"/><text x="${x(i)}" y="${y(pt.kg) - 8}" font-size="9" text-anchor="middle" fill="currentColor">${pt.kg}</text>`).join('')}
    <text x="${pad}" y="${H - 4}" font-size="9" fill="currentColor" opacity=".6">${pts[0].data.split('-').reverse().slice(0, 2).join('/')}</text>
    <text x="${W - 6}" y="${H - 4}" font-size="9" text-anchor="end" fill="currentColor" opacity=".6">${pts[pts.length - 1].data.split('-').reverse().slice(0, 2).join('/')}</text>
  </svg>`;
}

function viewPerfil() {
  const pid = S.ativo, p = P(pid), l = L(pid), pc = perfilCalc(pid);
  const im = C.imc(pc.peso, pc.altura), rc = C.relCinturaAltura(Number(l.peso.at(-1)?.cintura || p.cintura), pc.altura);
  const campo = (f, rot, tipo = 'number', extra = '') => `<label>${rot}<input type="${tipo}" class="inp" data-f="${f}" value="${esc(p[f])}" ${tipo === 'number' ? 'inputmode="decimal" step="0.1"' : ''} ${extra}></label>`;
  return `
  <section class="hero"><p class="mut">Perfil</p><h1 style="color:${COR[pid]}">${esc(p.nome)}</h1></section>
  <div class="card"><h3>📏 Dados</h3><div class="form">
    ${campo('nome', 'Nome', 'text')}
    ${campo('idade', 'Idade')}
    <label>Sexo<select class="inp" data-f="sexo"><option value="F" ${p.sexo === 'F' ? 'selected' : ''}>Feminino</option><option value="M" ${p.sexo === 'M' ? 'selected' : ''}>Masculino</option></select></label>
    ${campo('altura', 'Altura (cm)')}
    ${campo('peso', 'Peso inicial (kg)')}
    ${campo('pesoMeta', 'Peso meta (kg)')}
    ${campo('cintura', 'Cintura inicial (cm)')}
    ${campo('abdomen', 'Abdômen inicial (cm)')}
  </div>
  <label class="check"><input type="checkbox" data-f="diabetes" ${p.diabetes ? 'checked' : ''}> Tenho diabetes (ativa glicemia e alertas de carboidrato)</label>
  <label class="check"><input type="checkbox" data-f="modo" ${p.modo === 'leve' ? 'checked' : ''}> Modo leve (menos tempo de esforço, mais descanso)</label>
  </div>
  <div class="card"><h3>📊 Indicadores</h3><div class="metas">
    <div><b>${im ?? '—'}</b><span>IMC · ${C.classeImc(im)}</span></div>
    <div><b>${C.tmb(pc) ?? '—'}</b><span>kcal em repouso</span></div>
    <div><b>${kcalMeta(pid)}</b><span>kcal/dia p/ emagrecer</span></div>
    <div><b>${C.aguaMeta(pc.peso)} ml</b><span>água/dia</span></div>
    <div><b>${rc ?? '—'}</b><span>cintura/altura ${rc ? (rc < 0.5 ? '✅' : '⚠️ ideal < 0,5') : ''}</span></div>
    <div><b>${pc.peso ?? '—'} kg</b><span>peso atual</span></div>
  </div><p class="mut small">Estimativas gerais. Ajustes de dieta e remédios sempre com médico/nutricionista.</p></div>
  <div class="card"><h3>⚖️ Evolução</h3>${graficoPeso(pid)}
    <div class="form">
      <label>Peso hoje (kg)<input id="regPeso" type="number" inputmode="decimal" step="0.1" class="inp"></label>
      <label>Cintura (cm)<input id="regCint" type="number" inputmode="decimal" step="0.5" class="inp"></label>
      <label>Abdômen (cm)<input id="regAbd" type="number" inputmode="decimal" step="0.5" class="inp"></label>
    </div>
    <button class="btn full" data-a="regPeso">Registrar medidas</button>
    ${l.peso.length ? `<ul class="lista-simples">${l.peso.slice().reverse().map((x, i) => `<li><span>${x.data.split('-').reverse().join('/')}</span><b>${x.kg} kg ${x.cintura ? `· cint. ${x.cintura}` : ''} ${x.abd ? `· abd. ${x.abd}` : ''}</b><button class="ic" data-a="pesoDel" data-i="${l.peso.length - 1 - i}">🗑️</button></li>`).join('')}</ul>` : ''}
  </div>
  ${cardSync()}
  <div class="card"><h3>🗓️ Projeto do casal</h3>
    <label>Data de início do desafio<input type="date" class="inp" data-g="inicio" value="${S.inicio}"></label>
    <p class="mut small">Os dados ficam salvos neste aparelho. Use o backup para passar para o celular do parceiro(a) ou guardar uma cópia.</p>
    <div class="botoes"><button class="btn sec" data-a="exportar">⬇️ Exportar backup</button>
      <label class="btn sec">⬆️ Importar backup<input type="file" accept="application/json,.json" id="importar" hidden></label></div>
    <button class="btn perigo full" data-a="resetar">Zerar progresso de ${primeiro(pid)}</button>
  </div>`;
}

// ---------- Banco de dados online (Netlify Blobs) ----------
const API = '/api/dados';
const LOCAIS = ['ativo', 'aba', 'dietaSub', 'filtroRef', 'som', 'voz', 'disparados', 'montagem', 'sync'];
let syncOk = null, syncPronto = false, pushT = null, syncMsg = '';
async function syncPing() {
  try { const r = await fetch(`${API}?ping=1`, { cache: 'no-store' }); syncOk = r.ok && (await r.json()).ok === true; }
  catch { syncOk = false; }
  return syncOk;
}
function compartilhado() { const o = { ...S }; for (const k of LOCAIS) delete o[k]; return o; }
async function syncPuxar(forcar = false) {
  if (!syncOk || !S.sync.codigo) return;
  try {
    const r = await fetch(`${API}?codigo=${encodeURIComponent(S.sync.codigo)}`, { cache: 'no-store' });
    if (!r.ok) throw new Error(r.status);
    const d = await r.json();
    syncPronto = true;
    if (d && d.v === 1 && (forcar || (d.atualizado || 0) > (S.atualizado || 0))) {
      const loc = Object.fromEntries(LOCAIS.map((k) => [k, S[k]]));
      S = normalizar({ ...d, ...loc });
      gravarLocal();
      if (!PL && $('#modal').hidden) render();
    } else if (!d || (d.atualizado || 0) < (S.atualizado || 0)) {
      await syncEnviar();
      return;
    }
    syncMsg = `✅ Sincronizado às ${new Date().toTimeString().slice(0, 5)}`;
  } catch { syncMsg = '⚠️ Sem conexão com o banco — dados salvos no celular.'; }
  atualizarSyncStatus();
}
function agendarPush() {
  if (!syncOk || !syncPronto || !S.sync?.codigo) return;
  clearTimeout(pushT);
  pushT = setTimeout(syncEnviar, 1200);
}
async function syncEnviar() {
  if (!syncOk || !S.sync?.codigo) return;
  try {
    const r = await fetch(`${API}?codigo=${encodeURIComponent(S.sync.codigo)}`, {
      method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(compartilhado()),
    });
    if (!r.ok) throw new Error(r.status);
    syncMsg = `✅ Salvo na nuvem às ${new Date().toTimeString().slice(0, 5)}`;
  } catch { syncMsg = '⚠️ Sem conexão — sincroniza quando a internet voltar.'; }
  atualizarSyncStatus();
}
function atualizarSyncStatus() { const el = $('#syncStatus'); if (el) el.textContent = syncMsg; }
const novoCodigo = () => 'casal-' + Array.from(crypto.getRandomValues(new Uint8Array(10)), (b) => 'abcdefghjkmnpqrstuvwxyz23456789'[b % 31]).join('');

async function iniciarSync() {
  const q = new URLSearchParams(location.search).get('casal');
  await syncPing();
  if (!syncOk) { if (S.aba === 'perfil') render(); return; }
  if (q && /^[a-z0-9-]{8,64}$/i.test(q)) {
    S.sync.codigo = q.toLowerCase(); gravarLocal();
    history.replaceState(null, '', location.pathname);
    await syncPuxar(true);
    toast('☁️ Conectado ao banco do casal!');
  } else if (!S.sync.codigo) {
    S.sync.codigo = novoCodigo(); gravarLocal(); syncPronto = true;
    await syncEnviar();
  } else {
    await syncPuxar();
  }
  if (S.aba === 'perfil' && $('#modal').hidden) render();
}

function cardSync() {
  const titulo = '<h3>☁️ Banco de dados do casal</h3>';
  if (syncOk === null) return `<div class="card">${titulo}<p class="mut small">Verificando conexão…</p></div>`;
  if (syncOk === false) return `<div class="card">${titulo}
    <p class="small">Neste endereço o banco online não está ligado (site publicado arrastando o ZIP, pela Vercel ou sem internet). Os dados estão salvos <b>neste celular</b> e tudo funciona normalmente.</p>
    <p class="mut small">Para ligar o banco automático que sincroniza os 2 celulares, publique pelo GitHub no Netlify — ele cria o banco sozinho. Enquanto isso, use Exportar/Importar backup.</p></div>`;
  const link = `${location.origin}${location.pathname}?casal=${S.sync.codigo}`;
  return `<div class="card">${titulo}
    <p class="small">Banco online <b>ativo</b>: tudo é salvo na nuvem automaticamente e aparece nos dois celulares.</p>
    <p id="syncStatus" class="ok-msg">${syncMsg}</p>
    <label>Código do casal<input class="inp" readonly value="${esc(S.sync.codigo || '')}"></label>
    <div class="botoes"><button class="btn" data-a="syncCompartilhar" data-link="${esc(link)}">📲 Enviar para o outro celular</button>
      <button class="btn sec" data-a="syncAgora">🔄 Sincronizar agora</button></div>
    <details><summary class="small">Já tem um código? Entrar no banco do parceiro(a)</summary>
      <div class="linha"><input id="syncCod" class="inp" placeholder="casal-xxxxxxxxxx"><button class="btn" data-a="syncEntrar">Entrar</button></div>
      <p class="mut small">No iPhone com o app instalado, digite o código aqui dentro do app (o Safari guarda os dados separado do app).</p></details>
    <p class="mut small">🔒 Quem tiver o código vê os dados do casal. Não compartilhe com outras pessoas.</p></div>`;
}

// ---------- Tipo de dieta ----------
const NOME_REF = { cafe: 'café da manhã', almoco: 'almoço', lanche: 'lanche', jantar: 'jantar' };
const INFO_DIETA = {
  normal: 'Equilibrada: ½ prato de vegetais, ¼ proteína e ¼ carboidrato (de preferência integral).',
  lowcarb: 'Até ~100 g de carboidrato por dia (~25 g por refeição). Saem arroz, pão, massas, açúcar e farinhas; entram mais vegetais, proteína e gorduras boas.',
  ceto: 'Até ~30 g de carboidrato por dia (~10 g por refeição) e ~70% das calorias de gorduras boas (azeite, abacate, ovos, amendoim). O corpo entra em cetose em 2–4 dias. Beba bastante água para evitar dor de cabeça e cansaço no início.',
};
function dietaSeletor(pid) {
  const p = P(pid);
  return `<div class="card"><h3>🥗 Tipo de dieta de ${primeiro(pid)}</h3>
    <div class="seg">${Object.entries(C.DIETAS).map(([k, d]) => `<button class="${p.dieta === k ? 'on' : ''}" data-a="tipoDieta" data-d="${k}">${d.emoji} ${d.nome}</button>`).join('')}</div>
    <p class="small">${INFO_DIETA[p.dieta] || INFO_DIETA.normal}</p>
    ${p.diabetes && p.dieta !== 'normal' ? `<p class="alerta baixa">🩸 Com diabetes, a dieta ${C.DIETAS[p.dieta].nome.toLowerCase()} mexe muito na glicemia e pode exigir ajuste dos remédios (risco de hipoglicemia${p.dieta === 'ceto' ? ' e, com remédios do tipo “gliflozina”, de cetoacidose' : ''}). Comece só com liberação do médico e meça a glicemia com mais frequência.</p>` : ''}
    <p class="mut small">O cardápio do dia, o filtro “Na minha dieta” e o montador de prato seguem este limite de carboidrato.</p></div>`;
}

// ---------- Tela: TAF de concursos ----------
const tafDe = (pid) => S.taf[pid];
const metaTAF = (pid, t) => tafDe(pid).metas[t.id] ?? t.meta[P(pid).sexo];
const resTAF = (pid, id) => tafDe(pid).res.filter((x) => x.t === id);
function cinturaAtual(pid) {
  const r = resTAF(pid, 'cintura').at(-1);
  if (r) return r.v;
  const l = L(pid).peso.filter((x) => x.cintura).at(-1);
  return l ? l.cintura : Number(P(pid).cintura) || null;
}
function valorTAF(pid, t) {
  if (t.id === 'cintura') return cinturaAtual(pid);
  const rs = resTAF(pid, t.id).map((x) => x.v);
  if (!rs.length) return null;
  return t.maior ? Math.max(...rs) : Math.min(...rs);
}
function fmtTAF(v, t) {
  if (v == null || v === '') return '—';
  if (t.un === 'm' && t.passo < 1) return Number(v).toFixed(2).replace('.', ',') + ' m';
  if (t.un === 'reps') return `${v} rep.`;
  return `${v} ${t.un}`;
}
const mmss = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
const selo = (ok) => (ok == null ? '<span class="selo">—</span>' : ok ? '<span class="selo apto">APTO</span>' : '<span class="selo inapto">INAPTO</span>');

function statusTAF(pid) {
  const itens = TESTES.map((t) => C.tafApto(valorTAF(pid, t), metaTAF(pid, t), t.maior));
  itens.push(C.imcApto(C.imc(pesoAtual(pid), Number(P(pid).altura)), IMC_FAIXA.min, IMC_FAIXA.max));
  return { aptos: itens.filter((x) => x === true).length, total: itens.length };
}

function viewTAF() {
  const pid = S.ativo, sem = Math.floor(diaCasal() / 7) + 1;
  const st = statusTAF(pid);
  const imcV = C.imc(pesoAtual(pid), Number(P(pid).altura));
  return `
  <section class="hero">
    <p class="mut">${esc(P(pid).nome)} · Semana ${sem} de preparação</p>
    <h1>🎖️ TAF de Concursos</h1>
    <div class="linha">${anel(st.aptos / st.total, COR[pid], `${st.aptos}/${st.total}`, 'aptos')}
      <p class="flex1 small">Corrida de 12 min, barra, flexão, abdominal remador, saltos, cintura e IMC. <b>As metas são as mais comuns — ajuste conforme o edital do seu concurso.</b></p></div>
  </section>
  <div class="card"><h3>🏅 Placar do casal</h3>
    <table class="tabela placar"><thead><tr><th>Teste</th>${PIDS.map((p) => `<th style="color:${COR[p]}">${primeiro(p)}</th>`).join('')}</tr></thead><tbody>
    ${TESTES.map((t) => `<tr><td>${t.nome}</td>${PIDS.map((p) => { const v = valorTAF(p, t); return `<td>${fmtTAF(v, t)}<br>${selo(C.tafApto(v, metaTAF(p, t), t.maior))}</td>`; }).join('')}</tr>`).join('')}
    <tr><td>IMC</td>${PIDS.map((p) => { const v = C.imc(pesoAtual(p), Number(P(p).altura)); return `<td>${v ?? '—'}<br>${selo(C.imcApto(v, IMC_FAIXA.min, IMC_FAIXA.max))}</td>`; }).join('')}</tr>
    </tbody></table></div>
  <div class="card"><h3>🗓️ Como encaixar na semana</h3><ul class="dicas-eco">
    <li><span>1️⃣</span>Seg/Qua/Sex: treino do casal + bloco de força TAF (barra, flexão, remador).</li>
    <li><span>2️⃣</span>Ter/Qui: treino de corrida da semana + pliometria (saltos).</li>
    <li><span>3️⃣</span>Sábado (a partir da semana 3): simulado completo, registrando tudo aqui.</li>
    <li><span>⚠️</span>${P(pid).diabetes ? 'Meça a glicemia antes da corrida e dos simulados e leve um carboidrato rápido.' : 'Aqueça 10 min antes dos testes máximos.'}</li></ul></div>
  ${TESTES.map((t) => {
    const v = valorTAF(pid, t), meta = metaTAF(pid, t), ok = C.tafApto(v, meta, t.maior);
    const hist = resTAF(pid, t.id).slice(-5).reverse();
    return `<div class="card taf">
      <div class="taf-topo">${t.ex ? `<button class="taf-fig" data-a="verEx" data-id="${t.ex}">${figura(t.ex, { cor: COR[pid], tam: 130 })}</button>` : '<div class="taf-fig fita">📏</div>'}
        <div class="flex1"><h3>${t.nome}</h3>${selo(ok)}
          <p class="small">Melhor: <b>${fmtTAF(v, t)}</b> · Meta: <b>${fmtTAF(meta, t)}</b></p>
          ${barra(C.tafProgresso(v, meta, t.maior, t.id === 'cintura' ? Number(P(pid).cintura) : null), ok ? 'var(--ok)' : COR[pid])}</div></div>
      <details><summary>📋 Regra da prova e meta do edital</summary><p class="small">${t.regra}</p>
        <label class="small mut">Meta do meu edital (${t.un})<input type="number" class="inp" step="${t.passo}" inputmode="decimal" data-tafmeta="${t.id}" value="${tafDe(pid).metas[t.id] ?? ''}" placeholder="padrão: ${t.meta[P(pid).sexo]}"></label></details>
      <h4>💪 Treino da semana ${sem}</h4><ul class="treino-taf">${treinoTAF(t.id, sem, v, meta).map((x) => `<li>${x}</li>`).join('')}</ul>
      <div class="botoes">${t.simulado && t.simulado.tipo !== 'tentativas' ? `<button class="btn" data-a="simAbrir" data-id="${t.id}">⏱️ Simulado</button>` : ''}
        <button class="btn sec" data-a="tafReg" data-id="${t.id}">+ Registrar ${t.id === 'cintura' ? 'medida' : 'marca'}</button></div>
      ${hist.length ? `<ul class="lista-simples">${hist.map((h) => `<li><span>${h.data.split('-').reverse().slice(0, 2).join('/')}</span><b>${fmtTAF(h.v, t)}</b><button class="ic" data-a="tafDel" data-id="${t.id}" data-data="${h.data}" data-v="${h.v}">🗑️</button></li>`).join('')}</ul>` : ''}
    </div>`;
  }).join('')}
  <div class="card taf"><div class="taf-topo"><div class="taf-fig fita">⚖️</div><div class="flex1"><h3>IMC</h3>${selo(C.imcApto(imcV, IMC_FAIXA.min, IMC_FAIXA.max))}
    <p class="small">Atual: <b>${imcV ?? '—'}</b> (${C.classeImc(imcV)}) · Faixa aceita na maioria dos editais: <b>${IMC_FAIXA.min} a ${IMC_FAIXA.max}</b></p></div></div>
    <p class="mut small">Calculado com o último peso registrado e a altura do Perfil. Alguns editais usam outra faixa — confira.</p>
    <button class="btn sec full" data-a="aba" data-aba="perfil">Atualizar peso no Perfil</button></div>`;
}

function modalRegistroTAF(id) {
  const t = TESTES.find((x) => x.id === id);
  abrirModal(`<h2>${t.nome}</h2><p class="mut">${esc(P().nome)} · meta ${fmtTAF(metaTAF(S.ativo, t), t)}</p>
    <label>Resultado (${t.un})<input type="number" id="tafValor" class="inp" step="${t.passo}" inputmode="decimal"></label>
    <button class="btn full" data-a="tafSalvar" data-id="${id}">Salvar</button>`);
  setTimeout(() => $('#tafValor')?.focus(), 100);
}

function salvarTAF(id, v) {
  const t = TESTES.find((x) => x.id === id);
  if (v == null || isNaN(v)) return toast('Digite o resultado');
  tafDe(S.ativo).res.push({ t: id, data: hoje(), v: Number(v) });
  salvar(); fecharModal(); render();
  const ok = C.tafApto(v, metaTAF(S.ativo, t), t.maior);
  toast(ok ? `✅ ${fmtTAF(v, t)} — APTO em ${t.nome}!` : `📈 ${fmtTAF(v, t)} registrado. Continue treinando!`);
}

// Simulado com cronômetro e contador
let SIM = null;
function abrirSimulado(id) {
  const t = TESTES.find((x) => x.id === id);
  if (SIM) clearInterval(SIM.timer);
  SIM = { t, count: 0, voltas: 0, resto: t.simulado.seg * 1000, rodando: false, fim: 0, ultSeg: -1, timer: setInterval(tickSim, 250) };
  audioCtx();
  renderSim();
}
function renderSim() {
  const { t } = SIM, s = t.simulado;
  const seg = Math.ceil(SIM.resto / 1000);
  const relogio = s.seg ? `<div class="sim-relogio" id="simRel">${mmss(seg)}</div>
    <div class="botoes"><button class="btn" data-a="simPlay">${SIM.rodando ? '⏸ Pausar' : SIM.resto < s.seg * 1000 && SIM.resto > 0 ? '▶ Continuar' : '▶ Iniciar'}</button>
    <button class="btn sec" data-a="simZerar">↺ Zerar</button></div>` : '';
  const contador = s.tipo === 'tempo'
    ? `<button class="sim-tap" data-a="simVolta"><span>+1 volta</span><small>${SIM.voltas} voltas = ${SIM.voltas * 400} m</small></button>
       <label>${s.pede}<input type="number" id="simValor" class="inp" value="${SIM.voltas * 400 || ''}" inputmode="numeric"></label>`
    : `<button class="sim-tap" data-a="simTap"><span id="simCount">${SIM.count}</span><small>toque a cada repetição válida</small></button>`;
  abrirModal(`<h2>⏱️ Simulado: ${t.nome}</h2><p class="mut small">${esc(P().nome)} · meta ${fmtTAF(metaTAF(S.ativo, t), t)}</p>
    <div class="sim-fig">${figura(t.ex, { cor: COR[S.ativo], tam: 200 })}</div>
    ${relogio}${contador}<button class="btn full" data-a="simSalvar">💾 Salvar resultado</button>`);
}
function tickSim() {
  if (!SIM || !SIM.rodando) return;
  SIM.resto = Math.max(0, SIM.fim - Date.now());
  const seg = Math.ceil(SIM.resto / 1000);
  if (seg === SIM.ultSeg) return;
  SIM.ultSeg = seg;
  const el = $('#simRel'); if (el) el.textContent = mmss(seg);
  if (seg > 0 && seg <= 3) bip(660, 0.12);
  if (SIM.t.simulado.tipo === 'tempo' && seg > 0 && seg < 720 && seg % 60 === 0) falar(`Faltam ${seg / 60} minuto${seg === 60 ? '' : 's'}`);
  if (seg === 0) {
    SIM.rodando = false; bip(990, 0.6); vibrar([400, 100, 400]); falar('Tempo! Pare.');
    renderSim();
  }
}

// ---------- Jejum intermitente ----------
function cardJejum(pid) {
  const p = P(pid), j = p.jejum, lj = L(pid).jejum;
  const horasMeta = C.PROTOCOLOS[j.protocolo] || 16;
  const jan = C.janelaAlimentar(j.abre, j.protocolo);
  let tracker = '';
  if (j.ativo) {
    if (lj.inicio) {
      const h = (Date.now() - lj.inicio) / 3600000;
      tracker = `<div class="linha jejum"><span id="jejumAnel">${anel(h / horasMeta, COR[pid], C.fmtHoras(h), `de ${horasMeta}h`, 110)}</span>
        <div class="flex1"><p><b>Em jejum</b> desde ${new Date(lj.inicio).toTimeString().slice(0, 5)}</p><p class="small" id="jejumFase">${C.faseJejum(h)}</p>
        <p class="small mut">Termina às ${new Date(lj.inicio + horasMeta * 3600000).toTimeString().slice(0, 5)}</p></div></div>
        <button class="btn full" data-a="jejumFim">🍽️ Encerrar jejum</button>`;
    } else {
      tracker = `<button class="btn full" data-a="jejumIni">▶ Iniciar jejum agora</button>`;
    }
    const hist = lj.hist.slice(-5).reverse();
    if (hist.length) tracker += `<ul class="lista-simples">${hist.map((x) => `<li><span>${C.dataKey(new Date(x.fim)).split('-').reverse().slice(0, 2).join('/')}</span><b>${C.fmtHoras(x.h)} ${x.h >= horasMeta ? '✅' : ''}</b></li>`).join('')}</ul>`;
  }
  return `<div class="card"><h3>⏳ Jejum intermitente</h3>
    <label class="check"><input type="checkbox" data-jj="ativo" ${j.ativo ? 'checked' : ''}> <span>Quero fazer jejum intermitente</span></label>
    ${p.diabetes ? '<p class="alerta baixa">🩸 Com diabetes, jejum só com liberação médica: há risco de hipoglicemia, principalmente com insulina ou remédios que aumentam a insulina.</p>' : ''}
    ${j.ativo ? `<div class="form">
      <label>Protocolo<select class="inp" data-jj="protocolo">${Object.keys(C.PROTOCOLOS).map((k) => `<option ${k === j.protocolo ? 'selected' : ''}>${k}</option>`).join('')}</select></label>
      <label>Janela de comer abre às<input type="time" class="inp" data-jj="abre" value="${j.abre}"></label></div>
      <p class="small">🟢 Comer: <b>${jan.abre} → ${jan.fecha}</b> · ⏳ Jejum: <b>${jan.fecha} → ${jan.abre}</b> (água, café e chá sem açúcar liberados)</p>
      ${tracker}` : '<p class="mut small">Protocolos 12:12, 14:10, 16:8 ou 18:6, com cronômetro, fases do jejum e alarmes de abrir/fechar a janela.</p>'}
  </div>`;
}
function atualizarJejum() {
  if (S.aba !== 'diario') return;
  const lj = L().jejum, el = $('#jejumAnel');
  if (!el || !lj.inicio) return;
  const h = (Date.now() - lj.inicio) / 3600000, meta = C.PROTOCOLOS[P().jejum.protocolo] || 16;
  el.innerHTML = anel(h / meta, COR[S.ativo], C.fmtHoras(h), `de ${meta}h`, 110);
  const f = $('#jejumFase'); if (f) f.textContent = C.faseJejum(h);
}

const VIEWS = { casal: viewCasal, treino: viewTreino, taf: viewTAF, dieta: viewDieta, diario: viewDiario, perfil: viewPerfil };

// ---------- Modal e toast ----------
function abrirModal(html) {
  const m = $('#modal');
  m.innerHTML = `<div class="modal-fundo" data-a="fecharModal"></div><div class="modal-caixa"><button class="ic fechar" data-a="fecharModal">✕</button>${html}</div>`;
  m.hidden = false;
  document.body.classList.add('travado');
}
function fecharModal() {
  if (SIM) { clearInterval(SIM.timer); SIM = null; }
  $('#modal').hidden = true; $('#modal').innerHTML = '';
  if (!PL) document.body.classList.remove('travado');
}
let toastT;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg; t.classList.add('on');
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 3500);
}

// ---------- Lembretes ----------
async function notificar(a, pid) {
  toast(`${a.ic} ${a.tit}`);
  bip(880, 0.2); vibrar([200, 100, 200]);
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  const opts = { body: a.corpo, icon: 'icons/icon-192.png', badge: 'icons/icon-192.png', tag: pid + a.k, vibrate: [200, 100, 200], data: { url: './' } };
  try { const reg = await navigator.serviceWorker?.ready; if (reg) return reg.showNotification(`${a.ic} ${a.tit}`, opts); } catch {}
  try { new Notification(`${a.ic} ${a.tit}`, opts); } catch {}
}

function verificarLembretes() {
  const d = hoje(), hm = new Date().toTimeString().slice(0, 5);
  let mudou = false;
  for (const k of Object.keys(S.disparados)) if (!k.startsWith(d)) { delete S.disparados[k]; mudou = true; }
  PIDS.forEach((pid) => agenda(pid).forEach((a) => {
    const key = `${d}|${pid}|${a.k}`;
    if (a.hora === hm && !S.disparados[key]) { S.disparados[key] = 1; mudou = true; notificar(a, pid); }
  }));
  if (mudou) salvar();
}

function gerarICS(pids) {
  const restante = Math.max(1, 42 - diaCasal());
  const base = hoje().replace(/-/g, '');
  const stamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const linhas = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//CasalFit//PT-BR', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'X-WR-CALNAME:Casal Fit 6 semanas'];
  pids.forEach((pid) => agenda(pid).forEach((a) => {
    const hm = a.hora.replace(':', '');
    const fimMin = Number(a.hora.slice(3)) + 5;
    const fim = `${a.hora.slice(0, 2)}${String(Math.min(59, fimMin)).padStart(2, '0')}`;
    linhas.push('BEGIN:VEVENT', `UID:${pid}-${a.k.replace(/[^a-z0-9]/gi, '')}-${base}@casalfit`, `DTSTAMP:${stamp}`,
      `DTSTART:${base}T${hm}00`, `DTEND:${base}T${fim}00`, `RRULE:FREQ=DAILY;COUNT=${restante}`,
      `SUMMARY:${a.ic} ${a.tit}`, `DESCRIPTION:${a.corpo.replace(/[,;]/g, (c) => '\\' + c)}`,
      'BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${a.tit}`, 'TRIGGER:PT0M', 'END:VALARM', 'END:VEVENT');
  }));
  linhas.push('END:VCALENDAR');
  return linhas.join('\r\n');
}

function baixar(nome, conteudo, tipo) {
  if (isIOS && tipo.startsWith('text/calendar')) {
    location.href = `data:text/calendar;charset=utf-8,${encodeURIComponent(conteudo)}`;
    return;
  }
  const u = URL.createObjectURL(new Blob([conteudo], { type: tipo }));
  const a = Object.assign(document.createElement('a'), { href: u, download: nome });
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(u), 5000);
}

// ---------- Ações ----------
const ACOES = {
  aba: (d) => { S.aba = d.aba; salvar(); render(); window.scrollTo(0, 0); },
  pessoa: (d) => { S.ativo = d.pid; salvar(); render(); },
  irTreino: (d) => { S.ativo = d.pid; S.aba = 'treino'; salvar(); render(); window.scrollTo(0, 0); },
  agua: (d) => {
    const l = L(d.pid), k = hoje();
    l.agua[k] = Math.max(0, (l.agua[k] || 0) + Number(d.ml));
    salvar(); render();
    if (Number(d.ml) > 0) toast(`💧 +${d.ml} ml para ${primeiro(d.pid)}`);
  },
  rem: (d, el) => {
    const l = L(d.pid), k = hoje();
    l.rem[k] = l.rem[k] || {};
    l.rem[k][d.k] = el.checked;
    salvar(); el.closest('.check')?.classList.toggle('ok', el.checked);
  },
  verEx: (d) => modalExercicio(d.id),
  verDia: (d) => modalDia(Number(d.d)),
  iniciar: () => iniciarTreino(),
  feito: () => modalQuemTreinou(),
  salvarTreino: (d) => salvarTreino(d.min),
  recomecar: () => { if (confirm('Começar um novo ciclo de 6 semanas?')) { L().dia = 0; salvar(); render(); } },
  sairPlayer: () => { if (confirm('Sair do treino? O progresso deste treino não será salvo.')) fecharPlayer(); },
  somToggle: () => { S.voz = !S.voz; S.som = S.voz; salvar(); renderPlayer(); },
  plPausa: () => {
    if (PL.pausado) { PL.fim = Date.now() + PL.restoPausa; PL.pausado = false; }
    else { PL.restoPausa = Math.max(0, PL.fim - Date.now()); PL.pausado = true; }
    renderPlayer();
  },
  plPular: () => proximo(1),
  plVoltar: () => proximo(-1),
  glic: (d) => {
    const v = Number($('#' + d.src)?.value);
    if (!v) return toast('Digite o valor da glicemia');
    const mom = d.mom || $('#glicMom')?.value || '';
    L().glic.push({ data: hoje(), hora: new Date().toTimeString().slice(0, 5), v, mom });
    salvar(); render();
    toast(C.glicemiaAlerta(v).msg);
  },
  dietaSub: (d) => { S.dietaSub = d.s; salvar(); render(); },
  filtroRef: (d) => { S.filtroRef = d.f; salvar(); render(); },
  receita: (d) => modalReceita(d.id),
  usarReceita: (d) => { S.montagem = RECEITAS.find((r) => r.id === d.id).itens.map(([a, g]) => [a, r0(g * fator(S.ativo))]); S.aba = 'dieta'; S.dietaSub = 'montar'; salvar(); fecharModal(); render(); },
  mAdd: (d) => { const g = { veg: 80, prot: 120, carb: 60, gord: 5, lat: 100, fruta: 100 }[ALIMENTOS[d.id].cat]; S.montagem.push([d.id, d.id === 'azeite' ? 5 : d.id === 'castanha' || d.id === 'chia' ? 10 : g]); salvar(); render(); },
  mRem: (d) => { S.montagem.splice(Number(d.i), 1); salvar(); render(); },
  mLimpar: () => { S.montagem = []; salvar(); render(); },
  mSalvar: () => { const nome = prompt('Nome do prato:', 'Meu prato'); if (!nome) return; S.pratos.push({ nome, itens: S.montagem.map((x) => [...x]) }); salvar(); render(); toast('Prato salvo ⭐'); },
  mCarregar: (d) => { S.montagem = S.pratos[Number(d.i)].itens.map((x) => [...x]); salvar(); render(); },
  mDel: (d) => { S.pratos.splice(Number(d.i), 1); salvar(); render(); },
  permissao: async () => {
    const r = await Notification.requestPermission();
    if (r === 'granted') notificar({ ic: '✅', tit: 'Avisos ativados!', corpo: 'Vamos lembrar vocês de treinar, beber água e tomar os remédios.', k: 'teste' }, S.ativo);
    render();
  },
  ics: (d) => {
    const pids = d.quem === 'ambos' ? PIDS : [d.quem];
    baixar(`lembretes-casal-fit-${d.quem}.ics`, gerarICS(pids), 'text/calendar;charset=utf-8');
    toast('Abra o arquivo para adicionar ao calendário 📅');
  },
  remAdd: () => {
    const nome = $('#remNome').value.trim();
    const horarios = ($('#remHoras').value.match(/\d{1,2}:\d{2}/g) || []).map((h) => h.padStart(5, '0'));
    if (!nome || !horarios.length) return toast('Informe nome e horários (ex.: 08:00, 20:00)');
    P().remedios.push({ id: 'm' + Date.now().toString(36), nome, dose: $('#remDose').value.trim(), horarios });
    salvar(); render(); toast('Remédio adicionado 💊');
  },
  remDel: (d) => { if (confirm('Remover este remédio?')) { P().remedios.splice(Number(d.i), 1); salvar(); render(); } },
  regPeso: () => {
    const kg = Number($('#regPeso').value);
    if (!kg) return toast('Digite o peso');
    const reg = { data: hoje(), kg, cintura: Number($('#regCint').value) || null, abd: Number($('#regAbd').value) || null };
    const l = L(); const i = l.peso.findIndex((x) => x.data === reg.data);
    if (i >= 0) l.peso[i] = reg; else l.peso.push(reg);
    salvar(); render(); toast('Medidas registradas ⚖️');
  },
  pesoDel: (d) => { L().peso.splice(Number(d.i), 1); salvar(); render(); },
  exportar: () => baixar(`casal-fit-backup-${hoje()}.json`, JSON.stringify(S, null, 2), 'application/json'),
  resetar: () => { if (confirm(`Zerar treinos, água, peso e glicemia de ${primeiro(S.ativo)}? Isso não pode ser desfeito.`)) { S.logs[S.ativo] = logPadrao(); salvar(); render(); } },
  fecharModal: () => fecharModal(),
  tipoDieta: (d) => { P().dieta = d.d; salvar(); render(); toast(`${C.DIETAS[d.d].emoji} Dieta ${C.DIETAS[d.d].nome} para ${primeiro(S.ativo)}`); },
  jejumIni: () => { L().jejum.inicio = Date.now(); salvar(); render(); toast('⏳ Jejum iniciado. Força!'); },
  jejumFim: () => {
    const lj = L().jejum, h = (Date.now() - lj.inicio) / 3600000;
    lj.hist.push({ ini: lj.inicio, fim: Date.now(), h: Math.round(h * 100) / 100 }); lj.inicio = null;
    salvar(); render(); toast(`🍽️ Jejum de ${C.fmtHoras(h)} concluído!`);
  },
  tafReg: (d) => modalRegistroTAF(d.id),
  tafSalvar: (d) => salvarTAF(d.id, $('#tafValor').value === '' ? null : Number($('#tafValor').value)),
  tafDel: (d) => {
    const rs = tafDe(S.ativo).res, i = rs.findIndex((x) => x.t === d.id && x.data === d.data && String(x.v) === d.v);
    if (i >= 0 && confirm('Apagar este resultado?')) { rs.splice(i, 1); salvar(); render(); }
  },
  simAbrir: (d) => abrirSimulado(d.id),
  simPlay: () => {
    if (SIM.rodando) { SIM.rodando = false; }
    else {
      if (SIM.resto <= 0) SIM.resto = SIM.t.simulado.seg * 1000;
      SIM.fim = Date.now() + SIM.resto; SIM.rodando = true; SIM.ultSeg = -1;
      falar('Valendo!'); bip(990, 0.3);
    }
    renderSim();
  },
  simZerar: () => { SIM.rodando = false; SIM.resto = SIM.t.simulado.seg * 1000; SIM.count = 0; SIM.voltas = 0; renderSim(); },
  simTap: () => { SIM.count++; bip(1200, 0.05); vibrar(30); const c = $('#simCount'); if (c) c.textContent = SIM.count; },
  simVolta: () => { SIM.voltas++; bip(1200, 0.08); falar(`${SIM.voltas} voltas`); renderSim(); },
  simSalvar: () => {
    const v = SIM.t.simulado.tipo === 'tempo' ? Number($('#simValor').value) : SIM.count;
    if (!v) return toast('Nada para salvar ainda');
    salvarTAF(SIM.t.id, v);
  },
  syncAgora: async () => { await syncPuxar(); toast(syncMsg || 'Sincronizado'); },
  syncEntrar: async () => {
    const c = $('#syncCod').value.trim().toLowerCase();
    if (!/^[a-z0-9-]{8,64}$/.test(c)) return toast('Código inválido');
    if (!confirm('Entrar neste banco? Os dados deste celular serão trocados pelos do banco do casal.')) return;
    S.sync.codigo = c; gravarLocal(); await syncPuxar(true); render(); toast('☁️ Conectado ao banco do casal!');
  },
  syncCompartilhar: async (d) => {
    const txt = `Casal Fit — entre no nosso banco de dados: ${d.link}\nOu digite no Perfil o código: ${S.sync.codigo}`;
    try { if (navigator.share) await navigator.share({ title: 'Casal Fit', text: txt }); else { await navigator.clipboard.writeText(txt); toast('Link copiado 📋'); } } catch {}
  },
};

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-a]');
  if (!el) return;
  if (el.tagName === 'INPUT' && el.type === 'checkbox') return; // tratado no change
  ACOES[el.dataset.a]?.(el.dataset, el, e);
});

document.addEventListener('change', (e) => {
  const el = e.target;
  if (el.dataset.a === 'rem') return ACOES.rem(el.dataset, el);
  if (el.id === 'importar' && el.files[0]) {
    el.files[0].text().then((txt) => {
      try { const s = JSON.parse(txt); if (s.v !== 1 || !s.people) throw 0; S = { ...novoEstado(), ...s }; salvar(); render(); toast('Backup importado ✅'); }
      catch { toast('Arquivo de backup inválido'); }
    });
    return;
  }
  if (el.dataset.g) {
    S[el.dataset.g] = el.type === 'checkbox' ? el.checked : el.value;
    salvar(); render();
    return;
  }
  if (el.dataset.jj) {
    P().jejum[el.dataset.jj] = el.type === 'checkbox' ? el.checked : el.value;
    salvar(); render(); return;
  }
  if (el.dataset.refh) { P().refeicoes[el.dataset.refh] = el.value; salvar(); render(); return; }
  if (el.dataset.gh) {
    P().glicHorarios = [...new Set((el.value.match(/\d{1,2}:\d{2}/g) || []).map((h) => h.padStart(5, '0')))].sort();
    salvar(); render(); toast('🩸 Alarmes de glicemia atualizados'); return;
  }
  if (el.dataset.tafmeta) {
    const m = tafDe(S.ativo).metas;
    if (el.value === '') delete m[el.dataset.tafmeta]; else m[el.dataset.tafmeta] = Number(el.value);
    salvar(); render(); return;
  }
  if (el.dataset.f === 'cardSel') {
    S.cardapio = { [hoje()]: { ...(S.cardapio[hoje()] || {}), [el.dataset.ref]: el.value } };
    salvar(); render(); return;
  }
  if (el.dataset.f === 'mg') {
    S.montagem[Number(el.dataset.i)][1] = Math.max(0, Number(el.value) || 0);
    salvar(); render(); return;
  }
  const f = el.dataset.f;
  if (!f) return;
  const p = P();
  if (f === 'diabetes') p.diabetes = el.checked;
  else if (f === 'modo') p.modo = el.checked ? 'leve' : 'normal';
  else if (f === 'avisoRefeicao') p.avisoRefeicao = el.checked;
  else p[f] = el.type === 'number' ? (el.value === '' ? '' : Number(el.value)) : el.value;
  salvar(); render();
});

document.querySelectorAll('.tabbar button').forEach((b) => b.addEventListener('click', () => { S.aba = b.dataset.aba; salvar(); render(); window.scrollTo(0, 0); }));

// Instalação (Android/Chrome)
let promptInstalar = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault(); promptInstalar = e;
  const b = $('#btnInstalar'); b.hidden = false;
  b.onclick = async () => { promptInstalar.prompt(); await promptInstalar.userChoice; b.hidden = true; };
});

if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
speechSynthesis?.getVoices?.();

render();
verificarLembretes();
setInterval(() => { verificarLembretes(); atualizarJejum(); }, 15000);
iniciarSync();
setInterval(() => { if (!document.hidden) syncPuxar(); }, 60000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) { verificarLembretes(); if (!PL && $('#modal').hidden) render(); syncPuxar(); } });
