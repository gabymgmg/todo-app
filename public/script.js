const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(loginForm);
    const data = Object.fromEntries(formData);
    console.log(data)
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            // Redirect to dashboard immediately after successful login
            window.location.href = '/dashboard'; 
          } else {
            // Handle login errors
            console.error('Login failed:', response.status);
            alert('Login failed. Please check your credentials.');
          }
    } catch (error) {
        console.error('Login error:', error); // Handle errors during the fetch request itself, such as network errors, connection issues,etc.
        alert('An error occurred during login.');
    }
});