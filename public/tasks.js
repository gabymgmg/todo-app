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

// Add click event listener to the edit buttons
const editButtons = document.querySelectorAll('.btn-edit');
editButtons.forEach(button => {
  button.addEventListener('click', () => {
    const taskId = button.getAttribute('data-task-id');

    // Fetch task details from the server
    fetch(`/tasks/${taskId}`, { 
      method: 'GET'
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(taskData => {
        // Populate the edit form with task data
        const data = taskData.task
        console.log(document.getElementById('title'))
        document.getElementById('title').value = data.title;
        document.getElementById('description').value = data.description;
        document.getElementById('dueDate').value = data.dueDate;
        document.getElementById('status').value = data.status;
        //editTaskForm.setAttribute('action', `/tasks/${taskId}`); // Set the action attribute for PUT request

        // Show the edit modal
        editTaskModal.show();
      })
      .catch(error => {
        console.error('Error fetching task data:', error);
        // Handle error gracefully (e.g., display an error message)
      });
  });
});

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
    // Refresh the task list (replace with your actual logic)
    location.reload(); 

  } catch (error) {
    console.error('Error updating task:', error);
    errorMessageElement.textContent = 'Error updating task. Please try again.';
    errorMessageElement.style.display = 'block'
  }
})