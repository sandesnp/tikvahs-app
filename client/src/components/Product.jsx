import React from 'react';
import { Link } from 'react-router-dom';

export default function Product({ className = '', product }) {
  const { _id, name, price, description, imageUrl } = product;
  return (
    <li className={`product + ${className}`}>
      <figure className='product__image'>
        <img
          src={`${
            window.location.host === 'localhost:3000' ? '//localhost:5010' : ''
          }/api/image/${imageUrl}`}
          alt='tikvahs Blueberry cake'
        />
      </figure>
      <div className='product__information'>
        <div className='product__upper-section'>
          <Link to={`/menu/${_id}`} className='product__name'>
            {name}
          </Link>
          <p className='product__price'>{price}</p>
        </div>
        <p className='product__description'>{description}</p>
      </div>
    </li>
  );
}
