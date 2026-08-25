/* ---------- header on scroll + active nav ---------- */
  const header = document.getElementById('siteHeader');
  const navLinks = document.querySelectorAll('[data-nav]');
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 140;
      if(window.scrollY >= top) current = sec.getAttribute('id');
    });
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
  });

  /* ---------- mobile menu ---------- */
  const burger = document.getElementById('burgerBtn');
  const closeMenu = document.getElementById('closeMenu');
  const mobileMenu = document.getElementById('mobileMenu');
  burger.addEventListener('click', () => mobileMenu.classList.add('open'));
  closeMenu.addEventListener('click', () => mobileMenu.classList.remove('open'));
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));

  /* ---------- reveal on scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, {threshold:.15});
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ---------- animated counters ---------- */
  const counters = document.querySelectorAll('.num[data-count]');
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const decimal = el.dataset.decimal ? parseInt(el.dataset.decimal) : 0;
        const fullTarget = decimal ? parseFloat(target + '.' + decimal) : target;
        const duration = 1400;
        const startTime = performance.now();
        function tick(now){
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = fullTarget * eased;
          el.textContent = decimal ? value.toFixed(1) : Math.round(value).toLocaleString('pt-BR');
          if(progress < 1) requestAnimationFrame(tick);
          else el.textContent = decimal ? fullTarget.toFixed(1) : Math.round(fullTarget).toLocaleString('pt-BR');
        }
        requestAnimationFrame(tick);
        countIO.unobserve(el);
      }
    });
  }, {threshold:.5});
  counters.forEach(el => countIO.observe(el));

  /* ---------- open / closed live status ---------- */
  const hours = {
    0: null,
    1: [9,20], 2: [9,20], 3: [9,20], 4: [9,20], 5: [9,20],
    6: [9,18]
  };
  function updateStatus(){
    const now = new Date();
    const day = now.getDay();
    const h = now.getHours() + now.getMinutes()/60;
    const today = hours[day];
    const isOpen = today && h >= today[0] && h < today[1];

    const dot1 = document.getElementById('statusDot');
    const text1 = document.getElementById('statusText');
    const dot2 = document.getElementById('statusDot2');
    const text2 = document.getElementById('statusText2');

    [dot1, dot2].forEach(d => d && d.classList.toggle('closed', !isOpen));

    let msg;
    if(isOpen){
      msg = 'Aberto agora · fecha às ' + today[1] + 'h';
    } else if(today){
      msg = h < today[0] ? 'Fechado · abre às ' + today[0] + 'h hoje' : 'Fechado agora';
    } else {
      msg = 'Fechado hoje · abre segunda às ' + hours[1][0] + 'h';
    }
    if(text1) text1.textContent = msg;
    if(text2) text2.textContent = msg;

    document.querySelectorAll('.hours-row').forEach(row => {
      row.classList.toggle('today', parseInt(row.dataset.day) === day);
    });
  }
  updateStatus();
  setInterval(updateStatus, 60000);

  /* ---------- gallery lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  document.querySelectorAll('[data-lightbox]').forEach(fig => {
    fig.addEventListener('click', () => {
      lightboxImg.src = fig.dataset.lightbox;
      lightbox.classList.add('open');
    });
  });
  document.getElementById('lightboxClose').addEventListener('click', () => lightbox.classList.remove('open'));
  lightbox.addEventListener('click', (e) => { if(e.target === lightbox) lightbox.classList.remove('open'); });
  document.addEventListener('keydown', (e) => { if(e.key === 'Escape') lightbox.classList.remove('open'); });

  /* ---------- testimonial carousel ---------- */
  const track = document.getElementById('carouselTrack');
  const slides = track.children.length;
  const dotsWrap = document.getElementById('carouselDots');
  let current = 0;
  let autoplay;

  for(let i=0;i<slides;i++){
    const d = document.createElement('button');
    d.className = 'dot' + (i===0 ? ' active' : '');
    d.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(d);
  }
  function goTo(i){
    current = (i + slides) % slides;
    track.style.transform = 'translateX(-' + (current*100) + '%)';
    [...dotsWrap.children].forEach((d, idx) => d.classList.toggle('active', idx===current));
  }
  document.getElementById('prevBtn').addEventListener('click', () => { goTo(current-1); resetAutoplay(); });
  document.getElementById('nextBtn').addEventListener('click', () => { goTo(current+1); resetAutoplay(); });
  function resetAutoplay(){
    clearInterval(autoplay);
    autoplay = setInterval(() => goTo(current+1), 6000);
  }
  resetAutoplay();

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if(!wasOpen) item.classList.add('open');
    });
  });
