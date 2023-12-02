import React from 'react';

export default function Product({ className = '', product }) {
  const { name, price, description, image } = product;
  return (
    <li className={`product + ${className}`}>
      <figure className='product__image'>
        <img src={image} alt='tikvahs Blueberry cake' />
      </figure>
      <div className='product__information'>
        <div className='product__upper-section'>
          <a href={`/menu/${name}`} className='product__name'>
            {name}
          </a>
          <p className='product__price'>{price}</p>
        </div>
        <p className='product__description'>{description}</p>
      </div>
    </li>
  );
}
