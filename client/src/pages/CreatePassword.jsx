import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createPassword } from '../redux/userSlice';
import { Navigate } from 'react-router-dom';

const Notification = ({ message }) => {
  if (!message) return null;
  return <div style={{ color: 'red' }}>{message}</div>;
};

export default function CreatePassword() {
  const USER = useSelector((state) => state.User);
  const dispatch = useDispatch();
  const [passwords, setPasswords] = useState({ password: '', repassword: '' });
  const [notifcation, setNotification] = useState('');

  useEffect(() => {
    if (USER.error) setNotification(USER.error);
  }, [USER.error]);

  const handleChange = (e) => {
    setPasswords((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.preventDefault();
    if (!passwords.password || !passwords.repassword) {
      setNotification(
        'Please provide both password and confirmation password.'
      );
      return;
    }
    if (passwords.password !== passwords.repassword) {
      setNotification("The passwords don't match.");
      return;
    }
    dispatch(createPassword(passwords));
  };

  if (USER.isLoggedIn) {
    return <Navigate to='/' replace={true} />;
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>{notifcation}</div>
        <input
          type='password'
          name='password'
          value={passwords.password}
          id='password'
          onChange={handleChange}
        />
        <label htmlFor='password'>Password</label>
        <input
          type='password'
          name='repassword'
          value={passwords.repassword}
          id='repassword'
          onChange={handleChange}
        />
        <label htmlFor='repassword'>Confirm Password</label>

        <button>Create Password</button>
      </form>
    </div>
  );
}
