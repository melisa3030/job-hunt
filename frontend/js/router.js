import { renderJobs } from './jobs.js';
import { renderReviews } from './reviews.js';
import { renderCompanies } from './companies.js';
import { renderCompanyTab } from './company.js';
import { initSignupForm } from './signup.js';
import { initLoginForm } from './login.js';
import { AuthApi } from './api/authApi.js';
import { initManageUsers } from './admin/manageUsers.js';
import { initManageCompanies } from './admin/manageCompanies.js';
import { initManageJobs } from './admin/manageJobs.js';

const urlPageTitle = 'Job Hunt App';

const urlRoutes = {
  // Error routes
  404: {
    template: '/views/404.html',
    title: '404 | ' + urlPageTitle,
    description: 'Page not found',
  },
  '/forbidden': {
    template: '/views/forbidden.html',
    title: 'Forbidden | ' + urlPageTitle,
    description: 'Access Denied',
  },

  // Public routes
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

  // For logged-in users
  '/profile': {
    template: '/views/profile.html',
    title: 'Profile | ' + urlPageTitle,
    description: 'User profile',
  },

  // Admin routes
  '/admin/dashboard': {
    template: '/views/admin/dashboard.html',
    title: 'Admin Dashboard | ' + urlPageTitle,
    description: 'Admin Dashboard',
  },
  '/admin/users': {
    template: '/views/admin/users.html',
    title: 'Manage Users | ' + urlPageTitle,
    description: 'User Management',
  },
  '/admin/companies': {
    template: '/views/admin/companies.html',
    title: 'Manage Companies | ' + urlPageTitle,
    description: 'Company Management',
  },
  '/admin/jobs': {
    template: '/views/admin/jobs.html',
    title: 'Manage Jobs | ' + urlPageTitle,
    description: 'Job Management',
  },

  // Employer routes
  '/employer/dashboard': {
    template: '/views/employer/dashboard.html',
    title: 'Employer Dashboard | ' + urlPageTitle,
    description: 'Employer Dashboard',
  },
  '/employer/jobs': {
    template: '/views/employer/jobs.html',
    title: 'Posted Jobs | ' + urlPageTitle,
    description: 'Manage Posted Jobs',
  },
  '/employer/applications': {
    template: '/views/employer/applications.html',
    title: 'Applications | ' + urlPageTitle,
    description: 'Manage Job Applications',
  },
  '/employer/companies': {
    template: '/views/employer/companies.html',
    title: 'Manage Companies | ' + urlPageTitle,
    description: 'Company Management',
  },

  // Applicant routes
  '/my-applications': {
    template: '/views/applicant/applications.html',
    title: 'My Applications | ' + urlPageTitle,
    description: 'View My Job Applications',
  },
  '/bookmarks': {
    template: '/views/applicant/bookmarks.html',
    title: 'Saved Jobs | ' + urlPageTitle,
    description: 'View Saved Jobs',
  },
};

// Main route handler - processes URL changes and renders appropriate content
const urlLocationHandler = async () => {
  const path = window.location.pathname;
  const isAuthenticated = AuthApi.isAuthenticated();
  const user = await AuthApi.getCurrentUser();

  // Check if the path is a role-specific route
  const isRoleSpecificRoute =
    path.startsWith('/admin/') ||
    path.startsWith('/employer/') ||
    path === '/my-applications' ||
    path === '/bookmarks';

  // Role-based route protection
  if (isRoleSpecificRoute) {
    if (!isAuthenticated) {
      window.history.pushState({}, '', '/login');
      return urlLocationHandler();
    }

    // Check role-specific routes
    if (path.startsWith('/admin/') && user.role !== 'ADMIN') {
      window.history.pushState({}, '', '/forbidden');
      return urlLocationHandler();
    }

    if (path.startsWith('/employer/') && user.role !== 'EMPLOYER') {
      window.history.pushState({}, '', '/forbidden');
      return urlLocationHandler();
    }

    if (
      (path === '/my-applications' || path === '/bookmarks') &&
      user.role !== 'APPLICANT'
    ) {
      window.history.pushState({}, '', '/forbidden');
      return urlLocationHandler();
    }
  }

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
  if (routeKey === '/jobs') await renderJobs();
  if (routeKey === '/reviews') renderReviews();
  if (routeKey === '/companies') renderCompanies();
  if (routeKey === '/signup') initSignupForm();
  if (routeKey === '/login') initLoginForm();
  if (routeKey === '/admin/users') initManageUsers();
  if (routeKey === '/admin/companies') initManageCompanies();
  if (routeKey === '/admin/jobs') initManageJobs();
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
