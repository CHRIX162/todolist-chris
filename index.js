document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const emptyImage = document.querySelector('.empty-image');
    const progressBar = document.getElementById('progress');
    const progressNumbers = document.getElementById('numbers');

    // 1. Mettre à jour la barre de progression
    const updateProgress = () => {
        const totalTasks = taskList.children.length;
        const completedTasks = taskList.querySelectorAll('.check-box:checked').length;
        const progressWidth = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
        
        progressBar.style.width = `${progressWidth}%`;
        progressNumbers.textContent = `${completedTasks} / ${totalTasks}`;

        if (totalTasks > 0 && completedTasks === totalTasks) {
            confetti(); // Animation de fête [8]
        }
    };

    const toggleEmptyState = () => {
        emptyImage.style.display = taskList.children.length === 0 ? 'block' : 'none';
    };

    // 2. Ajouter une tâche
    const addTask = (text = "", completed = false) => {
        const taskText = text || taskInput.value.trim();
        if (!taskText) return;

        const li = document.createElement('li');
        if (completed) li.classList.add('completed');

        li.innerHTML = `
            <input type="checkbox" class="check-box" ${completed ? 'checked' : ''}>
            <span>${taskText}</span>
            <div class="task-buttons">
                <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
                <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;

        // Événement Check
        const checkbox = li.querySelector('.check-box');
        checkbox.addEventListener('change', () => {
            li.classList.toggle('completed', checkbox.checked);
            updateProgress();
            saveTasks();
        });

        // Événement Supprimer
        li.querySelector('.delete-btn').addEventListener('click', () => {
            li.remove();
            toggleEmptyState();
            updateProgress();
            saveTasks();
        });

        // Événement Editer [9]
        li.querySelector('.edit-btn').addEventListener('click', () => {
            if (!checkbox.checked) {
                taskInput.value = li.querySelector('span').textContent;
                li.remove();
                updateProgress();
                saveTasks();
            }
        });

        taskList.appendChild(li);
        taskInput.value = '';
        toggleEmptyState();
        updateProgress();
        saveTasks();
    };

    // 3. Sauvegarde Locale [10]
    const saveTasks = () => {
        const tasks = Array.from(taskList.querySelectorAll('li')).map(li => ({
            text: li.querySelector('span').textContent,
            completed: li.querySelector('.check-box').checked
        }));
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const loadTasks = () => {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        tasks.forEach(task => addTask(task.text, task.completed));
    };

    addTaskBtn.addEventListener('click', () => addTask());
    loadTasks();
});