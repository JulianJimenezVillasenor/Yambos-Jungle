// Smooth scroll for navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                // Close mobile menu if open (improves UX on mobile)
                const mobileMenu = document.getElementById('mobile-menu');
                const menuBtn = document.getElementById('menu-btn');
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    toggleMobileMenu(false);
                }

                // regular smooth scroll:
                const href = this.getAttribute('href');
                if (href && href.startsWith('#')) {
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        const yOffset = 12; // small offset
                        const y = target.getBoundingClientRect().top + window.pageYOffset - (document.documentElement.clientWidth >= 768 ? 88 : 72);
                        window.scrollTo({ top: y - yOffset, behavior: 'smooth' });
                    }
                }
            });
        });

        // Mobile menu toggle logic
        const menuBtn = document.getElementById('menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');

        function toggleMobileMenu(forceState) {
            // if forceState === true -> open, false -> close, undefined -> toggle
            const isHidden = mobileMenu.classList.contains('hidden');
            const shouldOpen = typeof forceState === 'boolean' ? forceState : isHidden;
            if (shouldOpen) {
                mobileMenu.classList.remove('hidden', 'mobile-menu-exit');
                mobileMenu.classList.add('mobile-menu-enter');
                menuBtn.setAttribute('aria-expanded', 'true');
                menuBtn.setAttribute('aria-label', 'Cerrar menú');
            } else {
                mobileMenu.classList.remove('mobile-menu-enter');
                mobileMenu.classList.add('mobile-menu-exit');
                // wait animation then hide
                setTimeout(() => {
                    mobileMenu.classList.add('hidden');
                    mobileMenu.classList.remove('mobile-menu-exit');
                }, 180);
                menuBtn.setAttribute('aria-expanded', 'false');
                menuBtn.setAttribute('aria-label', 'Abrir menú');
            }
        }

        menuBtn && menuBtn.addEventListener('click', () => {
            toggleMobileMenu();
        });

        // Close menu on resize to desktop to keep state consistent
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768 && mobileMenu && !mobileMenu.classList.contains('hidden')) {
                // hide mobile menu when desktop
                mobileMenu.classList.add('hidden');
                menuBtn.setAttribute('aria-expanded', 'false');
            }
        });

        // Close mobile menu when clicking outside (optional nice UX)
        document.addEventListener('click', (e) => {
            if (!mobileMenu || mobileMenu.classList.contains('hidden')) return;
            const isClickInside = mobileMenu.contains(e.target) || menuBtn.contains(e.target);
            if (!isClickInside && window.innerWidth < 768) {
                toggleMobileMenu(false);
            }
        });

        // Improve keyboard accessibility: close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu && !mobileMenu.classList.contains('hidden')) {
                toggleMobileMenu(false);
            }
        });