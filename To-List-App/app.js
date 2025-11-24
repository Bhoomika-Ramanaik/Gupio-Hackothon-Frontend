const STORAGE_KEY = 'todo_app_tasks';
let tasks = [];

const addForm = document.getElementById('addForm');
const taskInput = document.getElementById('taskInput');
const dueInput = document.getElementById('dueInput');
const taskList = document.getElementById('taskList');
const emptyText = document.getElementById('empty');
const filters = document.querySelectorAll('.filter-btn');

let currentFilter = 'all';

// Load saved tasks
function loadTasks() {
  const saved = localStorage.getItem(STORAGE_KEY);
  tasks = saved ? JSON.parse(saved) : [];
}

// Save tasks
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Render
function renderTasks() {
  taskList.innerHTML = '';

  const filtered = tasks.filter(t => {
    if (currentFilter === 'active') return !t.completed;
    if (currentFilter === 'completed') return t.completed;
    return true;
  });

  emptyText.hidden = filtered.length !== 0;

  filtered.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task';

    // Checkbox
    const checkbox = document.createElement('button');
    checkbox.className = 'checkbox';
    checkbox.innerHTML = task.completed ? "✓" : "";
    if (task.completed) checkbox.classList.add('checked');
    checkbox.onclick = () => toggleTask(task.id);

    // Info
    const main = document.createElement('div');
    main.className = 'task-main';

    const title = document.createElement('p');
    title.className = 'task-title';
    title.textContent = task.text;
    if (task.completed) {
      title.style.textDecoration = "line-through";
      title.style.opacity = "0.5";
    }

    const meta = document.createElement('p');
    meta.className = 'task-meta';
    meta.textContent = task.due ? `Due: ${task.due}` : "No due date";

    // Actions
    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'icon-btn';
    editBtn.textContent = "✏️";
    editBtn.onclick = () => editTask(task.id);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'icon-btn delete';
    deleteBtn.textContent = "🗑️";
    deleteBtn.onclick = () => deleteTask(task.id);

    actions.append(editBtn, deleteBtn);
    main.append(title, meta);
    li.append(checkbox, main, actions);
    taskList.append(li);
  });
}

// Add Task
addForm.addEventListener('submit', e => {
  e.preventDefault();

  const text = taskInput.value.trim();
  if (!text) return alert("Task cannot be empty!");

  tasks.push({
    id: Date.now(),
    text,
    due: dueInput.value || null,
    completed: false
  });

  saveTasks();
  renderTasks();
  addForm.reset();
});

// Toggle complete
function toggleTask(id) {
  tasks = tasks.map(t => t.id === id ? ({ ...t, completed: !t.completed }) : t);
  saveTasks();
  renderTasks();
}

// Delete
function deleteTask(id) {
  if (confirm("Delete this task?")) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
  }
}

// Edit
function editTask(id) {
  const newText = prompt("Update task:");
  if (!newText) return;

  tasks = tasks.map(t => t.id === id ? ({ ...t, text: newText }) : t);
  saveTasks();
  renderTasks();
}

// Filter buttons
filters.forEach(btn => {
  btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

// Init
loadTasks();
renderTasks();
