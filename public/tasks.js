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

  try {
    const taskId = editTaskForm.getAttribute('data-task-id'); 
    const formData = new FormData(editTaskForm);
    const response = await fetch(`/tasks/${taskId}`, { 
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(formData))
    });

    if (!response.ok) {
      throw new Error('Network response was not ok'); 
    }

    // Handle successful task update (e.g., close modal, refresh page)
    editTaskModal.hide();
    // Refresh the task list 
    const updatedTask = await response.json(); // Get the updated task from the server's response
    updateTaskInTable(updatedTask); // Call the function to update the table row

  } catch (error) {
    console.error('Error updating task:', error);
    errorMessageElement.textContent = 'Error updating task. Please try again.';
    errorMessageElement.style.display = 'block'
  }
})

async function editTask (taskId){
  try {
    const response = await fetch(`/tasks/${taskId}`); // Fetch with await
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`); // Handle errors
    }
    const taskObj = await response.json(); // Parse JSON with await
    const task = taskObj.task
    console.log(task.dueDate)
    //Populate the edit modal
    const editTitleInput = document.getElementById('editTitle');
    const editDescriptionInput = document.getElementById('editDescription');
    const editStatusSelect = document.getElementById('editStatus');
    //const editDueDate = document.getElementById('editDueDate');

    editTitleInput.value = task.title
    editDescriptionInput.value = task.description;
    editStatusSelect.value = task.status;
    //editDueDate.value = task.dueDate;
    editTaskModal.show();
    
  }
  catch(error){
    console.error("One or more edit modal elements not found!", error);
  }
}