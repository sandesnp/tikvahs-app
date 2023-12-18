import React, { useEffect } from 'react';
import Navigation from './layout/Navigation';
import Menu from './pages/Menu';
import Footer from './layout/Footer';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PageProduct from './pages/PageProduct';
import Contact from './pages/Contact';
import Login from './pages/Login';
import CreatePassword from './pages/CreatePassword';
import { useDispatch, useSelector } from 'react-redux';
import { checkUserCookie } from './redux/userSlice';
import ProductForm from './pages/ProductForm';

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
          <Route path='/menu' Component={Menu} />
          <Route path='/menu/:productId' Component={PageProduct} />
          <Route path='/contact' Component={Contact} />
          <Route path='/user/login' Component={Login} />
          <Route path='/user/createpassword' Component={CreatePassword} />
          <Route path='/menu/upload' Component={ProductForm} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}
