// register.js
document.addEventListener('DOMContentLoaded', function () {
    // Check if there's an error message
    
    if (hasError === 'true') {
        const usernameInput = document.getElementById('usernameInput');
        const originalPlaceholder = 'Enter Username';
        const errorMessage = 'Username already exists';

        // Change placeholder
        usernameInput.placeholder = errorMessage;

        // Add a class
        usernameInput.classList.add('invalidInput');

        // Remove the class after a delay
        setTimeout(() => {
            usernameInput.placeholder = originalPlaceholder;
            usernameInput.classList.remove('invalidInput');
        }, 5000); // Adjust the duration (in milliseconds) to match the animation duration
    }
});
