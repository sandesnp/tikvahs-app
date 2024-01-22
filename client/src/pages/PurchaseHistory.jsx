import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Table } from 'reactstrap';
import moment from 'moment';
import axios from 'axios';

export default function PurchaseHistory() {
  const OrderTable = ({ orders }) => {
    return (
      <Table hover responsive>
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
                <a href={`/order/${order.orderId}`}>{order.totalItems} items</a>
              </td>
              <td>{order.totalQuantity}</td>
              <td>{order.paymentStatus ? 'Made' : 'Due'}</td>
              <td>{order.orderStatus ? 'Fulfilled' : 'Pending fulfillment'}</td>
              <td>{moment(order.timestamp).format('MM/DD/YYYY hh:mm A')}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  const [orders, setOrders] = useState([]);
  const USER = useSelector((state) => state.User);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/api/order/my-purchase');
        console.log(response.data);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    if (USER.isLoggedIn) {
      fetchOrders();
    }
  }, [USER.isLoggedIn]);

  if (!USER.isLoggedIn) {
    return <Navigate to='/login' replace={true} />;
  }

  return (
    <div className='container mt-5'>
      <OrderTable orders={orders} />
    </div>
  );
}
