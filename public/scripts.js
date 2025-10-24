document.addEventListener('DOMContentLoaded', () => {
  // year
  document.getElementById('year').textContent = new Date().getFullYear();

  // mobile menu toggle
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const nav = document.getElementById('mainNav');
  mobileBtn && mobileBtn.addEventListener('click', () => {
    nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
  });

  // theme toggle
  const themeBtn = document.getElementById('themeToggle');
  themeBtn && themeBtn.addEventListener('click', () => {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (dark) {
      document.documentElement.removeAttribute('data-theme');
      themeBtn.textContent = '🌙';
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeBtn.textContent = '☀️';
    }
  });

  // smooth scroll anchors
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', function(e){
      const target = document.querySelector(this.getAttribute('href'));
      if(target){ e.preventDefault(); target.scrollIntoView({behavior:'smooth', block:'start'}); }
    });
  });

  // Load projects from backend
  fetch('/api/projects').then(r=>r.json()).then(list => {
    const grid = document.getElementById('projectsGrid');
    grid.innerHTML = '';
    list.forEach(p => {
      const el = document.createElement('article');
      el.className = 'project-card';
      el.innerHTML = `
        <img src="${p.img}" alt="${p.title}">
        <div class="project-meta">
          <div>
            <h3>${p.title}</h3>
            <p>${p.desc}</p>
          </div>
          <div class="proj-links">
            <a href="${p.live}" target="_blank">Live</a>
            <a href="${p.code}" target="_blank">Code</a>
          </div>
        </div>
      `;
      grid.appendChild(el);
    });
  }).catch(err => {
    console.error('Failed to load projects', err);
    document.getElementById('projectsGrid').innerHTML = '<p class="muted">Failed to load projects.</p>';
  });

  // Contact form
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  const clearBtn = document.getElementById('clearBtn');

  form && form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = 'Sending…';
    const payload = {
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      message: document.getElementById('message').value.trim()
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Send failed');
      status.textContent = 'Message sent! I will reply within 24 hours.';
      form.reset();
    } catch (err) {
      console.error(err);
      status.textContent = 'Send failed — try again later.';
    }
  });

  clearBtn && clearBtn.addEventListener('click', () => {
    form.reset();
    status.textContent = '';
  });
});
