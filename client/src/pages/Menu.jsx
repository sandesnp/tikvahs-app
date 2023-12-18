import React, { useState, useEffect } from 'react';

import Product from '../components/Product';
import axios from 'axios';

export default function Menu() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get(`/api/product/`).then((response) => {
      setProducts(response.data);
    });
  }, []);

  return (
    <header className='menu'>
      <h1 className='menu__title'>Menu</h1>
      <h2 className='menu__subheading'>Want to try some great cakes?</h2>
      <ul className='menu__list'>
        {products.map((product) => (
          <Product key={product._id} className='menu__item' product={product} />
        ))}
      </ul>
    </header>
  );
}
