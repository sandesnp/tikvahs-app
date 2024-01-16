import React from 'react';
import tw from 'twin.macro';
import { css } from 'styled-components/macro'; //eslint-disable-line
import AnimationRevealPage from 'helpers/AnimationRevealPage.js';
import Hero from 'components/hero/TwoColumnWithVideo.js';
import MainFeature2 from 'components/features/TwoColSingleFeatureWithStats2.js';
import TabGrid from 'components/TabCardGrid.js';
import Testimonial from 'components/testimonials/ThreeColumnWithProfileImage.js';

const Home = () => {
  const Subheading = tw.span`tracking-wider text-sm font-medium`;
  const HighlightedText = tw.span`bg-primary-500 text-gray-100 px-4 transform -skew-x-12 inline-block`;

  const imageCss = tw`rounded-4xl`;
  return (
    <AnimationRevealPage>
      <Hero
        heading={
          <>
            All Vegan Ingredients{' '}
            <HighlightedText>Meals Just For you.</HighlightedText>
          </>
        }
        description='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        imageSrc='https://source.unsplash.com/RndRFJ1v1kk'
        imageCss={imageCss}
        imageDecoratorBlob={true}
        primaryButtonText='Check Menu'
      />
      {/* TabGrid Component also accepts a tabs prop to customize the tabs and its content directly. Please open the TabGrid component file to see the structure of the tabs props.*/}
      <TabGrid
        heading={
          <>
            Checkout our <HighlightedText>menu.</HighlightedText>
          </>
        }
      />
      <MainFeature2
        subheading={<Subheading>A Reputed Brand</Subheading>}
        heading={
          <>
            Why <HighlightedText>Choose Us ?</HighlightedText>
          </>
        }
        statistics={[
          {
            key: 'Orders',
            value: '100+',
          },
          {
            key: 'Customers',
            value: '100+',
          },
          {
            key: 'Chefs',
            value: '5+',
          },
        ]}
        primaryButtonText='Check Menu'
        primaryButtonUrl='/menu'
        imageInsideDiv={false}
        imageSrc='https://source.unsplash.com/qZ5lPCPvdXE'
        imageCss={Object.assign(tw`bg-cover`, imageCss)}
        imageContainerCss={tw`md:w-1/2 h-auto`}
        imageDecoratorBlob={true}
        imageDecoratorBlobCss={tw`left-1/2 md:w-32 md:h-32 -translate-x-1/2 opacity-25`}
        textOnLeft={true}
      />
      <Testimonial
        subheading=''
        heading={
          <>
            Customers <HighlightedText>Love Us.</HighlightedText>
          </>
        }
      />
    </AnimationRevealPage>
  );
};

export default Home;
