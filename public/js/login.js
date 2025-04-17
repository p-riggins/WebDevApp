// login.js - Combined login and forgot password functionality

// Global variables to track form elements
let loginForm, emailInput, passwordInput, loginButton;
let forgotForm, forgotEmailInput, resetButton;

/**
 * Main initialization function
 */
function initializeLoginForms() {
  // Initialize login form elements
  loginForm = document.getElementById('signup');
  emailInput = document.getElementById('email');
  passwordInput = document.getElementById('password');
  loginButton = document.getElementById('loginButton');
  
  // Initialize forgot password form elements
  forgotForm = document.getElementById('forgotPasswordForm');
  forgotEmailInput = document.getElementById('forgotEmail');
  resetButton = document.getElementById('resetButton');
  
  // Set up login form validation
  setupLoginValidation();
  
  // Set up forgot password form validation
  setupForgotPasswordValidation();
}

/**
 * Handles validation for the login form
 */
function setupLoginValidation() {
  // Exit if form elements aren't found
  if (!loginForm || !emailInput || !passwordInput || !loginButton) return;
  
  // Initially disable the button
  loginButton.classList.remove('enabled');
  loginButton.disabled = true;
  
  // Validate on input
  loginForm.addEventListener('input', validateLoginForm);
  
  // Prevent default form submission and handle login
  loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Final validation before submission
    if (validateLoginForm()) {
      // If using the AuthService, use it here
      if (typeof AuthService !== 'undefined') {
        const email = emailInput.value;
        const password = passwordInput.value;
        
        AuthService.login(email, password)
          .then(user => {
            showAlert('Login successful!', 'success');
            showDashboard(user.role);
          })
          .catch(error => {
            showAlert('Login failed: ' + error.message, 'danger');
          });
      } else {
        // Fallback if AuthService isn't available
        showAlert('Login successful!', 'success');
        showSection('DashboardSection');
      }
    }
  });
}

/**
 * Validates the login form
 * @returns {boolean} True if valid, false otherwise
 */
function validateLoginForm() {
  let isValid = true;
  
  // Validate email
  if (!emailInput || !emailInput.value.trim()) {
    showInputError(emailInput, 'Email is required');
    isValid = false;
  } else if (!isValidEmail(emailInput.value)) {
    showInputError(emailInput, 'Please enter a valid email address');
    isValid = false;
  } else {
    clearInputError(emailInput);
  }
  
  // Validate password
  if (!passwordInput || !passwordInput.value.trim()) {
    showInputError(passwordInput, 'Password is required');
    isValid = false;
  } else {
    clearInputError(passwordInput);
  }
  
  // Enable or disable login button
  if (isValid && loginButton) {
    loginButton.classList.add('enabled');
    loginButton.disabled = false;
  } else if (loginButton) {
    loginButton.classList.remove('enabled');
    loginButton.disabled = true;
  }
  
  return isValid;
}

/**
 * Handles validation for the forgot password form
 */
function setupForgotPasswordValidation() {
  // Exit if form elements aren't found
  if (!forgotForm || !forgotEmailInput || !resetButton) return;
  
  // Initially disable the button
  resetButton.disabled = true;
  
  // Add input event listener for validation
  forgotForm.addEventListener('input', validateForgotPasswordForm);
  
  // Handle form submission
  forgotForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    if (validateForgotPasswordForm()) {
      // In a real app, this would make an API call to send a reset link
      
      // Disable the button while "sending"
      resetButton.disabled = true;
      resetButton.textContent = 'Sending...';
      
      // Simulate async operation
      setTimeout(() => {
        showAlert('Password reset link sent to ' + forgotEmailInput.value, 'success');
        
        // Reset form
        forgotEmailInput.value = '';
        resetButton.disabled = false;
        resetButton.textContent = 'Reset Password';
        
        // Redirect to login after a delay
        setTimeout(() => {
          showSection('loginSection');
        }, 2000);
      }, 1500);
    }
  });
}

/**
 * Validates the forgot password form
 * @returns {boolean} True if valid, false otherwise
 */
function validateForgotPasswordForm() {
  let isValid = true;
  
  // Validate email
  if (!forgotEmailInput || !forgotEmailInput.value.trim()) {
    showInputError(forgotEmailInput, 'Email is required');
    isValid = false;
  } else if (!isValidEmail(forgotEmailInput.value)) {
    showInputError(forgotEmailInput, 'Please enter a valid email address');
    isValid = false;
  } else {
    clearInputError(forgotEmailInput);
  }
  
  // Enable or disable reset button
  resetButton.disabled = !isValid;
  
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

// Password toggle function for login form
function togglePasswordVisibility() {
  const passwordField = document.getElementById('password');
  if (passwordField) {
    passwordField.type = passwordField.type === 'password' ? 'text' : 'password';
  }
}

// Initialize both forms when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeLoginForms);

// Export functions to global scope
window.togglePasswordVisibility = togglePasswordVisibility;
window.myFunction = togglePasswordVisibility; // Legacy compatibility