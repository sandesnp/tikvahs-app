import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, Link } from 'react-router-dom';
import { logoutThunk } from '../redux/userSlice';

export default function Navigation() {
  const location = useLocation();
  const currentPath = location.pathname.split('/')[1] || '/';
  const USER = useSelector((state) => state.User);
  const cart = useSelector((state) => state.Cart); // Assuming cart is the name of the cart slice
  const totalItems = cart.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const dispatch = useDispatch();

  //adds functiontionality -> if on current link add a className for highlight purpose
  function GoToLink({ path, children }) {
    return (
      <Link
        to={`/${path}`}
        className={`nav__link ${path === currentPath ? 'active' : ''}`}
      >
        {children}
      </Link>
    );
  }
  async function handleLogout(e) {
    e.preventDefault();
    dispatch(logoutThunk());
  }

  useEffect(() => {}, [USER.isLoggedIn]);
  return (
    <nav className='nav'>
      <h1 className='nav__title'>Tikvahs</h1>
      <ul className='nav__list'>
        <li className='nav__item'>
          <GoToLink path={'menu'}>Menu</GoToLink>
        </li>
        <li className='nav__item'>
          <GoToLink path={'contact'}>Contact</GoToLink>
        </li>
        {USER?.isLoggedIn && (
          <li className='nav__item'>
            <a onClick={handleLogout} href='/api/user/logout'>
              Logout
            </a>
          </li>
        )}
        <li className='nav__item'>
          <GoToLink path={'cart'}>Cart ({totalItems})</GoToLink>
        </li>
      </ul>
    </nav>
  );
}
