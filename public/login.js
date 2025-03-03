const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(loginForm);
    const data = Object.fromEntries(formData);
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            // Redirect to dashboard immediately after successful login
            window.location.href = '/dashboard';
        } else if (response.status === 401) { // Check for 401 Unauthorized (token expired)
            try {
                const refreshResponse = await fetch('/refresh_token', {
                    method: 'POST', 
                });

                if (refreshResponse.ok) {
                    window.location.href = '/dashboard'; // Redirect
                } else {
                    // Refresh token is invalid or expired
                    window.location.href = '/login'; // Redirect to login
                    console.error("Refresh token error:", refreshResponse.status);
                }
            } catch (refreshError) {
                console.error("No refresh token found:", refreshError);
                window.location.href = '/login'; // Redirect to login
            }
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