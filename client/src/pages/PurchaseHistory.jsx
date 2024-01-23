import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Table, Spinner } from 'reactstrap';
import moment from 'moment';
import axios from 'axios';

export default function PurchaseHistory() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // New state for loading status
  const USER = useSelector((state) => state.User);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true); // Start loading
      try {
        const response = await axios.get('/api/order/my-purchase');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
      setIsLoading(false); // Stop loading
    };

    if (USER.isLoggedIn) {
      fetchOrders();
    }
  }, [USER.isLoggedIn]);

  const OrderTable = ({ orders, isLoading }) => {
    if (isLoading) {
      return (
        <div className='text-center'>
          <Spinner color='primary' style={{ width: '3rem', height: '3rem' }} />{' '}
          {/* Adjusted for better visual */}
        </div>
      );
    } else if (orders.length === 0) {
      return (
        <div className='text-center'>
          <p>There are no orders made as of now.</p>
        </div>
      );
    } else {
      return (
        <Table hover responsive className='table'>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Total Items</th>
              <th>Total Quantity</th>
              <th>Payment Made</th>
              <th>Order Status</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.orderId}>
                <td>{order.orderId}</td>
                <td>
                  <a href={`/order/${order.orderId}`}>
                    {order.totalItems} items
                  </a>
                </td>
                <td>{order.totalQuantity}</td>
                <td>{order.paymentStatus ? 'Made' : 'Due'}</td>
                <td>
                  {order.orderStatus ? 'Fulfilled' : 'Pending fulfillment'}
                </td>
                <td>{moment(order.timestamp).format('MM/DD/YYYY hh:mm A')}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      );
    }
  };

  if (!USER.isLoggedIn) {
    return <Navigate to='/login' replace={true} />;
  }

  return (
    <div className='container mt-5'>
      <OrderTable orders={orders} isLoading={isLoading} />
    </div>
  );
}
