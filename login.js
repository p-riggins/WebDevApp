const usernameEl = document.querySelector('#username');
const passwordEl = document.querySelector('#password');

const form = document.querySelector('#signup');

const showError = (input, message) => {
    // get the input-box element
    const inputBox = input.parentElement;
    // add the error class
    inputBox.classList.remove('success');
    inputBox.classList.add('error');

    // show the error message
    const error = inputBox.querySelector('small');
    error.textContent = message;
};

const showSuccess = (input) => {
    // get the input-box element
    const inputBox = input.parentElement;

    // remove the error class
    inputBox.classList.remove('error');
    inputBox.classList.add('success');

    // hide the error message
    const error = inputBox.querySelector('small');
    error.textContent = '';
}

const checkUsername = () => {
    let valid = false;
    const username = usernameEl.value.trim();

    if (!isRequired(username)) {
        showError(usernameEl, 'Username cannot be blank.');
    } else {
        showSuccess(usernameEl);
        valid = true;
    }
    return valid;
}

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

    $('#loginButton').on('click',function(event) {
        event.preventDefault();

        let isUsernameValid = checkUsername();
        let isPasswordValid = checkPassword();
        let isFormValid = isUsernameValid && isPasswordValid;

        if (isFormValid) {  // Form is valid, you can proceed with form submission or other actions
            console.log('Form is valid');
        } else {
            console.log('Form is invalid');
        }

        console.log("Login button clicked");

        var username = $('#username').val();
        var password = $('#password').val();

        if (username !== '' && password !== '') {
            $.ajax({
                url: "http://localhost/login",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({
                    Username: username,
                    Password: password
                }),
                success: function(data) {

                    // Store session data in sessionStorage
                    sessionStorage.setItem('username', username); // Store the username
                    sessionStorage.setItem('SessionID', data);
                    console.log(data);

                    $('#loginButton').next('small')
                        .text("Successful login. Redirecting...")
                        .css('color', '#90EE90') // Set the text color to green
                        .show();
    
                    setTimeout(function() {
                        window.location.href = "/recipes";
                    }, 1500);
                },
                error: function() {
                    const errorMessage = !isFormValid
                        ? "Invalid username or password"
                        : "An error occurred. Please try again later.";
                    
                    $('#loginButton').next('small').text(errorMessage).show();
                }
            });
        } else {
            const errorMessage = !isFormValid
                        ? "Invalid username or password"
                        : "An error occurred. Please try again later.";
                    
                    $('#loginButton').next('small').text(errorMessage).show();
        }
    });
};

form.addEventListener('input', function (e) {
    switch (e.target.id) {
        case 'username':
            checkUsername();
            break;
        case 'password':
            checkPassword();
            break;
    }
});