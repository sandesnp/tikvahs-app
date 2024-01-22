import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import tw from 'twin.macro';
import styled from 'styled-components';
import { css } from 'styled-components/macro'; //eslint-disable-line
import { Container, ContentWithPaddingXl } from './Layouts.js';
import { SectionHeading } from './Headings.js';
import { PrimaryButton as PrimaryButtonBase } from './Buttons.js';
import { ReactComponent as SvgDecoratorBlob1 } from '../images/svg-decorator-blob-5.svg';
import { ReactComponent as SvgDecoratorBlob2 } from '../images/svg-decorator-blob-7.svg';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Spinner } from 'reactstrap';

const HeaderRow = tw.div`flex justify-between items-center flex-col xl:flex-row`;
const Header = tw(SectionHeading)``;
const TabsControl = tw.div`flex flex-wrap bg-gray-200 px-2 py-2 rounded leading-none mt-12 xl:mt-0`;

const TabControl = styled.div`
  ${tw`cursor-pointer px-6 py-3 mt-2 sm:mt-0 sm:mr-2 last:mr-0 text-gray-600 font-medium rounded-sm transition duration-300 text-sm sm:text-base w-1/2 sm:w-auto text-center`}
  &:hover {
    ${tw`bg-gray-300 text-gray-700`}
  }
  ${(props) => props.active && tw`bg-primary-500! text-gray-100!`}
  }
`;

const TabContent = tw(
  motion.div
)`mt-6 flex flex-wrap sm:-mr-10 md:-mr-6 lg:-mr-12`;
const CardContainer = tw.div`mt-10 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 sm:pr-10 md:pr-6 lg:pr-12`;
const Card = tw(
  motion(Link)
)`bg-gray-200 rounded-b block max-w-xs mx-auto sm:max-w-none sm:mx-0`;
const CardImageContainer = styled.div`
  ${(props) =>
    css`
      background-image: url('${props.imageSrc}');
    `}
  ${tw`h-56 xl:h-64 bg-center bg-cover relative rounded-t`}
`;

const CardHoverOverlay = styled(motion.div)`
  background-color: rgba(255, 255, 255, 0.5);
  ${tw`absolute inset-0 flex justify-center items-center`}
`;
const CardButton = tw(PrimaryButtonBase)`text-sm`;

const CardText = tw.div`p-4 text-gray-900`;
const CardTitle = tw.h5`text-lg font-semibold group-hover:text-primary-500`;
const CardContent = tw.p`mt-1 text-sm font-medium text-gray-600`;
const CardPrice = tw.p`mt-4 text-xl font-bold`;

const DecoratorBlob1 = styled(SvgDecoratorBlob1)`
  ${tw`pointer-events-none -z-20 absolute right-0 top-0 h-64 w-64 opacity-15 transform translate-x-2/3 -translate-y-12 text-pink-400`}
`;
const DecoratorBlob2 = styled(SvgDecoratorBlob2)`
  ${tw`pointer-events-none -z-20 absolute left-0 bottom-0 h-80 w-80 opacity-15 transform -translate-x-2/3 text-primary-500`}
`;

export default ({ heading = 'Checkout the Menu' }) => {
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/product/category');
        const fetchedCategories = response.data;
        setCategories(fetchedCategories);

        // Pick a random category to display initially
        if (fetchedCategories.length > 0) {
          const randomCategory =
            fetchedCategories[
              Math.floor(Math.random() * fetchedCategories.length)
            ];
          setActiveTab(randomCategory);
          fetchProductsForCategory(randomCategory);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const fetchProductsForCategory = async (categoryName) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/product/category/${categoryName}`);
      setProducts(response.data);
    } catch (error) {
      console.error(
        `Error fetching products for category ${categoryName}:`,
        error
      );
    }
    setIsLoading(false);
  };
  const handleCategoryClick = (categoryName) => {
    if (categoryName !== activeTab) {
      setActiveTab(categoryName);
      fetchProductsForCategory(categoryName);
    }
  };
  return (
    <Container>
      <ContentWithPaddingXl>
        <HeaderRow>
          <Header>{heading}</Header>
          <TabsControl>
            {categories.map((category, index) => (
              <TabControl
                key={index}
                active={activeTab === category}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </TabControl>
            ))}
          </TabsControl>
        </HeaderRow>

        {isLoading ? (
          <Spinner color='success'>Loading...</Spinner>
        ) : (
          <TabContent
            variants={{
              current: {
                opacity: 1,
                scale: 1,
                display: 'flex',
              },
              hidden: {
                opacity: 0,
                scale: 0.8,
                display: 'none',
              },
            }}
            transition={{ duration: 0.4 }}
            initial='hidden'
            animate='current'
          >
            {products.map((card, index) => (
              <CardContainer key={index}>
                <Card
                  className='group'
                  to={`/menu/${card._id}`}
                  initial='rest'
                  whileHover='hover'
                  animate='rest'
                >
                  <CardImageContainer
                    imageSrc={`${
                      window.location.host === 'localhost:3000'
                        ? '//localhost:5010'
                        : ''
                    }/api/image/${card.imageUrl}`}
                  >
                    <CardHoverOverlay
                      variants={{
                        hover: {
                          opacity: 1,
                          height: 'auto',
                        },
                        rest: {
                          opacity: 0,
                          height: 0,
                        },
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <CardButton>Buy</CardButton>
                    </CardHoverOverlay>
                  </CardImageContainer>
                  <CardText>
                    <CardTitle>{card.name}</CardTitle>
                    <CardContent>{card.description}</CardContent>
                    <CardPrice>{card.price}</CardPrice>
                  </CardText>
                </Card>
              </CardContainer>
            ))}
          </TabContent>
        )}
      </ContentWithPaddingXl>
      <DecoratorBlob1 />
      <DecoratorBlob2 />
    </Container>
  );
};
