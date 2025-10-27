// ===================================
// REGISTER.JS - Complete Registration System
// ===================================
// All-in-one: Authentication, UI, Effects, and Validation

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

function registerUser(fullname, email, password) {
  const users = getUsers();
  const normalizedEmail = email.trim().toLowerCase();
  
  const existingUser = users.find(user => 
    user.email.toLowerCase() === normalizedEmail
  );
  
  if (existingUser) {
    return { success: false, message: 'Email already registered' };
  }
  
  const newUser = {
    id: Date.now(),
    fullname: fullname.trim(),
    email: normalizedEmail,
    password: password,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  saveUsers(users);
  
  return { success: true, message: 'Registration successful!', user: newUser };
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
// REGISTER PAGE UI
// ===================================

document.addEventListener('DOMContentLoaded', function() {
  // Initialize effects
  initAuthEffects();
  
  // DOM Elements
  const form = document.getElementById('registerForm');
  if (!form) return; // Not on register page
  
  const fullname = document.getElementById('fullname');
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const confirmPassword = document.getElementById('confirm-password');
  const errorMsg = document.getElementById('error-msg');
  const loadingMsg = document.getElementById('loading-msg');
  const togglePassword = document.getElementById('togglePassword');
  const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
  const emailValidation = document.getElementById('emailValidation');
  const passwordStrengthEl = document.getElementById('passwordStrength');
  const strengthBar = document.getElementById('strengthBar');
  const strengthText = document.getElementById('strengthText');
  const loadingOverlay = document.getElementById('loadingOverlay');
  const successOverlay = document.getElementById('successOverlay');

  // Password Toggle
  if (togglePassword) {
    togglePassword.addEventListener('click', () => {
      const type = password.type === 'password' ? 'text' : 'password';
      password.type = type;
      const icon = togglePassword.querySelector('i');
      icon.classList.toggle('fa-eye');
      icon.classList.toggle('fa-eye-slash');
    });
  }

  if (toggleConfirmPassword) {
    toggleConfirmPassword.addEventListener('click', () => {
      const type = confirmPassword.type === 'password' ? 'text' : 'password';
      confirmPassword.type = type;
      const icon = toggleConfirmPassword.querySelector('i');
      icon.classList.toggle('fa-eye');
      icon.classList.toggle('fa-eye-slash');
    });
  }

  // Email Validation
  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  email.addEventListener('input', () => {
    const value = email.value.trim();
    if (value === '') {
      emailValidation.classList.remove('valid', 'invalid');
    } else if (validateEmail(value)) {
      emailValidation.classList.remove('invalid');
      emailValidation.classList.add('valid');
    } else {
      emailValidation.classList.remove('valid');
      emailValidation.classList.add('invalid');
    }
  });

  // Password Strength
  function checkPasswordStrength(pass) {
    if (pass.length === 0) return null;
    if (pass.length < 6) return 'weak';
    
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/\d/.test(pass)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) strength++;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength++;
    
    if (strength <= 1) return 'weak';
    if (strength === 2 || strength === 3) return 'medium';
    return 'strong';
  }

  password.addEventListener('input', () => {
    const value = password.value;
    const strength = checkPasswordStrength(value);
    
    if (!strength) {
      passwordStrengthEl.classList.remove('visible');
      strengthBar.className = 'strength-bar-fill';
      strengthText.textContent = '';
      strengthText.className = 'strength-text';
      return;
    }
    
    passwordStrengthEl.classList.add('visible');
    strengthBar.className = `strength-bar-fill ${strength}`;
    
    if (strength === 'weak') {
      strengthText.textContent = 'Weak - Should be longer and more complex';
      strengthText.className = 'strength-text weak';
    } else if (strength === 'medium') {
      strengthText.textContent = 'Medium - Pretty good!';
      strengthText.className = 'strength-text medium';
    } else {
      strengthText.textContent = 'Strong - Excellent password!';
      strengthText.className = 'strength-text strong';
    }
  });

  // Helper Functions
  function showError(msg) {
    if (errorMsg) {
      errorMsg.textContent = msg;
      errorMsg.style.display = 'block';
    }
    if (loadingMsg) loadingMsg.style.display = 'none';
  }

  function showLoading(msg) {
    if (loadingMsg) {
      loadingMsg.textContent = msg;
      loadingMsg.style.display = 'block';
    }
    if (errorMsg) errorMsg.style.display = 'none';
  }

  function hideMessages() {
    if (errorMsg) errorMsg.style.display = 'none';
    if (loadingMsg) loadingMsg.style.display = 'none';
  }

  function shakeCard() {
    const card = document.querySelector('.card');
    if (card) {
      card.classList.remove('shake');
      void card.offsetWidth;
      card.classList.add('shake');
    }
  }

  // Form Submit
  form.addEventListener('submit', function(evt) {
    evt.preventDefault();
    hideMessages();
    
    const fname = fullname.value.trim();
    const em = email.value.trim();
    const pw = password.value.trim();
    const cpw = confirmPassword.value.trim();
    
    // Validation
    if (!fname) {
      showError('❌ Please enter your full name');
      shakeCard();
      return;
    }
    
    if (!em) {
      showError('❌ Please enter your email');
      shakeCard();
      return;
    }
    
    if (!validateEmail(em)) {
      showError('❌ Please enter a valid email address');
      shakeCard();
      return;
    }
    
    if (!pw) {
      showError('❌ Please enter a password');
      shakeCard();
      return;
    }
    
    if (pw.length < 6) {
      showError('❌ Password must be at least 6 characters');
      shakeCard();
      return;
    }
    
    if (pw !== cpw) {
      showError('❌ Passwords do not match');
      shakeCard();
      return;
    }
    
    // Register
    showLoading('Creating your account...');
    
    setTimeout(() => {
      const result = registerUser(fname, em, pw);
      
      if (result.success) {
        if (loadingOverlay) loadingOverlay.classList.remove('hidden');
        hideMessages();
        
        setTimeout(() => {
          if (loadingOverlay) loadingOverlay.classList.add('hidden');
          if (successOverlay) successOverlay.classList.remove('hidden');
          
          setTimeout(() => {
            window.location.href = '../login/login.html';
          }, 1500);
        }, 800);
      } else {
        showError(`❌ ${result.message}`);
        shakeCard();
      }
    }, 500);
  });

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
