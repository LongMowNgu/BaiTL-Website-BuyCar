// Forgot password page script
// Purpose: Validate email and simulate sending reset instructions.

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

const form    = document.getElementById('forgotForm');
const emailEl = document.getElementById('email');
const alertEl = document.getElementById('alert');
const sendBtn = document.getElementById('sendBtn');
const emailValidation = document.getElementById('emailValidation');
const loadingOverlay = document.getElementById('loadingOverlay');
const successOverlay = document.getElementById('successOverlay');

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
  sendBtn.disabled = !emailEl.value.trim();
}

emailEl.addEventListener('input', () => {
  updateBtnState();
  
  // Email validation with visual feedback
  const value = emailEl.value.trim();
  if (value === '') {
    emailValidation.classList.remove('valid', 'invalid');
  } else if (isValidEmail(value)) {
    emailValidation.classList.remove('invalid');
    emailValidation.classList.add('valid');
  } else {
    emailValidation.classList.remove('valid');
    emailValidation.classList.add('invalid');
  }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const eVal = emailEl.value.trim().toLowerCase();
  if (!eVal) { showAlert('Please enter your email!', 'error'); shake(); return; }
  if (!isValidEmail(eVal)) { showAlert('Invalid email format!', 'error'); shake(); return; }

  // Show loading overlay
  loadingOverlay.classList.remove('hidden');
  
  setTimeout(() => {
    // Hide loading and show success
    loadingOverlay.classList.add('hidden');
    successOverlay.classList.remove('hidden');
    
    // Reset form
    emailEl.value = '';
    emailValidation.classList.remove('valid', 'invalid');
    sendBtn.disabled = true;
    
    // Hide success after delay
    setTimeout(() => {
      successOverlay.classList.add('hidden');
      showAlert('✅ Password reset instructions sent!', 'success');
    }, 1200);
  }, 800);
});

function shake() {
  const card = document.querySelector('.card');
  if (!card) return;
  card.classList.remove('shake');
  void card.offsetWidth;
  card.classList.add('shake');
}

// Reveal and subtle parallax

document.addEventListener('DOMContentLoaded', () => {
  const card = document.querySelector('.card');
  if (card) requestAnimationFrame(() => card.classList.add('revealed'));
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
