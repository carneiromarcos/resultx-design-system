/*
  Protótipo Electia — Assessments, Testes personalizados e Ranking (06/10/2026).
  Comportamento da página electia-assessments-2026-10-06.html. Dados fictícios.
  Ficha: docs/research/electia-assessments-2026-10-06.md
*/
document.addEventListener('DOMContentLoaded', () => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const esc = (t) => String(t).replace(/[&<>"]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
  const pct = (n) => `${Math.round(n)}%`;
  const media = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);
  const virgula = (n, casas = 1) => n.toFixed(casas).replace('.', ',');

  /* ── Modelos (texto do app: tests/page.tsx L45-99, behavioral-catalog.ts,
     types/database.ts L281-299) ─────────────────────────────────────── */
  const TESTES = [
    { id: 'disc', nome: 'DISC', q: 24, min: 8, revela: '4 dimensões',
      desc: 'Perfil comportamental em 4 dimensões: Dominância, Influência, Estabilidade e Conformidade.' },
    { id: 'tipologia', nome: 'Tipologia Cognitiva', q: 60, min: 10, revela: '16 tipos',
      desc: '16 tipos cognitivos baseados em 4 dicotomias de preferências mentais.' },
    { id: 'eneagrama', nome: 'Eneagrama', q: 45, min: 8, revela: '9 tipos · 3 centros',
      desc: '9 tipos de personalidade com asas, centros e setas de integração/estresse.' },
    { id: 'bigfive', nome: 'Big Five', q: 120, min: 15, revela: '5 domínios · 30 facetas',
      desc: 'IPIP-NEO-120: 5 domínios e 30 facetas — o modelo mais validado cientificamente.' },
    { id: 'temperamentos', nome: 'Temperamentos', q: 70, min: 12, revela: '16 perfis',
      desc: '4 temperamentos clássicos (colérico, sanguíneo, fleumático, melancólico) + 12 misturas — 16 perfis no total.' },
    { id: 'motivadores', nome: 'Motivadores', q: 10, min: 5, revela: '6 valores',
      desc: '6 valores motivacionais de Spranger: o que move cada colaborador.' },
  ];
  const SITU = [
    { id: 'n1', nivel: 1, nome: 'Cenários de Postura', itens: '≈8 itens', extra: '3 abordagens de resposta',
      desc: 'Cenários que revelam comportamento real sob pressão e dilemas éticos.' },
    { id: 'n2', nivel: 2, nome: 'Inventário de Práticas', itens: '≈8 itens', extra: 'Autoavaliação',
      desc: 'Autoavaliação ancorada em comportamentos observáveis.' },
    { id: 'n3', nivel: 3, nome: 'Diagnóstico de Liderança', itens: '≈8 itens', extra: '3 abordagens de resposta',
      desc: 'Avaliação de gestores em dimensões críticas de liderança.' },
    { id: 'n4', nivel: 4, nome: 'Termômetro Organizacional', itens: '≈20 itens', extra: 'Anônimo',
      desc: 'Pesquisa anônima de clima — sem resultado individual.', anonimo: true },
  ];
  const MODELO = Object.fromEntries([...TESTES, ...SITU].map((m) => [m.id, m]));
  const MIN_ANONIMO = 5;

  /* ── Testes personalizados: envios comportamentais + módulos situacionais ───
     Totais batem com o dashboard (#85): 52 enviados, 37 concluídos. */
  const r = (id, modelo, titulo, status, enviados, respostas, prazo, dias, criado) =>
    ({ id, modelo, titulo, status, enviados, respostas, prazo, dias, criado });
  const RUNS = [
    r('r1', 'disc', 'Integração — Assistencial (outubro)', 'andamento', 12, 10, '09/10', 3, '02/10/2026'),
    r('r2', 'disc', 'Recepção — novos contratados', 'encerrado', 3, 3, '27/09', null, '20/09/2026'),
    r('r3', 'tipologia', 'Coordenações — liderança', 'andamento', 9, 6, '08/10', 2, '01/10/2026'),
    r('r4', 'eneagrama', 'Equipe de faturamento', 'andamento', 8, 5, '07/10', 1, '30/09/2026'),
    r('r5', 'bigfive', 'Enfermagem — turno da noite', 'expirado', 8, 6, '30/09', null, '23/09/2026'),
    r('r6', 'temperamentos', 'Atendimento — recepção e central', 'andamento', 5, 3, '11/10', 5, '04/10/2026'),
    r('r7', 'motivadores', 'Departamento Pessoal', 'andamento', 7, 4, '12/10', 6, '05/10/2026'),
    r('s1', 'n1', 'Postura sob pressão — Atendimento', 'andamento', 10, 6, '10/10', 4, '29/09/2026'),
    r('s2', 'n1', 'Dilemas éticos — Faturamento', 'rascunho', 0, 0, null, null, '05/10/2026'),
    r('s3', 'n2', 'Práticas de segurança do paciente', 'andamento', 14, 11, '12/10', 6, '03/10/2026'),
    r('s4', 'n3', 'Liderança — coordenadores', 'encerrado', 5, 5, '24/09', null, '15/09/2026'),
    r('s5', 'n4', 'Clima — 2º semestre', 'andamento', 40, 17, '13/10', 7, '06/10/2026'),
    r('s6', 'n4', 'Clima — Lavanderia', 'andamento', 6, 3, '13/10', 7, '06/10/2026'),
  ];
  const STATUS = {
    andamento: ['Em andamento', 'in-progress'], rascunho: ['Rascunho', 'draft'],
    encerrado: ['Encerrado', 'done'], expirado: ['Expirado', 'blocked'],
  };

  /* ── Ranking: pessoas, cargo, departamento, fit por teste e última AD ── */
  const CARGOS = {
    coord: ['Coordenadora de Enfermagem', true], enf: ['Enfermeiro(a)', true], tec: ['Técnico(a) de Enfermagem', true],
    recep: ['Recepcionista', true], dp: ['Analista de Departamento Pessoal', true], fat: ['Faturista', true],
    aux: ['Auxiliar administrativo', false],
  };
  const p = (nome, cargo, depto, testes, ad, adData) => ({ nome, cargo, depto, testes, ad, adData });
  const PESSOAS = [
    p('Helena Prado', 'coord', 'Assistencial', { disc: 92, tipologia: 88, eneagrama: 90, bigfive: 86, motivadores: 94 }, 3.8, '12/09/2026'),
    p('Tânia Rocha', 'tec', 'Assistencial', { disc: 90, bigfive: 87, temperamentos: 85, motivadores: 89 }, 3.4, '10/09/2026'),
    p('Otávio Sena', 'dp', 'Departamento Pessoal', { disc: 91, tipologia: 84, bigfive: 80, motivadores: 83 }, 3.6, '05/09/2026'),
    p('Renata Baptista', 'enf', 'Assistencial', { disc: 82, eneagrama: 79, bigfive: 84, temperamentos: 76 }, 2.9, '12/09/2026'),
    p('Igor Pacheco', 'tec', 'Assistencial', { disc: 80, tipologia: 74, motivadores: 81 }, 3.1, '10/09/2026'),
    p('Lívia Monteiro', 'recep', 'Atendimento', { disc: 77, temperamentos: 70, motivadores: 72 }, 2.6, '28/08/2026'),
    p('Saulo Teles', 'tec', 'Assistencial', { disc: 70, eneagrama: 62, bigfive: 66 }, 2.2, '10/09/2026'),
    p('Bianca Arruda', 'fat', 'Administrativo', { disc: 65, tipologia: 60, bigfive: 58 }, 1.8, '02/09/2026'),
    p('Murilo Cardoso', 'recep', 'Atendimento', { disc: 58, motivadores: 49 }, null, null),
    p('Joana Ribeiro', 'dp', 'Departamento Pessoal', { disc: 46, eneagrama: 41, temperamentos: 39 }, 2.4, '05/09/2026'),
    p('Vítor Queiroz', 'fat', 'Administrativo', { disc: 35 }, null, null),
    p('Camila Duarte', 'enf', 'Assistencial', {}, null, null),
    p('André Falcão', 'aux', 'Administrativo', { disc: 70 }, null, null),
    p('Patrícia Lemos', 'tec', 'Assistencial', {}, null, null),
  ].map((x) => {
    const valores = Object.values(x.testes);
    const temAlvo = CARGOS[x.cargo][1];
    return { ...x, cargoNome: CARGOS[x.cargo][0], fit: temAlvo && valores.length ? Math.round(media(valores)) : null, temAlvo };
  });

  const nav = $('#app-nav');

  /* ── Toast e "fora do protótipo" ─────────────────────────────────── */
  /* Duas regiões: a do <body> e a de dentro da gaveta. Com a gaveta aberta
     o script do DS deixa inert tudo o que é irmão dela (a região do <body>
     junto), e um aviso ali não seria lido nem visto. */
  const TOASTS = [$('[data-toast]'), $('[data-toast-gaveta]')];
  let toastTimer;
  function avisar(texto) {
    const gavetaAberta = nav.hasAttribute('data-open');
    const [alvo, outro] = gavetaAberta ? [TOASTS[1], TOASTS[0]] : TOASTS;
    outro.hidden = true;
    outro.textContent = '';
    alvo.textContent = texto;
    alvo.hidden = false;
    if (gavetaAberta) reservarAvisoNaGaveta();
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { alvo.hidden = true; liberarAvisoNaGaveta(); }, 4000);
  }
  /* O aviso grudado no pé da gaveta reserva a própria altura no
     scroll-padding dela: foco por Tab e scrollIntoView param acima dele. O
     item já focado volta para a área livre na hora. */
  function reservarAvisoNaGaveta() {
    const altura = TOASTS[1].parentElement.getBoundingClientRect().height;
    nav.style.scrollPaddingBlockEnd = `${Math.ceil(altura) + 8}px`;
    liberarItemFocado();
  }
  function liberarAvisoNaGaveta() { nav.style.scrollPaddingBlockEnd = ''; }
  /* O Chrome não aplica o scroll-padding na rolagem do foco por Tab (o item
     parava rente ao pé, metade sob o aviso). Aqui, a cada foco na gaveta com
     o aviso visível, o item sobe até ficar inteiro acima dele. */
  function liberarItemFocado() {
    const aviso = TOASTS[1];
    const a = document.activeElement;
    if (aviso.hidden || !nav.contains(a) || aviso.parentElement.contains(a)) return;
    const topoAviso = aviso.parentElement.getBoundingClientRect().top;
    const r = a.getBoundingClientRect();
    if (r.bottom > topoAviso - 4) nav.scrollTop += r.bottom - topoAviso + 8;
    if (a.getBoundingClientRect().top < nav.getBoundingClientRect().top) a.scrollIntoView({ block: 'start', behavior: 'instant' });
  }
  nav.addEventListener('focusin', () => requestAnimationFrame(liberarItemFocado));
  nav.addEventListener('sidebartoggle', () => { TOASTS.forEach((t) => { t.hidden = true; }); liberarAvisoNaGaveta(); });
  document.addEventListener('click', (ev) => {
    const fora = ev.target.closest('[data-fora], [data-fora-btn]');
    if (fora) {
      ev.preventDefault();
      const nome = (fora.dataset.label || fora.dataset.foraBtn || fora.querySelector('.sidebar-label')?.textContent || fora.textContent).replace(/\s+/g, ' ').trim();
      avisar(`“${nome}” fica fora deste protótipo.`);
      return;
    }
    if (ev.target.closest('#app-nav a') && nav.hasAttribute('data-open')) window.ResultXSidebarOverlay?.close(nav);
  });

  /* ── CANDIDATO 21: dica das marcas dos gráficos (WCAG 1.4.13) ────────
     Só ponteiro: o mesmo dado está no texto visível ou na tabela. A dica se
     ancora à marca, aceita o ponteiro sobre ela (hoverable), não some por
     tempo (persistent) e fecha com Escape sem mexer no foco (dismissible).
     Fechada com Escape, só reabre quando o ponteiro entra em outra marca. */
  const tip = $('[data-viz-tip]');
  const TIP_SAIDA_MS = 300; // folga para o ponteiro ir da marca à dica
  let tipDe = null;
  let tipDispensada = null;
  let tipSaida = 0;
  function mostrarTip(marcaEl) {
    clearTimeout(tipSaida);
    if (marcaEl === tipDispensada) return;
    tipDispensada = null;
    tipDe = marcaEl;
    tip.textContent = marcaEl.dataset.tip;
    tip.hidden = false;
    const r = marcaEl.getBoundingClientRect();
    const x = Math.max(8, Math.min(r.left + r.width / 2 - tip.offsetWidth / 2, window.innerWidth - tip.offsetWidth - 8));
    const acima = r.top - tip.offsetHeight - 6;
    tip.style.left = `${x}px`;
    tip.style.top = `${acima >= 8 ? acima : r.bottom + 6}px`;
  }
  function esconderTip() { clearTimeout(tipSaida); tip.hidden = true; tipDe = null; }
  document.addEventListener('pointerover', (ev) => {
    if (tip.contains(ev.target)) { clearTimeout(tipSaida); return; }
    const alvo = ev.target.closest('[data-tip]');
    /* Toda reentrada cancela o fechamento pendente ANTES de qualquer saída
       antecipada: voltar à mesma marca em menos de 300 ms mantinha o timer. */
    if (alvo) { clearTimeout(tipSaida); if (alvo !== tipDe || tip.hidden) mostrarTip(alvo); return; }
    if (!tip.hidden) { clearTimeout(tipSaida); tipSaida = setTimeout(esconderTip, TIP_SAIDA_MS); }
  });
  document.addEventListener('pointerout', (ev) => {
    const marcaSaida = ev.target.closest('[data-tip]');
    if (marcaSaida && !marcaSaida.contains(ev.relatedTarget) && marcaSaida === tipDispensada) tipDispensada = null;
  });
  document.addEventListener('keydown', (ev) => {
    if (ev.key !== 'Escape' || tip.hidden) return;
    tipDispensada = tipDe;
    esconderTip();
  });
  /* Rolagem: a dica acompanha a marca (não some sozinha). */
  window.addEventListener('scroll', () => { if (!tip.hidden && tipDe) mostrarTip(tipDe); }, { passive: true });

  const marca = (id) => `<span class="test-mark test-mark-${id} t-${id}" aria-hidden="true"></span>`;
  const nivel = (n) => `<span class="level-mark" aria-hidden="true">${[1, 2, 3, 4].map((i) => `<i${i > n ? ' class="is-off"' : ''}></i>`).join('')}</span>`;
  const plural = (n, s, pl = `${s}s`) => `${n} ${n === 1 ? s : pl}`;
  function kpi(rotulo, valor, nota) {
    return `<div class="dl-statcard dl-statcard--compact"><span class="dl-statcard-label">${rotulo}</span><span class="dl-statcard-value">${valor}</span><span class="dl-statcard-compare">${nota}</span></div>`;
  }

  /* ═══ Tela 1: catálogo de modelos ═════════════════════════════════ */
  function usoDe(id) {
    const runs = RUNS.filter((x) => x.modelo === id);
    if (!runs.length) return '<span class="model-usage is-empty">Nenhum teste criado ainda</span>';
    const env = runs.reduce((a, x) => a + x.enviados, 0);
    const resp = runs.reduce((a, x) => a + x.respostas, 0);
    const texto = id.startsWith('n')
      ? `${runs.length} teste${runs.length > 1 ? 's' : ''} criado${runs.length > 1 ? 's' : ''}`
      : `${plural(runs.length, 'envio')} · ${resp} de ${env} respostas`;
    return `<a class="model-usage" href="#testes-personalizados?modelo=${id}">${texto}</a>`;
  }
  function renderCatalogo() {
    $('[data-models-comp]').innerHTML = TESTES.map((t) => `
      <li><article class="model-card t-${t.id}" aria-labelledby="m-${t.id}">
        <header class="model-head">
          <span class="model-sigil">${marca(t.id)}</span>
          <div><h3 id="m-${t.id}">${t.nome}</h3>
            <p class="model-facts"><span>${t.q} questões</span><span>~${t.min} min</span></p></div>
        </header>
        <div class="model-body">
          <p class="model-desc">${esc(t.desc)}</p>
          <span class="tag tag-quiet model-reveals">${t.revela}</span>
        </div>
        <footer class="model-foot">
          ${usoDe(t.id)}
          <div class="model-actions">
            <a class="btn btn-ghost btn-sm" href="#envio-rapido" data-fora data-label="Envio rápido de ${t.nome}" aria-label="Envio rápido de ${t.nome}">Envio rápido</a>
            <a class="btn btn-primary btn-sm" href="#aplicar" data-fora data-label="Aplicar ${t.nome}" aria-label="Aplicar ${t.nome}">Aplicar</a>
          </div>
        </footer>
      </article></li>`).join('');
    $('[data-models-situ]').innerHTML = SITU.map((s) => `
      <li><article class="model-card" aria-labelledby="m-${s.id}">
        <header class="model-head">
          <span class="model-sigil">${nivel(s.nivel)}</span>
          <div><h3 id="m-${s.id}">${s.nome}</h3>
            <p class="model-facts"><span class="model-code">${s.id.toUpperCase()}</span><span>${s.itens}</span><span>${s.extra}</span></p></div>
        </header>
        <div class="model-body">
          <p class="model-desc">${esc(s.desc)}</p>
          ${s.anonimo ? `<p class="privacy-note"><svg class="icon icon-sm" aria-hidden="true"><use href="#i-lock"/></svg>Mínimo de ${MIN_ANONIMO} respondentes. Ninguém vê resposta individual.</p>` : ''}
        </div>
        <footer class="model-foot">
          ${usoDe(s.id)}
          <div class="model-actions">
            <a class="btn btn-primary btn-sm" href="#criar" data-fora data-label="Criar ${s.nome}" aria-label="Criar teste de ${s.nome}">Criar teste</a>
          </div>
        </footer>
      </article></li>`).join('');
  }

  /* ═══ Tela 2: Testes personalizados ══════════════════════════════════════ */
  const filtros = { q: '', modelo: '', status: '' };
  const fModelo = $('#f-modelo');
  fModelo.innerHTML = `<option value="">Todos os modelos</option>
    <optgroup label="Comportamentais">${TESTES.map((t) => `<option value="${t.id}">${t.nome}</option>`).join('')}</optgroup>
    <optgroup label="Situacionais">${SITU.map((s) => `<option value="${s.id}">${s.id.toUpperCase()} · ${s.nome}</option>`).join('')}</optgroup>`;

  function renderRunsKpis() {
    const and = RUNS.filter((x) => x.status === 'andamento');
    const pend = and.reduce((a, x) => a + (x.enviados - x.respostas), 0);
    const urg = and.filter((x) => x.dias != null && x.dias <= 3);
    $('[data-runs-kpis]').innerHTML = [
      kpi('Em andamento', and.length, `de ${RUNS.length} testes personalizados`),
      kpi('Respostas pendentes', pend, 'nos testes em andamento'),
      kpi('Prazo em até 3 dias', urg.length, urg.length ? urg.map((x) => MODELO[x.modelo].nome).join(', ') : 'nenhum'),
      kpi('Rascunhos', RUNS.filter((x) => x.status === 'rascunho').length, 'prontos para publicar'),
    ].join('');
  }
  function celulaRespostas(x) {
    if (x.status === 'rascunho') return '<span class="muted">Ainda não enviado</span>';
    const m = MODELO[x.modelo];
    const largura = x.enviados ? (x.respostas / x.enviados) * 100 : 0;
    const marcaMin = m.anonimo ? `<span class="run-min" style="left:${(MIN_ANONIMO / x.enviados) * 100}%"></span>` : '';
    let nota = '';
    if (m.anonimo) {
      nota = x.respostas < MIN_ANONIMO
        ? `<small>Anônimo · relatório abre com ${MIN_ANONIMO} (faltam ${MIN_ANONIMO - x.respostas})</small>`
        : '<small>Anônimo · relatório disponível</small>';
    }
    return `<div class="run-progress"><span><b class="num">${x.respostas}</b> de ${x.enviados}</span>
      <span class="progress-track" aria-hidden="true"><span class="progress-fill" style="width:${largura}%"></span>${marcaMin}</span>${nota}</div>`;
  }
  function celulaPrazo(x) {
    if (!x.prazo) return '<span aria-hidden="true">—</span><span class="sr-only">Sem prazo</span>';
    if (x.status === 'expirado') return `${x.prazo} <span class="muted">· venceu</span>`;
    if (x.status === 'encerrado') return `${x.prazo} <span class="muted">· encerrado</span>`;
    return `${x.prazo} <span class="muted">· em ${plural(x.dias, 'dia')}</span>`;
  }
  function renderRuns() {
    const q = filtros.q.trim().toLowerCase();
    const lista = RUNS.filter((x) => (!filtros.modelo || x.modelo === filtros.modelo)
      && (!filtros.status || x.status === filtros.status)
      && (!q || x.titulo.toLowerCase().includes(q) || MODELO[x.modelo].nome.toLowerCase().includes(q)));
    $('[data-runs]').innerHTML = lista.map((x) => {
      const m = MODELO[x.modelo];
      const situ = x.modelo.startsWith('n');
      const tipo = situ ? `Situacional ${x.modelo.toUpperCase()} · ${m.nome}` : `Comportamental · ${m.nome}`;
      const [rot, cls] = STATUS[x.status];
      return `<tr>
        <td class="no-label"><div class="run-name">${situ ? nivel(m.nivel) : marca(x.modelo)}<div><b>${esc(x.titulo)}</b><span class="run-model">${tipo}</span></div></div></td>
        <td data-label="Status"><span class="dl-status dl-status--${cls}">${rot}</span></td>
        <td data-label="Respostas">${celulaRespostas(x)}</td>
        <td data-label="Prazo"><span>${celulaPrazo(x)}</span></td>
        <td data-label="Criado em"><span>${x.criado}</span></td>
        <td class="no-label"><a class="btn btn-secondary btn-sm" href="#abrir" data-fora data-label="${esc(x.titulo)}" aria-label="${x.status === 'rascunho' ? 'Continuar' : 'Abrir'} ${esc(x.titulo)}">${x.status === 'rascunho' ? 'Continuar' : 'Abrir'}</a></td>
      </tr>`;
    }).join('');
    const vazio = lista.length === 0;
    $('[data-runs-wrap]').hidden = vazio;
    $('[data-runs-empty]').hidden = !vazio;
    const ativo = filtros.q || filtros.modelo || filtros.status;
    $('[data-runs-count]').textContent = ativo ? `${lista.length} de ${RUNS.length} testes` : `${RUNS.length} testes`;
  }
  function filtrosParaUrl() {
    const qs = new URLSearchParams(Object.entries(filtros).filter(([, v]) => v)).toString();
    history.replaceState(null, '', `#testes-personalizados${qs ? `?${qs}` : ''}`);
  }
  function filtrosDaUrl(query) {
    const ps = new URLSearchParams(query || '');
    filtros.q = ps.get('q') || '';
    filtros.modelo = MODELO[ps.get('modelo')] ? ps.get('modelo') : '';
    filtros.status = STATUS[ps.get('status')] ? ps.get('status') : '';
    $('#f-busca').value = filtros.q;
    fModelo.value = filtros.modelo;
    $('#f-status').value = filtros.status;
  }
  $$('[data-f]').forEach((el) => el.addEventListener('input', () => {
    filtros[el.dataset.f] = el.value;
    renderRuns();
    filtrosParaUrl();
  }));
  $('[data-filters]').addEventListener('submit', (ev) => ev.preventDefault());
  $$('[data-limpar]').forEach((b) => b.addEventListener('click', () => {
    filtrosDaUrl('');
    renderRuns();
    filtrosParaUrl();
    $('#f-busca').focus();
  }));

  /* ═══ Tela 3: Ranking ═════════════════════════════════════════════ */
  const DEPTOS = [...new Set(PESSOAS.map((x) => x.depto))].sort();
  $('[data-rk-depto]').innerHTML = `<option value="">Todos departamentos</option>${DEPTOS.map((d) => `<option>${d}</option>`).join('')}`;
  const cargosAd = [...new Set(PESSOAS.filter((x) => x.ad != null).map((x) => x.cargoNome))].sort();
  $('[data-rk-cargo]').innerHTML = `<option value="">Todos os cargos</option>${cargosAd.map((c) => `<option>${c}</option>`).join('')}`;

  /* Faixas = limiares que o app já usa (ranking/page.tsx L50-87). */
  const FAIXAS_FIT = [['Baixo', 'até 39%', (v) => v < 40], ['Moderado', '40–59%', (v) => v >= 40 && v < 60],
    ['Bom', '60–79%', (v) => v >= 60 && v < 80], ['Alto', '80% ou mais', (v) => v >= 80]];
  const FAIXAS_AD = [['Abaixo de 2', '1,0–1,9', (v) => v < 2], ['2,0–2,4', 'em ajuste', (v) => v >= 2 && v < 2.5],
    ['2,5–3,4', 'esperado', (v) => v >= 2.5 && v < 3.5], ['3,5–4,0', 'acima', (v) => v >= 3.5]];

  function histograma(alvo, rotulos, faixas, valores) {
    const contagens = faixas.map(([, , f]) => valores.filter(f).length);
    const max = Math.max(1, ...contagens);
    $(alvo).innerHTML = contagens.map((n, i) => `<li data-tip="${faixas[i][0]} (${faixas[i][1]}): ${plural(n, 'pessoa')}"><b>${n}</b><i style="height:${(n / max) * 78}%"></i></li>`).join('');
    $(rotulos).innerHTML = faixas.map(([nome, faixa], i) => `<li><b>${nome}</b>${faixa}<span class="sr-only">: ${plural(contagens[i], 'pessoa')}</span></li>`).join('');
  }

  function renderPodio(comFit) {
    $('[data-podium]').innerHTML = comFit.slice(0, 3).map((x, i) => {
      const lidos = TESTES.filter((t) => x.testes[t.id] != null).map((t) => `${t.nome} ${x.testes[t.id]}%`).join(', ');
      return `<li>
        <div class="podium-top"><span class="podium-rank" aria-hidden="true">${i + 1}º</span>
          <div class="podium-score"><b>${x.fit}%</b><small>fit com o cargo</small></div></div>
        <div class="podium-who"><b><span class="sr-only">${i + 1}º lugar: </span>${esc(x.nome)}</b><span>${esc(x.cargoNome)} · ${esc(x.depto)}</span></div>
        <ul class="strip" aria-hidden="true">${TESTES.map((t) => {
          const v = x.testes[t.id];
          return `<li class="t-${t.id}" data-tip="${t.nome}: ${v != null ? `${v}%` : 'não fez'}"><span class="col">${v != null ? `<span class="bar" style="height:${v}%"></span>` : '<span class="none">–</span>'}</span>${marca(t.id)}</li>`;
        }).join('')}</ul>
        <p class="sr-only">Fit por teste: ${lidos}.</p>
      </li>`;
    }).join('') || '<li class="empty-state-inline">Ninguém com fit calculado neste recorte.</li>';
  }
  function renderPorTeste(comFit, depto) {
    const linhas = TESTES.map((t) => {
      const doGrupo = comFit.filter((x) => x.testes[t.id] != null).map((x) => x.testes[t.id]);
      const daEmpresa = PESSOAS.filter((x) => x.fit != null && x.testes[t.id] != null).map((x) => x.testes[t.id]);
      return { t, g: media(doGrupo), e: media(daEmpresa), n: doGrupo.length };
    });
    $('[data-porteste]').innerHTML = linhas.map(({ t, g, e, n }) => `
      <li class="t-${t.id}">
        <span class="who">${marca(t.id)}<span>${t.nome}</span></span>
        <span class="bar-track" aria-hidden="true" data-tip="${t.nome}: recorte ${g != null ? pct(g) : 'sem dado'} · empresa ${e != null ? pct(e) : 'sem dado'} · ${plural(n, 'pessoa')}">
          ${g != null ? `<span class="bar" style="width:${g}%"></span>` : ''}${depto && e != null ? `<span class="tick" style="left:${e}%"></span>` : ''}</span>
        <span class="val">${g != null ? pct(g) : '—'}<small>${plural(n, 'pessoa')}</small></span>
      </li>`).join('');
    $('[data-porteste-tabela]').innerHTML = linhas.map(({ t, g, e, n }) => `<tr><td>${t.nome}</td><td>${g != null ? pct(g) : '—'}</td><td>${e != null ? pct(e) : '—'}</td><td>${n}</td></tr>`).join('');
    $('[data-porteste-n]').textContent = depto ? `${depto} × empresa` : 'empresa inteira';
    $('[data-key-tick]').hidden = !depto;
  }
  function linhaFit(x, i) {
    const feitos = TESTES.filter((t) => x.testes[t.id] != null);
    const motivo = x.temAlvo ? 'Sem teste' : 'Cargo sem perfil-alvo';
    return `<tr class="${x.fit != null && i < 3 ? 'rk-top' : ''}">
      <td data-label="Posição"><span class="rk-rank">${x.fit != null ? `${i + 1}º` : '—'}</span></td>
      <td data-label="Colaborador"><span class="rk-person"><b>${esc(x.nome)}</b><small>${esc(x.cargoNome)}</small></span></td>
      <td data-label="Departamento">${esc(x.depto)}</td>
      <td data-label="Testes feitos">${feitos.length ? `<span class="marks">${feitos.map((t) => marca(t.id)).join('')}</span><span class="sr-only">${feitos.map((t) => t.nome).join(', ')}</span>` : '<span class="muted">Nenhum</span>'}</td>
      <td data-label="Fit">${x.fit != null
        ? `<span class="fit-cell"><span class="bar-track" aria-hidden="true"><span class="bar" style="width:${x.fit}%"></span></span><b>${x.fit}%</b></span>`
        : `<span class="muted">${motivo}</span>`}</td>
    </tr>`;
  }
  function renderFit() {
    const depto = $('[data-rk-depto]').value;
    const grupo = PESSOAS.filter((x) => !depto || x.depto === depto);
    const comFit = grupo.filter((x) => x.fit != null).sort((a, b) => b.fit - a.fit);
    const semFit = grupo.filter((x) => x.fit == null);
    $('[data-fit-kpis]').innerHTML = [
      kpi('Pessoas', grupo.length, depto || 'todos os departamentos'),
      kpi('Com fit calculado', comFit.length, `${grupo.length - comFit.length} sem dado`),
      kpi('Fit médio', comFit.length ? pct(media(comFit.map((x) => x.fit))) : '—', 'de quem tem fit'),
      kpi('Sem dados', semFit.length, 'sem teste ou cargo sem perfil-alvo'),
    ].join('');
    renderPodio(comFit);
    renderPorTeste(comFit, depto);
    histograma('[data-dist-fit]', '[data-dist-fit-labels]', FAIXAS_FIT, comFit.map((x) => x.fit));
    $('[data-dist-fit-note]').textContent = `${plural(comFit.length, 'pessoa')} com fit. ${semFit.length} sem dado ficam fora do gráfico.`;
    $('[data-fit-rows]').innerHTML = [...comFit, ...semFit].map(linhaFit).join('');
  }

  function renderAd() {
    const cargo = $('[data-rk-cargo]').value;
    const grupo = PESSOAS.filter((x) => !cargo || x.cargoNome === cargo);
    const com = grupo.filter((x) => x.ad != null).sort((a, b) => b.ad - a.ad);
    const sem = grupo.filter((x) => x.ad == null);
    $('[data-ad-kpis]').innerHTML = [
      kpi('Pessoas', grupo.length, cargo || 'todos os cargos'),
      kpi('Com AD concluída', com.length, 'última avaliação de cada pessoa'),
      kpi('Nota média', com.length ? virgula(media(com.map((x) => x.ad))) : '—', 'escala de 1 a 4'),
      kpi('Sem AD', sem.length, 'nenhuma avaliação concluída'),
    ].join('');
    histograma('[data-dist-ad]', '[data-dist-ad-labels]', FAIXAS_AD, com.map((x) => x.ad));
    $('[data-ad-rows]').innerHTML = [...com, ...sem].map((x, i) => `<tr>
      <td data-label="Posição"><span class="rk-rank">${x.ad != null ? `${i + 1}º` : '—'}</span></td>
      <td data-label="Colaborador"><span class="rk-person"><b>${esc(x.nome)}</b><small>${esc(x.cargoNome)}</small></span></td>
      <td data-label="Última AD">${x.adData ? `<a href="#ad" data-fora data-label="AD de ${esc(x.nome)}">${x.adData}</a>` : '<span class="muted">Sem AD</span>'}</td>
      <td data-label="Nota">${x.ad != null
        ? `<span class="fit-cell"><span class="bar-track" aria-hidden="true"><span class="bar" style="width:${((x.ad - 1) / 3) * 100}%"></span></span><b>${virgula(x.ad)}</b></span>`
        : '<span class="muted">—</span>'}</td>
    </tr>`).join('');
  }
  $('[data-rk-depto]').addEventListener('change', renderFit);
  $('[data-rk-cargo]').addEventListener('change', renderAd);

  /* Abas do Ranking — APG com ativação automática (C14 do dashboard). */
  const ABAS = { fit: '#ranking', ad: '#ranking/desempenho' };
  const abas = $$('[role="tab"][data-aba]');
  function selecionarAba(nome) {
    abas.forEach((t) => {
      const sim = t.dataset.aba === nome;
      t.setAttribute('aria-selected', String(sim));
      t.tabIndex = sim ? 0 : -1;
      t.classList.toggle('active', sim);
      $(`#${t.getAttribute('aria-controls')}`).hidden = !sim;
    });
    document.title = `${nome === 'ad' ? 'Por desempenho' : 'Por fit ao cargo'} · Ranking · electia`;
  }
  function ativarPeloUsuario(tab) {
    selecionarAba(tab.dataset.aba);
    tab.focus();
    history.replaceState(null, '', ABAS[tab.dataset.aba]);
  }
  abas.forEach((t) => t.addEventListener('click', () => ativarPeloUsuario(t)));
  $('[role="tablist"]').addEventListener('keydown', (ev) => {
    const i = abas.indexOf(document.activeElement);
    if (i < 0) return;
    const n = abas.length;
    const destino = { ArrowRight: (i + 1) % n, ArrowLeft: (i - 1 + n) % n, Home: 0, End: n - 1 }[ev.key];
    if (destino === undefined) return;
    ev.preventDefault();
    ativarPeloUsuario(abas[destino]);
  });

  /* ═══ Rotas ═══════════════════════════════════════════════════════
     #assessments (padrão) · #testes-personalizados[?modelo=&status=&q=] ·
     #ranking · #ranking/desempenho. Nenhuma rota casa com um id. */
  const TITULOS = { assessments: 'Assessments', personalizados: 'Testes personalizados', ranking: 'Ranking' };
  function rota() {
    const [caminho, query] = location.hash.slice(1).split('?');
    const [tela, sub] = (caminho || 'assessments').split('/');
    const atual = { 'testes-personalizados': 'personalizados', ranking: 'ranking' }[tela] || 'assessments';
    $$('[data-screen]').forEach((s) => { s.hidden = s.dataset.screen !== atual; });
    $$('[data-nav]').forEach((a) => {
      const sim = a.dataset.nav === atual;
      a.classList.toggle('active', sim);
      if (sim) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    $('[data-top-title]').textContent = TITULOS[atual];
    document.title = `${TITULOS[atual]} · electia`;
    if (atual === 'personalizados') { filtrosDaUrl(query); renderRuns(); }
    if (atual === 'ranking') selecionarAba(sub === 'desempenho' ? 'ad' : 'fit');
    return `#${atual}-titulo`;
  }
  let quadro = 0;
  function aplicarRota() {
    const alvo = $(rota());
    alvo.focus({ preventScroll: true });
    alvo.scrollIntoView({ block: 'start', behavior: 'instant' });
    cancelAnimationFrame(quadro);
    quadro = requestAnimationFrame(() => { if (document.activeElement === alvo) alvo.scrollIntoView({ block: 'start', behavior: 'instant' }); });
  }
  window.addEventListener('hashchange', aplicarRota);

  /* ── Pular para o conteúdo ──────────────────────────────────────────
     O href="#conteudo" passaria pelo roteador (hash desconhecido = tela
     padrão) e trocava a tela. Aqui o pulo só leva o foco ao h1 da tela
     atual, sem tocar na URL. */
  $('[data-skip]').addEventListener('click', (ev) => {
    ev.preventDefault();
    const h1 = $('[data-screen]:not([hidden]) h1');
    h1.focus({ preventScroll: true });
    h1.scrollIntoView({ block: 'start', behavior: 'instant' });
  });

  /* ── Tema ────────────────────────────────────────────────────────── */
  const temaBtn = $('[data-theme-toggle]');
  temaBtn.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.classList.add('theme-switching');
    root.dataset.theme = next;
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('theme-switching')));
    temaBtn.setAttribute('aria-label', next === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro');
    temaBtn.querySelector('use').setAttribute('href', next === 'dark' ? '#i-sun' : '#i-moon');
  });

  renderCatalogo();
  renderRunsKpis();
  renderFit();
  renderAd();
  rota();
});
