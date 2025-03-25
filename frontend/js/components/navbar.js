function Navbar() {
  const currentPath = window.location.pathname;

  return /* HTML */ `
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <a class="navbar-brand" href="/"> Job Hunt </a>
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
            <a class="nav-link ${currentPath === '/' ? 'active' : ''}" aria-current="page" href="/">
              Home
            </a>
          </li>
            <li class="nav-item">
              <a class="nav-link ${currentPath === '/jobs' ? 'active' : ''}" aria-current="page" href="/jobs">
                Jobs
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link ${currentPath === '/reviews' ? 'active' : ''}" href="/reviews">
                Reviews
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link ${currentPath === '/companies' ? 'active' : ''}" href="/companies">
                Companies
              </a>
            </li>
          </ul>
            <a href="/login" class="btn btn-primary" type="submit">
              Login
            </a>
          </form>
        </div>
      </div>
    </nav>
  `;
}

export default Navbar;
