// ===================================
// Login Page Script - AutoTrade
// ===================================
// Purpose: Client-side validation, remember me functionality, and authentication using localStorage
// Note: auth.js must be loaded before this script

// ===================================
// Toast Notification System
// ===================================
function createToastContainer() {
  if (!document.querySelector('.toast-container')) {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
}

function showToast(type, title, message, duration = 5000) {
  createToastContainer();
  const container = document.querySelector('.toast-container');
  
  const icons = {
    success: 'fa-circle-check',
    error: 'fa-circle-xmark',
    warning: 'fa-triangle-exclamation',
    info: 'fa-circle-info'
  };
  
  const toast = document.createElement('div');
  toast.className = `toast-notification toast-${type}`;
  toast.innerHTML = `
    <div class="toast-icon">
      <i class="fa-solid ${icons[type]}"></i>
    </div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" aria-label="Close">
      <i class="fa-solid fa-times"></i>
    </button>
    <div class="toast-progress"></div>
  `;
  
  container.appendChild(toast);
  
  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => {
    toast.classList.add('toast-hiding');
    setTimeout(() => toast.remove(), 300);
  });
  
  setTimeout(() => {
    toast.classList.add('toast-hiding');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ===================================
// DOM Elements
// ===================================
const loginForm = document.getElementById('loginForm');
const emailEl = document.getElementById('email');
const passEl = document.getElementById('password');
const alertEl = document.getElementById('alert');
const loginBtn = document.getElementById('loginBtn');
const googleBtn = document.getElementById('googleBtn');
const xBtn = document.getElementById('xBtn');
const togglePassword = document.getElementById('togglePassword');
const rememberMeCheckbox = document.getElementById('rememberMe');
const loadingOverlay = document.getElementById('loadingOverlay');
const successOverlay = document.getElementById('successOverlay');

// ===================================
// Toggle Password Visibility
// ===================================
if (togglePassword) {
  togglePassword.addEventListener('click', () => {
    const type = passEl.type === 'password' ? 'text' : 'password';
    passEl.type = type;
    const icon = togglePassword.querySelector('i');
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
  });
}

// ===================================
// Load Remembered Email & Check if Already Logged In
// ===================================
window.addEventListener('DOMContentLoaded', () => {
  // Check if user is already logged in
  const currentUser = getCurrentUser();
  if (currentUser) {
    // If a session exists, show a non-blocking notice with actions instead of auto-redirecting.
    console.log('User already logged in:', currentUser);
    showAlert(`You're already logged in as ${currentUser.fullname} (${currentUser.email}).`, 'success');

    // Create action buttons (Continue / Logout) and append to alert
    const actionContainer = document.createElement('div');
    actionContainer.style.marginTop = '10px';
    actionContainer.style.display = 'flex';
    actionContainer.style.gap = '8px';
    actionContainer.style.justifyContent = 'center';

    const continueLink = document.createElement('a');
    continueLink.href = '../index/index.html';
    continueLink.className = 'btn btn-sm btn-primary';
    continueLink.textContent = 'Continue to site';

    const logoutButton = document.createElement('button');
    logoutButton.type = 'button';
    logoutButton.className = 'btn btn-sm btn-outline-light';
    logoutButton.textContent = 'Logout';
    logoutButton.addEventListener('click', () => {
      logout();
      // Reload to clear UI state
      location.reload();
    });

    actionContainer.appendChild(continueLink);
    actionContainer.appendChild(logoutButton);
    if (alertEl) alertEl.appendChild(actionContainer);
    // Do NOT return here so the user can still interact with the form if they want to log in as a different user
  }

  // Load remembered email
  const rememberedEmail = localStorage.getItem('rememberedEmail');
  if (rememberedEmail) {
    emailEl.value = rememberedEmail;
    if (rememberMeCheckbox) {
      rememberMeCheckbox.checked = true;
    }
    updateBtnState();
  }
});

// ===================================
// Helper Functions
// ===================================
function showAlert(text, type='success') {
  alertEl.textContent = text;
  alertEl.classList.remove('hidden','success','error');
  alertEl.classList.add(type);
}

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function updateBtnState() {
  const e = emailEl.value.trim();
  const p = passEl.value.trim();
  loginBtn.disabled = !(e && p);
}

function shakeCard() {
  const card = document.querySelector('.card');
  if (card) {
    card.classList.remove('shake');
    void card.offsetWidth;
    card.classList.add('shake');
  }
}

// ===================================
// Event Listeners
// ===================================
emailEl.addEventListener('input', updateBtnState);
passEl.addEventListener('input', updateBtnState);

// ===================================
// Form Submission
// ===================================
loginForm.addEventListener('submit', function(evt){
  evt.preventDefault();
  const e = emailEl.value.trim().toLowerCase();
  const p = passEl.value.trim();

  console.log('=== Login Form Submit ===');
  console.log('Email input:', e);
  console.log('Password input:', p);
  console.log('Users in storage:', getUsers());
  
  if (!e || !p) {
    showAlert('Please enter email and password!', 'error');
    shakeCard();
    return;
  }
  
  if (!isValidEmail(e)) {
    showAlert('Invalid email format!', 'error');
    shakeCard();
    return;
  }
  
  // Validate login credentials from localStorage using auth.js functions
  const loginResult = loginUser(e, p);
  console.log('Login result:', loginResult);
  
  if (loginResult.success) {
    // Login successful
    if (rememberMeCheckbox && rememberMeCheckbox.checked) {
      localStorage.setItem('rememberedEmail', e);
    } else {
      localStorage.removeItem('rememberedEmail');
    }
    
    showAlert(loginResult.message, 'success');
    
    if (loadingOverlay) {
      loadingOverlay.classList.remove('hidden');
    }
    
    setTimeout(() => {
      if (loadingOverlay) {
        loadingOverlay.classList.add('hidden');
      }
      if (successOverlay) {
        successOverlay.classList.remove('hidden');
      }
      
      setTimeout(() => {
        window.location.href = '../index/index.html';
      }, 1200);
    }, 800);
  } else {
    showAlert(loginResult.message, 'error');
    shakeCard();
  }
});

// ===================================
// Social Login Buttons
// ===================================
if (googleBtn) {
  googleBtn.addEventListener('click', function() {
    showAlert('Google login feature is under development...', 'success');
  });
}

if (xBtn) {
  xBtn.addEventListener('click', function() {
    showAlert('X (Twitter) login feature is under development...', 'success');
  });
}

// ===================================
// Page Animations
// ===================================
document.addEventListener('DOMContentLoaded', () => {
  const card = document.querySelector('.card');
  if (card) {
    requestAnimationFrame(() => {
      card.classList.add('revealed');
    });
  }

  const bg = document.querySelector('.page-bg');
  if (bg) {
    const onMove = (x, y) => {
      const rx = (x / window.innerWidth - 0.5) * 8;
      const ry = (y / window.innerHeight - 0.5) * 8;
      bg.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
    };
    
    window.addEventListener('mousemove', (e) => {
      onMove(e.clientX, e.clientY);
    });
    
    window.addEventListener('touchmove', (e) => {
      const t = e.touches[0];
      if (!t) return;
      onMove(t.clientX, t.clientY);
    }, { passive: true });
  }
});