import React, { useEffect } from 'react';
import Navigation from './layout/Navigation';
import Menu from './pages/Menu';
import Footer from './layout/Footer';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PageProduct from './pages/PageProduct';
import Contact from './pages/Contact';
import Login from './pages/Login';
import CreatePassword from './pages/CreatePassword';
import { useDispatch, useSelector } from 'react-redux';
import { checkUserCookie } from './redux/userSlice';
import ProductForm from './pages/ProductForm';
import Cart from './pages/Cart';
import AdminView from './pages/admin/AdminView';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import ProductManagement from './pages/admin/ProductManagement';
import UserProfile from './pages/UserProfie';

export default function App() {
  const USER = useSelector((state) => state.User);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkUserCookie()); //state
  }, []);
  return (
    <div className='app'>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path='/menu' element={<Menu />} />
          <Route path='/menu/:productId' element={<PageProduct />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/user/login' element={<Login />} />
          <Route path='/user/createpassword' element={<CreatePassword />} />
          <Route path='/menu/upload' element={<ProductForm />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/admin' element={<AdminView />}>
            {/* Make the admin/dashboard component the default */}
            <Route index element={<Navigate to='/admin/dashboard' replace />} />
            <Route path='/admin/dashboard' element={<AdminDashboard />} />
            <Route path='/admin/user' element={<UserManagement />} />
            <Route path='/admin/product' element={<ProductManagement />} />
          </Route>
          <Route path='/user/profile' element={<UserProfile />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}
