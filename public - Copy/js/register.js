// register.js - Form validation for registration page

// Global variables to track form elements
let registrationForm, regEmailInput, regPasswordInput, regConfirmPasswordInput;
let roleSelect, registerButton, passwordErrorSpan;

/**
 * Main initialization function
 */
function initializeRegistrationForm() {
  // Get form elements
  registrationForm = document.getElementById('registrationForm');
  regEmailInput = document.getElementById('regEmail');
  regPasswordInput = document.getElementById('regPassword');
  regConfirmPasswordInput = document.getElementById('regConfirmPassword');
  roleSelect = document.getElementById('roleSelect');
  registerButton = document.getElementById('registerButton');
  passwordErrorSpan = document.getElementById('passwordError');
  
  // Exit if form elements aren't found
  if (!registrationForm || !regEmailInput || !regPasswordInput || !regConfirmPasswordInput) {
    console.error('Registration form elements not found');
    return;
  }
  
  // Initially disable the register button
  if (registerButton) {
    registerButton.classList.remove('enabled');
    registerButton.disabled = true;
  }
  
  // Set up form validation
  setupRegistrationValidation();
}

/**
 * Sets up validation for the registration form
 */
function setupRegistrationValidation() {
  // Validate on input
  registrationForm.addEventListener('input', validateRegistrationForm);
  
  // Handle form submission
  registerButton.addEventListener('click', function(e) {
    e.preventDefault();
    
    if (validateRegistrationForm()) {
      // Get form values
      const email = regEmailInput.value;
      const password = regPasswordInput.value;
      const role = roleSelect ? roleSelect.options[roleSelect.selectedIndex].text : 'Student';
      
      // Store user data
      const userData = {
        email: email,
        role: role,
        password: password // In a real app, you'd hash this before sending it
      };
      
      // In a real app, you would send this to your backend
      console.log('Registration data:', userData);
      
      // Store in registeredUsers array if available
      if (typeof window.registeredUsers === 'undefined') {
        window.registeredUsers = [];
      }
      window.registeredUsers.push(userData);
      
      // Show success message
      showAlert('Registration successful!', 'success');
      
      // Redirect to login
      setTimeout(() => {
        showSection('loginSection');
      }, 1500);
    } else {
      showAlert('Please fix the errors in the form', 'warning');
    }
  });
}

/**
 * Validates the registration form
 * @returns {boolean} True if valid, false otherwise
 */
function validateRegistrationForm() {
  let isValid = true;
  
  // Validate email
  if (!regEmailInput.value.trim()) {
    showInputError(regEmailInput, 'Email is required');
    isValid = false;
  } else if (!isValidEmail(regEmailInput.value)) {
    showInputError(regEmailInput, 'Please enter a valid email address');
    isValid = false;
  } else {
    clearInputError(regEmailInput);
  }
  
  // Validate password
  if (!regPasswordInput.value.trim()) {
    showInputError(regPasswordInput, 'Password is required');
    isValid = false;
  } else if (regPasswordInput.value.length < 6) {
    showInputError(regPasswordInput, 'Password must be at least 6 characters');
    isValid = false;
  } else {
    clearInputError(regPasswordInput);
  }
  
  // Validate password confirmation
  if (!regConfirmPasswordInput.value.trim()) {
    showInputError(regConfirmPasswordInput, 'Please confirm your password');
    isValid = false;
  } else if (regConfirmPasswordInput.value !== regPasswordInput.value) {
    showInputError(regConfirmPasswordInput, 'Passwords do not match');
    // Update the password error span
    if (passwordErrorSpan) {
      passwordErrorSpan.textContent = 'Passwords do not match';
      passwordErrorSpan.className = 'error';
    }
    isValid = false;
  } else {
    clearInputError(regConfirmPasswordInput);
    // Update the password error span
    if (passwordErrorSpan) {
      passwordErrorSpan.textContent = 'Passwords match';
      passwordErrorSpan.className = 'success';
    }
  }
  
  // Validate role selection
  if (roleSelect && roleSelect.selectedIndex <= 0) {
    isValid = false;
  }
  
  // Enable or disable register button
  if (isValid && registerButton) {
    registerButton.classList.add('enabled');
    registerButton.disabled = false;
  } else if (registerButton) {
    registerButton.classList.remove('enabled');
    registerButton.disabled = true;
  }
  
  return isValid;
}

/**
 * Shows error message for input field
 * @param {HTMLElement} input - Input element
 * @param {string} message - Error message
 */
function showInputError(input, message) {
  if (!input) return;
  
  const inputBox = input.parentElement;
  inputBox.classList.remove('success');
  inputBox.classList.add('error');
  
  const errorElement = inputBox.querySelector('small');
  if (errorElement) {
    errorElement.textContent = message;
  }
}

/**
 * Clears error message for input field
 * @param {HTMLElement} input - Input element
 */
function clearInputError(input) {
  if (!input) return;
  
  const inputBox = input.parentElement;
  inputBox.classList.remove('error');
  inputBox.classList.add('success');
  
  const errorElement = inputBox.querySelector('small');
  if (errorElement) {
    errorElement.textContent = '';
  }
}

/**
 * Toggle password visibility for registration form
 */
function toggleRegisterPasswordVisibility() {
  const passwordField = document.getElementById('regPassword');
  const confirmPasswordField = document.getElementById('regConfirmPassword');
  
  if (passwordField) {
    passwordField.type = passwordField.type === 'password' ? 'text' : 'password';
  }
  
  if (confirmPasswordField) {
    confirmPasswordField.type = confirmPasswordField.type === 'password' ? 'text' : 'password';
  }
}

// Initialize registration form when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeRegistrationForm);

// Export functions to global scope
window.toggleRegisterPasswordVisibility = toggleRegisterPasswordVisibility;
window.toggleStudentPassword = toggleRegisterPasswordVisibility; // Legacy compatibility