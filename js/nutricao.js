// Tabela de alimentos por 100 g (valores aproximados, base TACO/USDA)
// cat: veg | prot | carb | gord | fruta | lat   ig: B (baixo) M (médio) A (alto)
const A = (nome, emoji, cat, kcal, carb, prot, gord, fibra, ig = 'B', medida = '') =>
  ({ nome, emoji, cat, kcal, carb, prot, gord, fibra, ig, medida });

export const ALIMENTOS = {
  frango:    A('Peito de frango grelhado', '🍗', 'prot', 159, 0, 32, 2.5, 0, 'B', '1 filé médio ≈ 120 g'),
  tilapia:   A('Tilápia grelhada', '🐟', 'prot', 128, 0, 26, 2.7, 0, 'B', '1 filé ≈ 150 g'),
  salmao:    A('Salmão grelhado', '🍣', 'prot', 206, 0, 22, 12, 0, 'B', '1 posta ≈ 120 g'),
  patinho:   A('Patinho moído refogado', '🥩', 'prot', 219, 0, 35.9, 7.3, 0, 'B', '4 col. sopa ≈ 100 g'),
  ovo:       A('Ovo cozido', '🥚', 'prot', 146, 0.6, 13.3, 9.5, 0, 'B', '1 ovo ≈ 50 g'),
  atum:      A('Atum em água (lata)', '🐠', 'prot', 116, 0, 26, 1, 0, 'B', '1 lata drenada ≈ 120 g'),
  tofu:      A('Tofu', '🧈', 'prot', 76, 1.9, 8, 4.8, 0.3, 'B', '1 fatia ≈ 80 g'),
  ricota:    A('Ricota', '🧀', 'lat', 140, 3.8, 12.6, 8.1, 0, 'B', '1 fatia ≈ 30 g'),
  iogurte:   A('Iogurte natural desnatado', '🥛', 'lat', 41, 5.8, 3.8, 0.3, 0, 'B', '1 pote ≈ 170 g'),
  arroz:     A('Arroz integral cozido', '🍚', 'carb', 124, 25.8, 2.6, 1, 2.7, 'M', '1 col. servir ≈ 45 g'),
  feijao:    A('Feijão carioca cozido', '🫘', 'carb', 76, 13.6, 4.8, 0.5, 8.5, 'B', '1 concha ≈ 80 g'),
  lentilha:  A('Lentilha cozida', '🟤', 'carb', 93, 16.3, 6.3, 0.5, 7.9, 'B', '1 concha ≈ 100 g'),
  grao:      A('Grão-de-bico cozido', '🧆', 'carb', 164, 27, 8.9, 2.6, 7.6, 'B', '3 col. sopa ≈ 60 g'),
  batataDoce:A('Batata-doce cozida', '🍠', 'carb', 77, 18.4, 0.6, 0.1, 2.2, 'M', '1 pedaço médio ≈ 80 g'),
  quinoa:    A('Quinoa cozida', '🌾', 'carb', 120, 21.3, 4.4, 1.9, 2.8, 'B', '3 col. sopa ≈ 60 g'),
  aveia:     A('Aveia em flocos', '🥣', 'carb', 394, 66.6, 13.9, 8.5, 9.1, 'B', '1 col. sopa ≈ 15 g'),
  paoInt:    A('Pão integral', '🍞', 'carb', 253, 49.9, 9.4, 3.7, 6.9, 'M', '1 fatia ≈ 25 g'),
  abobora:   A('Abóbora cabotiá cozida', '🎃', 'veg', 48, 10.8, 1.4, 0.7, 2.5, 'M', '1 xícara ≈ 150 g'),
  brocolis:  A('Brócolis cozido', '🥦', 'veg', 25, 4.4, 2.1, 0.5, 3.4, 'B', '1 xícara ≈ 100 g'),
  couveflor: A('Couve-flor cozida', '🤍', 'veg', 19, 3.9, 1.2, 0.2, 2.1, 'B', '1 xícara ≈ 100 g'),
  abobrinha: A('Abobrinha refogada', '🥒', 'veg', 20, 4.2, 1.1, 0.2, 1.6, 'B', '1 xícara ≈ 100 g'),
  alface:    A('Alface', '🥬', 'veg', 11, 1.7, 1.3, 0.2, 1.8, 'B', '1 prato raso ≈ 30 g'),
  rucula:    A('Rúcula', '🌿', 'veg', 13, 2.2, 1.8, 0.1, 1.7, 'B', '1 prato raso ≈ 30 g'),
  tomate:    A('Tomate', '🍅', 'veg', 15, 3.1, 1.1, 0.2, 1.2, 'B', '1 unidade ≈ 100 g'),
  pepino:    A('Pepino', '🥒', 'veg', 10, 2, 0.9, 0.1, 1.1, 'B', '½ unidade ≈ 60 g'),
  cenoura:   A('Cenoura crua ralada', '🥕', 'veg', 34, 7.7, 1.3, 0.2, 3.2, 'B', '2 col. sopa ≈ 30 g'),
  espinafre: A('Espinafre cozido', '🥬', 'veg', 23, 3.8, 2.9, 0.3, 2.5, 'B', '½ xícara ≈ 50 g'),
  berinjela: A('Berinjela assada', '🍆', 'veg', 19, 4.5, 0.7, 0.1, 2.5, 'B', '1 unidade ≈ 200 g'),
  vagem:     A('Vagem cozida', '🫛', 'veg', 25, 5.3, 1.8, 0.2, 2.4, 'B', '1 xícara ≈ 100 g'),
  cogumelo:  A('Cogumelo champignon', '🍄', 'veg', 22, 3.3, 3.1, 0.3, 1, 'B', '½ xícara ≈ 50 g'),
  cebola:    A('Cebola', '🧅', 'veg', 39, 8.9, 1.7, 0.1, 2.2, 'B', '2 col. sopa ≈ 20 g'),
  azeite:    A('Azeite extravirgem', '🫒', 'gord', 884, 0, 0, 100, 0, 'B', '1 col. chá ≈ 5 g'),
  abacate:   A('Abacate', '🥑', 'gord', 96, 6, 1.2, 8.4, 6.3, 'B', '2 col. sopa ≈ 40 g'),
  castanha:  A('Castanha-do-pará', '🌰', 'gord', 643, 15.1, 14.5, 63.5, 7.9, 'B', '2 unidades ≈ 10 g'),
  chia:      A('Chia', '⚫', 'gord', 486, 42, 16.5, 30.7, 34, 'B', '1 col. sopa ≈ 10 g'),
  morango:   A('Morango', '🍓', 'fruta', 30, 6.8, 0.9, 0.3, 1.7, 'B', '6 unidades ≈ 80 g'),
  maca:      A('Maçã com casca', '🍎', 'fruta', 56, 15.2, 0.3, 0.1, 1.3, 'B', '1 pequena ≈ 100 g'),
  mamao:     A('Mamão papaia', '🍈', 'fruta', 40, 10.4, 0.5, 0.1, 1, 'M', '½ papaia ≈ 150 g'),
  // Opções econômicas
  sobrecoxa: A('Sobrecoxa de frango assada (sem pele)', '🍗', 'prot', 233, 0, 29.2, 12, 0, 'B', '1 unidade ≈ 100 g'),
  sardinha:  A('Sardinha em lata ao molho de tomate', '🐟', 'prot', 185, 0.7, 20.9, 10.5, 0, 'B', '1 lata drenada ≈ 100 g'),
  figado:    A('Fígado bovino grelhado', '🥩', 'prot', 225, 4.2, 29.9, 9, 0, 'B', '1 bife ≈ 100 g'),
  feijaoPreto: A('Feijão preto cozido', '🫘', 'carb', 77, 14, 4.5, 0.5, 8.4, 'B', '1 concha ≈ 80 g'),
  arrozBranco: A('Arroz branco cozido', '🍚', 'carb', 128, 28.1, 2.5, 0.2, 1.6, 'A', '1 col. servir ≈ 45 g'),
  cuscuz:    A('Cuscuz de milho cozido', '🌽', 'carb', 113, 25.3, 2.2, 0.7, 2.1, 'A', '1 fatia ≈ 80 g'),
  repolho:   A('Repolho cru', '🥬', 'veg', 17, 3.9, 0.9, 0.1, 1.9, 'B', '1 xícara ≈ 60 g'),
  chuchu:    A('Chuchu cozido', '🥒', 'veg', 19, 4.8, 0.4, 0.1, 1, 'B', '1 xícara ≈ 120 g'),
  couve:     A('Couve refogada', '🥬', 'veg', 40, 4.3, 2.9, 2, 3.1, 'B', '½ xícara ≈ 50 g'),
  beterraba: A('Beterraba cozida', '🟣', 'veg', 32, 7.2, 1.3, 0.1, 1.9, 'M', '3 col. sopa ≈ 60 g'),
  banana:    A('Banana prata', '🍌', 'fruta', 98, 26, 1.3, 0.1, 2, 'M', '1 pequena ≈ 60 g'),
  laranja:   A('Laranja', '🍊', 'fruta', 37, 8.9, 1, 0.1, 0.8, 'B', '1 média ≈ 130 g'),
  amendoim:  A('Amendoim torrado sem sal', '🥜', 'gord', 606, 18.7, 22.5, 54, 7.8, 'B', '1 col. sopa ≈ 10 g'),
};

