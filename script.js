   
        document.addEventListener('DOMContentLoaded', function() {
            const taskInput = document.getElementById('taskInput');
            const addBtn = document.getElementById('addBtn');
            const taskList = document.getElementById('taskList');
            const totalTasksSpan = document.getElementById('totalTasks');
            const completedTasksSpan = document.getElementById('completedTasks');
            
            let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            
            // Render tasks from local storage
            renderTasks();
            updateStats();
            
            // Add new task
            addBtn.addEventListener('click', addTask);
            taskInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    addTask();
                }
            });
            
            function addTask() {
                const taskText = taskInput.value.trim();
                if (taskText === '') {
                    return;
                }
                
                const newTask = {
                    id: Date.now(),
                    text: taskText,
                    completed: false
                };
                
                tasks.push(newTask);
                saveTasks();
                renderTasks();
                updateStats();
                
                taskInput.value = '';
                taskInput.focus();
            }
            
            function renderTasks() {
                if (tasks.length === 0) {
                    taskList.innerHTML = `
                        <li class="empty-state">
                            <img src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/23ebfb4b-e5d7-4022-a4bb-26e6617728d8.png" alt="Illustration of a clipboard with verification checkmarks in a flat design style" />
                            <p>No tasks added yet. Start by adding one above!</p>
                        </li>
                    `;
                    return;
                }
                
                taskList.innerHTML = '';
                
                tasks.forEach(task => {
                    const taskItem = document.createElement('li');
                    taskItem.className = 'task-item' + (task.completed ? ' completed' : '');
                    taskItem.innerHTML = `
                        <span class="task-text">${task.text}</span>
                        <div class="task-actions">
                            <button class="complete-btn" aria-label="Mark task as complete"></button>
                            <button class="delete-btn" aria-label="Delete task"></button>
                        </div>
                    `;
                    
                    const completeBtn = taskItem.querySelector('.complete-btn');
                    const deleteBtn = taskItem.querySelector('.delete-btn');
                    
                    completeBtn.addEventListener('click', () => toggleComplete(task.id));
                    deleteBtn.addEventListener('click', () => deleteTask(task.id));
                    
                    taskList.appendChild(taskItem);
                });
            }
            
            function toggleComplete(id) {
                tasks = tasks.map(task => {
                    if (task.id === id) {
                        return { ...task, completed: !task.completed };
                    }
                    return task;
                });
                
                saveTasks();
                renderTasks();
                updateStats();
            }
            
            function deleteTask(id) {
                tasks = tasks.filter(task => task.id !== id);
                saveTasks();
                renderTasks();
                updateStats();
            }
            
            function saveTasks() {
                localStorage.setItem('tasks', JSON.stringify(tasks));
            }
            
            function updateStats() {
                const total = tasks.length;
                const completed = tasks.filter(task => task.completed).length;
                
                totalTasksSpan.textContent = `${total} ${total === 1 ? 'task' : 'tasks'}`;
                completedTasksSpan.textContent = `${completed} completed`;
            }
        });
   