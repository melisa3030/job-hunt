import { AuthApi } from '../api/authApi.js';

async function Navbar() {
  const currentPath = window.location.pathname;
  const isAuthenticated = AuthApi.isAuthenticated();
  const user = await AuthApi.getCurrentUser();

  function getMenuItemsByRole(user) {
    const baseItems = [
      `<li><button class="dropdown-item" id="logoutBtn">Logout</button></li>`,
    ];

    const roleSpecificItems = {
      ADMIN: [
        `<li><a class="dropdown-item" href="/admin/users" data-link>Manage Users</a></li>`,
        `<li><a class="dropdown-item" href="/admin/companies" data-link>Manage Companies</a></li>`,
        `<li><a class="dropdown-item" href="/admin/jobs" data-link>Manage Jobs</a></li>`,
      ],
      EMPLOYER: [
        `<li><a class="dropdown-item" href="/profile" data-link>Profile</a></li>`,
        `<li><a class="dropdown-item" href="/employer/jobs" data-link>Posted Jobs</a></li>`,
        `<li><a class="dropdown-item" href="/employer/applications" data-link>Applications</a></li>`,
        `<li><a class="dropdown-item" href="/employer/company" data-link>Manage company</a></li>`,
      ],
      APPLICANT: [
        `<li><a class="dropdown-item" href="/profile" data-link>Profile</a></li>`,
        `<li><a class="dropdown-item" href="/my-applications" data-link>My Applications</a></li>`,
        `<li><a class="dropdown-item" href="/bookmarks" data-link>Saved Jobs</a></li>`,
      ],
    };

    const items = [...(roleSpecificItems[user.role] || [])];
    if (items.length > 0) {
      items.push(`<li><hr class="dropdown-divider"></li>`);
    }
    items.push(...baseItems);

    return items.join('');
  }

  return /* HTML */ `
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <a class="navbar-brand" href="/" data-link> Job Hunt </a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a
                class="nav-link ${currentPath === '/' ? 'active' : ''}"
                aria-current="page"
                href="/"
                data-link
              >
                Home
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link ${currentPath === '/jobs' ? 'active' : ''}"
                aria-current="page"
                href="/jobs"
                data-link
              >
                Jobs
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link ${currentPath === '/reviews' ? 'active' : ''}"
                href="/reviews"
                data-link
              >
                Reviews
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link ${currentPath === '/companies' ? 'active' : ''}"
                href="/companies"
                data-link
              >
                Companies
              </a>
            </li>
          </ul>
          <div class="d-flex navbar-nav">
            ${isAuthenticated && user
              ? `
                <li class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    ${user.username}
                  </a>
                  <ul class="dropdown-menu dropdown-menu-lg-end" aria-labelledby="userDropdown">
                    ${getMenuItemsByRole(user)}
                  </ul>
                </li>
              `
              : `
                <li class="nav-item">
                  <a href="/login" class="btn btn-primary text-white" data-link>
                    Login
                  </a>
                </li>
              `}
          </div>
        </div>
      </div>
    </nav>
  `;
}

export default async function renderNavbar() {
  const navbarContainer = document.getElementById('navbar-container');
  if (!navbarContainer) {
    console.error('Navbar container not found');
    return;
  }

  try {
    navbarContainer.innerHTML = await Navbar();

    // Add event listeners after rendering
    if (AuthApi.isAuthenticated()) {
      const logoutBtn = document.getElementById('logoutBtn');
      logoutBtn?.addEventListener('click', async () => {
        await AuthApi.logout();
        window.location.reload();
      });
    }
  } catch (error) {
    console.error('Error rendering navbar:', error);
    navbarContainer.innerHTML = `
      <div class="alert alert-danger" role="alert">
        Error loading navigation. Please refresh the page.
      </div>
    `;
  }
}
