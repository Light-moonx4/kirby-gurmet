/**
 * script.js
 * Fusion Gourmet - Festival Landing Page
 * 
 * Handles all interactive behavior:
 *  - Responsive hamburger menu toggle (open / close / outside-click)
 *  - Smooth scroll for anchor links
 *  - Active nav link highlight on scroll (Intersection Observer)
 */

/* ============================================================
   1. DOM REFERENCES
   ============================================================ */

/** Button that shows/hides the nav on mobile */
const menuToggle = document.getElementById('menuToggle');

/** The <nav> element that contains all navigation links */
const mainNav   = document.getElementById('mainNav');

/** All anchor links inside the navigation */
const navLinks  = mainNav.querySelectorAll('a');

/* ============================================================
   2. HAMBURGER MENU — TOGGLE
   Open or close the mobile nav when the ☰ / ✕ button is clicked.
   The CSS class "active" controls visibility via display:flex.
   ============================================================ */

menuToggle.addEventListener('click', function () {
    const isOpen = mainNav.classList.toggle('active');

    /* Swap icon between ☰ (closed) and ✕ (open) so the user
       always knows the current state of the menu */
    menuToggle.innerHTML = isOpen ? '&#10005;' : '&#9776;';

    /* Prevent the page body from scrolling while the menu is open */
    document.body.style.overflow = isOpen ? 'hidden' : '';
});

/* ============================================================
   3. HAMBURGER MENU — CLOSE ON LINK CLICK
   When the user taps a nav link on mobile, close the menu
   automatically instead of leaving it open over the content.
   ============================================================ */

navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
        mainNav.classList.remove('active');
        menuToggle.innerHTML = '&#9776;'; /* restore ☰ icon */
        document.body.style.overflow = '';
    });
});

/* ============================================================
   4. HAMBURGER MENU — CLOSE ON OUTSIDE CLICK
   If the user taps anywhere outside the header while the mobile
   menu is open, close it. This is the standard UX pattern for
   dropdown / drawer navigation.
   ============================================================ */

document.addEventListener('click', function (event) {
    /* Check whether the click target is inside the header.
       closest() walks up the DOM tree — returns null if not found */
    const clickedInsideHeader = event.target.closest('header');

    if (!clickedInsideHeader && mainNav.classList.contains('active')) {
        mainNav.classList.remove('active');
        menuToggle.innerHTML = '&#9776;';
        document.body.style.overflow = '';
    }
});

/* ============================================================
   5. ACTIVE NAV LINK — INTERSECTION OBSERVER
   Watches each page section and highlights the matching nav link
   as the user scrolls. Works without scroll event listeners,
   keeping performance smooth on mobile.
   ============================================================ */

/** IDs of all page sections that have a matching nav anchor */
const sectionIds = ['inicio', 'chefs', 'festival', 'galeria', 'contacto'];

/** Map each section id to its corresponding nav <a> element */
const navMap = {};
sectionIds.forEach(function (id) {
    const link = mainNav.querySelector('a[href="#' + id + '"]');
    if (link) navMap[id] = link;
});

/**
 * IntersectionObserver callback.
 * Fires whenever a watched section enters or leaves the viewport.
 * Only the section that is currently intersecting gets the
 * "nav-active" class on its nav link.
 *
 * @param {IntersectionObserverEntry[]} entries - Changed entries
 */
function onSectionIntersect(entries) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting) {
            /* Remove highlight from all links first */
            Object.values(navMap).forEach(function (a) {
                a.classList.remove('nav-active');
            });
            /* Add highlight to the link that matches the visible section */
            const activeLink = navMap[entry.target.id];
            if (activeLink) activeLink.classList.add('nav-active');
        }
    });
}

const observer = new IntersectionObserver(onSectionIntersect, {
    /* Fire when at least 40% of the section is visible */
    threshold: 0.4
});

/* Attach the observer to every section that has a matching nav link */
sectionIds.forEach(function (id) {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
});
