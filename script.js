// Select DOM Elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const pendingList = document.getElementById('pendingList');
const completedList = document.getElementById('completedList');
const pendingCount = document.getElementById('pendingCount');
const completedCount = document.getElementById('completedCount');

// Load tasks from Local Storage or initialize an empty array
let tasks = JSON.parse(localStorage.getItem('dailyActivities')) || [];

// Save tasks to Local Storage
function saveTasks() {
    localStorage.setItem('dailyActivities', JSON.stringify(tasks));
}

// Render tasks to the screen
function renderTasks() {
    pendingList.innerHTML = '';
    completedList.innerHTML = '';

    let pendingCounter = 0;
    let completedCounter = 0;

    tasks.forEach((task) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;

        li.innerHTML = `
            <div class="task-left">
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})">
                <span class="task-text">${escapeHTML(task.text)}</span>
            </div>
            <div class="task-actions">
                <button class="edit-btn" onclick="editTask(${task.id})">Edit</button>
                <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;

        if (task.completed) {
            completedList.appendChild(li);
            completedCounter++;
        } else {
            pendingList.appendChild(li);
            pendingCounter++;
        }
    });

    // Show empty state messages if lists have no items
    if (pendingCounter === 0) {
        pendingList.innerHTML = '<li class="empty-msg">No pending tasks.</li>';
    }
    if (completedCounter === 0) {
        completedList.innerHTML = '<li class="empty-msg">No completed tasks yet.</li>';
    }

    // Update badge counters
    pendingCount.textContent = pendingCounter;
    completedCount.textContent = completedCounter;
}

// Add a new task
function addTask() {
    const text = taskInput.value.trim();
    if (text === '') {
        alert('Please enter a task!');
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskInput.value = '';
    taskInput.focus();
}

// Toggle task between Pending and Completed
window.toggleTask = function(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    saveTasks();
    renderTasks();
};

// Edit an existing task
window.editTask = function(id) {
    const taskToEdit = tasks.find(task => task.id === id);
    if (!taskToEdit) return;

    const updatedText = prompt('Edit your task:', taskToEdit.text);
    if (updatedText !== null && updatedText.trim() !== '') {
        taskToEdit.text = updatedText.trim();
        saveTasks();
        renderTasks();
    }
};

// Delete a task
window.deleteTask = function(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
};

// Helper function to prevent HTML injection
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Event Listeners for Add Button and Enter Key
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Initial render when the page loads
renderTasks();