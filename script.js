const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const toggleTheme = document.getElementById('toggle-theme');
const clearCompletedBtn = document.getElementById('clear-completed');
const filterButtons = document.querySelectorAll('.filter-btn');
const totalCount = document.getElementById('total-count');
const activeCount = document.getElementById('active-count');
const completedCount = document.getElementById('completed-count');
const suggestBtn = document.getElementById('suggest-task');

let currentFilter = 'all';

window.onload = function () {
  loadTasks();
  loadTheme();
  updateCounters();
};

addBtn.addEventListener('click', handleAddTask);
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleAddTask();
});

function handleAddTask() {
  const taskText = taskInput.value.trim();
  if (taskText === '') return;
  addTask(taskText);
  taskInput.value = '';
  saveTasks();
  updateCounters();
}

function addTask(text, completed = false) {
  const li = document.createElement('li');
  if (completed) li.classList.add('completed');

  const taskContent = document.createElement('div');
  taskContent.className = 'task-content';

  const icon = document.createElement('div');
  icon.className = 'task-icon';
  icon.textContent = '📝';

  const span = document.createElement('span');
  span.textContent = text;

  taskContent.appendChild(icon);
  taskContent.appendChild(span);
  li.appendChild(taskContent);

  li.addEventListener('click', () => {
    li.classList.toggle('completed');
    saveTasks();
    updateCounters();
  });

  li.addEventListener('dblclick', () => {
    const newText = prompt('Edit your task:', span.textContent);
    if (newText !== null && newText.trim() !== '') {
      span.textContent = newText.trim();
      saveTasks();
    }
  });

  const btn = document.createElement('button');
  btn.textContent = '✕';
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    li.remove();
    saveTasks();
    updateCounters();
  });

  li.appendChild(btn);
  taskList.appendChild(li);
  applyFilter();
}

function saveTasks() {
  const tasks = [];
  taskList.querySelectorAll('li').forEach((li) => {
    tasks.push({
      text: li.querySelector('span').textContent,
      completed: li.classList.contains('completed'),
    });
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  const data = JSON.parse(localStorage.getItem('tasks')) || [];
  data.forEach(task => addTask(task.text, task.completed));
}

toggleTheme.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

function loadTheme() {
  const theme = localStorage.getItem('theme');
  if (theme === 'dark') document.body.classList.add('dark');
}

clearCompletedBtn.addEventListener('click', () => {
  taskList.querySelectorAll('li.completed').forEach(li => li.remove());
  saveTasks();
  updateCounters();
});

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    applyFilter();
  });
});

function applyFilter() {
  const tasks = taskList.querySelectorAll('li');
  tasks.forEach(task => {
    switch (currentFilter) {
      case 'all':
        task.style.display = 'flex';
        break;
      case 'active':
        task.style.display = task.classList.contains('completed') ? 'none' : 'flex';
        break;
      case 'completed':
        task.style.display = task.classList.contains('completed') ? 'flex' : 'none';
        break;
    }
  });
}

function updateCounters() {
  const tasks = taskList.querySelectorAll('li');
  const completed = taskList.querySelectorAll('li.completed').length;
  totalCount.textContent = `Total: ${tasks.length}`;
  completedCount.textContent = `Completed: ${completed}`;
  activeCount.textContent = `Active: ${tasks.length - completed}`;
}

function getSmartTaskSuggestion() {
  const hour = new Date().getHours();
  const timeSuggestions = hour < 12
    ? ["Write your daily goals ☀️", "Go for a morning walk 🚶", "Meditate for 10 minutes 🧘"]
    : hour < 18
    ? ["Finish pending tasks ✅", "Check your emails 📧", "Organize workspace 🧹"]
    : ["Plan tomorrow 📝", "Read a book 📖", "Reflect on today 🌙"];

  const genericSuggestions = [
    "Call a friend 📞",
    "Drink water 💧",
    "Do 10 pushups 💪",
    "Stretch your legs 🧎",
    "Clean your desk 🧽"
  ];

  const suggestions = [...timeSuggestions, ...genericSuggestions];
  const suggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
  return suggestion;
}

suggestBtn.addEventListener('click', () => {
  const suggestion = getSmartTaskSuggestion();
  addTask(suggestion);
  saveTasks();
  updateCounters();
});
