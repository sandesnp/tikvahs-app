import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { loginUser } from '../redux/userSlice';
import AnimationRevealPage from 'helpers/AnimationRevealPage.js';
import { Container as ContainerBase } from 'components/misc/Layouts';
import { ReactComponent as LoginIcon } from 'feather-icons/dist/icons/log-in.svg';
import tw from 'twin.macro';
import styled from 'styled-components';
import { css } from 'styled-components/macro'; //eslint-disable-line
import illustration from 'images/login-illustration.svg';
import logo from 'images/logo.svg';
import googleIconImageSrc from 'images/google-icon.png';

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

const SocialButtonsContainer = tw.div`flex flex-col items-center`;
const SocialButton = styled.a`
  ${tw`w-full max-w-xs font-semibold rounded-lg py-3 border text-gray-900 bg-gray-100 hocus:bg-gray-200 hocus:border-gray-400 flex items-center justify-center transition-all duration-300 focus:outline-none focus:shadow-outline text-sm mt-5 first:mt-0`}
  .iconContainer {
    ${tw`bg-white p-2 rounded-full`}
  }
  .icon {
    ${tw`w-4`}
  }
  .text {
    ${tw`ml-4`}
  }
`;

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

const Login = ({
  logoLinkUrl = '#',
  illustrationImageSrc = illustration,
  headingText = 'Sign In To Tikvahs',
  socialButtons,
}) => {
  const SubmitButtonIcon = LoginIcon;
  const currentHost = window.location.host;
  const socialLinks = socialButtons || [
    {
      iconImageSrc: googleIconImageSrc,
      text: 'Log In With Google',
      url: `${
        currentHost === 'localhost:3000' ? '//localhost:5010' : ''
      }/api/user/auth/google`,
    },
  ];
  // Redux state and dispatch
  const USER = useSelector((state) => state.User);
  const dispatch = useDispatch();

  // Local state for form inputs and notification
  const [user, setUser] = useState({ email: '', password: '' });
  const [notification, setNotification] = useState(
    'Or Sign in with your e-mail'
  );

  // Handle form input changes
  const handleChange = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsClicked((prev) => !prev);
    dispatch(loginUser(user));
  };

  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    // Effect for error handling
    const possibleErrors = [
      "Password doesn't match",
      "Email Doesn't Exist",
      'Password is wrong',
    ];
    if (possibleErrors.includes(USER.error)) {
      console.log('error', USER.error);
      setNotification(USER.error);
      const timer = setTimeout(() => {
        setNotification('Or Sign in with your e-mail'); // or set to your default value
      }, 3000);

      // Clear timeout if the component unmounts
      return () => clearTimeout(timer);
    }
  }, [USER.error, isClicked]);

  // Redirect if logged in
  if (USER.isLoggedIn) {
    if (
      USER.data.message === 'admin@admin' ||
      USER.data.email === 'admin@admin'
    ) {
      return <Navigate to='/admin/dashboard' replace={true} />;
    }

    return <Navigate to='/' replace={true} />;
  }
  return (
    <AnimationRevealPage>
      <Container>
        <Content>
          <MainContainer>
            <LogoLink href={logoLinkUrl}>
              <LogoImage src={logo} />
            </LogoLink>
            <MainContent>
              <Heading>{headingText}</Heading>
              <FormContainer>
                <SocialButtonsContainer>
                  {socialLinks.map((socialButton, index) => (
                    <SocialButton key={index} href={socialButton.url}>
                      <span className='iconContainer'>
                        <img
                          src={socialButton.iconImageSrc}
                          className='icon'
                          alt=''
                        />
                      </span>
                      <span className='text'>{socialButton.text}</span>
                    </SocialButton>
                  ))}
                </SocialButtonsContainer>
                <DividerTextContainer>
                  <DividerText>{notification}</DividerText>
                </DividerTextContainer>
                <Form onSubmit={handleSubmit}>
                  <Input
                    type='email'
                    placeholder='Email'
                    name='email'
                    value={user.email}
                    onChange={handleChange}
                  />
                  <Input
                    type='password'
                    placeholder='Password'
                    name='password'
                    value={user.password}
                    onChange={handleChange}
                  />
                  <SubmitButton type='submit'>
                    <SubmitButtonIcon className='icon' />
                    <span className='text'>Log In</span>
                  </SubmitButton>
                </Form>
              </FormContainer>
            </MainContent>
          </MainContainer>
          <IllustrationContainer>
            <IllustrationImage imageSrc={illustrationImageSrc} />
          </IllustrationContainer>
        </Content>
      </Container>
    </AnimationRevealPage>
  );
};

export default Login;
