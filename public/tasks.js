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
// Provide default values for initial state
let totalPages = 1;
let currentPage = 1;
let searchTerm = "";
let currentStatus = "";
const tasksPerPage = 5;

// General functions for update and create rows (tasks) in table
function createTableRowHTML(task) {
  return `
      <td class="task-title">${task.title}</td>
      <td class="task-description">${task.description}</td>
      <td class="task-status">${statusDisplay[task.status] || "To Do"}</td>
      <td>
          <button class="btn btn-sm btn-primary btn-edit" type="button" data-bs-toggle="modal" data-bs-target="#editTaskModal" data-task-id="${task.id}" onclick="editTask(${task.id})">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteTask(${task.id})">Delete</button>
      </td>
  `;
}

function createNewRow(task) {
  const newRow = document.createElement('tr');
  newRow.dataset.taskId = task.id;
  newRow.innerHTML = createTableRowHTML(task);
  return newRow;
}

function updateExistingRow(row, updatedTask) {
  const titleCell = row.querySelector('.task-title');
  const descriptionCell = row.querySelector('.task-description');
  const statusCell = row.querySelector('.task-status');

  if (titleCell) titleCell.textContent = updatedTask.title;
  if (descriptionCell) descriptionCell.textContent = updatedTask.description;
  if (statusCell) statusCell.textContent = statusDisplay[updatedTask.status] || "To Do";
}

function updateTaskInTable(updatedTask) {
  const row = document.querySelector(`tr[data-task-id="${updatedTask.id}"]`);
  const tasksContainer = document.getElementById('tasksContainer');

  if (row) {
    updateExistingRow(row, updatedTask);
  } else {
    const newRow = createNewRow(updatedTask);
    tasksContainer.appendChild(newRow);
    // Ensures that if a new task is created while the user is on a page other than page 1,
    // the task list is refreshed to correctly display the new task.
    if (updatedTask.id && currentPage != 1) {
      fetchTasks()
    }
  }
}

async function fetchTasks(page = 1) {
  try {
    // Get tasks with params if any
    const response = await fetch(`/tasks?page=${page}&limit=${tasksPerPage}&search=${searchTerm}&status=${currentStatus}`);
    const data = await response.json();
    if(!data){
      throw new Error('Problems with parsing response'); // Handle errors
    }
    const tasks = data.tasks; // Since the response comes with diff properties
    totalPages = data.totalPages;
    currentPage = data.currentPage;

    const tasksContainer = document.getElementById('tasksContainer');
    tasksContainer.innerHTML = ''; // Clear existing tasks

    if (tasks.length === 0) {
      tasksContainer.innerHTML = '<tr><td colspan="4">No tasks found.</td></tr>';
      return;
    }
    // Populate the table with fetched tasks
    tasks.forEach(task => {
      const row = createNewRow(task);
      tasksContainer.appendChild(row);
    });

    renderPagination(); // Render pagination after fetching
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
}

function filterTasks(term) {
  searchTerm = term; // Update the search term
  fetchTasks(); // Fetch tasks again with the new search term
}

function filterByStatus(status) {
  currentStatus = status;
  fetchTasks();
}

function renderPagination() {
  const paginationContainer = document.getElementById('pagination');
  paginationContainer.innerHTML = ''; // Clear existing pagination buttons

  if (totalPages <= 1) return; // If only one page or no pages, no pagination needed

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement('button');
    pageButton.textContent = i; // Set the button text to the page number
    pageButton.classList.add('btn', 'btn-sm', 'mx-1');
    if (i === currentPage) pageButton.classList.add('btn-primary'); // Highlight the current page button
    pageButton.addEventListener('click', () => {
      fetchTasks(i); // Fetch tasks for the clicked page
    });
    paginationContainer.appendChild(pageButton); // Add the button to the container
  }
}

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

// Handling of Events
// Add task function
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

// Edit task function
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
    updateTaskInTable(updatedTask); // Call the function to update the table row

  } catch (error) {
    console.error('Error updating task:', error);
    const errorMessageElement = document.getElementById('error-message-task'); // Get the element
    if (errorMessageElement) { // Check if the element exists
      errorMessageElement.textContent = 'Error updating task. Please try again.';
      errorMessageElement.style.display = 'block';
    }
  }
})

// Call fetchTasks() to load the tasks when the page loads
document.addEventListener('DOMContentLoaded', () => {
  fetchTasks();

  const searchInput = document.getElementById('search'); // Add a search input in your HTML
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      filterTasks(searchInput.value);
    });
  }
  const statusFilter = document.getElementById('statusFilter'); // Add a search input in your HTML
  if (statusFilter) {
    statusFilter.addEventListener('change', () => {
      filterByStatus(statusFilter.value);
    });
  }
});

// Add an event listener for clear the modal form
addTaskModal.addEventListener('hidden.bs.modal', () => {
  addTaskForm.reset();
  const errorMessageElement = document.getElementById('error-message-task');
  errorMessageElement.textContent = "";
  errorMessageElement.style.display = 'none';
});