// Preço médio estimado em R$/kg do alimento pronto (varia por região e época)
const PRECOS = {
  frango: 22, tilapia: 50, salmao: 90, patinho: 45, ovo: 14, atum: 80, tofu: 40, ricota: 35, iogurte: 15,
  arroz: 4, feijao: 3.5, lentilha: 6, grao: 7, batataDoce: 6, quinoa: 18, aveia: 15, paoInt: 18, abobora: 5,
  brocolis: 15, couveflor: 12, abobrinha: 7, alface: 15, rucula: 20, tomate: 8, pepino: 6, cenoura: 5, espinafre: 20,
  berinjela: 7, vagem: 12, cogumelo: 40, cebola: 5, azeite: 50, abacate: 10, castanha: 120, chia: 50, morango: 25,
  maca: 10, mamao: 6, sobrecoxa: 18, sardinha: 40, figado: 18, feijaoPreto: 3.5, arrozBranco: 2.5, cuscuz: 3,
  repolho: 4, chuchu: 4, couve: 12, beterraba: 5, banana: 6, laranja: 4, amendoim: 25,
};
for (const [id, rs] of Object.entries(PRECOS)) ALIMENTOS[id].rs = rs;
export const faixaPreco = (rs) => (rs <= 20 ? '$' : rs <= 45 ? '$$' : '$$$');
export const LIMITE_ECONOMICO = 6; // R$ por prato (porção base)

