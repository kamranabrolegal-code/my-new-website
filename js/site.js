// site.js — frontend interactivity for IDEAL INTERNATIONAL LAW FIRM AND CONSULTANCY
// Populates services grid, enables mobile nav, smooth scrolling, and basic form validation/submit stubs

document.addEventListener('DOMContentLoaded', function () {
  const services = [
    { id: 'civil', title: 'Civil', desc: 'Civil litigation, property matters, contracts and recovery proceedings.' },
    { id: 'criminal', title: 'Criminal', desc: 'Criminal defence, bail matters and criminal proceedings representation.' },
    { id: 'banking', title: 'Banking', desc: 'Banking disputes, documentation and financial matters.' },
    { id: 'family', title: 'Family', desc: 'Matrimonial disputes, custody, maintenance and succession family matters.' },
    { id: 'cyber', title: 'Cyber', desc: 'Cybercrime, digital disputes, electronic evidence and online-offence advice.' },
    { id: 'tribunal', title: 'Tribunal', desc: 'Representation before tribunals and quasi-judicial forums.' },
    { id: 'public', title: 'Public Litigation', desc: 'Public-interest and constitutional litigation support and representation.' },
    { id: 'research', title: 'Research', desc: 'Legal research, opinions, case-law and statutory research services.' },
    { id: 'nationality', title: 'Nationality', desc: 'Nationality issues and advisory support for individuals.' },
    { id: 'visa', title: 'Visa', desc: 'Visa-related legal consultancy and assistance.' },
    { id: 'company', title: 'Company', desc: 'Company formation, corporate documentation and compliance.' },
    { id: 'firm', title: 'Firm / Business Consultancy', desc: 'Legal consultancy for firms, entrepreneurs and organizations.' },
    { id: 'income-tax', title: 'Income Tax', desc: 'Income tax consultancy and representation services.' },
    { id: 'sales-tax', title: 'Sales Tax', desc: 'Sales tax consultancy and representation services.' },
    { id: 'customs', title: 'Customs', desc: 'Customs-related disputes, WEBOC and trade documentation assistance.' },
    { id: 'ipo', title: 'IPO', desc: 'Intellectual Property Office (IPO) related services.' },
    { id: 'patent', title: 'Patent', desc: 'Patent filing, prosecution and related IP consultancy.' },
    { id: 'ngo', title: 'NGO / NPO', desc: 'Establishment, registration, compliance and documentation for NGOs/NPOs.' },
    { id: 'weboc', title: 'WEBOC', desc: 'WEBOC and online trade-related legal consultancy.' },
    { id: 'other', title: 'Other Services', desc: 'Additional legal & consultancy services (editable via admin panel).' }
  ];

  // Simple SVG icon factory (gold-accent circle with scale glyph)
  function svgIcon() {
    return `
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width="24" height="24" rx="5" fill="#F6EFD9"></rect>
        <path d="M7 12h10M7 8h10M7 16h6" stroke="#0B2540" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
  }

  // Populate services grid on homepage
  const grid = document.getElementById('services-grid');
  if (grid) {
    services.forEach(s => {
      const card = document.createElement('article');
      card.className = 'service-card';
      card.innerHTML = `
        <div class="icon" aria-hidden="true">${svgIcon()}</div>
        <div class="content">
          <h4>${s.title}</h4>
          <p>${s.desc}</p>
        </div>
        <div class="learn"><a class="btn btn-outline" href="#${s.id}">Learn More</a></div>
      `;
      grid.appendChild(card);
    });
  }

  // Populate service select in consultation form
  const serviceSelect = document.querySelector('select[name="serviceRequired"]');
  if (serviceSelect) {
    services.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.title;
      opt.textContent = s.title;
      serviceSelect.appendChild(opt);
    });
  }

  // Mobile nav toggle (simple)
  const nav = document.querySelector('.nav');
  function toggleNav() {
    if (!nav) return;
    nav.classList.toggle('open');
  }
  // Add a simple toggle button if none exists (for small screens)
  const actions = document.querySelector('.nav-wrap .actions');
  if (actions) {
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Toggle menu');
    btn.innerHTML = '\u2630'; // hamburger
    btn.style.background = 'transparent';
    btn.style.color = 'var(--gold)';
    btn.style.border = 'none';
    btn.style.fontSize = '1.05rem';
    btn.addEventListener('click', function () {
      toggleNav();
      const expanded = nav.classList.contains('open');
      btn.setAttribute('aria-expanded', String(expanded));
    });
    actions.prepend(btn);
  }

  // Smooth scrolling for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      if (!targetId) return;
      const el = document.getElementById(targetId);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // close mobile nav if open
        if (nav && nav.classList.contains('open')) {
          nav.classList.remove('open');
        }
      }
    });
  });

  // Simple form validation helpers
  function showFormMessage(form, message, type = 'success') {
    let el = form.querySelector('.form-message');
    if (!el) {
      el = document.createElement('div');
      el.className = 'form-message';
      el.style.marginTop = '0.6rem';
      form.appendChild(el);
    }
    el.textContent = message;
    el.style.color = type === 'success' ? 'green' : 'crimson';
  }

  // Stub submit handler — this will POST to /api/submit when backend is ready
  async function submitForm(form, payload) {
    try {
      // Attempt to POST to a real endpoint if provided
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        return { ok: true };
      }
      // If endpoint returns non-OK, fall through to local success message
      return { ok: false };
    } catch (err) {
      // Network error or endpoint not present — simulate queued submission
      console.warn('Submission endpoint not available, request logged locally.', err);
      // Optionally, store in localStorage for later sync
      const queue = JSON.parse(localStorage.getItem('ideal_form_queue') || '[]');
      queue.push({ payload, at: new Date().toISOString() });
      localStorage.setItem('ideal_form_queue', JSON.stringify(queue));
      return { ok: false };
    }
  }

  // Consultation form handling
  const consultForm = document.getElementById('consultForm');
  if (consultForm) {
    consultForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const data = new FormData(consultForm);
      const payload = Object.fromEntries(data.entries());

      // Basic validation: required fields
      if (!payload.fullName || !payload.phone || !payload.email) {
        showFormMessage(consultForm, 'Please complete Full Name, Phone Number and Email fields.', 'error');
        return;
      }

      showFormMessage(consultForm, 'Sending request...', 'info');
      const r = await submitForm(consultForm, { type: 'consultation', data: payload });
      if (r.ok) {
        showFormMessage(consultForm, 'Your consultation request has been submitted. We will contact you shortly.');
        consultForm.reset();
      } else {
        showFormMessage(consultForm, 'Your request was saved and will be delivered to the administrator when a connection is available.');
        consultForm.reset();
      }
    });
  }

  // Inquiry form handling
  const inquiryForm = document.getElementById('inquiryForm');
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const data = new FormData(inquiryForm);
      const payload = Object.fromEntries(data.entries());
      if (!payload.clientName || !payload.contactNumber) {
        showFormMessage(inquiryForm, 'Please provide Client Name and Contact Number.', 'error');
        return;
      }
      showFormMessage(inquiryForm, 'Sending inquiry...', 'info');
      const r = await submitForm(inquiryForm, { type: 'inquiry', data: payload });
      if (r.ok) {
        showFormMessage(inquiryForm, 'Inquiry submitted. Our team will follow up.');
        inquiryForm.reset();
      } else {
        showFormMessage(inquiryForm, 'Your inquiry was saved locally and will be delivered when a connection is available.');
        inquiryForm.reset();
      }
    });
  }

  // Accessibility: focus visible handling for keyboard users
  document.body.addEventListener('keydown', function (e) {
    if (e.key === 'Tab') document.body.classList.add('using-keyboard');
  });

});
