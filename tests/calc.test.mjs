import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as C from '../js/calc.js';
import { treinoDoDia, SEMANAS } from '../js/plano.js';
import { calcPrato, RECEITAS, ALIMENTOS } from '../js/nutricao.js';
import { EXERCICIOS } from '../js/exercicios.js';

test('IMC e classificação', () => {
  assert.equal(C.imc(80, 175), 26.1);
  assert.equal(C.classeImc(26.1), 'Sobrepeso');
  assert.equal(C.classeImc(22), 'Peso adequado');
  assert.equal(C.imc(null, 170), null);
});

test('TMB Mifflin-St Jeor', () => {
  assert.equal(C.tmb({ sexo: 'M', peso: 80, altura: 175, idade: 30 }), 1749);
  assert.equal(C.tmb({ sexo: 'F', peso: 70, altura: 165, idade: 30 }), 1420);
});

test('meta de calorias respeita piso', () => {
  assert.equal(C.metaKcal({ sexo: 'F', peso: 50, altura: 150, idade: 50 }), 1200);
  assert.equal(C.metaKcal({ sexo: 'M', peso: 80, altura: 175, idade: 30 }), 1900);
});

test('água e proteína', () => {
  assert.equal(C.aguaMeta(70), 2450);
  assert.equal(C.aguaMeta(null), 2000);
  assert.equal(C.proteinaMeta(70), 112);
});

test('fator de porção limitado', () => {
  assert.equal(C.porcaoFator(1600), 1);
  assert.equal(C.porcaoFator(1000), 0.8);
  assert.equal(C.porcaoFator(4000), 1.6);
});

test('carboidrato por refeição (diabetes)', () => {
  assert.equal(C.carbStatus(40, true), 'ok');
  assert.equal(C.carbStatus(50, true), 'atencao');
  assert.equal(C.carbStatus(70, true), 'alto');
  assert.equal(C.carbStatus(50, false), 'ok');
});

test('tipos de dieta', () => {
  assert.equal(C.limiteCarb('ceto'), 10);
  assert.equal(C.limiteCarb('lowcarb', true), 25);
  assert.equal(C.carbStatus(20, false, 'lowcarb'), 'ok');
  assert.equal(C.carbStatus(30, false, 'lowcarb'), 'atencao');
  assert.equal(C.carbStatus(20, false, 'ceto'), 'alto');
  assert.equal(C.carbDia('ceto'), 30);
});

test('jejum intermitente', () => {
  assert.deepEqual(C.janelaAlimentar('12:00', '16:8'), { abre: '12:00', fecha: '20:00' });
  assert.deepEqual(C.janelaAlimentar('18:00', '12:12'), { abre: '18:00', fecha: '06:00' });
  assert.equal(C.dentroJanela('13:00', '12:00', '20:00'), true);
  assert.equal(C.dentroJanela('07:30', '12:00', '20:00'), false);
  assert.equal(C.dentroJanela('02:00', '18:00', '06:00'), true);
  assert.equal(C.fmtHoras(13.5), '13h30');
});

test('TAF apto e progresso', () => {
  assert.equal(C.tafApto(2500, 2400, true), true);
  assert.equal(C.tafApto(20, 25, true), false);
  assert.equal(C.tafApto(90, 102, false), true);
  assert.equal(C.tafApto(null, 10), null);
  assert.equal(C.tafProgresso(1200, 2400), 0.5);
  assert.equal(C.imcApto(31), false);
  assert.equal(C.imcApto(24), true);
});

test('glicemia antes do treino', () => {
  assert.equal(C.glicemiaAlerta(60).nivel, 'hipo');
  assert.equal(C.glicemiaAlerta(85).nivel, 'baixa');
  assert.equal(C.glicemiaAlerta(140).nivel, 'ok');
  assert.equal(C.glicemiaAlerta(300).nivel, 'alta');
});

test('semana e dia', () => {
  assert.deepEqual(C.semanaDia(0), { semana: 1, dia: 1 });
  assert.deepEqual(C.semanaDia(13), { semana: 2, dia: 7 });
  assert.deepEqual(C.semanaDia(99), { semana: 6, dia: 7 });
});

test('horários de água', () => {
  assert.deepEqual(C.horariosIntervalo('08:00', '11:00', 60), ['08:00', '09:00', '10:00', '11:00']);
});

test('sequência de treinos', () => {
  assert.equal(C.sequencia(['2026-11-07', '2026-11-08', '2026-11-09'], '2026-11-09'), 3);
  assert.equal(C.sequencia(['2026-11-07', '2026-11-08'], '2026-11-09'), 2);
  assert.equal(C.sequencia(['2026-11-05'], '2026-11-09'), 0);
});

test('plano progride em intensidade', () => {
  for (let i = 1; i < SEMANAS.length; i++) {
    const a = SEMANAS[i - 1], b = SEMANAS[i];
    assert.ok(b.work * b.rounds >= a.work * a.rounds, `semana ${i + 1}`);
  }
  for (let d = 0; d < 42; d++) {
    const t = treinoDoDia(d, false);
    for (const id of t.exercicios) assert.ok(EXERCICIOS[id], `exercício ${id} no dia ${d}`);
  }
  assert.equal(treinoDoDia(6).tipo, 'descanso');
  assert.ok(treinoDoDia(32).exercicios.includes('burpee'));
  assert.ok(!treinoDoDia(4).exercicios.includes('burpee'));
});

test('receitas usam alimentos existentes e somam macros', () => {
  for (const r of RECEITAS) for (const [id] of r.itens) assert.ok(ALIMENTOS[id], `${r.nome}: ${id}`);
  const t = calcPrato([['frango', 100], ['arroz', 100]]);
  assert.equal(Math.round(t.kcal), 283);
  assert.equal(Math.round(t.carb), 26);
});
