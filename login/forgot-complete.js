// ===================================
// FORGOT.JS - Complete Password Reset System
// ===================================
// All-in-one: UI, Effects, and Email Validation

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
// FORGOT PASSWORD PAGE UI
// ===================================

document.addEventListener('DOMContentLoaded', function() {
  // Initialize effects
  initAuthEffects();
  
  // DOM Elements
  const form = document.getElementById('forgotForm');
  if (!form) return; // Not on forgot page
  
  const emailEl = document.getElementById('email');
  const alertEl = document.getElementById('alert');
  const sendBtn = document.getElementById('sendBtn');
  const emailValidation = document.getElementById('emailValidation');
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
    sendBtn.disabled = !(e && isValidEmail(e));
  }

  function shakeCard() {
    const card = document.querySelector('.card');
    if (card) {
      card.classList.remove('shake');
      void card.offsetWidth;
      card.classList.add('shake');
    }
  }

  // Email Validation with Visual Feedback
  emailEl.addEventListener('input', () => {
    const value = emailEl.value.trim();
    updateBtnState();
    
    if (value === '') {
      if (emailValidation) {
        emailValidation.classList.remove('valid', 'invalid');
      }
    } else if (isValidEmail(value)) {
      if (emailValidation) {
        emailValidation.classList.remove('invalid');
        emailValidation.classList.add('valid');
      }
    } else {
      if (emailValidation) {
        emailValidation.classList.remove('valid');
        emailValidation.classList.add('invalid');
      }
    }
  });

  // Form Submit
  form.addEventListener('submit', function(evt){
    evt.preventDefault();
    const e = emailEl.value.trim();
    
    if (!e) {
      showAlert('Please enter your email address', 'error');
      shakeCard();
      return;
    }
    
    if (!isValidEmail(e)) {
      showAlert('Please enter a valid email address', 'error');
      shakeCard();
      return;
    }
    
    // Simulate sending reset instructions
    if (loadingOverlay) loadingOverlay.classList.remove('hidden');
    
    setTimeout(() => {
      if (loadingOverlay) loadingOverlay.classList.add('hidden');
      if (successOverlay) successOverlay.classList.remove('hidden');
      
      showAlert('Password reset instructions sent to your email!', 'success');
      
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 2000);
    }, 1500);
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
