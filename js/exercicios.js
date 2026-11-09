// Exercícios com ilustração animada desenhada por código (SVG).
// Pose = 11 articulações [x,y]: Cabeça, Ombro(N), Quadril(P), Cotovelo/Mão frente, Cotovelo/Mão trás,
// Joelho/Pé frente, Joelho/Pé trás. Chão em y=125.

const P = {
  agachA: [100,30, 100,45, 99,80, 112,52, 128,52, 111,54, 127,55, 102,102, 101,125, 99,102, 98,125],
  agachB: [102,50, 96,64, 80,95, 110,66, 126,64, 109,68, 125,67, 104,99, 101,125, 102,100, 98,125],
  pranchaAlta: [151,80, 138,88, 104,98, 139,105, 139,123, 137,105, 137,123, 82,111, 60,123, 81,112, 59,124],
  deitado: [46,114, 60,117, 95,119, 75,121, 92,122, 75,122, 92,123, 118,119, 142,120, 118,120, 142,121],
  crunchUp: [54,92, 65,101, 95,119, 64,86, 52,88, 66,88, 53,90, 113,100, 127,123, 111,101, 125,124],
  brucos: [150,115, 136,118, 98,119, 156,118, 174,118, 156,119, 174,119, 74,120, 50,121, 74,121, 50,122],
  burpee1: [100,28, 100,43, 100,78, 103,26, 106,10, 97,26, 94,10, 101,101, 100,124, 99,101, 99,124],
  burpee2: [120,68, 110,78, 88,98, 116,100, 120,123, 114,100, 118,123, 106,96, 97,123, 104,97, 95,124],
};

