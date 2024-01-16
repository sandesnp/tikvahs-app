import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export default function AdminView() {
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