export const DICAS_ECONOMIA = [
  ['🥚', 'Ovo é a proteína mais barata e completa: 2 ovos ≈ R$ 1,40.'],
  ['🍗', 'Troque peito por sobrecoxa sem pele, fígado ou sardinha em lata.'],
  ['🫘', 'Feijão, lentilha e grão-de-bico secos rendem muito: cozinhe 1 kg e congele em porções.'],
  ['🍚', 'Arroz branco é barato, mas sobe a glicemia: misture com bastante feijão e salada (Talita: no máx. 3 col. sopa).'],
  ['🥬', 'Repolho, chuchu, abóbora, cenoura e couve são os vegetais mais baratos e enchem metade do prato.'],
  ['🍊', 'Prefira frutas da estação (laranja, banana, mamão). Compre na feira no fim do horário.'],
  ['🥜', 'Amendoim substitui castanhas com o mesmo benefício por 1/5 do preço.'],
  ['🧊', 'Cozinhem juntos no domingo e congelem marmitas da semana: economiza dinheiro e evita besteira.'],
];

// Lista de compras semanal econômica para 2 pessoas (preços estimados)
export const LISTA_ECONOMICA = [
  ['Ovos', '30 unidades', 21], ['Frango (sobrecoxa/coxa)', '1,5 kg', 20], ['Fígado bovino', '500 g', 9],
  ['Sardinha em lata', '3 latas', 18], ['Feijão (carioca ou preto)', '1 kg', 8], ['Arroz (integral ou branco)', '1 kg', 7],
  ['Fubá/flocão de milho para cuscuz', '500 g', 3], ['Aveia em flocos', '250 g', 5], ['Repolho', '1 unidade', 6],
  ['Chuchu, abobrinha e cenoura', '2 kg', 12], ['Abóbora', '1,5 kg', 8], ['Tomate e cebola', '2 kg', 14],
  ['Couve', '2 maços', 6], ['Banana e laranja', '2 kg cada', 18], ['Amendoim', '250 g', 6],
];

