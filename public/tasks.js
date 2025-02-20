const myModal = new bootstrap.Modal(document.getElementById('addTaskModal'))
const addTaskForm = document.getElementById('addTaskForm');

const editTaskModal = new bootstrap.Modal(document.getElementById('editTaskModal'));
const editTaskForm = document.getElementById('editTaskForm');

// Status display
const statusDisplay = {
  todo: 'To Do',
  in_progress: 'In Progress',
  completed: 'Completed'
}

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
      // Update the task table
      const updatedTask = (await response.json()).task; // Get the updated task from the server's response
      updateTaskInTable(updatedTask)
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

  try {
    const taskId = editTaskForm.dataset.taskId; // Get from the form
    const formData = new FormData(editTaskForm);
    const response = await fetch(`/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(formData))
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    // Handle successful task update 
    editTaskModal.hide();
    // Update the task list 
    const updatedTask = (await response.json()).task; // Get the updated task from the server's response
    // add the status
    console.log(updatedTask)
    updateTaskInTable(updatedTask); // Call the function to update the table row

  } catch (error) {
    console.error('Error updating task:', error);
    errorMessageElement.textContent = 'Error updating task. Please try again.';
    errorMessageElement.style.display = 'block'
  }
})

async function editTask(taskId) {
  try {
    const response = await fetch(`/tasks/${taskId}`); // Fetch the list tasks
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`); // Handle errors
    }
    const taskObj = await response.json(); // Parse JSON with await
    const task = taskObj.task // The response comes with message and task
    // Get the elements from the edit modal
    const editTitleInput = document.getElementById('editTitle');
    const editDescriptionInput = document.getElementById('editDescription');
    const editStatusSelect = document.getElementById('editStatus');
    const editDueDate = document.getElementById('editDueDate');

    //Populate the edit modal
    editTitleInput.value = task.title
    editDescriptionInput.value = task.description;
    editStatusSelect.value = task.status;
    editDueDate.value = formatDateForInput(task.dueDate);
    editTaskForm.dataset.taskId = taskId; // Set it on the form
    editTaskModal.show();
  }
  catch (error) {
    console.error("One or more edit modal elements not found!", error);
  }
}

async function updateTaskInTable(updatedTask) {
  const row = document.querySelector(`tr[data-task-id="${updatedTask.id}"]`);

  if (row) {
    const titleCell = row.querySelector('.task-title');
    const descriptionCell = row.querySelector('.task-description');
    const statusCell = row.querySelector('.task-status');
    titleCell.textContent = updatedTask.title;
    descriptionCell.textContent = updatedTask.description;
    statusCell.textContent = statusDisplay[updatedTask.status]

  } else {
    console.error("Row not found for updated task:", updatedTask.id);
  }
}

function formatDateForInput(dateString) {
  if (!dateString) {
    return "";
  }
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString; // Return original string if formatting fails
  }
}
