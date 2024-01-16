import React, { useState } from 'react';
import tw from 'twin.macro';
import styled from 'styled-components';
import { css } from 'styled-components/macro'; //eslint-disable-line
import {
  SectionHeading,
  Subheading as SubheadingBase,
} from 'components/misc/Headings.js';
import { PrimaryButton as PrimaryButtonBase } from 'components/misc/Buttons.js';
import EmailIllustrationSrc from 'images/email-illustration.svg';
import axios from 'axios';

const Container = tw.div`relative`;
const TwoColumn = tw.div`flex flex-col md:flex-row justify-between max-w-screen-xl mx-auto py-20 md:py-24`;
const Column = tw.div`w-full max-w-md mx-auto md:max-w-none md:mx-0`;
const ImageColumn = tw(Column)`md:w-5/12 flex-shrink-0 h-80 md:h-auto`;
const TextColumn = styled(Column)((props) => [
  tw`md:w-7/12 mt-16 md:mt-0`,
  props.textOnLeft
    ? tw`md:mr-12 lg:mr-16 md:order-first`
    : tw`md:ml-12 lg:ml-16 md:order-last`,
]);

const Image = styled.div((props) => [
  `background-image: url("${props.imageSrc}");`,
  tw`rounded bg-contain bg-no-repeat bg-center h-full`,
]);
const TextContent = tw.div`lg:py-8 text-center md:text-left`;

const Subheading = tw(SubheadingBase)`text-center md:text-left`;
const Heading = tw(
  SectionHeading
)`mt-4 font-black text-left text-3xl sm:text-4xl lg:text-5xl text-center md:text-left leading-tight`;
const Description = tw.p`mt-4 text-center md:text-left text-sm md:text-base lg:text-lg font-medium leading-relaxed text-secondary-100`;

const Form = tw.form`mt-8 md:mt-10 text-sm flex flex-col max-w-sm mx-auto md:mx-0`;
const Input = tw.input`mt-6 first:mt-0 border-b-2 py-3 focus:outline-none font-medium transition duration-300 hocus:border-primary-500`;
const Textarea = styled(Input).attrs({ as: 'textarea' })`
  ${tw`h-24`}
`;

const SubmitButton = tw(PrimaryButtonBase)`inline-block mt-8`;

export default ({
  subheading = 'Contact Us',
  heading = (
    <>
      Feel free to <span tw='text-primary-500'>get in touch</span>
      <wbr /> with us.
    </>
  ),
  description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  submitButtonText = 'Send',
  formAction = '#',
  formMethod = 'get',
  textOnLeft = true,
}) => {
  // The textOnLeft boolean prop can be used to display either the text on left or right side of the image.
  const [notification, setNotification] = useState('');

  // Function to validate form data
  const validateForm = ({ email, subject, message }) => {
    if (!email || !subject || !message) {
      setNotification('Please fill in all fields.');
      return false;
    }

    // Simple regex for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setNotification('Please enter a valid email address.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    console.log(`click`);
    e.preventDefault();

    // Get the data from the form
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');

    // Validate form data
    if (!validateForm({ email, subject, message })) return;

    try {
      // Send the data to your backend endpoint using axios
      await axios.post('/api/user/sendmail', {
        email,
        subject,
        message: message,
      });

      // If the request was successful, show a success notification
      setNotification('Email sent successfully!');

      // Clear the notification after 4 seconds
      setTimeout(() => {
        setNotification('');
      }, 4000);
      // clear the form fields
      e.target.reset();
    } catch (error) {
      console.error('Error:', error);
      // Determine error message based on the response or status
      const errorMessage = error.response
        ? `Failed to send email: ${error.response.data.message}`
        : 'An error occurred. Please try again later.';
      setNotification(errorMessage);
    }
  };

  return (
    <Container>
      <TwoColumn>
        <ImageColumn>
          <Image imageSrc={EmailIllustrationSrc} />
        </ImageColumn>
        <TextColumn textOnLeft={textOnLeft}>
          <TextContent>
            {subheading && <Subheading>{subheading}</Subheading>}
            <Heading>{heading}</Heading>
            {description && <Description>{description}</Description>}

            <Form
              action={formAction}
              method={formMethod}
              onSubmit={handleSubmit}
            >
              <Input
                type='email'
                name='email'
                placeholder='Your Email Address'
              />
              <Input type='text' name='subject' placeholder='Subject' />
              <Textarea name='message' placeholder='Your Message Here' />
              <h6>{notification}</h6>
              <SubmitButton type='submit'>{submitButtonText}</SubmitButton>
            </Form>
          </TextContent>
        </TextColumn>
      </TwoColumn>
    </Container>
  );
};