export const EXERCICIOS = {
  polichinelo: {
    nome: 'Polichinelo', grupo: 'Cardio', emoji: '⭐', vista: 'frente', dur: 0.9,
    frames: [[100,30, 100,45, 100,80, 92,62, 90,80, 108,62, 110,80, 96,102, 95,125, 104,102, 105,125],
             [100,27, 100,42, 100,77, 86,30, 80,14, 114,30, 120,14, 90,100, 80,122, 110,100, 120,122]],
    como: ['Em pé, pés juntos e braços ao lado do corpo.', 'Salte abrindo as pernas e levando os braços acima da cabeça.', 'Salte de volta à posição inicial. Mantenha ritmo constante.'],
    erros: ['Aterrissar com o calcanhar (use a ponta dos pés)', 'Travar os joelhos'],
    leve: 'Sem salto: abra uma perna de cada vez enquanto sobe os braços.',
  },
  skipping: {
    nome: 'Skipping (joelho alto)', grupo: 'Cardio', emoji: '🏃', dur: 0.6,
    frames: [[100,28, 100,43, 100,78, 92,58, 88,74, 107,58, 116,48, 119,82, 115,104, 100,101, 99,124],
             [100,28, 100,43, 100,78, 107,58, 116,48, 92,58, 88,74, 100,101, 99,124, 119,82, 115,104]],
    como: ['Corra parado no lugar.', 'Eleve os joelhos até a altura do quadril.', 'Braços acompanham o movimento, abdômen contraído.'],
    erros: ['Inclinar o tronco para trás', 'Pisar com força no chão'],
    leve: 'Marcha no lugar elevando os joelhos sem saltar.',
  },
  agachamento: {
    nome: 'Agachamento', grupo: 'Pernas e glúteos', emoji: '🍑', dur: 1.8,
    frames: [P.agachA, P.agachB],
    como: ['Pés na largura dos ombros, braços à frente.', 'Leve o quadril para trás como se fosse sentar.', 'Desça até as coxas ficarem paralelas ao chão e suba empurrando o chão.'],
    erros: ['Joelhos entrando para dentro', 'Tirar os calcanhares do chão', 'Curvar as costas'],
    leve: 'Agache até uma cadeira e levante.',
  },
  agachSalto: {
    nome: 'Agachamento com salto', grupo: 'Pernas e cardio', emoji: '🚀', dur: 1.2,
    frames: [P.agachB, [100,22, 100,37, 100,72, 104,22, 108,6, 96,22, 92,6, 101,95, 100,117, 99,95, 99,118]],
    como: ['Faça um agachamento completo.', 'Suba explosivamente saltando com os braços para cima.', 'Aterrisse suave, já descendo para o próximo agachamento.'],
    erros: ['Aterrissar com joelhos rígidos', 'Perder o alinhamento dos joelhos'],
    leve: 'Agachamento terminando na ponta dos pés, sem salto.',
  },
  afundo: {
    nome: 'Afundo alternado', grupo: 'Pernas e glúteos', emoji: '🦵', dur: 2,
    frames: [[100,30, 100,45, 100,80, 110,60, 104,78, 92,60, 97,78, 104,102, 106,125, 97,102, 95,125],
             [98,46, 98,61, 98,96, 108,76, 102,94, 90,76, 95,94, 120,100, 121,124, 85,118, 64,122]],
    como: ['Em pé, mãos na cintura.', 'Dê um passo à frente e desça até os dois joelhos formarem 90°.', 'Volte e alterne a perna.'],
    erros: ['Joelho da frente passar muito da ponta do pé', 'Tronco inclinado para frente'],
    leve: 'Desça só até a metade, apoiando a mão numa parede.',
  },
  ponte: {
    nome: 'Ponte de glúteo', grupo: 'Glúteos e core', emoji: '🌉', dur: 2, chao: true,
    frames: [[46,114, 60,117, 95,119, 78,121, 95,123, 78,122, 95,124, 115,99, 125,123, 113,100, 123,124],
             [48,113, 63,115, 98,98, 80,121, 97,123, 80,122, 97,124, 118,95, 125,123, 116,96, 123,124]],
    como: ['Deitado de barriga para cima, joelhos dobrados, pés no chão.', 'Contraia glúteos e abdômen e eleve o quadril.', 'Segure 1 segundo no alto e desça devagar.'],
    erros: ['Arquear a lombar', 'Empurrar com a ponta dos pés'],
    leve: 'Amplitude menor, sem pausa no alto.',
  },
  flexao: {
    nome: 'Flexão de braço', grupo: 'Peito, braços e core', emoji: '💪', dur: 1.8, chao: true,
    frames: [P.pranchaAlta, [151,101, 138,108, 104,113, 126,104, 139,123, 125,105, 137,123, 82,118, 60,123, 81,119, 59,124]],
    como: ['Mãos um pouco mais abertas que os ombros, corpo reto.', 'Desça o peito em direção ao chão com cotovelos a ~45°.', 'Empurre o chão e volte, sem deixar o quadril cair.'],
    erros: ['Quadril caído ou empinado', 'Cotovelos muito abertos'],
    leve: 'Faça com os joelhos apoiados no chão ou mãos na parede.',
  },
  prancha: {
    nome: 'Prancha', grupo: 'Abdômen (core)', emoji: '🧱', dur: 3, chao: true, isometrico: true,
    frames: [[152,98, 138,105, 103,111, 138,123, 156,123, 136,123, 154,124, 81,117, 58,123, 80,118, 57,124],
             [152,97, 138,104, 103,108, 138,123, 156,123, 136,123, 154,124, 81,116, 58,123, 80,117, 57,124]],
    como: ['Antebraços no chão, cotovelos abaixo dos ombros.', 'Corpo em linha reta da cabeça aos pés.', 'Contraia abdômen e glúteos e respire normalmente.'],
    erros: ['Quadril alto ou caído', 'Prender a respiração'],
    leve: 'Prancha com os joelhos apoiados.',
  },
  pranchaLateral: {
    nome: 'Prancha lateral', grupo: 'Oblíquos', emoji: '📐', dur: 2.5, chao: true, isometrico: true,
    frames: [[150,74, 137,83, 97,101, 138,103, 139,123, 140,64, 142,46, 70,112, 44,122, 71,110, 46,119],
             [150,73, 137,82, 97,97, 138,103, 139,123, 140,63, 142,45, 70,110, 44,122, 71,108, 46,119]],
    como: ['De lado, apoie a mão (ou antebraço) abaixo do ombro.', 'Eleve o quadril formando uma linha reta.', 'Metade do tempo para cada lado.'],
    erros: ['Quadril caindo', 'Ombro longe da linha da mão'],
    leve: 'Joelho de baixo apoiado no chão.',
  },
  mountain: {
    nome: 'Escalador (mountain climber)', grupo: 'Abdômen e cardio', emoji: '⛰️', dur: 0.7, chao: true,
    frames: [[151,80, 138,88, 104,98, 139,105, 139,123, 137,105, 137,123, 122,107, 112,122, 82,112, 60,124],
             [151,80, 138,88, 104,98, 139,105, 139,123, 137,105, 137,123, 82,111, 60,123, 122,108, 112,123]],
    como: ['Posição de prancha alta, mãos abaixo dos ombros.', 'Leve um joelho em direção ao peito.', 'Troque as pernas rapidamente, quadril baixo.'],
    erros: ['Quadril muito alto', 'Ombros à frente das mãos'],
    leve: 'Alterne as pernas devagar, sem saltar.',
  },
  burpee: {
    nome: 'Burpee', grupo: 'Corpo inteiro', emoji: '🔥', dur: 2.6,
    frames: [P.burpee1, P.burpee2, P.pranchaAlta, P.burpee2, P.burpee1],
    como: ['Em pé, agache e apoie as mãos no chão.', 'Leve os pés para trás até a prancha.', 'Volte os pés, levante-se e estique os braços para cima.'],
    erros: ['Cair com o quadril na prancha', 'Lombar curvada ao levantar'],
    leve: 'Leve os pés para trás um de cada vez, sem saltar.',
  },
  crunch: {
    nome: 'Abdominal supra', grupo: 'Abdômen', emoji: '🎯', dur: 1.6, chao: true,
    frames: [[46,114, 60,117, 95,119, 52,104, 44,110, 54,106, 45,112, 113,100, 127,123, 111,101, 125,124], P.crunchUp],
    como: ['Deitado, joelhos dobrados, mãos atrás da cabeça.', 'Solte o ar e enrole o tronco tirando as escápulas do chão.', 'Desça devagar sem encostar totalmente a cabeça.'],
    erros: ['Puxar o pescoço com as mãos', 'Subir com impulso'],
    leve: 'Braços estendidos à frente, amplitude curta.',
  },
  bicicleta: {
    nome: 'Abdominal bicicleta', grupo: 'Abdômen e oblíquos', emoji: '🚲', dur: 1.4, chao: true,
    frames: [[54,92, 65,101, 95,119, 64,86, 52,88, 66,88, 53,90, 85,97, 104,104, 117,108, 140,104],
             [55,93, 66,102, 95,119, 64,87, 52,89, 66,89, 53,91, 117,108, 140,104, 85,97, 104,104]],
    como: ['Ombros fora do chão, mãos atrás da cabeça.', 'Leve o cotovelo em direção ao joelho oposto.', 'Alterne os lados estendendo a outra perna.'],
    erros: ['Puxar o pescoço', 'Lombar sair do chão'],
    leve: 'Pés mais altos e movimento lento.',
  },
  elevacao: {
    nome: 'Elevação de pernas', grupo: 'Abdômen inferior', emoji: '🦿', dur: 2.2, chao: true,
    frames: [P.deitado, [46,114, 60,117, 95,119, 75,121, 92,122, 75,122, 92,123, 98,96, 101,72, 97,96, 100,72]],
    como: ['Deitado, braços ao lado do corpo, mãos sob o quadril.', 'Suba as pernas estendidas até 90°.', 'Desça devagar sem encostar os pés no chão.'],
    erros: ['Lombar descolar do chão', 'Descer rápido demais'],
    leve: 'Faça com os joelhos dobrados.',
  },
  tesoura: {
    nome: 'Tesoura (flutter kick)', grupo: 'Abdômen inferior', emoji: '✂️', dur: 0.8, chao: true,
    frames: [[46,114, 60,117, 95,119, 75,121, 92,122, 75,122, 92,123, 117,109, 139,98, 118,114, 141,110],
             [46,114, 60,117, 95,119, 75,121, 92,122, 75,122, 92,123, 118,114, 141,110, 117,109, 139,98]],
    como: ['Deitado, pernas estendidas e um pouco elevadas.', 'Alterne subindo e descendo as pernas em movimentos curtos.', 'Lombar sempre colada no chão.'],
    erros: ['Arquear a lombar', 'Pernas muito baixas no início'],
    leve: 'Pernas mais altas (mais perto de 90°).',
  },
  russian: {
    nome: 'Rotação russa', grupo: 'Oblíquos', emoji: '🔄', vista: 'frente', dur: 1.6, chao: true,
    frames: [[90,67, 94,82, 100,118, 84,98, 74,108, 90,100, 76,110, 88,100, 86,114, 112,100, 114,114],
             [110,67, 106,82, 100,118, 116,98, 126,108, 110,100, 124,110, 88,100, 86,114, 112,100, 114,114]],
    como: ['Sentado, tronco inclinado para trás, joelhos dobrados.', 'Mãos unidas à frente do peito.', 'Gire o tronco de um lado para o outro tocando o chão ao lado do quadril.'],
    erros: ['Curvar as costas', 'Girar só os braços'],
    leve: 'Mantenha os pés apoiados no chão.',
  },
  deadbug: {
    nome: 'Dead bug', grupo: 'Core profundo', emoji: '🐞', dur: 2.2, chao: true,
    frames: [[46,114, 60,117, 95,119, 61,100, 62,82, 60,100, 61,82, 97,96, 119,97, 96,97, 118,98],
             [46,114, 60,117, 95,119, 61,100, 62,82, 43,115, 26,114, 118,113, 141,116, 96,97, 118,98]],
    como: ['Deitado, braços para o teto, joelhos a 90° no ar.', 'Estenda braço e perna opostos devagar.', 'Volte e troque o lado, lombar colada no chão.'],
    erros: ['Lombar arqueando', 'Movimento rápido'],
    leve: 'Estenda só a perna, braços parados.',
  },
  superman: {
    nome: 'Super-homem', grupo: 'Lombar e postura', emoji: '🦸', dur: 2, chao: true,
    frames: [P.brucos, [152,104, 137,111, 98,119, 156,105, 174,98, 156,106, 173,99, 74,116, 52,108, 74,117, 52,109]],
    como: ['Deitado de barriga para baixo, braços estendidos à frente.', 'Eleve braços, peito e pernas ao mesmo tempo.', 'Segure 1–2 segundos e desça.'],
    erros: ['Jogar a cabeça para trás', 'Movimento brusco'],
    leve: 'Eleve só braços ou só pernas.',
  },
  cobra: {
    nome: 'Alongamento cobra', grupo: 'Alongamento', emoji: '🐍', dur: 3, chao: true, isometrico: true,
    frames: [[150,115, 136,118, 98,119, 140,121, 152,122, 139,122, 151,123, 74,120, 50,121, 74,121, 50,122],
             [138,79, 128,90, 98,118, 132,107, 136,123, 130,107, 134,123, 74,120, 50,121, 74,121, 50,122]],
    como: ['Deitado de barriga para baixo, mãos ao lado do peito.', 'Estenda os braços elevando o peito, quadril no chão.', 'Respire fundo alongando o abdômen.'],
    erros: ['Encolher os ombros', 'Forçar a lombar'],
    leve: 'Apoie os antebraços (posição da esfinge).',
  },
  caminhada: {
    nome: 'Caminhada', grupo: 'Descanso ativo', emoji: '🚶', dur: 1.1,
    frames: [[100,30, 100,45, 100,80, 95,62, 92,78, 105,62, 110,77, 108,102, 114,124, 94,102, 88,124],
             [100,30, 100,45, 100,80, 105,62, 110,77, 95,62, 92,78, 94,102, 88,124, 108,102, 114,124]],
    como: ['Caminhe em ritmo moderado (dá para conversar, mas não cantar).', 'Postura ereta, abdômen levemente contraído.', 'Ideal: 30–40 minutos, de preferência juntos!'],
    erros: ['Ritmo lento demais', 'Esquecer a água'],
    leve: '20 minutos já contam.',
  },
  // ----- TAF -----
  corrida: {
    nome: 'Corrida', grupo: 'TAF · resistência', emoji: '🏃', dur: 0.7,
    frames: [[104,28, 102,43, 98,78, 92,58, 86,72, 110,56, 118,48, 114,96, 110,120, 90,100, 74,112],
             [104,28, 102,43, 98,78, 110,56, 118,48, 92,58, 86,72, 90,100, 74,112, 114,96, 110,120]],
    como: ['Tronco levemente inclinado à frente, olhar no horizonte.', 'Passada curta e rápida, pisando abaixo do quadril.', 'Braços a 90° balançando para frente e para trás.'],
    erros: ['Sair rápido demais e quebrar no fim', 'Passada longa batendo o calcanhar'],
    leve: 'Alterne 2 min trotando e 1 min caminhando.',
  },
  barra: {
    nome: 'Barra fixa', grupo: 'TAF · costas e braços', emoji: '🪜', vista: 'frente', dur: 2.2,
    extra: '<line x1="55" y1="22" x2="145" y2="22" stroke="#9aa0c0" stroke-width="5" stroke-linecap="round"/><line x1="55" y1="22" x2="55" y2="128" stroke="#9aa0c0" stroke-width="3" opacity=".5"/><line x1="145" y1="22" x2="145" y2="128" stroke="#9aa0c0" stroke-width="3" opacity=".5"/>',
    frames: [[100,42, 100,56, 100,90, 88,40, 84,22, 112,40, 116,22, 98,108, 92,120, 102,108, 108,120],
             [100,14, 100,32, 100,66, 80,36, 84,22, 120,36, 116,22, 98,84, 92,96, 102,84, 108,96]],
    como: ['Pegada pronada (palmas para frente), mãos na largura dos ombros.', 'Parta com os braços totalmente estendidos, sem balanço.', 'Suba até o queixo passar acima da barra e desça até estender os braços.'],
    erros: ['Balançar o corpo (kipping) — não conta no TAF', 'Não estender os braços na descida'],
    leve: 'Negativas: suba com ajuda de uma cadeira e desça em 5 segundos.',
  },
  remador: {
    nome: 'Abdominal remador', grupo: 'TAF · abdômen', emoji: '🚣', dur: 1.3, chao: true,
    frames: [[46,114, 60,117, 95,119, 42,118, 24,118, 43,119, 25,119, 118,119, 142,120, 118,120, 142,121],
             [93,69, 90,84, 95,119, 106,92, 118,100, 105,94, 117,102, 115,98, 124,120, 114,99, 122,121]],
    como: ['Deitado, pernas estendidas e braços estendidos acima da cabeça.', 'Suba o tronco flexionando as pernas e abrace/ultrapasse os joelhos com os braços.', 'Volte à posição inicial encostando as escápulas e as mãos no chão.'],
    erros: ['Não estender totalmente ao voltar (não conta)', 'Tirar o quadril do chão'],
    leve: 'Faça com os pés presos e amplitude menor.',
  },
  saltoDist: {
    nome: 'Salto em distância parado', grupo: 'TAF · potência', emoji: '🦘', dur: 1.4,
    extra: '<rect x="130" y="125" width="65" height="6" rx="3" fill="#e8c27a" opacity=".6"/><line x1="70" y1="120" x2="70" y2="132" stroke="#fff" stroke-width="2"/>',
    frames: [[90,52, 84,64, 68,94, 72,74, 60,80, 71,76, 59,82, 90,100, 86,125, 88,101, 84,125],
             [128,30, 124,44, 112,74, 136,44, 150,40, 135,46, 149,42, 134,80, 140,98, 132,82, 138,100],
             [168,52, 162,64, 146,94, 176,66, 190,64, 175,68, 189,67, 168,100, 164,125, 166,101, 162,125],
             [168,52, 162,64, 146,94, 176,66, 190,64, 175,68, 189,67, 168,100, 164,125, 166,101, 162,125]],
    como: ['Pés paralelos atrás da linha, sem pisar nela.', 'Agache balançando os braços para trás e salte projetando quadril e braços à frente.', 'Caia com os dois pés e não toque o chão atrás com as mãos (mede o ponto mais próximo da linha).'],
    erros: ['Cair sentado ou com a mão para trás', 'Saltar para cima em vez de para frente'],
    leve: 'Saltos curtos em sequência, focando na aterrissagem.',
  },
  saltoAlt: {
    nome: 'Salto em altura', grupo: 'TAF · impulsão', emoji: '⬆️', dur: 1.4,
    extra: '<line x1="60" y1="90" x2="140" y2="90" stroke="#ffc94d" stroke-width="3" stroke-dasharray="6 3"/><line x1="60" y1="88" x2="60" y2="128" stroke="#9aa0c0" stroke-width="3"/><line x1="140" y1="88" x2="140" y2="128" stroke="#9aa0c0" stroke-width="3"/>',
    frames: [[102,50, 96,64, 80,95, 82,74, 70,80, 81,76, 69,82, 104,99, 101,125, 102,100, 98,125],
             [100,10, 100,25, 100,58, 108,22, 114,8, 92,22, 86,8, 112,70, 104,86, 110,72, 102,88]],
    como: ['Posicione-se de frente/lado para o sarrafo conforme o edital.', 'Agache, balance os braços e impulsione para cima com força.', 'Encolha as pernas para passar sem derrubar o sarrafo.'],
    erros: ['Corrida de aproximação fora da regra do edital', 'Encostar no sarrafo'],
    leve: 'Agachamento com salto e saltos no degrau.',
  },
};

