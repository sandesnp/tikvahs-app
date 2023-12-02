import React from 'react';
import Product from '../components/Product';
import Image1 from '../images/front-view-sweet-chocolate-cake.jpg';
import Image2 from '../images/assortment-pieces-cake.jpg';
import Image3 from '../images/banana-cake.jpeg';

export default function Menu() {
  const products = [
    {
      id: 0,
      name: 'BlueBerry',
      price: 24.99,
      description:
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatibus sit corporis blanditiis eligendi, non officiis praesentium nobis dolorad optio aut repellat explicabo incidunt deserunt eius id quo solutanisi unde.',
      image: Image1,
    },

    {
      id: 1,
      name: 'Raspberry',
      price: 23.99,
      description:
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatibus sit corporis blanditiis eligendi, non officiis praesentium nobis dolorad optio aut repellat explicabo incidunt deserunt eius id quo solutanisi unde.',
      image: Image2,
    },
    {
      id: 2,
      name: 'Banana',
      price: 27.99,
      description:
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatibus sit corporis blanditiis eligendi, non officiis praesentium nobis dolorad optio aut repellat explicabo incidunt deserunt eius id quo solutanisi unde.',
      image: Image3,
    },
  ];

  return (
    <header className='menu'>
      <h1 className='menu__title'>Menu</h1>
      <h2 className='menu__subheading'>Want to try some great cakes?</h2>
      <ul className='menu__list'>
        {products.map((product) => (
          <Product key={product.id} className='menu__item' product={product} />
        ))}
      </ul>
    </header>
  );
}
