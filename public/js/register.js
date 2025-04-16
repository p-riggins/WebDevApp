// Validate the registration form on input
document.getElementById('registrationForm').addEventListener('input', function () {
    validateForm();
});

function validateForm() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const submitBtn = document.getElementById('submitBtn');
    const errorElement = document.getElementById('passwordError');

    let isValid = true;

    // Ensure all required fields (email, password, confirmPassword) are filled
    if (!email || !password || !confirmPassword) {
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

// Simulate registration on submit button click
document.getElementById('submitBtn').addEventListener('click', function(e) {
    e.preventDefault();
    // Run validation one more time
    validateForm();
    const submitBtn = document.getElementById('submitBtn');
    if (!submitBtn.disabled) {
         alert("Registration successful!");
         // Optionally, clear the form or redirect the user.
    } else {
         alert("Please fix the errors in the form.");
    }
});

function myFunction() {
    var passwordField = document.getElementById("password");
    var confirmPasswordField = document.getElementById("confirmPassword");

    // Toggle visibility for password field
    if (passwordField.type === "password") {
        passwordField.type = "text";
    } else {
        passwordField.type = "password";
    }
    
    // Toggle visibility for confirm password field
    if (confirmPasswordField.type === "password") {
        confirmPasswordField.type = "text";
    } else {
        confirmPasswordField.type = "password";
    }
}

// Global array to store registered users
const registeredUsers = [];

// Function to handle instructor registration
function registerInstructor() {
  console.log('Instructor registration triggered');
  const firstName = document.getElementById('fname_instructor').value;
  const lastName = document.getElementById('lname_instructor').value;
  const email = document.getElementById('email_instructor').value;

  if (firstName && lastName && email) {
    registeredUsers.push({
      firstName,
      lastName,
      email,
      role: 'Instructor',
    });

    console.log('Instructor registered:', { firstName, lastName, email });
    alert('Instructor registered successfully!');
    showSection('registeredUsersSection');
    populateRegisteredUsersTable();
  } else {
    alert('Please fill out all required fields.');
  }
}

// Function to handle student registration
function registerStudent() {
  console.log('Student registration triggered');
  const firstName = document.getElementById('fname_student').value;
  const lastName = document.getElementById('lname_student').value;
  const email = document.getElementById('email_student').value;

  if (firstName && lastName && email) {
    registeredUsers.push({
      firstName,
      lastName,
      email,
      role: 'Student',
    });

    console.log('Student registered:', { firstName, lastName, email });
    alert('Student registered successfully!');
    showSection('registeredUsersSection');
    populateRegisteredUsersTable();
  } else {
    alert('Please fill out all required fields.');
  }
}

// Function to populate the registered users table
function populateRegisteredUsersTable() {
  const tableBody = document.querySelector('#registeredUsersTable tbody');
  tableBody.innerHTML = ''; // Clear existing rows

  registeredUsers.forEach((user) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${user.firstName}</td>
      <td>${user.lastName}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
    `;
    tableBody.appendChild(row);
  });
}

// Ensure event listeners are properly attached
document.getElementById('submitBtnInstructor').addEventListener('click', registerInstructor);
document.getElementById('submitBtnStudent').addEventListener('click', registerStudent);
