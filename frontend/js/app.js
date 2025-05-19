import renderNavbar from './components/navbar.js';
import { initRouter } from './router.js';

async function initApp() {
  await renderNavbar();
  initRouter();
}

initApp();