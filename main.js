class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.currentFilter = 'all';
        this.initializeElements();
        this.bindEvents();
        this.render();
    }

    initializeElements() {
        this.taskForm = document.getElementById('taskForm');
        this.taskInput = document.getElementById('taskInput');
        this.categorySelect = document.getElementById('categorySelect');
        this.dueDateInput = document.getElementById('dueDateInput');
        this.taskList = document.getElementById('taskList');
        this.taskCount = document.getElementById('taskCount');
        this.clearCompleted = document.getElementById('clearCompleted');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        
        // Set today as the default date
        const today = new Date().toISOString().split('T')[0];
        this.dueDateInput.value = today;
    }

    bindEvents() {
        this.taskForm.addEventListener('submit', (e) => this.handleSubmit(e));
        this.clearCompleted.addEventListener('click', () => this.clearCompletedTasks());
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', () => this.setFilter(btn.dataset.filter));
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        const title = this.taskInput.value.trim();
        if (!title) return;

        const task = {
            id: Date.now().toString(),
            title,
            category: this.categorySelect.value,
            dueDate: this.dueDateInput.value,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.unshift(task);
        this.saveTasks();
        this.taskInput.value = '';
        this.render();
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.render();
        }
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
        this.render();
    }

    clearCompletedTasks() {
        this.tasks = this.tasks.filter(task => !task.completed);
        this.saveTasks();
        this.render();
    }

    setFilter(filter) {
        this.currentFilter = filter;
        this.filterButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        this.render();
    }

    getFilteredTasks() {
        switch (this.currentFilter) {
            case 'active':
                return this.tasks.filter(task => !task.completed);
            case 'completed':
                return this.tasks.filter(task => task.completed);
            default:
                return this.tasks;
        }
    }

    formatDate(dateString) {
        const options = { month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    createTaskElement(task) {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        taskElement.innerHTML = `
            <div class="task-content">
                <div class="task-title">${task.title}</div>
                <div class="task-meta">
                    <span class="task-category">${task.category}</span>
                    <span class="task-date">Due ${this.formatDate(task.dueDate)}</span>
                </div>
            </div>
            <div class="task-actions">
                <button class="btn-toggle" onclick="taskManager.toggleTask('${task.id}')">
                    ${task.completed ? '✓' : '○'}
                </button>
                <button class="btn-delete" onclick="taskManager.deleteTask('${task.id}')">
                    ×
                </button>
            </div>
        `;
        
        return taskElement;
    }

    render() {
        const filteredTasks = this.getFilteredTasks();
        this.taskList.innerHTML = '';
        
        filteredTasks.forEach(task => {
            this.taskList.appendChild(this.createTaskElement(task));
        });

        const activeTasks = this.tasks.filter(task => !task.completed).length;
        this.taskCount.textContent = `${activeTasks} task${activeTasks !== 1 ? 's' : ''} remaining`;
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
}

// Initialize the task manager
const taskManager = new TaskManager();