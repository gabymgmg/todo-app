const loginForm = document.getElementById('loginForm');
const errorMessageElement = document.getElementById('error-message'); // Declare it here
const logoutButton = document.getElementById('logoutButton');
import axios from 'axios';
const instance = axios.create({
    baseURL: '/', // API base URL 
    withCredentials: true, // Allows cookies to be sent
});

instance.interceptors.response.use(
    (response) => {
        return response; // Successful response
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401) {
            if (cookieExists('refreshToken')) {
                try {
                    await refreshAccessToken();
                    return instance(originalRequest); // Retry request
                } catch (refreshError) {
                    // Refresh failed, redirect to login
                    clearCookiesAndRedirect();
                    return Promise.reject(refreshError);
                }
            } else {
                // No refresh token, redirect to login
                // clearCookiesAndRedirect();
                displayError(error.response.data.message || 'Login failed.');
                return Promise.reject(error);
            }
        }

        return Promise.reject(error); // Other errors
    }
);

async function refreshAccessToken() {
    try {
        const response = await instance.post('/refreshToken');
        if (response.status !== 200) {
            throw new Error('Refresh token failed');
        }
    } catch (error) {
        throw error;
    }
}

function cookieExists(name) {
    return document.cookie.split(';').some(cookie => cookie.trim().startsWith(`${name}=`));
}

function clearCookiesAndRedirect() {
    document.cookie = "jwt=; max-age=0; path=/;";
    document.cookie = "refreshToken=; max-age=0; path=/;";
    window.location.href = '/login';
}

// Login form handling
async function handleLogin(event) {
    event.preventDefault();
    const credentials = Object.fromEntries(new FormData(loginForm));
    console.log('Attempting login with:', credentials);

    try {
        const response = await instance.post('/login', credentials);

        if (response.status === 200) {
            window.location.href = '/dashboard';
            return;
        }

    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.log('login failed', error.response)
            displayError(error.response.data.message || 'Login failed.');
        } else {
            displayError('An unexpected error occurred.');
            console.error('Login error:', error);
        }
    }
}

function displayError(message) {
    errorMessageElement && (errorMessageElement.textContent = message, errorMessageElement.style.display = 'block');
}

loginForm && loginForm.addEventListener('submit', handleLogin);

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