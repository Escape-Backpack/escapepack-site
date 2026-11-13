/* Norse playtest feedback form.
   - Layer 1 and 2 are plain fields.
   - Layer 3 shows the puzzles one at a time (so postcards are not spoiled), in play order.
   - Unsent answers are kept in localStorage as a draft.
   PUZZLES mirrors the order in play/norse/v2/raven2-data.js: puzzle N is solved with the props that
   envelope N-1 released (puzzle 1: the box top) and its answer opens envelope N. Update both if the order changes. */
(function () {
  const ASSETS = '/play/norse/v2/assets/Postcard_';
  const P = (slug, name) => ({ slug, name });
  const PUZZLES = [
    { cards: [P('L1_LAnse', 'L’Anse aux Meadows')], other: ['Liv’s notes card', 'The cypher wheel'] },
    { cards: [P('AD_Bjarnarhofn', 'Bjarnarhöfn')], other: ['Aud’s carved comb'] },
    { cards: [P('L2_Battle_Harbour', 'Battle Harbour'), P('L3_Baffin_Island', 'Baffin Island')], other: [] },
    { cards: [P('H2_Staraya_Ladoga', 'Staraya Ladoga'), P('H3_Kyiv', 'Kyiv'), P('HD_Constantinople', 'Constantinople')], other: [] },
    { cards: [P('A2_Hvammur', 'Hvammur')], other: ['Island Settlement map', 'Treasure Museum ticket'] },
    { cards: [P('R1_Chalus', 'Châlus'), P('R6_Roumare_Forest', 'Roumare Forest'), P('RD_Walcheren', 'Walcheren')], other: [] },
    { cards: [P('LD_Brattahlid', 'Brattahlíð')], other: ['Western Lands map', 'Museum ticket'] },
    { cards: [P('A1_Dogurdarnes', 'Dögurðarnes'), P('A3_Esjuberg', 'Esjuberg')], other: ['Pouch of coins', 'Tally wheels'] },
    { cards: [P('R2_Rouen', 'Rouen')], other: ['Granted Lands map', 'Museum ticket'] },
    { cards: [P('R3_Bayeux', 'Bayeux'), P('R4_Winchester', 'Winchester'), P('R5_Battle', 'Battle')], other: ['Liv’s ruler'] },
    { cards: [P('H1_Oslo', 'Oslo')], other: ['Varangian Road map', 'Hnefatafl board', 'Museum ticket'] },
    { cards: [P('H4_Hedeby', 'Hedeby'), P('H5_Sicily', 'Sicily')], other: ['Raven’s flights card'] },
    { cards: [P('H6_Patara', 'Patara')], other: ['Hop tickets', 'Booking confirmations'] }
  ];
  const N = PUZZLES.length;
  const KEY = 'norse-feedback-draft-v1';
  const pad = n => String(n + 1).padStart(2, '0');

  const form = document.getElementById('norse-form');
  const box = document.getElementById('puzzles');
  const dots = document.getElementById('dots');
  const startWrap = document.getElementById('steps-start-wrap');
  const layerSteps = document.getElementById('layer-steps');
  const layerMore = document.getElementById('layer-more');
  const error = form.querySelector('[data-form-error]');
  const submit = document.getElementById('send');
  const state = { status: Array(N).fill(''), reached: -1 };

  /* ---------- puzzle cards ---------- */
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  PUZZLES.forEach((pz, i) => {
    const p = `puzzle_${pad(i)}`;
    const names = pz.cards.map(c => c.name).join(' · ');
    const fs = document.createElement('fieldset');
    fs.className = 'pz'; fs.hidden = true; fs.dataset.n = i;
    fs.innerHTML = `
      <button type="button" class="pz-summary"><span class="pz-num">Puzzle ${i + 1}</span><span class="pz-sumtext"></span><small>Edit</small></button>
      <div class="pz-full">
        <div class="pz-head"><span class="pz-num">Puzzle ${i + 1} of ${N}</span><h3 class="pz-title" tabindex="-1">${esc(names)}</h3>
          <p class="pz-sub">The puzzle that opens envelope ${i + 1}.</p></div>
        <div class="pz-cards">${pz.cards.map(c => `<figure><img src="${ASSETS}${c.slug}_Front.webp" alt="Postcard: ${esc(c.name)}" width="300" height="200" loading="lazy" decoding="async"><figcaption>${esc(c.name)}</figcaption></figure>`).join('')}</div>
        ${pz.other.length ? `<ul class="pz-chips" aria-label="Also in this puzzle">${pz.other.map(o => `<li>${esc(o)}</li>`).join('')}</ul>` : ''}
        <div class="pz-body">
          <fieldset class="seg"><legend>How was it?</legend>
            <label><input type="radio" name="${p}_difficulty" value="too easy"><span>Too easy</span></label>
            <label><input type="radio" name="${p}_difficulty" value="about right"><span>About right</span></label>
            <label><input type="radio" name="${p}_difficulty" value="too hard"><span>Too hard</span></label>
          </fieldset>
          <label class="check"><input type="checkbox" name="${p}_hint" value="yes"> I used a hint</label>
          <div class="field"><label for="${p}_comment">Anything to add? <span>(optional)</span></label><textarea id="${p}_comment" name="${p}_comment" maxlength="2000" placeholder="What happened? No need to give away the answer."></textarea></div>
          <div class="pz-actions">
            <button type="button" class="button button-primary" data-act="next">${i === N - 1 ? 'That’s the last one' : 'Next puzzle →'}</button>
            <button type="button" class="linkish" data-act="skip">I didn’t play this one</button>
            <button type="submit" class="linkish" data-act="send">Stop here and send</button>
          </div>
        </div>
      </div>`;
    box.appendChild(fs);
    const d = document.createElement('span'); dots.appendChild(d);
  });

  const card = i => box.children[i];
  function touched(i) {
    const c = card(i);
    return !!(c.querySelector('input:checked') || c.querySelector('textarea').value.trim());
  }
  function summaryOf(i) {
    const c = card(i), t = c.querySelector('.pz-sumtext');
    if (state.status[i] === 'skipped') { t.innerHTML = '<b>Didn’t play this one</b>'; return; }
    const bits = [], d = c.querySelector('input[type=radio]:checked');
    if (d) bits.push(d.value);
    if (c.querySelector('input[type=checkbox]:checked')) bits.push('used a hint');
    if (c.querySelector('textarea').value.trim()) bits.push('has a note');
    t.innerHTML = `<b>${esc(PUZZLES[i].cards.map(x => x.name).join(' · '))}</b> — ${esc(bits.length ? bits.join(', ') : 'nothing to add')}`;
  }
  function render() {
    PUZZLES.forEach((_, i) => {
      const c = card(i), s = state.status[i];
      c.hidden = i > state.reached;
      c.classList.toggle('done', s === 'done');
      c.classList.toggle('skipped', s === 'skipped');
      if (s) summaryOf(i);
      dots.children[i].className = s || (i <= state.reached ? 'reached' : '');
    });
    startWrap.hidden = state.reached >= 0;
  }
  function advance(i, status) {
    state.status[i] = status;
    state.reached = Math.max(state.reached, Math.min(i + 1, N - 1));
    render(); save();
    const target = i + 1 < N ? card(i + 1) : submit;
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (i + 1 < N) card(i + 1).querySelector('.pz-title').focus({ preventScroll: true });
  }
  document.getElementById('steps-start').addEventListener('click', () => {
    state.reached = 0; render(); save();
    card(0).querySelector('.pz-title').focus({ preventScroll: true });
  });
  box.addEventListener('click', e => {
    const c = e.target.closest('.pz'); if (!c) return;
    const i = +c.dataset.n, act = e.target.closest('[data-act]')?.dataset.act;
    if (act === 'next') advance(i, 'done');
    else if (act === 'skip') advance(i, 'skipped');
    else if (e.target.closest('.pz-summary')) {
      state.status[i] = ''; render(); save();
      c.querySelector('.pz-title').focus({ preventScroll: false });
    }
  });

  /* ---------- draft in the browser ---------- */
  const keyOf = el => el.name + (el.type === 'radio' || el.type === 'checkbox' ? '#' + el.value : '');
  const saveable = () => [...form.elements].filter(el => el.name && !el.name.startsWith('_') && el.type !== 'hidden' && el.type !== 'submit' && el.type !== 'button');
  function save() {
    try {
      const fields = {};
      saveable().forEach(el => {
        const k = keyOf(el);
        if (el.type === 'radio' || el.type === 'checkbox') { if (el.checked) fields[k] = true; }
        else if (el.value) fields[k] = el.value;
      });
      const any = Object.keys(fields).length || state.reached >= 0;
      if (any) localStorage.setItem(KEY, JSON.stringify({ fields, status: state.status, reached: state.reached }));
      else localStorage.removeItem(KEY);
    } catch (_) { /* storage unavailable: the form still works */ }
  }
  function restore() {
    let d; try { d = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (_) { return; }
    if (!d || !d.fields) return;
    saveable().forEach(el => {
      const v = d.fields[keyOf(el)];
      if (el.type === 'radio' || el.type === 'checkbox') el.checked = !!v;
      else if (v != null) el.value = v;
    });
    if (Array.isArray(d.status) && d.status.length === N) state.status = d.status;
    if (Number.isInteger(d.reached)) state.reached = Math.min(d.reached, N - 1);
    document.getElementById('draft-note').hidden = false;
    if (state.reached >= 0) layerSteps.open = true;
    const moreKeys = ['stuck', 'favourite', 'play_time', 'group_size', 'device', 'other', 'used_hints#yes', 'hard_to_read#yes', 'unclear_instructions#yes', 'difficulty_off#yes'];
    if (moreKeys.some(k => d.fields[k])) layerMore.open = true;
  }
  function clearDraft() { try { localStorage.removeItem(KEY); } catch (_) { /* ignore */ } }
  document.getElementById('draft-clear').addEventListener('click', () => {
    form.reset(); state.status.fill(''); state.reached = -1;
    clearDraft(); render(); document.getElementById('draft-note').hidden = true;
  });
  form.addEventListener('input', save);
  form.addEventListener('change', save);

  /* ---------- sending ---------- */
  function buildData() {
    const data = new FormData(form);
    let puzzles = 0;
    PUZZLES.forEach((_, i) => {
      const p = `puzzle_${pad(i)}_`;
      const include = i <= state.reached && state.status[i] !== 'skipped' && (state.status[i] === 'done' || touched(i));
      [...data.keys()].filter(k => k.startsWith(p)).forEach(k => data.delete(k));
      if (!include) return;
      puzzles++;
      const c = card(i);
      data.set(p + 'postcards', PUZZLES[i].cards.map(x => x.name).join(', '));
      c.querySelectorAll('input:checked, textarea').forEach(el => { if (el.value) data.set(el.name, el.value); });
    });
    [...data.keys()].forEach(k => { if (!k.startsWith('_') && data.get(k) === '') data.delete(k); });
    data.set('puzzles_reviewed', String(puzzles));
    return { data, puzzles };
  }
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const { data, puzzles } = buildData();
    const text = ['message', 'stuck', 'favourite', 'other'].some(k => (data.get(k) || '').toString().trim());
    if (!text && !puzzles && !data.get('rating') && !data.get('progress')) {
      error.textContent = 'Please add a short note, a rating, or a puzzle comment first.';
      error.hidden = false; error.focus(); return;
    }
    if (data.get('email') && !form.elements.email.checkValidity()) {
      error.textContent = 'That email address doesn’t look right. You can also leave it empty.';
      error.hidden = false; error.focus(); return;
    }
    error.hidden = true;
    const label = submit.textContent;
    submit.disabled = true; submit.textContent = 'Sending…';
    try {
      const r = await fetch(form.action, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      if (r.status === 429) throw new Error('rate-limit');
      if (!r.ok) throw new Error('status ' + r.status);
      try { window.EscapeAnalytics?.track('feedback_submitted', { game: 'norse' }); } catch (_) { /* ignore */ }
      clearDraft();
      form.hidden = true;
      const ok = document.getElementById('norse-success'); ok.hidden = false; ok.focus();
      ok.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (err) {
      error.textContent = err.message === 'rate-limit'
        ? 'Too many requests right now. Please wait a minute and try again.'
        : 'We couldn’t send this yet. Your answers are still here, so please try again.';
      error.hidden = false; error.focus();
      submit.disabled = false; submit.textContent = label;
    }
  });

  restore();
  render();
})();
