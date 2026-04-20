const VALID_PASSWORD = 'Mr.M_Architect_2025';
let attempts = 4;

function togglePassword() {
  const input = document.getElementById('password');
  const icon = document.getElementById('eyeIcon');
  if (input.type === 'password') {
    input.type = 'text';
    icon.classList.remove('fa-eye');
    icon.classList.add('fa-eye-slash');
  } else {    input.type = 'password';
    icon.classList.remove('fa-eye-slash');
    icon.classList.add('fa-eye');
  }
}

document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const input = document.getElementById('password');
  const error = document.getElementById('errorMsg');
  const attemptsSpan = document.getElementById('attempts');
  
  if (input.value === VALID_PASSWORD) {
    window.location.href = 'dashboard.html';
  } else {
    attempts--;
    attemptsSpan.textContent = attempts;
    error.style.display = 'flex';
    input.value = '';
    input.focus();
    if (attempts === 0) {
      setTimeout(() => { alert('🔒 Sistem terkunci. Coba lagi nanti.'); location.reload(); }, 500);
    }
  }
});

document.getElementById('password').addEventListener('input', function() {
  document.getElementById('errorMsg').style.display = 'none';
});
