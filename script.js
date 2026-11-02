// Kit builder: people, nights, extras -> live box summary.
(function () {
  const CATALOG = [
    { id: 'chairs', name: 'Camping chairs', detail: 'One per person' },
    { id: 'bigtent', name: 'Bigger tent', detail: 'More room for gear' },
    { id: 'cooler', name: 'Cooler', detail: 'Keeps food cold for the weekend' },
    { id: 'stove', name: 'Portable stove', detail: 'Second burner for groups' },
    { id: 'lights', name: 'Camping lights', detail: 'Lanterns for the campsite' },
    { id: 'hiking', name: 'Hiking gear', detail: 'Poles and daypacks' },
    { id: 'rooftop', name: 'Rooftop tent', detail: 'Sleeps on top of your car' }
  ];

  const state = { people: 2, nights: 2, added: new Set(), sent: false };

  const addonsEl = document.getElementById('addons');
  const listEl = document.getElementById('box-list');
  const countEl = document.getElementById('count-line');
  const summaryEl = document.getElementById('box-summary');
  const sentEl = document.getElementById('box-sent');

  // Build extras buttons
  CATALOG.forEach((item) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'addon';
    btn.dataset.id = item.id;
    btn.setAttribute('aria-pressed', 'false');
    btn.innerHTML =
      '<span class="addon-text">' +
        '<span class="addon-name"></span>' +
        '<span class="addon-detail"></span>' +
      '</span>' +
      '<span class="addon-mark" aria-hidden="true">+</span>';
    btn.querySelector('.addon-name').textContent = item.name;
    btn.querySelector('.addon-detail').textContent = item.detail;
    btn.addEventListener('click', () => {
      if (state.added.has(item.id)) state.added.delete(item.id);
      else state.added.add(item.id);
      render();
    });
    addonsEl.appendChild(btn);
  });

  // Single-choice groups
  document.querySelectorAll('.choice-row').forEach((row) => {
    const key = row.dataset.group;
    row.addEventListener('click', (e) => {
      const btn = e.target.closest('.choice');
      if (!btn) return;
      state[key] = Number(btn.dataset.value);
      render();
    });
  });

  document.getElementById('send').addEventListener('click', () => {
    state.sent = true;
    render();
  });
  document.getElementById('edit').addEventListener('click', () => {
    state.sent = false;
    render();
  });

  function tripLine() {
    const nights = state.nights === 1 ? '1 night' : state.nights + ' nights';
    return state.people + ' people, ' + nights;
  }

  function boxItems() {
    const p = state.people;
    const base = [
      p <= 2 ? '2-person tent' : p + '-person tent',
      p + ' sleeping bags',
      p + ' sleeping mats',
      'Cooking set with pot, pan and cutlery',
      'Headlamps, lighter and rubbish bags'
    ];
    const extras = CATALOG.filter((c) => state.added.has(c.id)).map((c) => c.name);
    return base.concat(extras);
  }

  function render() {
    document.querySelectorAll('.choice-row').forEach((row) => {
      const current = String(state[row.dataset.group]);
      row.querySelectorAll('.choice').forEach((btn) => {
        btn.setAttribute('aria-pressed', String(btn.dataset.value === current));
      });
    });

    addonsEl.querySelectorAll('.addon').forEach((btn) => {
      const on = state.added.has(btn.dataset.id);
      btn.setAttribute('aria-pressed', String(on));
      btn.querySelector('.addon-mark').textContent = on ? '✓' : '+';
    });

    const items = boxItems();
    listEl.replaceChildren(...items.map((label) => {
      const li = document.createElement('li');
      const plus = document.createElement('span');
      plus.className = 'plus';
      plus.setAttribute('aria-hidden', 'true');
      plus.textContent = '+';
      const text = document.createElement('span');
      text.textContent = label;
      li.append(plus, text);
      return li;
    }));
    countEl.textContent = items.length + ' items in your box.';

    document.querySelectorAll('[data-trip-line]').forEach((el) => {
      el.textContent = tripLine();
    });

    summaryEl.hidden = state.sent;
    sentEl.hidden = !state.sent;
  }

  render();
})();