export const CATEGORIAS = {
  veg: { nome: 'Vegetais', cor: '#3ddc84', dica: '½ do prato' },
  prot: { nome: 'Proteínas', cor: '#ff7a59', dica: '¼ do prato' },
  carb: { nome: 'Carboidratos', cor: '#ffc94d', dica: '¼ do prato' },
  gord: { nome: 'Gorduras boas', cor: '#a3d65c', dica: 'pouca quantidade' },
  lat: { nome: 'Laticínios', cor: '#9ecbff', dica: 'complemento' },
  fruta: { nome: 'Frutas', cor: '#ff5c8a', dica: 'sobremesa/lanche' },
};

export function calcPrato(itens, fator = 1) {
  const t = { kcal: 0, carb: 0, prot: 0, gord: 0, fibra: 0, g: 0, custo: 0 };
  for (const [id, g0] of itens) {
    const a = ALIMENTOS[id];
    if (!a) continue;
    const g = g0 * fator;
    t.g += g;
    t.custo += ((a.rs || 0) * g) / 1000;
    for (const k of ['kcal', 'carb', 'prot', 'gord', 'fibra']) t[k] += (a[k] * g) / 100;
  }
  t.carbLiq = Math.max(0, t.carb - t.fibra);
  return t;
}

export const REFEICOES = { cafe: '☀️ Café da manhã', almoco: '🍽️ Almoço', lanche: '🍎 Lanche', jantar: '🌙 Jantar' };

const R = (id, nome, ref, itens, preparo, tags = []) => ({ id, nome, ref, itens, preparo, tags });

