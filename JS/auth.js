function login() {
    const name = document.getElementById('name').value;
    const password = document.getElementById('password').value;
  
    // Send login request to server
    fetch('/loginpage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token })
    })
    .then(res => res.json())
    .then(data => {
      // Save token in local storage
      localStorage.setItem('jwt_token', data.token);
      alert('Login successful');
    })
    .catch(err => {
      console.error(err);
      alert('Login failed');
    });
}