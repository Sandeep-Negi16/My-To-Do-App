const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');

let tasks = [];

// Load tasks from localStorage on start
window.onload = function() {
  const storedTasks = localStorage.getItem('tasks');
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
    renderTasks();
  }
};

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render the tasks in the UI
function renderTasks() {
  taskList.innerHTML = '';

  tasks.forEach((task) => {
    const taskItem = document.createElement('div');
    taskItem.className = 'task-item';

    const taskText = document.createElement('span');
    taskText.className = 'task-text';
    taskText.textContent = task.text;
    if (task.completed) {
      taskText.classList.add('completed');
    }

    // Toggle completed on click
    taskText.addEventListener('click', () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    });

    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'buttons';

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.className = 'btn edit';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => {
      if (editBtn.textContent === 'Edit') {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = task.text;
        input.className = 'task-text';
        taskItem.replaceChild(input, taskText);
        input.focus();
        editBtn.textContent = 'Save';

        input.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            input.blur();
          }
        });
        input.addEventListener('blur', () => {
          const newText = input.value.trim();
          if (newText) {
            task.text = newText;
            saveTasks();
            renderTasks();
          } else {
            alert('Task cannot be empty');
            input.focus();
          }
          editBtn.textContent = 'Edit';
        });

      }
    });

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn delete';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => {
      tasks = tasks.filter((t) => t !== task);
      saveTasks();
      renderTasks();
    });

    buttonsDiv.appendChild(editBtn);
    buttonsDiv.appendChild(deleteBtn);

    taskItem.appendChild(taskText);
    taskItem.appendChild(buttonsDiv);
    taskList.appendChild(taskItem);
  });
}

// Add new task when button clicked
addBtn.addEventListener('click', () => {
  const text = taskInput.value.trim();
  if (text === '') {
    alert('Please enter a task.');
    return;
  }
  tasks.push({ text, completed: false });
  taskInput.value = '';
  saveTasks();
  renderTasks();
});

// Also add new task on pressing Enter key in input box
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addBtn.click();
  }
});
