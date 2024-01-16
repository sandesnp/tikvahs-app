import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PageProduct from './pages/PageProduct';
import Login from './pages/Login';
import CreatePassword from './pages/CreatePasswrod';
import { useDispatch } from 'react-redux';
import { checkUserCookie } from './redux/userSlice';
import ProductForm from './pages/ProductForm';
import Cart from './pages/Cart';
import AdminView from './pages/admin/AdminView';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import ProductManagement from './pages/admin/ProductManagement';
import UserProfile from './pages/UserProfile';
import TabCardGrid from 'components/TabCardGrid';
import Home from 'pages/Home';
import Contact from 'components/forms/TwoColContactUsWithIllustrationFullForm';
import Footer from 'components/footers/MiniCenteredFooter';
import Header from './components/headers/light';

export default function App() {
  // const USER = useSelector((state) => state.User);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkUserCookie()); //state
  }, [dispatch]);

  return (
    <div className='app'>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path='/menu' element={<TabCardGrid />} />
          <Route path='/menu/:productId' element={<PageProduct />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/user/login' element={<Login />} />
          <Route path='/user/createpassword' element={<CreatePassword />} />
          <Route path='/menu/upload' element={<ProductForm />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/' element={<Home />} />

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
