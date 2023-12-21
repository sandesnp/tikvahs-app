import React, { useState, useEffect } from 'react';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../redux/userSlice';
import axios from 'axios';

export default function UserProfile() {
  const USER = useSelector((state) => state.User);
  const dispatch = useDispatch();
  // The initial user state is stored separately for comparison
  const initialUserState = {
    email: '', // Preset email for demonstration
    password: '',
    confirmPassword: '',
  };

  const [user, setUser] = useState(initialUserState);
  const [validationMessage, setValidationMessage] = useState('');

  // Effect to update local state when Redux state changes
  useEffect(() => {
    setUser((currentUser) => ({
      ...currentUser,
      email: USER.data.email || '',
    }));
  }, [USER.data.email]);

  useEffect(() => {
    if (validationMessage) {
      const timer = setTimeout(() => {
        setValidationMessage('');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [validationMessage]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const validateAndSubmit = async (e) => {
    e.preventDefault();

    if (user.email.length > 100) {
      setValidationMessage('Email cannot be more than 100 characters.');
      return;
    }

    if (
      (user.password || user.confirmPassword) &&
      user.password !== user.confirmPassword
    ) {
      setValidationMessage('Both password fields must match.');
      return;
    }

    if (user.password.length > 50 || user.confirmPassword.length > 50) {
      setValidationMessage('Password cannot be more than 50 characters.');
      return;
    }

    if (user.password && !user.confirmPassword) {
      setValidationMessage('Please confirm your password.');
      return;
    }

    if (!user.password && user.confirmPassword) {
      setValidationMessage('Please enter your password.');
      return;
    }

    // Check if no changes were made
    const isEmailUnchanged = user.email === USER.data.email;
    const arePasswordsUnchanged = !user.password && !user.confirmPassword;

    if (isEmailUnchanged && arePasswordsUnchanged) {
      setValidationMessage('No changes were made.');
      return;
    }
    //if password exists sends both password and email to be updated if not just email
    const payload = user.password
      ? { email: user.email, password: user.password }
      : { email: user.email };

    // Send patch request if only email was changed.
    dispatch(updateUser(payload));
    setValidationMessage('Profile updated successfully!');
  };

  const resetFields = () => {
    setUser(initialUserState);
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <Form>
        <FormGroup>
          <Label for='email'>Email</Label>
          <Input
            type='email'
            name='email'
            id='email'
            value={user.email}
            onChange={handleChange}
            maxLength={100}
          />
        </FormGroup>
        <FormGroup>
          <Label for='password'>Password</Label>
          <Input
            type='password'
            name='password'
            id='password'
            value={user.password}
            onChange={handleChange}
            maxLength={50}
          />
        </FormGroup>
        <FormGroup>
          <Label for='confirmPassword'>Confirm Password</Label>
          <Input
            type='password'
            name='confirmPassword'
            id='confirmPassword'
            value={user.confirmPassword}
            onChange={handleChange}
            maxLength={50}
          />
        </FormGroup>
        {validationMessage && <Alert color='danger'>{validationMessage}</Alert>}
        <Button color='primary' onClick={validateAndSubmit}>
          Update
        </Button>{' '}
        <Button color='secondary' onClick={resetFields}>
          Cancel
        </Button>
      </Form>
    </div>
  );
}
