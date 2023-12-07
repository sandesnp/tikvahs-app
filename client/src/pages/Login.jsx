import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import Axios from 'axios';

export default function Login() {
  const [user, setUser] = useState({ email: '', password: '' });
  const [notification, setNotification] = useState('');
  const navigate = useNavigate();
  const handleChange = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //Since i couldn't access the passportjs failure message, i did a workaround. I added status
      //property in the response if the login is positive. So status will only exist if the login is made.
      const response = await Axios.post('/api/user/login', user);

      if (response.data.success) return navigate(response.data.navigateLink);
    } catch (error) {
      if (error.response.status === 401) {
        setNotification(error.response.data.message);
        return setTimeout(() => {
          setNotification('');
        }, 5000);
      }
      console.log(error);
    }
  };

  return (
    <div>
      {notification}
      <form onSubmit={handleSubmit}>
        <label htmlFor='email'>Email</label>
        <input
          className='login__email'
          id='email'
          type='text'
          value={user.email}
          onChange={handleChange}
          name='email'
        />
        <label htmlFor='password'>Password</label>
        <input
          className='login__password'
          id='password'
          type='password'
          value={user.password}
          onChange={handleChange}
          name='password'
        />
        <button className='button button__anim--white login__button'>
          Login
        </button>
      </form>

      <div className='col-sm-4'>
        <div className='card'>
          <div className='card-body'>
            <Link className='btn btn-block' to={'/api/user/auth/google'}>
              <i className='fab fa-google'></i>
              Sign In with Google
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
