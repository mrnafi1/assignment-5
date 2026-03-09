
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');


loginForm.addEventListener('submit', function(event) {
    
    
    event.preventDefault();


    const usernameValue = usernameInput.value;
    const passwordValue = passwordInput.value;

    
    if (usernameValue === 'admin' && passwordValue === 'admin123') {
        
        
        alert('Login Successful!');
        
        
        window.location.href = 'main.html'; 
        
    } else {
        
        alert('Invalid Username or Password. Please try again!');
    }
});