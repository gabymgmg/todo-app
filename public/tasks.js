const myModal = new bootstrap.Modal(document.getElementById('addTaskModal'))
const addTaskForm = document.getElementById('addTaskForm');

const editTaskModal = new bootstrap.Modal(document.getElementById('editTaskModal'));
const editTaskForm = document.getElementById('editTaskForm');



addTaskForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(addTaskForm);
    const data = Object.fromEntries(Array.from(formData.entries()));
    try {
        const response = await fetch('/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            myModal.hide();
            location.reload();
        } else {
            // Handle task creation errors
            const errorData = await response.json();
            const errorMessage = errorData.message || 'Empty or Invalid Field';

            // Display the error message
            const errorMessageElement = document.getElementById('error-message-task');
            errorMessageElement.textContent = errorMessage;
            errorMessageElement.style.display = 'block';
            console.error('Error creating task:', response.status);
        }
    } catch (error) {
        console.error('Error creating task:', error);
    }
});

function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
      fetch(`/tasks/${taskId}`, { method: 'DELETE' })
        .then(response => {
          if (response.ok) {
            location.reload(); // Reload the page to update the task list
          } else {
            console.error('Error deleting task:', response.status);
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  }

  editTaskForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(addTaskForm);
    const data = Object.fromEntries(Array.from(formData.entries()));
    try {
        const response = await fetch('/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            myModal.hide();
            location.reload();
        } else {
            // Handle task creation errors
            const errorData = await response.json();
            const errorMessage = errorData.message || 'Empty or Invalid Field';

            // Display the error message
            const errorMessageElement = document.getElementById('error-message-task');
            errorMessageElement.textContent = errorMessage;
            errorMessageElement.style.display = 'block';
            console.error('Error creating task:', response.status);
        }
    } catch (error) {
        console.error('Error creating task:', error);
    }
});
