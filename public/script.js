function handleLoginResponse(response) {
    if (response.ok) {
      return response.json()
        .then(data => {
          localStorage.setItem('jwtToken', data.token); 
          window.location.href = '/dashboard'; 
        })
        .catch(error => {
          console.error('Error parsing JSON:', error);
          // Handle JSON parsing errors 
        });
    } else {
      // Handle login errors (e.g., display an error message)
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