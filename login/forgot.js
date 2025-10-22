// Forgot password page script
// Purpose: Validate email and simulate sending reset instructions.
// Mục đích: Kiểm tra email và mô phỏng gửi hướng dẫn đặt lại mật khẩu.

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
  if (!eVal) { showAlert('Vui lòng nhập email!', 'error'); shake(); return; }
  if (!isValidEmail(eVal)) { showAlert('Email không đúng định dạng!', 'error'); shake(); return; }

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
      showAlert('✅ Hướng dẫn đặt lại mật khẩu đã được gửi!', 'success');
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
