// Register page script
// Purpose: Client-side validation for required fields, email format, and password match; simulate async submit.
// Mục đích: Kiểm tra thông tin nhập, định dạng email, khớp mật khẩu; mô phỏng gửi bất đồng bộ.

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
// Hiện/ẩn mật khẩu
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
// Kiểm tra email với biểu tượng trực quan
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
// Chỉ báo độ mạnh mật khẩu
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
    strengthText.textContent = 'Yếu - Nên dài hơn và phức tạp hơn';
    strengthText.className = 'strength-text weak';
  } else if (strength === 'medium') {
    strengthText.textContent = 'Trung bình - Khá tốt!';
    strengthText.className = 'strength-text medium';
  } else {
    strengthText.textContent = 'Mạnh - Mật khẩu an toàn!';
    strengthText.className = 'strength-text strong';
  }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  errorMsg.textContent = "";
  loadingMsg.textContent = "";

  // ✅ Kiểm tra nhập đủ
  if (!fullname.value.trim() || !email.value.trim() || !password.value.trim() || !confirmPassword.value.trim()) {
    errorMsg.textContent = "❌ Vui lòng nhập đầy đủ thông tin!";
    const card = document.querySelector('.register-card');
    if (card) { card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake'); }
    return;
  }

  // ✅ Kiểm tra định dạng email
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email.value)) {
    errorMsg.textContent = "❌ Email không hợp lệ!";
    const card = document.querySelector('.register-card');
    if (card) { card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake'); }
    return;
  }

  // ✅ Kiểm tra mật khẩu trùng khớp
  if (password.value !== confirmPassword.value) {
    errorMsg.textContent = "❌ Mật khẩu không khớp!";
    const card = document.querySelector('.register-card');
    if (card) { card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake'); }
    return;
  }

  // ⏳ Hiển thị loading overlay
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
