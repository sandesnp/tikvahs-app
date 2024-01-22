import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addItem } from '../redux/cartSlice'; // Import the action

export default function PageProduct() {
  const [product, setProduct] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const { productId } = useParams();
  const handleAddToCart = () => {
    dispatch(addItem({ ...product, quantity }));
  };
  useEffect(() => {
    axios.get(`/api/product/${productId}`).then((response) => {
      console.log(response.data);
      setProduct(response.data);
    });
  }, [productId]);
  return (
    <div className='pageproduct'>
      <figure className='pageproduct__image'>
        <img
          src={`${
            window.location.host === 'localhost:3000' ? '//localhost:5010' : ''
          }/api/image/${product.imageUrl}`}
          alt='tikvahs cake'
        />
      </figure>
      <div className='pageproduct__information'>
        <h1 className='pageproduct__name'>{product.name}</h1>
        <h1 className='pageproduct__price'>{product.category}</h1>
        <p className='pageproduct__price'>{product.price}</p>
        <p className='pageproduct__description'>{product.description}</p>
        <label htmlFor='quantity'>Quantity:</label>

        <div className='quantity-input'>
          <button
            className='decrement'
            onClick={() => setQuantity((prev) => prev && prev - 1)}
          >
            -
          </button>
          <input type='number' value={quantity} />
          <button
            className='increment'
            onClick={() => setQuantity((prev) => prev + 1)}
          >
            +
          </button>
        </div>
        <button
          className='button button__anim--white pageproduct__button'
          onClick={handleAddToCart}
        >
          Add
        </button>
      </div>
    </div>
  );
}
