const myModal = new bootstrap.Modal(document.getElementById('addTaskModal'))
const addTaskForm = document.getElementById('addTaskForm');
addTaskForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(addTaskForm);
  const data = Object.fromEntries(Array.from(formData.entries())); 

  try {
    console.log('This is data sent', data); // Log to verify event listener execution
    const response = await fetch('/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      myModal.hide(); 
      location.reload(); 
    } else {
      console.error('Error creating task:', response.status);
    }
  } catch (error) {
    console.error('Error creating task:', error);
  }
});