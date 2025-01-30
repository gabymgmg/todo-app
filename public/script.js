async function handleLoginResponse(response) {
  if (response.ok) {
    try {
      const data = await response.json();
      const token = data.accessToken
      // Get the access token
      if (token) {
        // Save the access token (short-lived) in browser session
        sessionStorage.setItem('jwtToken', token);
        console.log('this is access', token)
        //Fetch dashboard
        const dashboardResponse = await fetch('/dashboard', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }

        });
        console.log(dashboardResponse.ok)
        if (dashboardResponse.ok) {
          // Redirect only if the dashboard fetch is successful.
        window.location.href = '/dashboard'; // Or redirect to the actual dashboard URL.
        }
      } else {
        console.error('No access token received.');
        alert('Login failed. No access token received.');
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
      alert('Login failed. An error occurred.');
    }
  } else {
    // Handle login errors
    console.error('Login failed:', response.status);
    alert('Login failed. Please check your credentials.');
  }
}

const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (event) => {
  console.log('submitted')
  event.preventDefault();

  const formData = new FormData(loginForm);
  const data = Object.fromEntries(formData);

  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    handleLoginResponse(response);

  } catch (error) {
    console.error('Login error:', error);
    alert('An error occurred during login.');
  }
});