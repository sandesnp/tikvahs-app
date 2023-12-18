import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { loginUser } from '../redux/userSlice';

export default function Login() {
  const USER = useSelector((state) => state.User);
  const currentHost = window.location.host;

  const dispatch = useDispatch();
  const [user, setUser] = useState({ email: '', password: '' });
  const [notification, setNotification] = useState();

  const handleChange = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginUser(user));
  };

  const possibleErrors = ["Password doesn't match", "Email Doesn't Exist"];
  useEffect(() => {
    if (possibleErrors.includes(USER.error)) setNotification(USER.error);
  }, [USER.error]);
  if (USER.isLoggedIn) {
    return <Navigate to='/' replace={true} />;
  }
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
            <a
              className='btn btn-block'
              href={`${
                currentHost === 'localhost:3000' ? '//localhost:5010' : ''
              }/api/user/auth/google`}
            >
              <i className='fab fa-google'></i>
              Sign In with Google
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
