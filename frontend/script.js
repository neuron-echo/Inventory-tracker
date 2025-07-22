const apiURL     = 'http://localhost:3000/items';
const form       = document.getElementById('item-form');
const listEl     = document.getElementById('inventory-list');
const searchIn   = document.getElementById('search-input');

// Fetch & display, with optional filter
async function refresh(filter = '') {
  const res   = await fetch(apiURL);
  let items   = await res.json();
  filter      = filter.toLowerCase();

  listEl.innerHTML = '';
  items
    .filter(i => i.name.toLowerCase().includes(filter))
    .forEach(renderItem);
}

function renderItem(item) {
  const li      = document.createElement('li');
  const nameSp  = document.createElement('span');
  nameSp.className = 'name';
  nameSp.textContent = item.name;

  const qtySp   = document.createElement('span');
  qtySp.className = 'qty';
  qtySp.textContent = `×${item.quantity}`;

  const btn     = document.createElement('button');
  btn.className = 'remove';
  btn.textContent = 'Remove';
  btn.onclick   = () => removeItem(item._id);

  li.append(nameSp, qtySp, btn);
  listEl.appendChild(li);
}

// Add new item
form.addEventListener('submit', async e => {
  e.preventDefault();
  const name = form['item-name'].value.trim();
  const qty  = +form['item-qty'].value;
  if (!name || qty < 1) return alert('Enter valid data');

  await fetch(apiURL, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ name, quantity: qty })
  });
  form.reset();
  refresh(searchIn.value);
});

// Remove item
async function removeItem(id) {
  await fetch(`${apiURL}/${id}`, { method: 'DELETE' });
  refresh(searchIn.value);
}

// Live search
searchIn.addEventListener('input', () => refresh(searchIn.value));

// Initial load
refresh();
