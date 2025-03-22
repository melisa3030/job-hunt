import { renderJobs } from './jobs.js';
import { renderReviews } from './reviews.js';
import { renderCompanies } from './companies.js';
import { renderCompanyTab } from './company.js';

const urlPageTitle = 'Job Hunt App';

const urlRoutes = {
  404: {
    template: '/views/404.html',
    title: '404 | ' + urlPageTitle,
    description: 'Page not found',
  },
  '/': {
    template: '/views/home.html',
    title: 'Home | ' + urlPageTitle,
    description: 'Welcome to the home page',
  },
  '/login': {
    template: '/views/login.html',
    title: 'Login | ' + urlPageTitle,
    description: 'Login to your account',
  },
  '/signup': {
    template: '/views/signup.html',
    title: 'Signup | ' + urlPageTitle,
    description: 'Create an account',
  },
  '/profile': {
    template: '/views/profile.html',
    title: 'Profile | ' + urlPageTitle,
    description: 'User profile',
  },
  '/jobs': {
    template: '/views/jobs.html',
    title: 'Jobs | ' + urlPageTitle,
    description: 'Browse job listings',
  },
  '/reviews': {
    template: '/views/reviews.html',
    title: 'Reviews | ' + urlPageTitle,
    description: 'Company reviews',
  },
  '/companies': {
    template: '/views/companies.html',
    title: 'Companies | ' + urlPageTitle,
    description: 'Company profiles',
  },
  '/company/:id': {
    template: '/views/company/company.html',
    title: 'Company | ' + urlPageTitle,
    description: 'Company details',
  },
};

const urlLocationHandler = async () => {
  const path = window.location.pathname;
  const routeKey =
    Object.keys(urlRoutes).find((key) =>
      key.includes(':id') ? path.startsWith(key.split('/:id')[0]) : key === path
    ) || '404';

  const route = urlRoutes[routeKey];
  const html = await fetch(route.template).then((response) => response.text());
  document.getElementById('app').innerHTML = html;
  document.title = route.title;
  document
    .querySelector('meta[name="description"]')
    .setAttribute('content', route.description);

  if (routeKey === '/company/:id') {
    const id = path.split('/')[2];
    const tab = path.split('/')[3] || 'about';
    renderCompanyTab(id, tab);
  }

  if (routeKey === '/jobs') {
    renderJobs();
  }

  if (routeKey === '/reviews') {
    renderReviews();
  }

  if (routeKey === '/companies') {
    renderCompanies();
  }
};

const urlRoute = (event) => {
  event = event || window.event;
  event.preventDefault();
  window.history.pushState({}, '', event.target.href);
  urlLocationHandler();
};

export const initRouter = () => {
  document.addEventListener('click', (e) => {
    if (e.target.matches('[data-link]')) {
      urlRoute(e);
    }
    if (e.target.matches('[data-tab-link]')) {
      e.preventDefault();
      const id = window.location.pathname.split('/')[2];
      const tab = e.target.getAttribute('data-id');
      const href = `/company/${id}/${tab}`;
      renderCompanyTab(id, tab);
      window.history.pushState({}, '', href);
    }
  });

  window.onpopstate = urlLocationHandler;

  urlLocationHandler();
};

export { urlLocationHandler };