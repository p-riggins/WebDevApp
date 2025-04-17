// scripts.js - Utility Functions

/**
 * Utility function to toggle password visibility
 * @param {string} passwordId - ID of the password field
 */
function togglePasswordVisibility(passwordId) {
    if (!passwordId) {
        // Default to the login password field
        toggleLoginPassword();
        return;
      }
      
      const passwordField = document.getElementById(passwordId);
      if (passwordField) {
        passwordField.type = passwordField.type === "password" ? "text" : "password";
      }
    
  }
  
  /**
   * Toggle visibility for multiple password fields
   * @param {Array<string>} ids - Array of password field IDs
   */
  function toggleMultiplePasswordFields(ids) {
    ids.forEach(id => togglePasswordVisibility(id));
  }
  
  /**
   * Toggle password visibility for login form
   */
  function toggleLoginPassword() {
    togglePasswordVisibility('password');
  }
  
  /**
   * Toggle password visibility for registration form
   */
  function toggleRegisterPasswordVisibility() {
    // Use IDs based on your current HTML structure
    // If you've updated your HTML with standardized IDs, use those
    const passwordId = document.getElementById('regPassword') ? 'regPassword' : 'password_student';
    const confirmPasswordId = document.getElementById('regConfirmPassword') ? 'regConfirmPassword' : 'confirmPassword_student';
    
    toggleMultiplePasswordFields([passwordId, confirmPasswordId]);
  }
  
  /**
   * Format date to a readable string
   * @param {Date|string} date - Date to format
   * @returns {string} Formatted date string
   */
  function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
  
  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} True if email is valid
   */
  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
  
  /**
   * Create a debounced function (for search inputs, etc.)
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function} Debounced function
   */
  function debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
  
  /**
   * Show an alert message that disappears after a timeout
   * @param {string} message - Message to display
   * @param {string} type - Alert type (success, error, warning, info)
   * @param {number} duration - Duration in milliseconds
   */
  function showAlert(message, type = 'info', duration = 3000) {
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} position-fixed top-0 start-50 translate-middle-x mt-3`;
    alert.style.zIndex = '9999';
    alert.innerHTML = message;
    
    // Add to body
    document.body.appendChild(alert);
    
    // Remove after duration
    setTimeout(() => {
      alert.classList.add('fade');
      setTimeout(() => alert.remove(), 300);
    }, duration);
  }
  
  // Define common password toggle functions used inline in HTML - for backwards compatibility
  window.myFunction = toggleLoginPassword;
  window.toggleStudentPassword = toggleRegisterPasswordVisibility;
  
  // Export functions to global scope for use in other scripts
  window.togglePasswordVisibility = togglePasswordVisibility;
  window.toggleMultiplePasswordFields = toggleMultiplePasswordFields;
  window.toggleLoginPassword = toggleLoginPassword;
  window.toggleRegisterPasswordVisibility = toggleRegisterPasswordVisibility;
  window.formatDate = formatDate;
  window.isValidEmail = isValidEmail;
  window.debounce = debounce;
  window.showAlert = showAlert;