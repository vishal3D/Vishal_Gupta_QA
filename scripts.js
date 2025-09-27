function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const btn = document.getElementById('mobile-menu-button');
    if (!menu) return;
    const isHidden = menu.classList.toggle('hidden');
    if (btn) btn.setAttribute('aria-expanded', String(!isHidden));
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
