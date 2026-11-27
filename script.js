
const $ = id => document.getElementById(id);

let tasks = JSON.parse(localStorage.getItem('aura_tasks') || '[]');
let notes = JSON.parse(localStorage.getItem('aura_notes') || '[]');

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// GUARDADO
function save() {
  localStorage.setItem('aura_tasks', JSON.stringify(tasks));
  localStorage.setItem('aura_notes', JSON.stringify(notes));
  renderAll();
}

// NAVEGACIÓN
function showView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  $(id).classList.add('active');

  document.querySelectorAll('.nav-item[data-view]').forEach(b => {
    b.classList.toggle('active', b.dataset.view === id);
  });

  const labels = {
    dashboard: 'Inicio',
    tasks: 'Mis tareas',
    calendar: 'Calendario',
    notes: 'Notas',
    assistant: 'Asistente AURA'
  };

  $('crumb').textContent = labels[id];
  $('sidebar').classList.remove('open');

  if (id === 'calendar') renderCalendar('fullCalendar');
  if (id === 'tasks') renderTasks();
  if (id === 'notes') renderNotes();
}

document.querySelectorAll('.nav-item[data-view]').forEach(btn => {
  btn.addEventListener('click', () => showView(btn.dataset.view));
});

$('menuBtn').onclick = () => $('sidebar').classList.toggle('open');

// MODALES
function openTaskModal() {
  $('taskInput').value = '';
  $('taskTime').value = '';
  $('taskModal').classList.add('open');
  $('taskInput').focus();
}

function openNoteModal() {
  $('noteTitle').value = '';
  $('noteContent').value = '';
  $('noteModal').classList.add('open');
}

function closeModal(id) {
  $(id).classList.remove('open');
}

// TAREAS
function addTask() {
  const name = $('taskInput').value.trim();

  if (!name) {
    alert('Escribí el nombre de la tarea.');
    return;
  }

  tasks.push({
    id: Date.now(),
    name,
    date: $('taskTime').value,
    done: false
  });

  closeModal('taskModal');
  save();
}

function toggleTask(id) {
  tasks = tasks.map(t =>
    t.id === id ? { ...t, done: !t.done } : t
  );
  save();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  save();
}

function taskHTML(t) {
  return `
    <div class="task">
      <button class="task-check ${t.done ? 'done' : ''}"
        onclick="toggleTask(${t.id})">
        ${t.done ? '✓' : ''}
      </button>

      <div class="task-text ${t.done ? 'done' : ''}">
        ${escapeHTML(t.name)}
        ${t.date ? `<div class="task-time">${escapeHTML(t.date)}</div>` : ''}
      </div>

      <button class="delete-task"
        onclick="deleteTask(${t.id})">×</button>
    </div>
  `;
}

function renderTasks() {
  const query = ($('taskSearch')?.value || '').toLowerCase();

  const filtered = tasks.filter(t =>
    t.name.toLowerCase().includes(query)
  );

  $('allTasks').innerHTML = filtered.length
    ? filtered.map(taskHTML).join('')
    : '<div class="empty">No hay tareas para mostrar.</div>';
}

// PANEL PRINCIPAL
function renderDashboard() {
  const done = tasks.filter(t => t.done).length;
  const pending = tasks.length - done;

  const percent = tasks.length
    ? Math.round(done / tasks.length * 100)
    : 0;

  $('completedStat').textContent = done;
  $('pendingStat').textContent = pending;
  $('notesStat').textContent = notes.length;

  $('progressText').textContent = percent + '%';
  $('progressFill').style.width = percent + '%';

  $('dashboardTasks').innerHTML = tasks.length
    ? tasks.slice(-5).reverse().map(taskHTML).join('')
    : '<div class="empty">Todavía no tenés tareas.</div>';
}

// NOTAS
function addNote() {
  const title = $('noteTitle').value.trim();
  const content = $('noteContent').value.trim();

  if (!title || !content) {
    alert('Completá el título y el contenido.');
    return;
  }

  notes.unshift({
    id: Date.now(),
    title,
    content
  });

  closeModal('noteModal');
  save();
}

