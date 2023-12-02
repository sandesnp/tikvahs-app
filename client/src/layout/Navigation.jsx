import React from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export default function Navigation() {
  const location = useLocation();
  const currentPath = location.pathname.split('/')[1] || '/';

  function Link({ path, children }) {
    return (
      <a
        href={`/${path}`}
        className={`nav__link ${path === currentPath ? 'active' : ''}`}
      >
        {children}
      </a>
    );
  }

  async function handleLogout(e) {
    e.preventDefault();
    const response = await axios.get('/api/user/logout/');
    console.log(response);
  }

  return (
    <nav className='nav'>
      <h1 className='nav__title'>Tikvahs</h1>
      <ul className='nav__list'>
        <li className='nav__item'>
          <Link path={'menu'}>Menu</Link>
        </li>
        <li className='nav__item'>
          <Link path={'contact'}>Contact</Link>
        </li>
        <li className='nav__item'>
          <a onClick={handleLogout} href='/api/user/logout'>
            Logout
          </a>
        </li>
      </ul>
    </nav>
  );
}
