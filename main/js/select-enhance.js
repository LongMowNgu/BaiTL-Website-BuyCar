// Reusable custom select enhancer (index-style) for any page
// Usage: add class="filter-enhance" on <select> elements and include this script
(function(){
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
    if (!e.target.closest('.filter-select-wrapper')) closeAllPanels(null);
  });
  document.addEventListener('keydown', (e)=>{ if (e.key==='Escape') closeAllPanels(null); });
  document.addEventListener('DOMContentLoaded', enhanceSelects);
})();