function deleteNote(id) {
  notes = notes.filter(n => n.id !== id);
  save();
}

function renderNotes() {
  $('notesList').innerHTML = notes.length
    ? notes.map(n => `
      <div class="note-box">
        <button class="note-delete"
          onclick="deleteNote(${n.id})">×</button>

        <div class="note-title">${escapeHTML(n.title)}</div>
        <div class="note-content">${escapeHTML(n.content)}</div>
      </div>
    `).join('')
    : '<div class="empty">Todavía no guardaste ninguna nota.</div>';
}

// SEGURIDAD DE TEXTO HTML
function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[c]);
}

// CALENDARIO
function calendarHTML(target) {
  const now = new Date();
  const first = new Date(currentYear, currentMonth, 1).getDay();
  const total = new Date(currentYear, currentMonth + 1, 0).getDate();

  const names = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

  let html = names.map(n =>
    `<div class="day-name">${n}</div>`
  ).join('');

  for (let i = 0; i < first; i++) {
    html += '<div></div>';
  }

  for (let d = 1; d <= total; d++) {
    const isToday =
      d === now.getDate() &&
      currentMonth === now.getMonth() &&
      currentYear === now.getFullYear();

    html += `
      <div class="day ${isToday ? 'today' : ''}">
        ${d}
      </div>
    `;
  }

  $(target).innerHTML = html;
}

function renderCalendar(target) {
  const label = new Date(currentYear, currentMonth, 1)
    .toLocaleDateString('es-AR', {
      month: 'long',
      year: 'numeric'
    });

  if (target === 'fullCalendar') {
    $('fullMonth').textContent = label;
  }

  if (target === 'miniCalendar') {
    $('monthName').textContent = label;
  }

  calendarHTML(target);
}

function changeMonth(amount) {
  currentMonth += amount;

  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }

  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }

  renderCalendar('fullCalendar');
}

// ASISTENTE DEMOSTRATIVO
function sendMessage() {
  const input = $('chatInput');
  const msg = input.value.trim();

  if (!msg) return;

  const box = $('chatBox');

  box.innerHTML += `
    <div class="message user">${escapeHTML(msg)}</div>
  `;

  input.value = '';

  const lower = msg.toLowerCase();

  let answer = 'Puedo ayudarte a organizar tus tareas, pensar objetivos o guardar ideas.';

  if (lower.includes('tarea')) {
    answer = `Tenés ${tasks.length} tareas en total y ${tasks.filter(t => !t.done).length} pendientes.`;
  } else if (lower.includes('nota')) {
    answer = `Actualmente tenés ${notes.length} notas guardadas.`;
  } else if (lower.includes('hola')) {
    answer = '¡Hola! ¿Qué te gustaría organizar hoy?';
  } else if (lower.includes('objetivo')) {
    answer = 'Un buen objetivo debe ser claro, concreto y tener una fecha.';
  }

  box.innerHTML += `
    <div class="message bot">${escapeHTML(answer)}</div>
  `;

  box.scrollTop = box.scrollHeight;
}

// MODO OSCURO
$('themeBtn').onclick = () => {
  const dark = document.body.classList.toggle('dark');

  const variables = {
    '--bg': dark ? '#111218' : '#f6f7f9',
    '--panel': dark ? '#1b1c24' : '#ffffff',
    '--text': dark ? '#f3f3f8' : '#17191f',
    '--border': dark ? '#30313b' : '#eceef1',
    '--muted': dark ? '#a2a4b0' : '#9297a2'
  };

  Object.entries(variables).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });

  localStorage.setItem('aura_dark', dark ? '1' : '0');
};

// INICIALIZACIÓN
function renderAll() {
  renderDashboard();
  renderTasks();
  renderNotes();
  renderCalendar('miniCalendar');
}

$('todayDate').textContent = new Date().toLocaleDateString('es-AR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric'
});

if (localStorage.getItem('aura_dark') === '1') {
  $('themeBtn').click();
}

renderAll();
