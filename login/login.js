// ===================================
// Login Page Script - AutoTrade
// ===================================
// Purpose: Client-side validation, remember me functionality, and demo authentication
// Mục đích: Kiểm tra đầu vào, tính năng ghi nhớ, và xác thực demo

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
// Configuration
// ===================================
const VALID_EMAIL = 'long@gmail.com'; // Demo email

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
// Load Remembered Email
// ===================================
window.addEventListener('DOMContentLoaded', () => {
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

  if (!e || !p) {
    showAlert('Vui lòng nhập email và mật khẩu!', 'error');
    shakeCard();
    return;
  }
  
  if (!isValidEmail(e)) {
    showAlert('Email không đúng định dạng!', 'error');
    shakeCard();
    return;
  }
  
  if (e === VALID_EMAIL && p !== '') {
    if (rememberMeCheckbox && rememberMeCheckbox.checked) {
      localStorage.setItem('rememberedEmail', e);
    } else {
      localStorage.removeItem('rememberedEmail');
    }
    
    showAlert('Đăng nhập thành công!', 'success');
    
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
    showAlert('Email hoặc mật khẩu không đúng.', 'error');
    shakeCard();
  }
});

// ===================================
// Social Login Buttons
// ===================================
if (googleBtn) {
  googleBtn.addEventListener('click', function() {
    showAlert('Tính năng đăng nhập Google đang phát triển...', 'success');
  });
}

if (xBtn) {
  xBtn.addEventListener('click', function() {
    showAlert('Tính năng đăng nhập X (Twitter) đang phát triển...', 'success');
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