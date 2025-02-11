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
            const errorData = await response.json();
            const errorMessage = errorData.message || 'Login failed.';

            // Display the error message
            const errorMessageElement = document.getElementById('error-message');
            errorMessageElement.textContent = errorMessage;
            errorMessageElement.style.display = 'block';
            console.error('Login failed:', response.status); 
        }
    } catch (error) {
        console.error('Login error:', error); // Handle errors during the fetch request itself, such as network errors, connection issues,etc.
        alert('An error occurred during login.');
    }
});

const logoutButton = document.getElementById('logoutButton');

logoutButton.addEventListener('click', async () => {
    try {
        const response = await fetch('/logout', {
            method: 'GET'
        });

        if (response.ok) {
            window.location.href = '/login';
        } else {
            console.error('Logout failed:', response.status);
            alert('Logout failed.');
        }

    } catch (error) {
        console.error('Logout error:', error);
        alert('An error occurred during logout.');
    }
});