// dashboard.js - Dashboard and authentication functionality

// AuthService - modular authentication service for backend integration
const AuthService = {
    // Current user information
    currentUser: null,
  
    // Login method - ready for backend integration
    login: async function(email, password) {
      try {
        // In a real app, this would be an API call
        return new Promise((resolve, reject) => {
          // Simple validation
          if (!email || !password) {
            reject(new Error('Email and password are required'));
            return;
          }
  
          // Demo role detection
          let userRole = 'student';
          if (email.includes('instructor') || email.includes('teacher')) {
            userRole = 'instructor';
          }
  
          // Create user object
          const user = {
            email: email,
            role: userRole,
            displayName: email.split('@')[0],
          };
  
          // Store user in the service
          this.currentUser = user;
          localStorage.setItem('user', JSON.stringify(user));
          resolve(user);
        });
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },
  
    // Logout method
    logout: function() {
      this.currentUser = null;
      localStorage.removeItem('user');
      return Promise.resolve();
    },
  
    // Check if user is authenticated
    isAuthenticated: function() {
      if (this.currentUser) return true;
      
      // Check localStorage for stored user
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          this.currentUser = JSON.parse(storedUser);
          return true;
        } catch (e) {
          console.error('Error parsing stored user', e);
        }
      }
      
      return false;
    },
  
    // Get current user
    getCurrentUser: function() {
      if (!this.isAuthenticated()) return null;
      return this.currentUser;
    }
  };
  
  // Function to show dashboard based on role
  function showDashboard(role) {
    // Show dashboard section
    showSection('DashboardSection');
    
    // Update body classes
    document.body.classList.remove('login-page');
    document.body.classList.add('sb-nav-fixed');
    
    // Update username in sidebar
    const user = AuthService.getCurrentUser();
    if (user) {
      const userNameElement = document.querySelector('.sb-sidenav-footer .small + div');
      if (userNameElement) {
        userNameElement.textContent = user.displayName || user.email;
      }
    }
    
    // Show/hide role-specific content
    const instructorContent = document.querySelectorAll('.instructor-only');
    const studentContent = document.querySelectorAll('.student-only');
    
    if (role === 'instructor') {
      instructorContent.forEach(el => el.style.display = 'block');
      studentContent.forEach(el => el.style.display = 'none');
    } else {
      instructorContent.forEach(el => el.style.display = 'none');
      studentContent.forEach(el => el.style.display = 'block');
    }
    
    // Initialize any charts or tables
    initializeCharts();
  }
  
  // Placeholder for chart initialization
  function initializeCharts() {
    // This would be replaced with actual chart initialization code
    console.log('Charts would be initialized here');
  }
  
  // Export functions to global scope
  window.showDashboard = showDashboard;
  window.AuthService = AuthService;