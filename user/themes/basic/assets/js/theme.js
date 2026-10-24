(() => {
    const header = document.querySelector('[data-shrink-on-scroll="true"]');
    const overlayHeader = document.querySelector('.site-header--over-hero');
    const backToTop = document.querySelector('#back-to-top');
    const navToggle = document.querySelector('.main-nav__toggle');
    const mainNav = document.querySelector('#primary-navigation');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updateHeaderOverlap = () => {
        if (overlayHeader) {
            overlayHeader.style.setProperty('--site-header-height', `${overlayHeader.offsetHeight}px`);
        }
    };

    const updateScrollState = () => {
        if (header) {
            header.classList.toggle('is-scrolled', window.scrollY > 24);
            updateHeaderOverlap();
        }

        if (backToTop) {
            const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
            const isVisible = scrollableHeight > 0 && window.scrollY / scrollableHeight >= 0.5;

            backToTop.classList.toggle('is-visible', isVisible);
            backToTop.setAttribute('aria-hidden', String(!isVisible));
            backToTop.tabIndex = isVisible ? 0 : -1;
        }
    };

    window.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState, { passive: true });
    window.addEventListener('load', updateScrollState, { once: true });

    if (overlayHeader && 'ResizeObserver' in window) {
        new ResizeObserver(updateHeaderOverlap).observe(overlayHeader);
    }

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: reducedMotion.matches ? 'auto' : 'smooth'
            });
        });
    }

    if (navToggle && mainNav) {
        const closeMenu = () => {
            mainNav.classList.remove('is-open');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.setAttribute('aria-label', 'Open navigation menu');
        };

        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
            mainNav.classList.toggle('is-open', !isOpen);
            navToggle.setAttribute('aria-expanded', String(!isOpen));
            navToggle.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
        });

        mainNav.addEventListener('click', (event) => {
            if (event.target.closest('a') && window.innerWidth < 768) closeMenu();
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') closeMenu();
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768) closeMenu();
        });
    }

    document.querySelectorAll('[data-countdown-seconds]').forEach((countdown) => {
        const digit = countdown.querySelector('[style*="--value"]');
        let remaining = Math.max(0, Number.parseInt(countdown.dataset.countdownSeconds, 10) || 0);

        const render = () => {
            if (!digit) return;
            digit.textContent = String(remaining);
            digit.style.setProperty('--value', remaining);
            countdown.setAttribute('aria-label', `${remaining} seconds remaining`);
        };

        render();
        const timer = window.setInterval(() => {
            remaining = Math.max(0, remaining - 1);
            render();
            if (remaining === 0) window.clearInterval(timer);
        }, 1000);
    });

    updateScrollState();
    updateHeaderOverlap();
})();
