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
            <li>
              <Link to='/admin/order'>Order</Link>
            </li>
          </ul>
        </nav>
      </aside>
      <div className='main-content' style={{ overflow: 'scroll' }}>
        <Outlet />
      </div>
    </div>
  );
}
