document.getElementById('registrationForm').addEventListener('input', function () {
    validateForm();
});

function validateForm() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const submitBtn = document.getElementById('submitBtn');
    const errorElement = document.getElementById('passwordError');

    let isValid = true;

    // Check if all fields are filled
    if (!username || !password || !confirmPassword) {
        isValid = false;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        errorElement.textContent = 'Passwords do not match';
        errorElement.classList.remove('success');
        errorElement.classList.add('error');
        isValid = false;
    } else {
        errorElement.textContent = 'Passwords match';
        errorElement.classList.remove('error');
        errorElement.classList.add('success');
    }


    if (isValid) {
        submitBtn.classList.add('enabled');
        submitBtn.disabled = false;
    } else {
        submitBtn.classList.remove('enabled');
        submitBtn.disabled = true;
    }
}


function myFunction() {
    var passwordField = document.getElementById("password");
    var confirmPasswordField = document.getElementById("confirmPassword");

    // Toggle visibility for password field
    if (passwordField.type === "password") {
        passwordField.type = "text";
    } else {
        passwordField.type = "password";
    }
    

    // Toggle visibility for confirm password field (for register page)
    if (confirmPasswordField.type === "password") {
        confirmPasswordField.type = "text";
    } else {
        confirmPasswordField.type = "password";
    }
}

