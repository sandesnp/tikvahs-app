import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { removeItem, updateQuantity, checkoutCart } from '../redux/cartSlice';

export default function Cart() {
  const Cart = useSelector((state) => state.Cart);
  const USER = useSelector((state) => state.User);

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { items, totalAmount } = Cart;
  const handleRemove = (id) => {
    dispatch(removeItem(id));
  };
  const handleUpdate = (id, operation) => {
    dispatch(updateQuantity({ id, operation }));
  };

  const handleCheckout = () => {
    if (!USER.isLoggedIn) {
      return navigate('/user/login');
    }
    dispatch(checkoutCart())
      .then((action) => {
        if (action) {
          const url = action.payload;
          window.location.href = url; // Redirect to Stripe checkout
        }
      })
      .catch((error) => {
        console.error('Checkout failed:', error);
      });
  };
  if (Cart.totalQuantity < 1) {
    return <Navigate to='/' replace={true} />;
  }

  return (
    <div className='cart-container'>
      <h1 className='cart-header'>My Cart</h1>
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
              <p>${Math.round(item.quantity * item.price * 100) / 100}</p>
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
        <h3>Total: ${totalAmount}</h3>
      </div>
      <button className='checkout-button' onClick={handleCheckout}>
        Checkout
      </button>
    </div>
  );
}
