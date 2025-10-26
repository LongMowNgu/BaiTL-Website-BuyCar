// contact.js - simple client-side contact storage
(function(){
  const form = document.getElementById('contactForm');
  const status = document.getElementById('status');
  const clearBtn = document.getElementById('clearBtn');

  function saveMessage(msg) {
    const messages = JSON.parse(localStorage.getItem('contacts') || '[]');
    messages.unshift(msg);
    localStorage.setItem('contacts', JSON.stringify(messages));
  }

  function showStatus(text, kl='success'){
    status.innerHTML = `<div class="alert alert-${kl}">${text}</div>`;
    setTimeout(()=> status.innerHTML = '', 4000);
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    const name = (document.getElementById('name').value || '').trim();
    const email = (document.getElementById('email').value || '').trim().toLowerCase();
    const message = (document.getElementById('message').value || '').trim();

    if(!name || !email || !message){
      showStatus('Please complete all fields.', 'danger');
      return;
    }

    const entry = { id: Date.now(), name, email, message, createdAt: new Date().toISOString() };
    saveMessage(entry);
    form.reset();
    showStatus('Message saved. Thank you!');
  });

  clearBtn.addEventListener('click', function(){
    form.reset();
  });
})();