export const RECEITAS = [
  R('frango-ervas', 'Frango às ervas com arroz integral, feijão e salada arco-íris', 'almoco',
    [['frango', 120], ['arroz', 60], ['feijao', 80], ['alface', 30], ['tomate', 60], ['pepino', 40], ['cenoura', 30], ['azeite', 5]],
    'Tempere o frango com limão, alho, alecrim e páprica; grelhe 5 min de cada lado. Monte a salada colorida e regue com o azeite.', ['Clássico', 'Rico em fibras']),
  R('tilapia-limao', 'Tilápia ao limão com purê de couve-flor e brócolis', 'jantar',
    [['tilapia', 150], ['couveflor', 150], ['brocolis', 100], ['azeite', 5]],
    'Grelhe a tilápia com limão e ervas. Cozinhe a couve-flor e bata com uma pitada de sal, noz-moscada e o azeite até virar purê. Brócolis no vapor.', ['Low carb', 'Leve']),
  R('omelete-verde', 'Omelete recheada de espinafre, tomate e cogumelos', 'cafe',
    [['ovo', 100], ['espinafre', 50], ['tomate', 50], ['cogumelo', 50], ['ricota', 30], ['azeite', 3]],
    'Bata 2 ovos com sal e orégano. Refogue rapidamente os cogumelos e o espinafre, junte os ovos e finalize com tomate e ricota esfarelada.', ['Low carb', 'Proteico']),
  R('bowl-quinoa', 'Bowl de quinoa, grão-de-bico, abacate e rúcula', 'almoco',
    [['quinoa', 80], ['grao', 60], ['abacate', 40], ['rucula', 30], ['tomate', 50], ['pepino', 40], ['azeite', 5]],
    'Monte o bowl em fatias coloridas: quinoa, grão-de-bico tostado com cominho, abacate em cubos, rúcula, tomate e pepino. Molho: limão + azeite + hortelã.', ['Vegetariano', 'Rico em fibras']),
  R('salmao-batata', 'Salmão grelhado com batata-doce assada e vagem', 'almoco',
    [['salmao', 120], ['batataDoce', 80], ['vagem', 100], ['azeite', 3]],
    'Asse a batata-doce em rodelas com casca (200 °C, 25 min) com alecrim. Grelhe o salmão com gergelim. Vagem no vapor com alho.', ['Ômega-3']),
  R('escondidinho', 'Escondidinho fit de abóbora com patinho', 'jantar',
    [['patinho', 110], ['abobora', 150], ['cebola', 20], ['tomate', 60], ['ricota', 20], ['azeite', 3]],
    'Refogue o patinho com cebola, alho e tomate. Amasse a abóbora cozida como purê. Monte em refratário, cubra com ricota e gratine 10 min.', ['Conforto', 'Proteico']),
  R('iogurte-morango', 'Taça de iogurte com morango, chia e aveia', 'cafe',
    [['iogurte', 170], ['morango', 80], ['chia', 10], ['aveia', 15]],
    'Em uma taça, alterne camadas de iogurte, morangos picados, aveia e chia. Canela por cima. Sem açúcar!', ['Rápido', 'Rico em fibras']),
  R('wrap-atum', 'Wrap de alface com atum, ricota e cenoura', 'lanche',
    [['alface', 60], ['atum', 80], ['ricota', 30], ['tomate', 40], ['cenoura', 30]],
    'Misture o atum com ricota, limão e cebolinha. Recheie folhas grandes de alface americana com a pasta, cenoura e tomate e enrole.', ['Low carb', 'Prático']),
  R('lentilha-legumes', 'Lentilha cremosa com legumes e ovo pochê', 'almoco',
    [['lentilha', 100], ['abobrinha', 80], ['cenoura', 40], ['cebola', 20], ['ovo', 50], ['azeite', 3]],
    'Cozinhe a lentilha com louro. Refogue cebola, cenoura e abobrinha, junte a lentilha. Sirva com ovo pochê por cima.', ['Rico em fibras', 'Baixo IG']),
  R('espaguete-abobrinha', 'Espaguete de abobrinha à bolonhesa', 'jantar',
    [['abobrinha', 200], ['patinho', 110], ['tomate', 100], ['cebola', 20], ['azeite', 5]],
    'Corte a abobrinha em tiras finas (espiralizador ou descascador) e salteie 2 min. Molho: patinho, cebola, alho e tomate picado com manjericão.', ['Low carb', 'Favorito']),
  R('tofu-salteado', 'Tofu salteado com brócolis, cogumelos e arroz integral', 'jantar',
    [['tofu', 150], ['brocolis', 100], ['cogumelo', 80], ['arroz', 50], ['azeite', 5]],
    'Doure o tofu em cubos. Salteie brócolis e cogumelos com gengibre e shoyu light. Sirva com arroz integral e gergelim.', ['Vegetariano']),
  R('maca-castanha', 'Maçã com canela e castanhas', 'lanche',
    [['maca', 100], ['castanha', 10]],
    'Fatie a maçã, polvilhe canela e acompanhe com 2 castanhas-do-pará. A gordura boa ajuda a segurar a glicemia.', ['Rápido']),
  R('pao-ovo', 'Torrada integral com ovos mexidos e tomate', 'cafe',
    [['paoInt', 50], ['ovo', 100], ['tomate', 50]],
    'Toste 2 fatias de pão integral. Mexa 2 ovos em fogo baixo com sal e cebolinha. Sirva com rodelas de tomate e orégano.', ['Clássico']),
  R('berinjela-recheada', 'Berinjela recheada com frango e ricota', 'jantar',
    [['berinjela', 200], ['frango', 100], ['tomate', 60], ['ricota', 30], ['azeite', 3]],
    'Corte a berinjela ao meio e asse 15 min. Retire parte da polpa, misture com frango desfiado e tomate, recheie, cubra com ricota e gratine.', ['Low carb', 'Bonito']),
  R('iogurte-mamao', 'Mamão com iogurte e chia', 'lanche',
    [['mamao', 100], ['iogurte', 100], ['chia', 5]],
    'Sirva o mamão em cubos com iogurte e chia. A chia e o iogurte diminuem o pico de açúcar da fruta.', ['Intestino feliz']),
  // ----- Econômicas -----
  R('pf-ovo', 'PF econômico: arroz, feijão, ovo e salada de repolho', 'almoco',
    [['arrozBranco', 50], ['feijao', 100], ['ovo', 100], ['repolho', 60], ['tomate', 50], ['cenoura', 30]],
    'Ovos cozidos ou mexidos com pouco óleo. Salada de repolho fininho com tomate, cenoura ralada, limão e sal. Mais feijão que arroz: segura a glicemia.', ['Econômico', 'Clássico']),
  R('cuscuz-ovo', 'Cuscuz nordestino com ovo mexido e tomate', 'cafe',
    [['cuscuz', 80], ['ovo', 100], ['tomate', 50]],
    'Hidrate o flocão com água e sal e cozinhe no vapor (cuscuzeira) por 10 min. Sirva com ovos mexidos e tomate picado.', ['Econômico', 'Proteico']),
  R('sobrecoxa-abobora', 'Sobrecoxa assada com abóbora e couve refogada', 'almoco',
    [['sobrecoxa', 110], ['abobora', 120], ['couve', 50], ['cebola', 20]],
    'Tempere a sobrecoxa (sem pele) com alho, limão, colorau e ervas; asse 40 min a 200 °C junto com a abóbora em cubos. Couve refogada no alho.', ['Econômico', 'Low carb']),
  R('sardinha-chuchu', 'Sardinha com chuchu refogado e feijão preto', 'almoco',
    [['sardinha', 100], ['chuchu', 120], ['feijaoPreto', 80], ['arrozBranco', 40]],
    'Aqueça a sardinha com cebola e cheiro-verde. Chuchu em cubos refogado com alho e tomate. Sirva com feijão preto e pouco arroz.', ['Econômico', 'Ômega-3']),
  R('figado-acebolado', 'Fígado acebolado com purê de abóbora e salada', 'jantar',
    [['figado', 100], ['cebola', 30], ['abobora', 120], ['alface', 30], ['tomate', 50]],
    'Deixe o fígado no limão 15 min, grelhe rapidamente com muita cebola. Purê: abóbora cozida amassada com sal e salsinha.', ['Econômico', 'Rico em ferro']),
  R('omelete-feira', 'Omelete de legumes da feira', 'jantar',
    [['ovo', 100], ['abobrinha', 60], ['cenoura', 30], ['tomate', 40], ['cebola', 20], ['repolho', 40]],
    'Refogue a abobrinha, cenoura ralada e cebola; junte 2 ovos batidos, tampe e doure dos dois lados. Salada de repolho ao lado.', ['Econômico', 'Low carb']),
  R('sopa-feijao', 'Sopa de feijão com legumes e frango', 'jantar',
    [['feijaoPreto', 150], ['chuchu', 60], ['cenoura', 40], ['repolho', 40], ['cebola', 20], ['sobrecoxa', 50]],
    'Bata parte do feijão cozido com o caldo, junte frango desfiado, chuchu, cenoura e repolho picados e cozinhe 15 min. Rende várias porções para congelar.', ['Econômico', 'Conforto']),
  R('banana-aveia', 'Banana amassada com aveia e canela', 'lanche',
    [['banana', 60], ['aveia', 15]],
    'Amasse a banana, misture a aveia e bastante canela. A fibra da aveia ajuda a frear o açúcar da banana.', ['Econômico', 'Rápido']),
  R('laranja-amendoim', 'Laranja com amendoim', 'lanche',
    [['laranja', 130], ['amendoim', 10]],
    'Coma a laranja em gomos (não em suco!) com 1 colher de sopa de amendoim sem sal.', ['Econômico', 'Rápido']),
  R('ovo-beterraba', 'Ovos cozidos com salada de beterraba e cenoura', 'lanche',
    [['ovo', 100], ['beterraba', 60], ['cenoura', 30]],
    'Cozinhe os ovos 10 min. Beterraba cozida em cubos com cenoura ralada, limão e sal.', ['Econômico', 'Proteico']),
  // ----- Low carb / cetogênica -----
  R('ceto-salmao', 'Salmão com brócolis no alho e abacate', 'almoco',
    [['salmao', 130], ['brocolis', 120], ['abacate', 50], ['azeite', 5]],
    'Grelhe o salmão com sal, pimenta e limão. Brócolis salteado no azeite com alho. Sirva com fatias de abacate e sal.', ['Cetogênica', 'Ômega-3']),
  R('ceto-sobrecoxa', 'Sobrecoxa crocante com couve e salada de repolho', 'almoco',
    [['sobrecoxa', 130], ['couve', 60], ['repolho', 60], ['tomate', 30], ['azeite', 5]],
    'Asse a sobrecoxa temperada até dourar. Couve refogada no alho. Salada de repolho com limão, azeite e sal.', ['Cetogênica', 'Econômico']),
  R('ceto-ovo-abacate', 'Ovos cozidos com abacate e sal', 'lanche',
    [['ovo', 100], ['abacate', 50]],
    'Cozinhe 2 ovos por 10 min. Sirva com abacate em fatias, sal, pimenta e um fio de limão.', ['Cetogênica', 'Rápido']),
  R('ceto-cafe', 'Ovos mexidos com cogumelos, espinafre e ricota', 'cafe',
    [['ovo', 150], ['cogumelo', 50], ['espinafre', 50], ['ricota', 20], ['azeite', 5]],
    'Refogue cogumelos e espinafre no azeite, junte 3 ovos batidos e mexa em fogo baixo. Finalize com ricota esfarelada.', ['Cetogênica', 'Proteico']),
];
