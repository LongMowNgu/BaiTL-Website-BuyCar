// Register page script
// Purpose: Client-side validation for required fields, email format, and password match; save to localStorage
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

const form = document.getElementById('registerForm');
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

// Toggle password visibility for both password fields
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

// Email validation with visual feedback
function validateEmail(value) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(value);
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

// Password strength indicator
function checkPasswordStrength(pass) {
  if (pass.length === 0) return null;
  if (pass.length < 6) return 'weak';
  
  let strength = 0;
  // Check length
  if (pass.length >= 8) strength++;
  // Check for numbers
  if (/\d/.test(pass)) strength++;
  // Check for special characters
  if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) strength++;
  // Check for uppercase and lowercase
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
    strengthText.textContent = 'Strong - Secure password!';
    strengthText.className = 'strength-text strong';
  }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  errorMsg.textContent = "";
  loadingMsg.textContent = "";

  // ✅ Check all fields are filled
  if (!fullname.value.trim() || !email.value.trim() || !password.value.trim() || !confirmPassword.value.trim()) {
    errorMsg.textContent = "❌ Please fill in all fields!";
    const card = document.querySelector('.register-card');
    if (card) { card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake'); }
    return;
  }

  // ✅ Check email format
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email.value)) {
    errorMsg.textContent = "❌ Invalid email!";
    const card = document.querySelector('.register-card');
    if (card) { card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake'); }
    return;
  }

  // ✅ Check passwords match
  if (password.value !== confirmPassword.value) {
    errorMsg.textContent = "❌ Passwords do not match!";
    const card = document.querySelector('.register-card');
    if (card) { card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake'); }
    return;
  }

  // ✅ Check minimum password length
  if (password.value.length < 6) {
    errorMsg.textContent = "❌ Password must be at least 6 characters!";
    const card = document.querySelector('.register-card');
    if (card) { card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake'); }
    return;
  }

  // ✅ Register user using auth.js functions
  // Trim password to avoid accidental leading/trailing spaces being stored
  const registerResult = registerUser(fullname.value.trim(), email.value.trim(), password.value.trim());
  
  if (!registerResult.success) {
    // Show detailed error message
    if (registerResult.message.includes('already registered')) {
      errorMsg.innerHTML = "❌ <strong>Email already registered!</strong><br>This email is already in use. Please <a href='../login/login.html' style='color: #fff; text-decoration: underline;'>login</a> or use a different email.";
    } else {
      errorMsg.textContent = "❌ " + registerResult.message;
    }
    const card = document.querySelector('.register-card');
    if (card) { card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake'); }
    return;
  }

  // ⏳ Show loading overlay
  loadingOverlay.classList.remove('hidden');
  
  setTimeout(() => {
    // Hide loading and show success
    loadingOverlay.classList.add('hidden');
    successOverlay.classList.remove('hidden');
    
    // Reset form and redirect
    form.reset();
    emailValidation.classList.remove('valid', 'invalid');
    passwordStrengthEl.classList.remove('visible');
    
    setTimeout(() => {
      window.location.href = "../login/login.html";
    }, 1200);
  }, 800);
});

// Reveal card and subtle parallax similar to login
document.addEventListener('DOMContentLoaded', () => {
  const card = document.querySelector('.register-card');
  if (card) { requestAnimationFrame(() => card.classList.add('revealed')); }

  const bg = document.querySelector('.page-bg');
  if (bg) {
    const onMove = (x, y) => {
      const rx = (x / window.innerWidth - 0.5) * 8;
      const ry = (y / window.innerHeight - 0.5) * 8;
      bg.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
    };
    window.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
    window.addEventListener('touchmove', (e) => { const t = e.touches[0]; if (!t) return; onMove(t.clientX, t.clientY); }, { passive: true });
  }
});
