// contact-enhanced.js - Advanced contact management system
(function(){
  // DOM Elements
  const form = document.getElementById('contactForm');
  const status = document.getElementById('status');
  const clearBtn = document.getElementById('clearBtn');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const subjectSelect = document.getElementById('subject');
  const messageInput = document.getElementById('message');
  const messageRows = document.getElementById('messageRows');
  const refreshBtn = document.getElementById('refreshMessages');
  const clearAllBtn = document.getElementById('clearMessages');
  const searchInput = document.getElementById('searchMessages');
  const filterPriority = document.getElementById('filterPriority');
  const messageCount = document.getElementById('messageCount');

  let currentFilter = { search: '', priority: '' };

  // LocalStorage Management
  function getMessages() {
    return JSON.parse(localStorage.getItem('contacts') || '[]');
  }

  function setMessages(list) {
    localStorage.setItem('contacts', JSON.stringify(list));
  }

  function saveMessage(msg) {
    const messages = getMessages();
    messages.unshift(msg);
    setMessages(messages);
  }

  function updateMessage(id, updates) {
    const messages = getMessages();
    const idx = messages.findIndex(m => m.id === id);
    if (idx !== -1) {
      messages[idx] = { ...messages[idx], ...updates };
      setMessages(messages);
    }
  }

  // Validation Functions
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhone(phone) {
    if (!phone) return true; // Optional field
    return /^[\d\s\-\+\(\)]+$/.test(phone);
  }

  // Status Messages
  function showStatus(text, type='success'){
    status.innerHTML = `<div class="alert alert-${type}" style="animation: slideIn 0.3s ease;">${text}</div>`;
    setTimeout(()=> {
      const alert = status.querySelector('.alert');
      if (alert) {
        alert.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => status.innerHTML = '', 300);
      }
    }, 4000);
  }

  // Utility Functions
  function escapeHtml(s) {
    return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  }

  function getPriorityBadge(priority) {
    const badges = {
      low: '<span class="badge bg-secondary">Low</span>',
      normal: '<span class="badge bg-info">Normal</span>',
      high: '<span class="badge bg-warning">High</span>',
      urgent: '<span class="badge bg-danger">Urgent</span>'
    };
    return badges[priority] || badges.normal;
  }

  function getStatusBadge(status) {
    const badges = {
      new: '<span class="badge bg-primary">New</span>',
      read: '<span class="badge bg-success">Read</span>',
      replied: '<span class="badge bg-info">Replied</span>',
      archived: '<span class="badge bg-secondary">Archived</span>'
    };
    return badges[status] || badges.new;
  }

  // Filter and Search
  function filterMessages(messages) {
    return messages.filter(m => {
      const matchSearch = !currentFilter.search || 
        m.name.toLowerCase().includes(currentFilter.search.toLowerCase()) ||
        m.email.toLowerCase().includes(currentFilter.search.toLowerCase()) ||
        m.message.toLowerCase().includes(currentFilter.search.toLowerCase()) ||
        (m.subject && m.subject.toLowerCase().includes(currentFilter.search.toLowerCase()));
      
      const matchPriority = !currentFilter.priority || m.priority === currentFilter.priority;
      
      return matchSearch && matchPriority;
    });
  }

  // Render Messages Table
  function renderMessages() {
    if (!messageRows) return;
    const allMessages = getMessages();
    const filteredMessages = filterMessages(allMessages);
    
    if (messageCount) {
      messageCount.textContent = filteredMessages.length;
    }
    
    if (!filteredMessages.length) {
      messageRows.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-4">No messages found</td></tr>';
      return;
    }
    
    messageRows.innerHTML = filteredMessages.slice(0, 20).map(m => `
      <tr class="${m.status === 'new' ? 'table-active' : ''}">
        <td style="white-space:nowrap; font-size:0.85rem">${formatDate(m.createdAt)}</td>
        <td>${escapeHtml(m.name)}</td>
        <td>${escapeHtml(m.subject || 'No subject')}</td>
        <td>${getPriorityBadge(m.priority)}</td>
        <td>${getStatusBadge(m.status)}</td>
        <td>
          <div class="btn-group btn-group-sm" role="group">
            <button class="btn btn-outline-light" data-id="${m.id}" data-action="view" title="View">
              <i class="fa-solid fa-eye"></i>
            </button>
            <button class="btn btn-outline-light" data-id="${m.id}" data-action="mark-read" title="Mark as read">
              <i class="fa-solid fa-check"></i>
            </button>
            <button class="btn btn-outline-light" data-id="${m.id}" data-action="delete" title="Delete">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // Message Actions
  if (messageRows) {
    messageRows.addEventListener('click', function(e){
      const btn = e.target.closest('button[data-action]');
      if (!btn) return;
      
      const id = Number(btn.getAttribute('data-id'));
      const action = btn.getAttribute('data-action');
      const list = getMessages();
      const message = list.find(x => x.id === id);
      
      if (!message) return;
      
      switch(action) {
        case 'view':
          showMessageModal(message);
          updateMessage(id, { status: 'read' });
          renderMessages();
          break;
          
        case 'mark-read':
          updateMessage(id, { status: 'read' });
          showStatus('Message marked as read', 'info');
          renderMessages();
          break;
          
        case 'delete':
          if (confirm('Delete this message?')) {
            const idx = list.findIndex(x => x.id === id);
            list.splice(idx, 1);
            setMessages(list);
            showStatus('Message deleted', 'info');
            renderMessages();
          }
          break;
      }
    });
  }

  // Show Message Modal
  function showMessageModal(message) {
    const modal = document.createElement('div');
    modal.className = 'message-modal';
    modal.innerHTML = `
      <div class="message-modal-content">
        <div class="message-modal-header">
          <h4><i class="fa-solid fa-envelope-open"></i> Message Details</h4>
          <button class="message-modal-close">&times;</button>
        </div>
        <div class="message-modal-body">
          <div class="mb-3">
            <strong>From:</strong> ${escapeHtml(message.name)}<br>
            <strong>Email:</strong> <a href="mailto:${escapeHtml(message.email)}">${escapeHtml(message.email)}</a><br>
            ${message.phone ? `<strong>Phone:</strong> ${escapeHtml(message.phone)}<br>` : ''}
            <strong>Subject:</strong> ${escapeHtml(message.subject || 'No subject')}<br>
            <strong>Date:</strong> ${formatDate(message.createdAt)}<br>
            <strong>Priority:</strong> ${getPriorityBadge(message.priority)}<br>
            <strong>Status:</strong> ${getStatusBadge(message.status)}
          </div>
          <div class="mb-3">
            <strong>Message:</strong>
            <div class="message-content">${escapeHtml(message.message)}</div>
          </div>
        </div>
        <div class="message-modal-footer">
          <button class="btn btn-outline-light btn-sm" onclick="location.href='mailto:${escapeHtml(message.email)}'">
            <i class="fa-solid fa-reply"></i> Reply via Email
          </button>
          <button class="btn btn-outline-light btn-sm message-modal-close-btn">Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    
    const closeModal = () => {
      modal.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => modal.remove(), 300);
    };
    
    modal.querySelector('.message-modal-close').addEventListener('click', closeModal);
    modal.querySelector('.message-modal-close-btn').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Real-time Validation
  emailInput.addEventListener('blur', function(){
    const email = this.value.trim();
    if (email && !validateEmail(email)) {
      this.classList.add('is-invalid');
      showStatus('Please enter a valid email address', 'danger');
    } else if (email) {
      this.classList.remove('is-invalid');
      this.classList.add('is-valid');
    }
  });

  phoneInput.addEventListener('blur', function(){
    const phone = this.value.trim();
    if (phone && !validatePhone(phone)) {
      this.classList.add('is-invalid');
      showStatus('Please enter a valid phone number', 'danger');
    } else if (phone) {
      this.classList.remove('is-invalid');
      this.classList.add('is-valid');
    }
  });

  // Character Counter
  const charCountEl = document.createElement('small');
  charCountEl.className = 'char-counter text-muted d-block mt-1';
  charCountEl.style.textAlign = 'right';
  messageInput.parentElement.appendChild(charCountEl);

  messageInput.addEventListener('input', function(){
    const length = this.value.length;
    const maxLength = 1000;
    charCountEl.textContent = `${length}/${maxLength} characters`;
    
    if (length > maxLength * 0.9) {
      charCountEl.style.color = '#ffc107';
    } else {
      charCountEl.style.color = 'rgba(255,255,255,0.6)';
    }
    
    if (length > maxLength) {
      this.value = this.value.substring(0, maxLength);
      charCountEl.textContent = `${maxLength}/${maxLength} characters (max reached)`;
      charCountEl.style.color = '#dc3545';
    }
  });
  charCountEl.textContent = `0/1000 characters`;

  // Form Submit
  form.addEventListener('submit', function(e){
    e.preventDefault();
    
    const name = nameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const phone = phoneInput.value.trim();
    const subject = subjectSelect.value;
    const message = messageInput.value.trim();
    const priority = document.querySelector('input[name="priority"]:checked').value;

    // Validation
    if(!name || !email || !subject || !message){
      showStatus('⚠️ Please complete all required fields.', 'danger');
      return;
    }

    if(!validateEmail(email)){
      showStatus('⚠️ Please enter a valid email address.', 'danger');
      emailInput.focus();
      return;
    }

    if(phone && !validatePhone(phone)){
      showStatus('⚠️ Please enter a valid phone number.', 'danger');
      phoneInput.focus();
      return;
    }

    if(message.length < 10){
      showStatus('⚠️ Message must be at least 10 characters.', 'danger');
      messageInput.focus();
      return;
    }

    // Create entry
    const entry = {
      id: Date.now(),
      name,
      email,
      phone: phone || null,
      subject,
      message,
      priority,
      createdAt: new Date().toISOString(),
      status: 'new'
    };

    // Save and show success
    saveMessage(entry);
    form.reset();
    charCountEl.textContent = `0/1000 characters`;
    
    // Remove validation classes
    emailInput.classList.remove('is-valid', 'is-invalid');
    phoneInput.classList.remove('is-valid', 'is-invalid');
    
    showStatus('✅ Message sent successfully! We will get back to you soon.', 'success');

    // Success animation
    const card = document.querySelector('.card');
    if (card) {
      card.style.animation = 'pulse 0.5s ease';
      setTimeout(() => card.style.animation = '', 500);
    }

    renderMessages();
  });

  // Clear Form
  clearBtn.addEventListener('click', function(){
    if (confirm('Clear all fields?')) {
      form.reset();
      charCountEl.textContent = `0/1000 characters`;
      emailInput.classList.remove('is-valid', 'is-invalid');
      phoneInput.classList.remove('is-valid', 'is-invalid');
      showStatus('Form cleared', 'info');
    }
  });

  // Search and Filter
  if (searchInput) {
    searchInput.addEventListener('input', function(){
      currentFilter.search = this.value;
      renderMessages();
    });
  }

  if (filterPriority) {
    filterPriority.addEventListener('change', function(){
      currentFilter.priority = this.value;
      renderMessages();
    });
  }

  // Refresh and Clear All
  if (refreshBtn) refreshBtn.addEventListener('click', renderMessages);
  
  if (clearAllBtn) clearAllBtn.addEventListener('click', function(){
    if (confirm('Clear all saved messages on this device?')){
      setMessages([]);
      renderMessages();
      showStatus('All messages cleared.','info');
    }
  });

  // Export Messages
  const exportBtn = document.createElement('button');
  exportBtn.type = 'button';
  exportBtn.className = 'btn btn-outline-light';
  exportBtn.innerHTML = '<i class="fa-solid fa-download"></i> Export';
  exportBtn.addEventListener('click', function(){
    const messages = getMessages();
    if (!messages.length) {
      showStatus('No messages to export', 'info');
      return;
    }
    const dataStr = JSON.stringify(messages, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `luxauto-contacts-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showStatus('✅ Messages exported successfully!', 'success');
  });
  
  if (clearAllBtn && clearAllBtn.parentElement) {
    clearAllBtn.parentElement.querySelector('.d-flex').appendChild(exportBtn);
  }

  // Add Custom Styles
  const style = document.createElement('style');
  style.textContent = `
    /* Ultra-bright contact info cards for maximum visibility */
    .contact-info-card {
      position: relative;
      z-index: 1;
      background: linear-gradient(145deg, rgba(13, 110, 253, 0.85), rgba(11, 94, 215, 0.75));
      border: 4px solid #ffffff;
      border-radius: 20px;
      padding: 36px 28px;
      text-align: center;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      box-shadow: 0 20px 60px rgba(13, 110, 253, 0.7), 
                  0 0 0 2px rgba(255,255,255,0.4) inset,
                  0 0 50px rgba(255, 255, 255, 0.3);
      backdrop-filter: blur(8px);
      overflow: hidden;
    }
    .contact-info-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
      transition: left 0.5s ease;
    }
    .contact-info-card:hover::before {
      left: 100%;
    }
    .contact-info-card:hover {
      transform: translateY(-12px) scale(1.05);
      box-shadow: 0 30px 80px rgba(13, 110, 253, 0.9), 
                  0 0 0 3px rgba(255,255,255,0.6) inset,
                  0 0 70px rgba(255, 255, 255, 0.5);
      border-color: #ffffff;
      background: linear-gradient(145deg, rgba(13, 110, 253, 0.95), rgba(11, 94, 215, 0.85));
    }
    .contact-info-card *, .contact-info-card h6, .contact-info-card p {
      color: #ffffff !important;
      text-shadow: 0 3px 10px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.8);
      position: relative;
      z-index: 2;
    }
    .contact-info-card i {
      font-size: 4rem;
      color: #ffffff;
      margin-bottom: 20px;
      filter: drop-shadow(0 6px 16px rgba(255,255,255,0.8)) drop-shadow(0 0 30px rgba(255,255,255,0.6));
      animation: iconFloat 3s ease-in-out infinite, iconPulse 2s ease-in-out infinite;
      position: relative;
      z-index: 2;
    }
    @keyframes iconPulse {
      0%, 100% { 
        filter: drop-shadow(0 6px 16px rgba(255,255,255,0.8)) drop-shadow(0 0 30px rgba(255,255,255,0.6));
      }
      50% { 
        filter: drop-shadow(0 8px 24px rgba(255,255,255,1)) drop-shadow(0 0 40px rgba(255,255,255,0.9));
      }
    }
    .contact-info-card h6 {
      font-size: 1.4rem;
      font-weight: 900;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin-bottom: 14px;
    }
    .contact-info-card p {
      font-size: 1.2rem;
      font-weight: 700;
    }
    
    /* Background pulse animation */
    @keyframes bgPulse {
      0%, 100% { 
        opacity: 0.6;
        transform: scale(1);
      }
      50% { 
        opacity: 0.9;
        transform: scale(1.05);
      }
    }
    @keyframes iconFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
    .contact-info-card h6 {
      margin: 16px 0 10px;
      font-weight: 800;
      font-size: 1.2rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      text-shadow: 0 2px 8px rgba(0,0,0,0.4);
    }
    .contact-info-card p {
      margin: 0;
      font-size: 1.05rem;
      font-weight: 600;
      text-shadow: 0 1px 4px rgba(0,0,0,0.35);
    }
    /* Make the section subtitle brighter */
    .contact-note { color: #ffffff !important; opacity: 0.95; }
    
    .message-modal {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.85);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      animation: fadeIn 0.3s ease;
      backdrop-filter: blur(8px);
    }
    .message-modal-content {
      background: rgba(18,18,18,0.98);
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 16px;
      max-width: 600px;
      width: 90%;
      max-height: 80vh;
      overflow: auto;
      box-shadow: 0 20px 60px rgba(0,0,0,0.7);
    }
    .message-modal-header {
      padding: 20px 24px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .message-modal-header h4 {
      margin: 0;
      color: #fff;
      font-size: 1.25rem;
    }
    .message-modal-close {
      background: transparent;
      border: none;
      color: rgba(255,255,255,0.7);
      font-size: 2rem;
      line-height: 1;
      cursor: pointer;
      transition: color 0.2s;
    }
    .message-modal-close:hover {
      color: #fff;
    }
    .message-modal-body {
      padding: 24px;
      color: rgba(255,255,255,0.85);
    }
    .message-content {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 8px;
      padding: 16px;
      margin-top: 8px;
      white-space: pre-wrap;
      max-height: 300px;
      overflow-y: auto;
    }
    .message-modal-footer {
      padding: 16px 24px;
      border-top: 1px solid rgba(255,255,255,0.1);
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    }
    
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.02); }
    }
    
    .table-active {
      background-color: rgba(13,110,253,0.1) !important;
    }
    
    .is-valid {
      border-color: #198754 !important;
    }
    .is-invalid {
      border-color: #dc3545 !important;
    }
  `;
  document.head.appendChild(style);

  // Initialize
  renderMessages();

  // Replies feed (bottom list with filters)
  function priorityRank(p) {
    const rank = { urgent: 4, high: 3, normal: 2, low: 1 };
    return rank[p] || 0;
  }

  function renderRepliesFeed() {
    const listEl = document.getElementById('repliesFeedList');
    if (!listEl) return;

    const all = getMessages();
    // only messages with reply
    let replies = all.filter(m => !!m.reply);

    // apply priority filter
    const pf = document.getElementById('repliesFilterPriority');
    const sf = document.getElementById('repliesSort');
    const priorityVal = pf ? pf.value : '';
    const sortVal = sf ? sf.value : 'newest';

    if (priorityVal) replies = replies.filter(m => (m.priority || 'normal') === priorityVal);

    // normalize date (createdAt preferred)
    const getMsgTime = (m) => new Date(m.createdAt || m.date || m.timestamp || Date.now()).getTime();

    replies.sort((a, b) => {
      if (sortVal === 'oldest') return getMsgTime(a) - getMsgTime(b);
      if (sortVal === 'priority') return priorityRank(b.priority) - priorityRank(a.priority) || (getMsgTime(b) - getMsgTime(a));
      // default newest
      return getMsgTime(b) - getMsgTime(a);
    });

    if (!replies.length) {
      listEl.innerHTML = '<div class="alert alert-info"><i class="fa-solid fa-circle-info"></i> Chưa có phản hồi nào từ cửa hàng.</div>';
      return;
    }

    listEl.innerHTML = replies.map(msg => {
      const statusText = {
        'new': 'Mới',
        'in-progress': 'Đang xử lý',
        'read': 'Đã xem',
        'replied': 'Đã trả lời',
        'archived': 'Lưu trữ'
      }[msg.status || 'replied'];

      const statusColor = {
        'new': 'info',
        'in-progress': 'warning',
        'read': 'secondary',
        'replied': 'success',
        'archived': 'secondary'
      }[msg.status || 'replied'];

      const when = formatDate(msg.createdAt || msg.date || msg.timestamp);

      return `
        <div class="card mb-3" style="background: rgba(18,18,18,0.95); border: 1px solid rgba(255,255,255,0.12); border-radius: 12px;">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start gap-2">
              <div>
                <h6 class="mb-1 text-white" style="font-weight:700">
                  <i class="fa-solid fa-envelope-open-text"></i> ${escapeHtml(msg.subject || 'Phản hồi liên hệ')}
                </h6>
                <div class="text-white-50 small">
                  <i class="fa-solid fa-user"></i> ${escapeHtml(msg.name)} • <i class="fa-solid fa-at"></i> ${escapeHtml(msg.email)}
                </div>
              </div>
              <div class="text-end">
                <span class="badge bg-${statusColor}">${statusText}</span>
                <div class="small text-white-50 mt-1"><i class="fa-solid fa-clock"></i> ${when}</div>
                <div class="small mt-1">Ưu tiên: <span class="badge bg-${['','secondary','info','warning','danger'][priorityRank(msg.priority)] || 'info'}">${msg.priority || 'normal'}</span></div>
              </div>
            </div>
            <div class="mt-3 p-3" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px;">
              <div class="text-white-50 small mb-1"><i class="fa-solid fa-message"></i> Tin nhắn của bạn:</div>
              <div class="text-white" style="white-space: pre-wrap;">${escapeHtml(msg.message)}</div>
            </div>
            <div class="mt-3 p-3" style="background: rgba(25,135,84,0.12); border: 1px solid rgba(25,135,84,0.3); border-radius: 10px;">
              <div class="text-success small mb-1"><i class="fa-solid fa-reply"></i> Phản hồi từ quản lý:</div>
              <div class="text-white" style="white-space: pre-wrap;">${escapeHtml(msg.reply)}</div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  const repliesPriorityEl = document.getElementById('repliesFilterPriority');
  const repliesSortEl = document.getElementById('repliesSort');
  if (repliesPriorityEl) repliesPriorityEl.addEventListener('change', renderRepliesFeed);
  if (repliesSortEl) repliesSortEl.addEventListener('change', renderRepliesFeed);

  // Run initial feed render
  renderRepliesFeed();
})();
