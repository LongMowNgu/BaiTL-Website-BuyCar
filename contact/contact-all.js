// ===================================
// CONTACT PAGE - UNIFIED JAVASCRIPT
// All-in-one JS for Contact Page
// ===================================

(function() {
  'use strict';

  // ===================================
  // 0. NAVBAR VISIBILITY & INTERACTIONS
  // ===================================
  document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('mainNav');
    if (navbar) {
      // Show navbar immediately (match Sell/Index behavior)
      navbar.classList.add('navbar-visible');
      navbar.classList.remove('navbar-hidden');

      // Collapse mobile nav on link click
      const navLinks = navbar.querySelectorAll('.nav-link');
      const navbarCollapse = navbar.querySelector('.navbar-collapse');
      if (navbarCollapse && typeof bootstrap !== 'undefined' && bootstrap.Collapse) {
        navLinks.forEach(link => {
          link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
              const bsCollapse = new bootstrap.Collapse(navbarCollapse, { toggle: false });
              bsCollapse.hide();
            }
          });
        });
      }
    }
  });

  // ===================================
  // 1. TOAST NOTIFICATION SYSTEM
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
      if (toast.parentElement) {
        toast.classList.add('toast-hiding');
        setTimeout(() => toast.remove(), 300);
      }
    }, duration);
  }

  // ===================================
  // 2. CUSTOM SELECT ENHANCEMENT
  // ===================================
  function closeAllPanels(except){
    document.querySelectorAll('.filter-select-panel.open').forEach(p=>{
      if (p!==except){
        p.classList.remove('open');
        p.setAttribute('aria-hidden','true');
        const t = p.parentElement && p.parentElement.querySelector('.filter-select-trigger');
        if (t){ t.classList.remove('open'); t.setAttribute('aria-expanded','false'); }
      }
    });
  }

  function enhanceSelects(){
    const selects = Array.from(document.querySelectorAll('select.filter-enhance'));
    selects.forEach(select=>{
      if (select.dataset.enhanced === 'true') return;

      const wrapper = document.createElement('div');
      wrapper.className = 'filter-select-wrapper';
      select.parentNode.insertBefore(wrapper, select);
      wrapper.appendChild(select);

      select.classList.add('filter-native-select');

      const trigger = document.createElement('button');
      trigger.type = 'button';
      trigger.className = 'filter-select-trigger';
      trigger.setAttribute('aria-haspopup','listbox');
      trigger.setAttribute('aria-expanded','false');

      const activeOption = select.options[select.selectedIndex];
      const initialLabel = activeOption ? activeOption.textContent : (select.getAttribute('data-placeholder') || 'Select');
      trigger.innerHTML = `<span>${initialLabel}</span><i class="bi bi-chevron-down"></i>`;
      wrapper.appendChild(trigger);

      const panel = document.createElement('div');
      panel.className = 'filter-select-panel';
      panel.setAttribute('aria-hidden','true');
      panel.setAttribute('role','listbox');

      const list = document.createElement('ul');
      list.className = 'filter-select-list';

      Array.from(select.options).forEach(option=>{
        if (option.disabled || option.hidden) return;
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'filter-select-option';
        btn.dataset.value = option.value;
        btn.textContent = option.textContent;
        btn.setAttribute('role','option');
        if (option.selected) btn.classList.add('active');
        btn.addEventListener('click', ()=>{
          select.value = option.value;
          trigger.querySelector('span').textContent = option.textContent;
          list.querySelectorAll('.filter-select-option').forEach(b=>b.classList.remove('active'));
          btn.classList.add('active');
          select.dispatchEvent(new Event('change', { bubbles:true }));
          closePanel();
        });
        li.appendChild(btn);
        list.appendChild(li);
      });

      panel.appendChild(list);
      wrapper.appendChild(panel);

      function openPanel(){
        closeAllPanels(panel);
        panel.classList.add('open');
        panel.setAttribute('aria-hidden','false');
        trigger.classList.add('open');
        trigger.setAttribute('aria-expanded','true');
      }
      function closePanel(){
        panel.classList.remove('open');
        panel.setAttribute('aria-hidden','true');
        trigger.classList.remove('open');
        trigger.setAttribute('aria-expanded','false');
      }

      trigger.addEventListener('click', (e)=>{
        e.preventDefault();
        if (panel.classList.contains('open')) closePanel(); else openPanel();
      });
      trigger.addEventListener('keydown',(e)=>{
        if (e.key==='Enter' || e.key===' ') { e.preventDefault(); if(panel.classList.contains('open')) closePanel(); else openPanel(); }
      });

      select.addEventListener('change', ()=>{
        const match = Array.from(list.querySelectorAll('.filter-select-option')).find(b=>b.dataset.value===select.value);
        list.querySelectorAll('.filter-select-option').forEach(b=>b.classList.remove('active'));
        if (match) {
          match.classList.add('active');
          trigger.querySelector('span').textContent = match.textContent;
        }
      });

      select.dataset.enhanced = 'true';
    });
  }

  document.addEventListener('click', (e)=>{
    if (!e.target.closest('.filter-select-wrapper')) closeAllPanels();
  });

  // ===================================
  // 3. CONTACT FORM LOGIC
  // ===================================
  const form = document.getElementById('contactForm');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const subjectSelect = document.getElementById('subject');
  const messageInput = document.getElementById('message');
  const sendBtn = document.getElementById('sendBtn');
  const clearBtn = document.getElementById('clearBtn');
  const messageRows = document.getElementById('messageRows');
  const refreshBtn = document.getElementById('refreshMessages');
  const clearAllBtn = document.getElementById('clearMessages');
  const searchInput = document.getElementById('searchMessages');
  const messageCount = document.getElementById('messageCount');

  let currentFilter = { search: '' };

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
    if (!phone) return true;
    return /^[\d\s\-\+\(\)]+$/.test(phone);
  }

  // Utility Functions
  function escapeHtml(s) {
    return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
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
      
      return matchSearch;
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
      messageRows.innerHTML = '<tr><td colspan="5" class="text-center text-muted py-4">No messages found</td></tr>';
      return;
    }
    
    messageRows.innerHTML = filteredMessages.slice(0, 20).map(m => `
      <tr class="${m.status === 'new' ? 'table-active' : ''}">
        <td style="white-space:nowrap; font-size:0.85rem">${formatDate(m.createdAt)}</td>
        <td>${escapeHtml(m.name)}</td>
        <td>${escapeHtml(m.subject || 'No subject')}</td>
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
          showToast('info', 'Updated', 'Message marked as read', 3000);
          renderMessages();
          break;
          
        case 'delete':
          if (confirm('Delete this message?')) {
            const idx = list.findIndex(x => x.id === id);
            list.splice(idx, 1);
            setMessages(list);
            showToast('info', 'Deleted', 'Message deleted successfully', 3000);
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
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:9999;display:flex;align-items:center;justify-content:center;animation:fadeIn 0.3s ease;';
    modal.innerHTML = `
      <div class="message-modal-content" style="background:rgba(18,18,18,0.98);border:1px solid rgba(255,255,255,0.2);border-radius:16px;padding:2rem;max-width:600px;width:90%;max-height:80vh;overflow:auto;">
        <div class="message-modal-header" style="margin-bottom:1.5rem;display:flex;justify-content:space-between;align-items:center;">
          <h4 style="color:#fff;margin:0;"><i class="fa-solid fa-envelope-open"></i> Message Details</h4>
          <button class="message-modal-close" style="background:transparent;border:none;color:#fff;font-size:1.5rem;cursor:pointer;">&times;</button>
        </div>
        <div class="message-modal-body" style="color:rgba(255,255,255,0.9);">
          <div style="margin-bottom:1.5rem;padding:1rem;background:rgba(255,255,255,0.05);border-radius:10px;">
            <strong>From:</strong> ${escapeHtml(message.name)}<br>
            <strong>Email:</strong> <a href="mailto:${escapeHtml(message.email)}" style="color:#0dcaf0;">${escapeHtml(message.email)}</a><br>
            ${message.phone ? `<strong>Phone:</strong> ${escapeHtml(message.phone)}<br>` : ''}
            <strong>Subject:</strong> ${escapeHtml(message.subject || 'No subject')}<br>
            <strong>Date:</strong> ${formatDate(message.createdAt)}<br>
            <strong>Status:</strong> ${getStatusBadge(message.status)}
          </div>
          <div style="padding:1rem;background:rgba(255,255,255,0.05);border-radius:10px;">
            <strong>Message:</strong>
            <div style="margin-top:0.5rem;white-space:pre-wrap;">${escapeHtml(message.message)}</div>
          </div>
        </div>
        <div class="message-modal-footer" style="margin-top:1.5rem;display:flex;gap:10px;justify-content:flex-end;">
          <button class="btn btn-primary" onclick="location.href='mailto:${escapeHtml(message.email)}'">
            <i class="fa-solid fa-reply"></i> Reply via Email
          </button>
          <button class="btn btn-outline-light message-modal-close-btn">Close</button>
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
  if (emailInput) {
    emailInput.addEventListener('blur', function(){
      const email = this.value.trim();
      if (email && !validateEmail(email)) {
        this.classList.add('is-invalid');
        showToast('error', 'Invalid Email', 'Please enter a valid email address', 3000);
      } else if (email) {
        this.classList.remove('is-invalid');
        this.classList.add('is-valid');
      }
    });
  }

  if (phoneInput) {
    phoneInput.addEventListener('blur', function(){
      const phone = this.value.trim();
      if (phone && !validatePhone(phone)) {
        this.classList.add('is-invalid');
        showToast('error', 'Invalid Phone', 'Please enter a valid phone number', 3000);
      } else if (phone) {
        this.classList.remove('is-invalid');
        this.classList.add('is-valid');
      }
    });
  }

  // Character Counter
  if (messageInput) {
    const charCountEl = document.createElement('small');
    charCountEl.className = 'char-counter';
    charCountEl.textContent = '0/1000 characters';
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
  }

  // Form Submit
  if (form) {
    form.addEventListener('submit', function(e){
      e.preventDefault();
      
      const name = nameInput.value.trim();
      const email = emailInput.value.trim().toLowerCase();
      const phone = phoneInput.value.trim();
      const subject = subjectSelect.value;
      const message = messageInput.value.trim();
      const consent = document.getElementById('consent');
      
      if (!consent || !consent.checked) {
        showToast('warning', 'Consent Required', 'Please accept the terms to continue', 3000);
        return;
      }

      // Validation
      if(!name || !email || !subject || !message){
        showToast('error', 'Missing Fields', 'Please complete all required fields', 3000);
        return;
      }

      if(!validateEmail(email)){
        showToast('error', 'Invalid Email', 'Please enter a valid email address', 3000);
        emailInput.focus();
        return;
      }

      if(phone && !validatePhone(phone)){
        showToast('error', 'Invalid Phone', 'Please enter a valid phone number', 3000);
        phoneInput.focus();
        return;
      }

      if(message.length < 10){
        showToast('error', 'Message Too Short', 'Message must be at least 10 characters', 3000);
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
        createdAt: new Date().toISOString(),
        status: 'new'
      };

      // Save and show success
      saveMessage(entry);
      localStorage.removeItem('contactDraft');
      form.reset();
      
      if (messageInput.parentElement.querySelector('.char-counter')) {
        messageInput.parentElement.querySelector('.char-counter').textContent = '0/1000 characters';
      }
      
      emailInput.classList.remove('is-valid', 'is-invalid');
      phoneInput.classList.remove('is-valid', 'is-invalid');
      
      showToast('success', 'Message Sent!', 'We will get back to you soon', 5000);
      renderMessages();
      
      // Re-enhance select after reset
      setTimeout(() => enhanceSelects(), 100);
    });
  }

  // Clear Form
  if (clearBtn) {
    clearBtn.addEventListener('click', function(){
      form.reset();
      emailInput.classList.remove('is-valid', 'is-invalid');
      phoneInput.classList.remove('is-valid', 'is-invalid');
      if (messageInput.parentElement.querySelector('.char-counter')) {
        messageInput.parentElement.querySelector('.char-counter').textContent = '0/1000 characters';
      }
      showToast('info', 'Form Cleared', 'All fields have been reset', 2000);
      setTimeout(() => enhanceSelects(), 100);
    });
  }

  // Auto-save draft
  let draftTimeout;
  function saveDraft(){
    const draft = {
      name: nameInput?.value || '',
      email: emailInput?.value || '',
      phone: phoneInput?.value || '',
      subject: subjectSelect?.value || '',
      message: messageInput?.value || ''
    };
    localStorage.setItem('contactDraft', JSON.stringify(draft));
  }

  function loadDraft(){
    try {
      const draft = JSON.parse(localStorage.getItem('contactDraft'));
      if (!draft) return;
      if (nameInput) nameInput.value = draft.name || '';
      if (emailInput) emailInput.value = draft.email || '';
      if (phoneInput) phoneInput.value = draft.phone || '';
      if (subjectSelect) subjectSelect.value = draft.subject || '';
      if (messageInput) messageInput.value = draft.message || '';
      
      if (draft.name || draft.email || draft.message) {
        showToast('info', 'Draft Restored', 'Your previous draft has been loaded', 3000);
      }
    } catch {}
  }

  [nameInput, emailInput, phoneInput, subjectSelect, messageInput].forEach(el => {
    if(el) {
      el.addEventListener('input', () => {
        clearTimeout(draftTimeout);
        draftTimeout = setTimeout(saveDraft, 500);
      });
    }
  });

  // Search filter
  if (searchInput) {
    searchInput.addEventListener('input', function(){
      currentFilter.search = this.value.trim();
      renderMessages();
    });
  }

  // Refresh and Clear All
  if (refreshBtn) refreshBtn.addEventListener('click', renderMessages);
  
  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', function(){
      if (confirm('Clear all saved messages on this device?')){
        setMessages([]);
        renderMessages();
        showToast('info', 'Messages Cleared', 'All messages have been deleted', 3000);
      }
    });
  }

  // Replies feed
  function renderRepliesFeed() {
    const listEl = document.getElementById('repliesFeedList');
    if (!listEl) return;

    const all = getMessages();
    let replies = all.filter(m => !!m.reply);

    const sf = document.getElementById('repliesSort');
    const sortVal = sf ? sf.value : 'newest';

    const getMsgTime = (m) => new Date(m.createdAt || m.date || m.timestamp || Date.now()).getTime();

    replies.sort((a, b) => {
      if (sortVal === 'oldest') return getMsgTime(a) - getMsgTime(b);
      return getMsgTime(b) - getMsgTime(a);
    });

    if (!replies.length) {
      listEl.innerHTML = '<div class="alert alert-info"><i class="fa-solid fa-circle-info"></i> No store replies yet.</div>';
      return;
    }

    listEl.innerHTML = replies.map(msg => {
      const statusText = {
        'new': 'New',
        'in-progress': 'In Progress',
        'read': 'Read',
        'replied': 'Replied',
        'archived': 'Archived'
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
                  <i class="fa-solid fa-envelope-open-text"></i> ${escapeHtml(msg.subject || 'Contact Reply')}
                </h6>
                <div class="text-white-50 small">
                  <i class="fa-solid fa-user"></i> ${escapeHtml(msg.name)} • <i class="fa-solid fa-at"></i> ${escapeHtml(msg.email)}
                </div>
              </div>
              <div class="text-end">
                <span class="badge bg-${statusColor}">${statusText}</span>
                <div class="small text-white-50 mt-1"><i class="fa-solid fa-clock"></i> ${when}</div>
              </div>
            </div>
            <div class="mt-3 p-3" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px;">
              <div class="text-white-50 small mb-1"><i class="fa-solid fa-message"></i> Your message:</div>
              <div class="text-white" style="white-space: pre-wrap;">${escapeHtml(msg.message)}</div>
            </div>
            <div class="mt-3 p-3" style="background: rgba(25,135,84,0.12); border: 1px solid rgba(25,135,84,0.3); border-radius: 10px;">
              <div class="text-success small mb-1"><i class="fa-solid fa-reply"></i> Store reply:</div>
              <div class="text-white" style="white-space: pre-wrap;">${escapeHtml(msg.reply)}</div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  const repliesSortEl = document.getElementById('repliesSort');
  if (repliesSortEl) repliesSortEl.addEventListener('change', renderRepliesFeed);

  renderRepliesFeed();

  // ===================================
  // 4. INTERACTIVE CONTACT CARDS
  // ===================================
  
  // Copy to clipboard functionality
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const card = this.closest('.interactive-card');
      const textToCopy = card.dataset.copy;
      
      navigator.clipboard.writeText(textToCopy).then(() => {
        const icon = this.querySelector('i');
        const originalClass = icon.className;
        icon.className = 'fa-solid fa-check';
        this.classList.add('copied');
        showToast('success', 'Copied!', `"${textToCopy}" copied to clipboard`, 2000);
        
        setTimeout(() => {
          icon.className = originalClass;
          this.classList.remove('copied');
        }, 2000);
      }).catch(err => {
        showToast('error', 'Copy Failed', 'Unable to copy. Please try again.', 3000);
      });
    });
  });

  // Working hours status checker
  function updateWorkingStatus() {
    const statusIndicator = document.getElementById('workingStatus');
    if (!statusIndicator) return;
    
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const currentTime = hour * 60 + minute;
    
    const isWeekday = day >= 1 && day <= 5;
    const workStart = 9 * 60;
    const workEnd = 18 * 60;
    const isWorkingHours = currentTime >= workStart && currentTime < workEnd;
    
    const dot = statusIndicator.querySelector('.status-dot');
    const text = statusIndicator.querySelector('.status-text');
    
    if (isWeekday && isWorkingHours) {
      dot.className = 'status-dot online';
      text.textContent = '🟢 Currently available';
      text.style.color = '#20c997';
    } else if (isWeekday && currentTime < workStart) {
      dot.className = 'status-dot offline';
      const hoursUntil = Math.floor((workStart - currentTime) / 60);
      const minutesUntil = (workStart - currentTime) % 60;
      text.textContent = `🕐 Opens in ${hoursUntil}h${minutesUntil > 0 ? ' ' + minutesUntil + 'm' : ''}`;
      text.style.color = '#ffc107';
    } else {
      dot.className = 'status-dot offline';
      text.textContent = '🔴 Currently closed';
      text.style.color = '#dc3545';
    }
  }
  
  updateWorkingStatus();
  setInterval(updateWorkingStatus, 60000);

  // Live Chat Functionality
  window.openLiveChat = function() {
    showToast('info', 'Live Chat', 'Chat feature coming soon! Please use the contact form or call us.', 4000);
  };

  // Animate cards on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 100);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.contact-info-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    cardObserver.observe(card);
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      if (document.activeElement && 
          (document.activeElement.id === 'message' || 
           document.activeElement.closest('#contactForm'))) {
        e.preventDefault();
        if (sendBtn) sendBtn.click();
      }
    }
  });

  // Subject suggestions
  const subjectSuggestions = {
    'general': 'e.g., I would like to know more about LuxAuto',
    'support': 'e.g., I am having issues with my account',
    'sales': 'e.g., I am interested in the 2023 Honda Civic',
    'feedback': 'e.g., The website interface is excellent',
    'partnership': 'e.g., We would like to partner with LuxAuto',
    'other': 'e.g., Other questions'
  };

  if (subjectSelect && messageInput) {
    subjectSelect.addEventListener('change', function() {
      const suggestion = subjectSuggestions[this.value];
      if (suggestion && !messageInput.value.trim()) {
        messageInput.setAttribute('placeholder', suggestion);
      }
    });
  }

  // ===================================
  // 5. INITIALIZE
  // ===================================
  
  enhanceSelects();
  loadDraft();
  renderMessages();
  
  // Card reveal animation
  setTimeout(() => {
    document.querySelector('.register-card')?.classList.add('revealed');
  }, 100);

  // ===================================
  // 6. ADVANCED INTERACTION FEATURES
  // ===================================

  // Particle background system
  function createParticles() {
    const container = document.createElement('div');
    container.className = 'particles-container';
    document.body.appendChild(container);
    
    for (let i = 0; i < 30; i++) {
      setTimeout(() => {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        container.appendChild(particle);
        
        // Remove and recreate after animation
        particle.addEventListener('animationend', () => {
          particle.remove();
          setTimeout(() => {
            const newParticle = particle.cloneNode();
            newParticle.style.left = Math.random() * 100 + '%';
            container.appendChild(newParticle);
          }, Math.random() * 5000);
        });
      }, i * 100);
    }
  }

  // Animate stats counter with easing
  function animateCounter(element, target, duration = 2000) {
    const start = parseInt(element.textContent) || 0;
    const startTime = performance.now();
    
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out quart for smooth deceleration
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(start + (target - start) * easeOutQuart);
      
      element.textContent = current;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target;
      }
    }
    
    element.classList.add('counting');
    requestAnimationFrame(update);
  }

  // Initialize stats dashboard with live data
  function initStatsDashboard() {
    const messages = JSON.parse(localStorage.getItem('messages')) || [];
    
    // Animate total messages counter
    const totalMessagesEl = document.getElementById('totalMessages');
    if (totalMessagesEl) {
      setTimeout(() => animateCounter(totalMessagesEl, messages.length), 500);
    }
    
    // Simulate active users with realistic fluctuation
    const activeUsersEl = document.getElementById('activeUsers');
    if (activeUsersEl) {
      const baseUsers = 12;
      const randomUsers = Math.floor(baseUsers + Math.random() * 8);
      setTimeout(() => animateCounter(activeUsersEl, randomUsers), 700);
      
      // Update active users every 30 seconds
      setInterval(() => {
        const newCount = Math.floor(baseUsers + Math.random() * 8);
        animateCounter(activeUsersEl, newCount, 1000);
      }, 30000);
    }
    
    // Update stats when localStorage changes (e.g., message sent)
    window.addEventListener('storage', (e) => {
      if (e.key === 'messages') {
        const updatedMessages = JSON.parse(e.newValue) || [];
        if (totalMessagesEl) {
          animateCounter(totalMessagesEl, updatedMessages.length, 800);
        }
      }
    });
    
    // Pulse stat cards on hover
    document.querySelectorAll('.stat-card').forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.style.animation = 'pulse 0.6s ease';
      });
      card.addEventListener('animationend', function() {
        this.style.animation = '';
      });
    });
  }

  // Form progress tracker
  function initFormProgress() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const progressContainer = document.createElement('div');
    progressContainer.className = 'form-progress';
    progressContainer.innerHTML = `
      <div class="container">
        <div class="form-progress-bar">
          <div class="form-progress-fill" id="formProgressFill"></div>
        </div>
        <div class="form-progress-text" id="formProgressText">0% Complete</div>
      </div>
    `;
    
    form.parentElement.insertBefore(progressContainer, form);
    
    const requiredFields = form.querySelectorAll('[required]');
    const progressFill = document.getElementById('formProgressFill');
    const progressText = document.getElementById('formProgressText');
    
    function updateProgress() {
      let completed = 0;
      requiredFields.forEach(field => {
        if (field.type === 'checkbox') {
          if (field.checked) completed++;
        } else if (field.value.trim()) {
          completed++;
        }
      });
      
      const percentage = Math.round((completed / requiredFields.length) * 100);
      progressFill.style.width = percentage + '%';
      progressText.textContent = percentage + '% Complete';
      
      if (percentage === 100) {
        progressText.textContent = '✓ Ready to send!';
        progressText.style.color = '#20c997';
      }
    }
    
    requiredFields.forEach(field => {
      field.addEventListener('input', updateProgress);
      field.addEventListener('change', updateProgress);
    });
    
    updateProgress();
  }

  // Confetti celebration effect
  function throwConfetti() {
    const colors = ['#0d6efd', '#0dcaf0', '#20c997', '#ffc107', '#dc3545'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 3000);
      }, i * 30);
    }
  }

  // Notification badge counter
  function updateNotificationBadge() {
    const messages = getMessages();
    const unreadCount = messages.filter(m => m.status === 'new').length;
    
    const existingBadge = document.querySelector('.notification-badge');
    if (existingBadge) existingBadge.remove();
    
    if (unreadCount > 0) {
      const badge = document.createElement('div');
      badge.className = 'notification-badge';
      badge.textContent = unreadCount > 9 ? '9+' : unreadCount;
      
      const historyTitle = document.querySelector('#messageHistory h3');
      if (historyTitle) {
        historyTitle.style.position = 'relative';
        historyTitle.appendChild(badge);
      }
    }
  }

  // Real-time typing indicator
  let typingTimeout;
  if (messageInput) {
    messageInput.addEventListener('input', function() {
      clearTimeout(typingTimeout);
      
      let indicator = this.parentElement.querySelector('.typing-indicator');
      if (!indicator && this.value.trim()) {
        indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.innerHTML = '<span></span><span></span><span></span>';
        this.parentElement.appendChild(indicator);
      }
      
      typingTimeout = setTimeout(() => {
        indicator?.remove();
      }, 1000);
    });
  }

  // Enhanced search with highlighting
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      currentFilter.search = this.value.trim();
      renderMessages();
      
      if (this.value.trim()) {
        this.classList.add('glow-border');
      } else {
        this.classList.remove('glow-border');
      }
    });
  }

  // Table row click to view details
  if (messageRows) {
    messageRows.addEventListener('click', function(e) {
      const row = e.target.closest('tr');
      if (!row || e.target.closest('button')) return;
      
      const id = Number(row.querySelector('[data-id]')?.getAttribute('data-id'));
      const message = getMessages().find(m => m.id === id);
      
      if (message) {
        row.classList.add('animate-scale-in');
        showMessageModal(message);
        updateMessage(id, { status: 'read' });
        renderMessages();
        updateNotificationBadge();
      }
    });
  }

  // Smooth scroll to sections
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Enhanced accordion interaction
  document.querySelectorAll('.accordion-button').forEach(button => {
    button.addEventListener('click', function() {
      this.classList.add('animate-fade-in');
      setTimeout(() => this.classList.remove('animate-fade-in'), 500);
    });
  });

  // Auto-expand first FAQ on load
  setTimeout(() => {
    const firstFaq = document.querySelector('#faq1');
    if (firstFaq && !firstFaq.classList.contains('show')) {
      const firstButton = document.querySelector('[data-bs-target="#faq1"]');
      if (firstButton) firstButton.click();
    }
  }, 1000);

  // Enhanced copy button with multiple formats
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const card = this.closest('.interactive-card');
      const textToCopy = card.dataset.copy;
      
      // Copy to clipboard with multiple formats
      if (navigator.clipboard && navigator.clipboard.write) {
        const textBlob = new Blob([textToCopy], { type: 'text/plain' });
        const htmlBlob = new Blob([`<a href="mailto:${textToCopy}">${textToCopy}</a>`], { type: 'text/html' });
        
        navigator.clipboard.write([
          new ClipboardItem({
            'text/plain': textBlob,
            'text/html': htmlBlob
          })
        ]).then(() => {
          const icon = this.querySelector('i');
          const originalClass = icon.className;
          icon.className = 'fa-solid fa-check';
          this.classList.add('copied');
          showToast('success', 'Copied!', `"${textToCopy}" copied to clipboard`, 2000);
          
          setTimeout(() => {
            icon.className = originalClass;
            this.classList.remove('copied');
          }, 2000);
        });
      } else {
        // Fallback
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast('success', 'Copied!', `"${textToCopy}" copied to clipboard`, 2000);
        });
      }
    });
  });

  // Initialize all enhanced features
  createParticles();
  initStatsDashboard();
  initFormProgress();
  updateNotificationBadge();
  
  // Refresh notification badge periodically
  setInterval(updateNotificationBadge, 5000);

  // Add bounce animation to action buttons
  setInterval(() => {
    document.querySelectorAll('.action-btn, .copy-btn').forEach((btn, index) => {
      setTimeout(() => {
        btn.classList.add('animate-bounce');
        setTimeout(() => btn.classList.remove('animate-bounce'), 1000);
      }, index * 200);
    });
  }, 10000);

  // Page visibility change handler
  document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
      renderMessages();
      updateNotificationBadge();
      updateWorkingStatus();
    }
  });

  // Keyboard navigation for table
  let selectedRowIndex = -1;
  document.addEventListener('keydown', function(e) {
    if (!messageRows) return;
    const rows = Array.from(messageRows.querySelectorAll('tr'));
    
    if (e.key === 'ArrowDown' && rows.length > 0) {
      e.preventDefault();
      selectedRowIndex = Math.min(selectedRowIndex + 1, rows.length - 1);
      rows[selectedRowIndex]?.focus();
      rows[selectedRowIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else if (e.key === 'ArrowUp' && rows.length > 0) {
      e.preventDefault();
      selectedRowIndex = Math.max(selectedRowIndex - 1, 0);
      rows[selectedRowIndex]?.focus();
      rows[selectedRowIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else if (e.key === 'Enter' && selectedRowIndex >= 0) {
      e.preventDefault();
      rows[selectedRowIndex]?.click();
    }
  });

  // Enhanced social button interactions
  document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
      this.classList.add('animate-bounce');
    });
    
    btn.addEventListener('animationend', function() {
      this.classList.remove('animate-bounce');
    });
  });

  // Add visual feedback for successful actions
  function addSuccessCheckmark(element) {
    const checkmark = document.createElement('i');
    checkmark.className = 'fa-solid fa-check';
    checkmark.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:3rem;color:#20c997;animation:scaleIn 0.5s ease;pointer-events:none;';
    
    element.style.position = 'relative';
    element.appendChild(checkmark);
    
    setTimeout(() => checkmark.remove(), 1000);
  }

  // Console easter egg
  console.log('%c🚗 LuxAuto Contact System', 'font-size:20px;font-weight:bold;color:#0dcaf0;');
  console.log('%cWelcome to the enhanced contact page!', 'font-size:14px;color:#20c997;');
  console.log('%c Features:', 'font-weight:bold;');
  console.log('  ✨ Real-time form progress tracking');
  console.log('  🎉 Confetti celebration effects');
  console.log('  📋 Enhanced clipboard support');
  console.log('  ⌨️ Keyboard navigation');
  console.log('  🎨 Particle background system');
  console.log('  🔔 Live notification badges');
  console.log('  💾 Auto-save drafts');

})();
