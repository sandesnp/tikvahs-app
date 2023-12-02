import React, { useState } from 'react';
import axios from 'axios';
// import Notification from '../components/Notification';

export default function CreatePassword() {
  const [passwords, setPasswords] = useState({ password: '', repassword: '' });
  const [notifcation, setNotification] = useState('');
  const handleChange = (e) => {
    setPasswords((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/user/createpassword/', passwords);
      console.log(response.data);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
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
        {notifcation}
        <button>Create Password</button>
      </form>
    </div>
  );
}
