// Select the email and password input fields
const emailEl = document.querySelector('#email'); // Updated to use "email"
const passwordEl = document.querySelector('#password');
const form = document.querySelector('#signup');

const showError = (input, message) => {
    const inputBox = input.parentElement;
    inputBox.classList.remove('success');
    inputBox.classList.add('error');
    const error = inputBox.querySelector('small');
    error.textContent = message;
};

const showSuccess = (input) => {
    const inputBox = input.parentElement;
    inputBox.classList.remove('error');
    inputBox.classList.add('success');
    const error = inputBox.querySelector('small');
    error.textContent = '';
};

const checkEmail = () => {
    let valid = false;
    const email = emailEl.value.trim();
    if (!isRequired(email)) {
        showError(emailEl, 'Email cannot be blank.');
    } else {
        showSuccess(emailEl);
        valid = true;
    }
    return valid;
};

const checkPassword = () => {
    let valid = false;
    const password = passwordEl.value.trim();
    if (!isRequired(password)) {
        showError(passwordEl, 'Password cannot be blank.');
    } else {
        showSuccess(passwordEl);
        valid = true;
    }
    return valid;
};

const isRequired = value => value === '' ? false : true;

function myFunction() {
    const passwordField = document.getElementById("password");
    passwordField.type = passwordField.type === "password" ? "text" : "password";
}

window.onload = function() {
    document.getElementById('loginButton').addEventListener('click', function(event) {
        event.preventDefault();

        let isEmailValid = checkEmail();
        let isPasswordValid = checkPassword();
        let isFormValid = isEmailValid && isPasswordValid;

        if (isFormValid) {  
            console.log('Form is valid. Simulating successful login...');
            // Optionally, show a success message to the user or redirect.
        } else {
            console.log('Form is invalid.');
        }
    });
};

form.addEventListener('input', function(e) {
    switch (e.target.id) {
        case 'email': // Now validating "email"
            checkEmail();
            break;
        case 'password':
            checkPassword();
            break;
    }
});
