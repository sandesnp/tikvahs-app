import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';
import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  Row,
  Col,
  Container,
} from 'reactstrap';
import axios from 'axios';

const OrderSummary = () => {
  const USER = useSelector((state) => state.User);
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!order) {
      axios
        .get(`/api/order/${orderId}`)
        .then((response) => {
          console.log(response.data);
          setOrder(response.data);
        })
        .catch((error) => {
          console.error('Error fetching order:', error);
          // Handle error, possibly set some state to show an error message
        });
    }
  }, [orderId, order]);

  if (!USER.isLoggedIn) {
    return <Navigate to='/user/login' replace />;
  }

  if (!order) {
    return <div>Loading...</div>; // Or some other loading state representation
  }

  // Calculate subtotal, tax, and total if necessary
  // This is placeholder logic; you will need to replace it with your actual logic
  const Total = order.orderDetails.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  // Format the address into a single string
  const formatAddress = (address) => {
    if (!address) return 'No address provided';
    return `${address.line1}${address.line2 ? ', ' + address.line2 : ''}, ${
      address.city
    }, ${address.state}, ${address.postal_code}, ${address.country}`;
  };

  return (
    <Container>
      <Row className='my-5'>
        <Col sm='12' md='8'>
          <h3>
            #{order._id}{' '}
            <span className='text-muted'>
              {order.orderStatus ? 'Fulfilled' : 'Pending fulfillment'}
            </span>
          </h3>
          <p>
            {new Date(order.createdAt).toLocaleString()}{' '}
            {order.orderDetails.length} item(s)
          </p>
          <Card>
            <CardBody>
              <CardTitle tag='h5'>Order summary</CardTitle>
              {order.orderDetails.map((item, index) => (
                <Row key={index}>
                  <Col xs='3'>
                    {/* Placeholder for product image */}
                    <img
                      style={{
                        backgroundColor: '#EEE',
                        width: '100%',
                        height: '100px',
                      }}
                      src={`${
                        window.location.host === 'localhost:3000'
                          ? '//localhost:5010'
                          : ''
                      }/api/image/${item.product.imageUrl}`}
                      alt='tikvahs '
                    />
                  </Col>
                  <Row xs='9'>
                    <CardText>{item.product.name}</CardText>
                    <CardText>Qty: {item.quantity}</CardText>

                    <CardText>£{item.product.price}</CardText>
                  </Row>
                </Row>
              ))}
              <hr />

              <Row>
                <Col>
                  <CardText>
                    <strong>Total</strong>
                  </CardText>
                </Col>
                <Col>
                  <CardText className='text-right'>
                    <strong>£{Total}</strong>
                  </CardText>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
        <Col sm='12' md='4'>
          <Card>
            <CardBody>
              <CardTitle tag='h5'>Customer</CardTitle>
              <CardText>Contact</CardText>
              <CardText>{order.user.name}</CardText>
              <CardText>{order.user.email}</CardText>
              <CardText>{formatAddress(order.shippingAddress)}</CardText>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderSummary;
