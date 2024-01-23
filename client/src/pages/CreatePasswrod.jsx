import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../redux/userSlice';
import { Navigate } from 'react-router-dom';

import AnimationRevealPage from 'helpers/AnimationRevealPage.js';
import { Container as ContainerBase } from 'components/misc/Layouts';
import { ReactComponent as LoginIcon } from 'feather-icons/dist/icons/log-in.svg';
import tw from 'twin.macro';
import styled from 'styled-components';
import illustration from 'images/login-illustration.svg';
import logo from 'images/logo.svg';

const Container = tw(
  ContainerBase
)`min-h-screen bg-primary-900 text-white font-medium flex justify-center -m-8`;
const Content = tw.div`max-w-screen-xl m-0 sm:mx-20 sm:my-16 bg-white text-gray-900 shadow sm:rounded-lg flex justify-center flex-1`;
const MainContainer = tw.div`lg:w-1/2 xl:w-5/12 p-6 sm:p-12`;
const LogoLink = tw.a``;
const LogoImage = tw.img`h-12 mx-auto`;
const MainContent = tw.div`mt-12 flex flex-col items-center`;
const Heading = tw.h1`text-2xl xl:text-3xl font-extrabold`;
const FormContainer = tw.div`w-full flex-1 mt-8`;

const DividerTextContainer = tw.div`h-1 my-12 border-b text-center relative`;
const DividerText = tw.div`leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform -translate-y-1/2 absolute inset-x-0 top-1/2 bg-transparent`;

const Form = tw.form`mx-auto max-w-xs`;
const Input = tw.input`w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5 first:mt-0`;
const SubmitButton = styled.button`
  ${tw`mt-5 tracking-wide font-semibold bg-primary-500 text-gray-100 w-full py-4 rounded-lg hover:bg-primary-900 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none`}
  .icon {
    ${tw`w-6 h-6 -ml-2`}
  }
  .text {
    ${tw`ml-3`}
  }
`;
const IllustrationContainer = tw.div`sm:rounded-r-lg flex-1 bg-purple-100 text-center hidden lg:flex justify-center`;
const IllustrationImage = styled.div`
  ${(props) => `background-image: url("${props.imageSrc}");`}
  ${tw`m-12 xl:m-16 w-full max-w-sm bg-contain bg-center bg-no-repeat`}
`;

const CreatePassword = () => {
  const USER = useSelector((state) => state.User);
  const dispatch = useDispatch();
  const [passwords, setPasswords] = useState({ password: '', repassword: '' });
  const [notification, setNotification] = useState('');

  useEffect(() => {
    if (USER.error) setNotification(USER.error);
  }, [USER.error]);

  const handleChange = (e) => {
    setPasswords((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
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
    dispatch(updateUser({ password: passwords.password }));
  };

  if (USER.isLoggedIn) {
    return <Navigate to='/' replace={true} />;
  }
  return (
    <AnimationRevealPage>
      <Content className='content'>
        <MainContainer className='main-container'>
          <LogoLink href='#'>
            <LogoImage src={logo} className='logo-image' />
          </LogoLink>
          <MainContent className='main-content'>
            <Heading className='heading'>Create Password</Heading>
            <FormContainer className='form-container'>
              <DividerTextContainer>
                <DividerText>{notification}</DividerText>
              </DividerTextContainer>
              <Form className='form' onSubmit={handleSubmit}>
                <Input
                  className='input'
                  type='password'
                  placeholder='Password'
                  name='password'
                  value={passwords.password}
                  onChange={handleChange}
                />
                <Input
                  className='input'
                  type='password'
                  placeholder='Confirm Password'
                  name='repassword'
                  value={passwords.repassword}
                  onChange={handleChange}
                />
                <SubmitButton className='submit-button' type='submit'>
                  <LoginIcon className='icon' />
                  <span className='text'>Create Password</span>
                </SubmitButton>
              </Form>
            </FormContainer>
          </MainContent>
        </MainContainer>
        <IllustrationContainer className='illustration-container'>
          <IllustrationImage imageSrc={illustration} />
        </IllustrationContainer>
      </Content>
    </AnimationRevealPage>
  );
};

export default CreatePassword;
