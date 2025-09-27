function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const btn = document.getElementById('mobile-menu-button');
    if (!menu) return;
    const willOpen = !menu.classList.contains('open');
    // Guard: ignore an immediate close that happens right after opening.
    // Some mobile browsers synthesize multiple events which can cause a
    // close to fire milliseconds after open; we treat those as no-ops.
    if (!willOpen && menu.__justOpened) {
        // If a close is requested while we're in the 'just opened' window, ignore it.
        return;
    }
    // Toggle the menu open/closed
    const header = document.getElementById('main-header');
    if (willOpen) {
        // position menu under header to avoid overlaying the toggle button
        if (header) {
            // Use header height so the absolute-positioned menu inside the header
            // sits directly below it even when the header is fixed and the page
            // is scrolled.
            menu.style.top = header.offsetHeight + 'px';
        }
        // If Tailwind 'hidden' is present, remove it so our CSS can show the menu
        if (menu.classList.contains('hidden')) menu.classList.remove('hidden');
        menu.classList.add('open');
    // mark as just opened to prevent immediate accidental close; clear shortly after
    if (menu.__justOpenedTimer) clearTimeout(menu.__justOpenedTimer);
    menu.__justOpened = true;
    menu.__justOpenedTimer = setTimeout(() => { menu.__justOpened = false; delete menu.__justOpenedTimer; }, 420);
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

// Initialize mobile menu button: use pointerdown and a short lock to avoid a
// synthesized click re-triggering the toggle immediately after open.
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('mobile-menu-button');
    if (!btn) return;
    const TOGGLE_LOCK_MS = 420; // longer than the open/close transition
    const handler = (ev) => {
        // Prevent the subsequent click event from reaching other handlers/causing re-toggle
        if (ev) {
            ev.preventDefault();
            ev.stopPropagation();
        }
        if (handler.locked) return;
        handler.locked = true;
        try {
            toggleMobileMenu();
        } finally {
            setTimeout(() => { handler.locked = false; }, TOGGLE_LOCK_MS);
        }
    };
    // Use pointerdown so we grab the interaction early and prevent the synthesized click
    btn.addEventListener('pointerdown', handler);
});

// Adjust mobile menu top on resize while open
window.addEventListener('resize', () => {
    const menu = document.getElementById('mobile-menu');
    const header = document.getElementById('main-header');
    if (!menu || !header) return;
    if (menu.classList.contains('open')) {
        menu.style.top = header.offsetHeight + 'px';
    }
});

// Ensure main content isn't hidden under the fixed header by adding top padding
function adjustMainForFixedHeader() {
    const header = document.getElementById('main-header');
    const main = document.querySelector('main');
    if (!header || !main) return;
    const h = header.getBoundingClientRect().height;
    // Use CSS variable or inline padding to avoid layout shifts
    main.style.paddingTop = h + 'px';
}

window.addEventListener('resize', adjustMainForFixedHeader);
window.addEventListener('load', adjustMainForFixedHeader);
document.addEventListener('DOMContentLoaded', adjustMainForFixedHeader);

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
