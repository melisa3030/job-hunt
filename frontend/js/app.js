import Navbar from './components/navbar.js';
import { initRouter } from './router.js'; 

const body = document.body;

body.insertAdjacentHTML('afterbegin', Navbar());
initRouter(); 