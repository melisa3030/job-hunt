import { renderJobs } from './jobs.js';
import { renderReviews } from './reviews.js';
import { renderCompanies } from './companies.js';
import { renderCompanyTab } from './company.js';
import { initSignupForm } from './signup.js';

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

// Main route handler - processes URL changes and renders appropriate content
const urlLocationHandler = async () => {
  // Get the current URL path
  const path = window.location.pathname;

  // Find matching route - handles both static and dynamic routes (with :id)
  // Falls back to 404 if no match is found
  const routeKey =
    Object.keys(urlRoutes).find((key) =>
      key.includes(':id') ? path.startsWith(key.split('/:id')[0]) : key === path
    ) || '404';

  // Get route configuration for the matched path
  const route = urlRoutes[routeKey];

  // Fetch and insert the HTML template
  const html = await fetch(route.template).then((response) => response.text());
  document.getElementById('app').innerHTML = html;

  // Update page metadata
  document.title = route.title;
  document
    .querySelector('meta[name="description"]')
    .setAttribute('content', route.description);


  // Handle special routes with dynamic content
  if (routeKey === '/company/:id') {
    const id = path.split('/')[2];
    const tab = path.split('/')[3] || 'about';
    renderCompanyTab(id, tab);
  }

  // Render section-specific content
  if (routeKey === '/jobs') renderJobs();
  if (routeKey === '/reviews') renderReviews();
  if (routeKey === '/companies') renderCompanies();
  if (routeKey === '/signup') initSignupForm();

};

// Handle client-side navigation
const urlRoute = (event) => {
  event = event || window.event;
  event.preventDefault();
  // Update URL without a page reload
  window.history.pushState({}, '', event.target.href);
  // Handle the route change
  urlLocationHandler();
};


// Initialize the router
export const initRouter = () => {
  // Handle clicks on navigation links
  document.addEventListener('click', (e) => {
    // Handle regular navigation
    if (e.target.matches('[data-link]')) {
      urlRoute(e);
    }
    // Handle company tab navigation
    if (e.target.matches('[data-tab-link]')) {
      e.preventDefault();
      const id = window.location.pathname.split('/')[2];
      const tab = e.target.getAttribute('data-id');
      const href = `/company/${id}/${tab}`;
      renderCompanyTab(id, tab);
      window.history.pushState({}, '', href);
    }
  });

  // Handle browser back/forward buttons
  window.onpopstate = urlLocationHandler;

  // Handle initial page load
  urlLocationHandler();
};


export { urlLocationHandler };