// Ossos: [a,b] índices de articulações; trás (b) primeiro para ficar atrás
const OSSOS_TRAS = [[1, 5], [5, 6], [2, 9], [9, 10]];
const OSSOS_FRENTE = [[0, 1], [1, 2], [2, 7], [7, 8], [1, 3], [3, 4]];

let uid = 0;
export function figura(id, { cor = '#7c5cff', tam = 200, animar = true } = {}) {
  const ex = EXERCICIOS[id];
  if (!ex) return '';
  const fr = ex.frames.length === 2 ? [ex.frames[0], ex.frames[1], ex.frames[0]] : ex.frames;
  const n = fr.length;
  const dur = (ex.dur * (n - 1)) / 2 + 's';
  const keyTimes = fr.map((_, i) => (i / (n - 1)).toFixed(3)).join(';');
  const splines = Array(n - 1).fill('0.45 0 0.55 1').join(';');
  const g = `grad${++uid}`;
  const base = animar ? fr[0] : fr[Math.floor((n - 1) / 2)];
  const anim = (attr, vals) =>
    animar ? `<animate attributeName="${attr}" values="${vals.join(';')}" dur="${dur}" repeatCount="indefinite" calcMode="spline" keyTimes="${keyTimes}" keySplines="${splines}"/>` : '';
  const pt = (f, j) => [f[j * 2], f[j * 2 + 1]];
  const linha = ([a, b], stroke, w) => {
    const [x1, y1] = pt(base, a), [x2, y2] = pt(base, b);
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round">` +
      anim('x1', fr.map((f) => pt(f, a)[0])) + anim('y1', fr.map((f) => pt(f, a)[1])) +
      anim('x2', fr.map((f) => pt(f, b)[0])) + anim('y2', fr.map((f) => pt(f, b)[1])) + '</line>';
  };
  const [hx, hy] = pt(base, 0);
  const tapete = ex.chao ? `<rect x="20" y="124" width="170" height="5" rx="2.5" fill="${cor}" opacity=".25"/>` : '';
  return `<svg viewBox="0 0 200 140" width="100%" style="max-width:${tam}px" role="img" aria-label="${ex.nome}">
  <defs><linearGradient id="${g}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${cor}" stop-opacity=".18"/><stop offset="1" stop-color="${cor}" stop-opacity="0"/></linearGradient></defs>
  <rect x="0" y="0" width="200" height="140" rx="16" fill="url(#${g})"/>
  <line x1="10" y1="128" x2="190" y2="128" stroke="currentColor" stroke-opacity=".25" stroke-width="2" stroke-linecap="round"/>
  ${tapete}${ex.extra || ''}
  ${OSSOS_TRAS.map((o) => linha(o, cor + '88', 7)).join('')}
  ${OSSOS_FRENTE.map((o) => linha(o, cor, 8)).join('')}
  <circle cx="${hx}" cy="${hy}" r="9" fill="${cor}">${anim('cx', fr.map((f) => f[0]))}${anim('cy', fr.map((f) => f[1]))}</circle>
</svg>`;
}
