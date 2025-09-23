
    (function(){
      const menuBtn = document.getElementById('menu-btn');
      const mobileMenu = document.getElementById('mobile-menu');
      if (!menuBtn) return;
      menuBtn.addEventListener('click', () => {
        const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
        menuBtn.setAttribute('aria-expanded', (!expanded).toString());
        if (mobileMenu) mobileMenu.classList.toggle('hidden');
      });

      // cerrar menú al hacer click en enlace (mejora UX)
      if (mobileMenu) {
        mobileMenu.querySelectorAll('a').forEach(a => {
          a.addEventListener('click', () => mobileMenu.classList.add('hidden'));
        });
      }
    })();

    (function(){
      document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function(e){
          const href = this.getAttribute('href');
          if (href.length > 1 && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({ behavior: 'smooth', block: 'start' });
            // cerrar menú móvil si está abierto
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) mobileMenu.classList.add('hidden');
          }
        });
      });
    })();

    (function(){
      const wa = document.querySelector('.whatsapp-button');
      if (!wa) return;
      const tip = wa.querySelector('.whatsapp-tooltip');
      if (!tip) return;
      // Mostrar tooltip en hover (solo si hay espacio y en Desktop)
      wa.addEventListener('mouseenter', () => { tip.style.display = 'block'; tip.style.opacity = '1'; tip.style.position='absolute'; tip.style.right='70px'; tip.style.background='rgba(0,0,0,0.7)'; tip.style.color='white'; tip.style.padding='6px 10px'; tip.style.borderRadius='6px'; });
      wa.addEventListener('mouseleave', () => { tip.style.display = 'none'; });
    })();

    (function(){
      // añadir focus outlines visibles para teclado
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') document.body.classList.add('show-focus-outlines');
      });
    })();

(function(){
      const slidesContainer = document.querySelector('.slides');
      const slides = Array.from(document.querySelectorAll('.slide'));
      const prevBtn = document.getElementById('prevBtn');
      const nextBtn = document.getElementById('nextBtn');
      const dots = Array.from(document.querySelectorAll('.dots button'));
      const thumbs = Array.from(document.querySelectorAll('.thumb-btn'));
      const carousel = document.getElementById('carousel');

      const COUNT = slides.length;
      let current = 0;
      const AUTOPLAY_DELAY = 4500;
      let autoplayTimer = null;
      let isPaused = false;
      let isTouching = false;

      function updateUI(index, announce = true) {
        const translate = -index * 100;
        slidesContainer.style.transform = 'translateX(' + translate + '%)';
        slides.forEach((s,i) => { s.setAttribute('aria-hidden', (i !== index).toString()); });
        dots.forEach((d,i) => d.setAttribute('aria-current', (i===index).toString()));
        thumbs.forEach((t,i) => t.setAttribute('aria-current', (i===index).toString()));
        current = index;
        if (announce) carousel.setAttribute('aria-label', 'Imagen ' + (index+1) + ' de ' + COUNT);
      }
      function goTo(index) { index = (index + COUNT) % COUNT; updateUI(index); }
      function next() { goTo(current + 1); }
      function prev() { goTo(current - 1); }

      function startAutoplay() {
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        stopAutoplay();
        autoplayTimer = setInterval(() => { if (!isPaused && !isTouching) next(); }, AUTOPLAY_DELAY);
      }
      function stopAutoplay() { if (autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null; } }
      function restartAutoplay() { stopAutoplay(); setTimeout(startAutoplay, 900); }

      nextBtn.addEventListener('click', () => { next(); restartAutoplay(); });
      prevBtn.addEventListener('click', () => { prev(); restartAutoplay(); });

      dots.forEach(d => d.addEventListener('click', () => { goTo(Number(d.dataset.to)); restartAutoplay(); }));
      thumbs.forEach(t => t.addEventListener('click', () => { goTo(Number(t.dataset.to)); restartAutoplay(); }));

      carousel.addEventListener('mouseenter', () => { isPaused = true; });
      carousel.addEventListener('mouseleave', () => { isPaused = false; });
      carousel.addEventListener('focusin', () => { isPaused = true; });
      carousel.addEventListener('focusout', () => { isPaused = false; });

      carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { next(); restartAutoplay(); }
        else if (e.key === 'ArrowLeft') { prev(); restartAutoplay(); }
      });

      document.addEventListener('visibilitychange', () => {
        if (document.hidden) stopAutoplay(); else startAutoplay();
      });

      // Swipe touch
      let startX = 0, currentX = 0, deltaX = 0;
      const threshold = 40;
      slidesContainer.addEventListener('touchstart', (e) => {
        isTouching = true; startX = e.touches[0].clientX; currentX = startX; slidesContainer.style.transition = 'none'; stopAutoplay();
      }, {passive:true});
      slidesContainer.addEventListener('touchmove', (e) => {
        currentX = e.touches[0].clientX; deltaX = currentX - startX;
        const percent = (deltaX / carousel.offsetWidth) * 100;
        slidesContainer.style.transform = 'translateX(' + ((-current*100) + percent) + '%)';
      }, {passive:true});
      slidesContainer.addEventListener('touchend', (e) => {
        slidesContainer.style.transition = ''; isTouching = false;
        if (Math.abs(deltaX) > threshold) { if (deltaX < 0) next(); else prev(); } else { goTo(current); }
        deltaX = 0; restartAutoplay();
      });

      // mouse drag (desktop)
      let isDragging = false;
      slidesContainer.addEventListener('pointerdown', (e) => {
        isDragging = true; isTouching = true; startX = e.clientX;
        slidesContainer.setPointerCapture(e.pointerId); slidesContainer.style.transition = 'none'; stopAutoplay();
      });
      slidesContainer.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        currentX = e.clientX; deltaX = currentX - startX;
        const percent = (deltaX / carousel.offsetWidth) * 100;
        slidesContainer.style.transform = 'translateX(' + ((-current*100) + percent) + '%)';
      });
      slidesContainer.addEventListener('pointerup', (e) => {
        if (!isDragging) return; isDragging = false; isTouching = false; slidesContainer.style.transition = '';
        if (Math.abs(deltaX) > threshold) { if (deltaX < 0) next(); else prev(); } else goTo(current);
        deltaX = 0; restartAutoplay();
      });
      slidesContainer.addEventListener('pointercancel', () => { isDragging = false; isTouching = false; slidesContainer.style.transition = ''; goTo(current); restartAutoplay(); });

      dots.forEach((d,i) => { d.dataset.to = i; d.setAttribute('role','tab'); d.setAttribute('tabindex','0'); });
      thumbs.forEach((t,i) => { t.dataset.to = i; t.setAttribute('role','tab'); t.setAttribute('tabindex','0'); });

      updateUI(0,false); startAutoplay();
      if (COUNT <= 1) { prevBtn.style.display='none'; nextBtn.style.display='none'; document.querySelector('.controls-bottom').style.display='none'; stopAutoplay(); }
    })();
