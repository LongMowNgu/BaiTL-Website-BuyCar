// contact.js - Advanced contact management system with Toast Notifications
(function(){
  // Toast Notification System
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
    
    // Close button handler
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
      toast.classList.add('toast-hiding');
      setTimeout(() => toast.remove(), 300);
    });
    
    // Auto-remove after duration
    setTimeout(() => {
      if (toast.parentElement) {
        toast.classList.add('toast-hiding');
        setTimeout(() => toast.remove(), 300);
      }
    }, duration);
  }

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

  // Status Messages - Now using Toast Notifications
  function showStatus(text, type='success'){
    const titles = {
      success: 'Thành công!',
      danger: 'Lỗi!',
      warning: 'Cảnh báo!',
      info: 'Thông tin'
    };
    
    const toastType = type === 'danger' ? 'error' : type === 'warning' ? 'warning' : type === 'info' ? 'info' : 'success';
    showToast(toastType, titles[type] || titles.success, text);
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
