// Simple hash router to control view sections

const routes = new Set(['home', 'shop', 'about', 'contact', 'checkout']);

function getCurrentRoute() {
  const hash = window.location.hash.replace('#', '').trim();
  return routes.has(hash) ? hash : 'home';
}

function renderRoute() {
  const current = getCurrentRoute();
  document.querySelectorAll('.route-section').forEach(sec => {
    sec.classList.remove('route-active');
    sec.style.display = 'none';
  });

  const el = document.getElementById(current);
  if (el) {
    el.style.display = 'block';
    requestAnimationFrame(() => el.classList.add('route-active'));
  }

  const cartDrawer = document.getElementById('cartDrawer');
  if (cartDrawer) cartDrawer.classList.remove('open');
}

window.addEventListener('hashchange', renderRoute);
window.addEventListener('DOMContentLoaded', renderRoute);