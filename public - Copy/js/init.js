// init.js - Main application initialization script

// Global variables
let isInitialized = false;

// Main initialization function
function initApp() {
  // Prevent multiple initializations
  if (isInitialized) return;
  isInitialized = true;
  
  console.log('Initializing application...');
  
  // Define all available sections
  const sections = [
    'loginSection',
    'forgotPasswordSection',
    'registerSection',
    'DashboardSection'
  ];
  
  // Hide all sections initially
  sections.forEach(id => {
    const section = document.getElementById(id);
    if (section) {
      section.style.display = 'none';
    }
  });
  
  // Setup global event listeners (for elements present across multiple sections)
  setupGlobalEventListeners();
  
  // Check authentication status and show appropriate section
  checkAuthAndShowSection();
  
  console.log('Application initialized successfully');
}

// Function to check authentication and show appropriate section
function checkAuthAndShowSection() {
  // Check if user is authenticated using AuthService
  if (typeof AuthService !== 'undefined' && AuthService.isAuthenticated()) {
    console.log('User is authenticated');
    const user = AuthService.getCurrentUser();
    showDashboard(user.role);
  } else {
    // If not authenticated, show login page
    console.log('User is not authenticated, showing login page');
    showSection('loginSection');
  }
}

// Set up global event listeners
function setupGlobalEventListeners() {
  // Handle section navigation links
  document.addEventListener('click', function(event) {
    // Check if the clicked element has onclick with showSection
    if (event.target.hasAttribute('onclick')) {
      const onclickAttr = event.target.getAttribute('onclick');
      if (onclickAttr.includes('showSection(')) {
        // The navigation is handled by the inline onclick attribute
        // We don't need to do anything here
      }
    }
  });
  
  // Handle sidebar toggle
  const sidebarToggle = document.querySelector('#sidebarToggle');
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', function(event) {
      event.preventDefault();
      document.body.classList.toggle('sb-sidenav-toggled');
      localStorage.setItem('sb|sidebar-toggle', 
        document.body.classList.contains('sb-sidenav-toggled'));
    });
    
    // Check for saved sidebar state
    if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
      document.body.classList.add('sb-sidenav-toggled');
    }
  }
  
  // Handle logout
  const logoutLinks = document.querySelectorAll('.logout-link');
  logoutLinks.forEach(link => {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      
      if (typeof AuthService !== 'undefined') {
        AuthService.logout();
      }
      
      showSection('loginSection');
    });
  });
}

// Function to show a specific section
function showSection(sectionId) {
  // Define all available sections
  const sections = [
    'loginSection',
    'forgotPasswordSection',
    'registerSection',
    'DashboardSection'
  ];
  
  // Check if the section exists
  const targetSection = document.getElementById(sectionId);
  if (!targetSection) {
    console.error('Section not found:', sectionId);
    return;
  }
  
  // Hide all sections
  sections.forEach(id => {
    const section = document.getElementById(id);
    if (section) {
      section.style.display = 'none';
    }
  });
  
  // Show the requested section
  targetSection.style.display = 'block';
  
  // Update body classes based on the section
  const appBody = document.getElementById('appBody');
  if (sectionId === 'DashboardSection') {
    appBody.classList.remove('login-page');
    appBody.classList.add('sb-nav-fixed');
  } else {
    appBody.classList.add('login-page');
    appBody.classList.remove('sb-nav-fixed');
  }
  
  console.log('Now showing section:', sectionId);
}

// Export functions to global scope
window.showSection = showSection;

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);

// As a fallback, also check when window is fully loaded
window.addEventListener('load', function() {
  if (!isInitialized) {
    initApp();
  }
});