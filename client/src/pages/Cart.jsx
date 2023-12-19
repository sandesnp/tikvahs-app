import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeItem, updateQuantity } from '../redux/cartSlice';

export default function Cart() {
  const Cart = useSelector((state) => state.Cart);
  const dispatch = useDispatch();
  const { items, totalAmount } = Cart;
  const handleRemove = (id) => {
    dispatch(removeItem(id));
  };
  const handleUpdate = (id, operation) => {
    dispatch(updateQuantity({ id, operation }));
  };
  return (
    <div className='cart-container'>
      <div className='cart-header'>
        <div>PRODUCT</div>
        <div>PRICE</div>
        <div>QUANTITY</div>
        <div>TOTAL</div>
        <div>REMOVE</div>
      </div>
      {items.length > 0 &&
        items.map((item) => (
          <div key={item._id} className='cart-item'>
            <div className='cart-item-details'>
              <img
                src={`${
                  window.location.host === 'localhost:3000'
                    ? '//localhost:5010'
                    : ''
                }/api/image/${item.imageUrl}`}
                alt='Product Name'
              />
              <h4>{item.name}</h4>
            </div>
            <p className='item-price'>${item.price} Aud</p>
            <div className='quantity-control'>
              <button
                onClick={() => {
                  handleUpdate(item._id, 'decrement');
                }}
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => {
                  handleUpdate(item._id, 'increment');
                }}
              >
                +
              </button>
            </div>
            <div className='item-quantity'>
              <p>${Math.round(item.quantity * item.price * 100) / 100}USD</p>
            </div>
            <button
              className='remove-button'
              onClick={() => handleRemove(item._id)}
            >
              Remove
            </button>
          </div>
        ))}
      <div className='cart-total'>
        <h3>Total: {totalAmount} USD</h3>
      </div>
      <button className='checkout-button'>Checkout</button>
    </div>
  );
}
