// ===================================
// LOGIN.JS - Complete Login System
// ===================================
// All-in-one: Authentication, UI, Effects, and Navigation

// ===================================
// AUTHENTICATION & USER MANAGEMENT
// ===================================

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem('users') || '[]');
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
}

function saveUsers(users) {
  try {
    localStorage.setItem('users', JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users:', error);
  }
}

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
  } catch (error) {
    console.error('Error reading current user:', error);
    return null;
  }
}

function setCurrentUser(user) {
  try {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } catch (error) {
    console.error('Error setting current user:', error);
  }
}

function logout() {
  localStorage.removeItem('currentUser');
}

function isLoggedIn() {
  return getCurrentUser() !== null;
}

function loginUser(email, password) {
  const users = getUsers();
  const normalizedEmail = email.trim().toLowerCase();
  const user = users.find(u => 
    u.email.toLowerCase() === normalizedEmail && u.password === password
  );
  
  if (user) {
    setCurrentUser(user);
    return { success: true, message: 'Login successful!', user };
  }
  return { success: false, message: 'Invalid email or password' };
}

// ===================================
// VISUAL EFFECTS
// ===================================

function initAuthEffects() {
  const bg = document.querySelector('.page-bg');
  const logo = document.querySelector('.brand-logo');
  const card = document.querySelector('.card');

  if (bg) {
    bg.animate(
      [
        { transform: 'translate3d(0,0,0) scale(1)' },
        { transform: 'translate3d(-2%, 1%, 0) scale(1.02)' },
        { transform: 'translate3d(0,0,0) scale(1)' }
      ],
      { duration: 14000, iterations: Infinity, easing: 'ease-in-out' }
    );
  }

  function onMove(e) {
    const x = (e.clientX / window.innerWidth - 0.5) * 18;
    const y = (e.clientY / window.innerHeight - 0.5) * 12;
    if (bg) bg.style.transform = `translate3d(${x * 0.6}px, ${y * 0.6}px, 0)`;
    if (logo) logo.style.transform = `translate3d(${x * 0.12}px, ${y * 0.12}px, 0)`;
    if (card) card.style.transform = `translate3d(${x * 0.03}px, ${y * 0.03}px, 0)`;
  }

  window.addEventListener('mousemove', onMove, { passive: true });
  window.addEventListener('touchmove', (ev) => {
    const t = ev.touches && ev.touches[0];
    if (t) onMove({ clientX: t.clientX, clientY: t.clientY });
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    if (bg) bg.style.transform = '';
    if (logo) logo.style.transform = '';
    if (card) card.style.transform = '';
  });
}

// ===================================
// LOGIN PAGE UI
// ===================================

document.addEventListener('DOMContentLoaded', function() {
  // Initialize effects
  initAuthEffects();
  
  // DOM Elements
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return; // Not on login page
  
  const emailEl = document.getElementById('email');
  const passEl = document.getElementById('password');
  const alertEl = document.getElementById('alert');
  const loginBtn = document.getElementById('loginBtn');
  const togglePassword = document.getElementById('togglePassword');
  const rememberMeCheckbox = document.getElementById('rememberMe');
  const loadingOverlay = document.getElementById('loadingOverlay');
  const successOverlay = document.getElementById('successOverlay');

  // Helper Functions
  function showAlert(text, type='success') {
    if (!alertEl) return;
    alertEl.textContent = text;
    alertEl.classList.remove('hidden','success','error');
    alertEl.classList.add(type);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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

  // Password Toggle
  if (togglePassword) {
    togglePassword.addEventListener('click', () => {
      const type = passEl.type === 'password' ? 'text' : 'password';
      passEl.type = type;
      const icon = togglePassword.querySelector('i');
      icon.classList.toggle('fa-eye');
      icon.classList.toggle('fa-eye-slash');
    });
  }

  // Check if Already Logged In
  const currentUser = getCurrentUser();
  if (currentUser) {
    showAlert(`You're already logged in as ${currentUser.fullname} (${currentUser.email}).`, 'success');
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
      location.reload();
    });

    actionContainer.appendChild(continueLink);
    actionContainer.appendChild(logoutButton);
    if (alertEl) alertEl.appendChild(actionContainer);
  }

  // Load Remembered Email
  const rememberedEmail = localStorage.getItem('rememberedEmail');
  if (rememberedEmail) {
    emailEl.value = rememberedEmail;
    if (rememberMeCheckbox) rememberMeCheckbox.checked = true;
    updateBtnState();
  }

  // Event Listeners
  emailEl.addEventListener('input', updateBtnState);
  passEl.addEventListener('input', updateBtnState);

  // Form Submit
  loginForm.addEventListener('submit', function(evt){
    evt.preventDefault();
    const e = emailEl.value.trim().toLowerCase();
    const p = passEl.value.trim();
    
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
    
    const loginResult = loginUser(e, p);
    
    if (loginResult.success) {
      if (rememberMeCheckbox && rememberMeCheckbox.checked) {
        localStorage.setItem('rememberedEmail', e);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      
      if (loadingOverlay) loadingOverlay.classList.remove('hidden');
      
      setTimeout(() => {
        if (loadingOverlay) loadingOverlay.classList.add('hidden');
        if (successOverlay) successOverlay.classList.remove('hidden');
        
        setTimeout(() => {
          window.location.href = '../index/index.html';
        }, 1200);
      }, 800);
    } else {
      showAlert(loginResult.message, 'error');
      shakeCard();
    }
  });

  // Social Login Placeholders
  const googleBtn = document.getElementById('googleBtn');
  const xBtn = document.getElementById('xBtn');
  const facebookBtn = document.getElementById('facebookBtn');
  const telegramBtn = document.getElementById('telegramBtn');
  
  if (googleBtn) {
    googleBtn.addEventListener('click', () => {
      showAlert('Google sign-in coming soon!', 'error');
    });
  }
  
  if (xBtn) {
    xBtn.addEventListener('click', () => {
      showAlert('X sign-in coming soon!', 'error');
    });
  }

  if (facebookBtn) {
    facebookBtn.addEventListener('click', () => {
      showAlert('Facebook sign-in coming soon!', 'error');
    });
  }

  if (telegramBtn) {
    telegramBtn.addEventListener('click', () => {
      showAlert('Telegram sign-in coming soon!', 'error');
    });
  }

  // Add shake animation CSS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    .shake {
      animation: shake 0.5s;
    }
  `;
  document.head.appendChild(style);
});
