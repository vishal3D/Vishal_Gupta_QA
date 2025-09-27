function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const btn = document.getElementById('mobile-menu-button');
    if (!menu) return;
    const willOpen = !menu.classList.contains('open');
    // Toggle the menu open/closed
    const header = document.getElementById('main-header');
    if (willOpen) {
        // position menu under header to avoid overlaying the toggle button
        if (header) {
            const rect = header.getBoundingClientRect();
            // pageYOffset ensures correct position when page is scrolled
            menu.style.top = (rect.bottom + window.pageYOffset) + 'px';
        }
        // If Tailwind 'hidden' is present, remove it so our CSS can show the menu
        if (menu.classList.contains('hidden')) menu.classList.remove('hidden');
        menu.classList.add('open');
        if (btn) {
            btn.setAttribute('aria-expanded', 'true');
            btn.classList.add('open');
        }
    } else {
        menu.classList.remove('open');
        if (btn) {
            btn.setAttribute('aria-expanded', 'false');
            btn.classList.remove('open');
        }
        // clear inline top after transition and re-add Tailwind 'hidden' so menu doesn't block layout
        if (menu.__closeTimer) clearTimeout(menu.__closeTimer);
        menu.__closeTimer = setTimeout(() => {
            if (!menu.classList.contains('open')) menu.classList.add('hidden');
            menu.style.top = '';
            delete menu.__closeTimer;
        }, 360);
    }
}

// debounce helper
function debounce(fn, wait) {
    let t = null;
    return function (...args) {
        if (t) return; // ignore subsequent calls within wait window
        fn.apply(this, args);
        t = setTimeout(() => { t = null; }, wait);
    };
}

// Attach debounced toggle to button after DOM ready to avoid inline onclick change
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('mobile-menu-button');
    if (!btn) return;
    const debounced = debounce(toggleMobileMenu, 100);
    // Use pointerup to reduce duplicate touch/click events and attach debounced handler
    btn.addEventListener('pointerup', debounced);
});

// Adjust mobile menu top on resize while open
window.addEventListener('resize', () => {
    const menu = document.getElementById('mobile-menu');
    const header = document.getElementById('main-header');
    if (!menu || !header) return;
    if (menu.classList.contains('open')) {
        const rect = header.getBoundingClientRect();
        menu.style.top = (rect.bottom + window.pageYOffset) + 'px';
    }
});

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
