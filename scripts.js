function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const btn = document.getElementById('mobile-menu-button');
    if (!menu) return;

    const isOpen = menu.classList.contains('open');
    if (isOpen) {
        // close
        menu.style.maxHeight = menu.scrollHeight + 'px'; // set current for transition
        // force repaint
        // eslint-disable-next-line no-unused-expressions
        menu.offsetHeight;
        menu.style.maxHeight = '0px';
        menu.classList.remove('open');
        if (btn) btn.setAttribute('aria-expanded', 'false');
        // after transition remove inline style
        menu.addEventListener('transitionend', function handler() {
            menu.style.display = 'none';
            menu.style.maxHeight = '';
            menu.removeEventListener('transitionend', handler);
        });
    } else {
        // open
        menu.style.display = 'block';
        menu.style.maxHeight = '0px';
        // force repaint
        // eslint-disable-next-line no-unused-expressions
        menu.offsetHeight;
        const target = menu.scrollHeight + 'px';
        menu.style.maxHeight = target;
        menu.classList.add('open');
        if (btn) btn.setAttribute('aria-expanded', 'true');
        menu.addEventListener('transitionend', function handler() {
            // clear to allow natural height on resizes
            menu.style.maxHeight = '';
            menu.removeEventListener('transitionend', handler);
        });
    }
}

function smoothScroll(event) {
    if (event) event.preventDefault();
    // Support being called with an Event from a link or with a string id
    const href = event && event.currentTarget ? event.currentTarget.getAttribute('href') : null;
    const targetId = href || (typeof event === 'string' ? event : null);
    if (!targetId) return;
    const target = document.querySelector(targetId);
    if (!target) return;

    const header = document.getElementById('main-header');
    const headerHeight = header ? header.getBoundingClientRect().height : 0;
    const offset = Math.max(0, headerHeight + 16);

    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    // Update the focus for accessibility
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
}
