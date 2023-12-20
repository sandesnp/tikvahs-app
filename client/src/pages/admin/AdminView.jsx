import React from 'react';
import { useNavigate, Outlet, Link } from 'react-router-dom';

export default function AdminView() {
  const navigate = useNavigate();

  const GotoLink = (e, link) => {
    e.preventDefault();
    navigate(link);
  };

  return (
    <div className='dashboard-container'>
      <aside className='sidebar'>
        <nav>
          <ul>
            <li>
              <Link to='/admin/dashboard'>Dashboard</Link>
            </li>
            <li>
              <Link to='/admin/product'>Product</Link>
            </li>
            <li>
              <Link to='/admin/user'>User</Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className='main-content'>
        <Outlet />
      </main>
    </div>
  );
}
