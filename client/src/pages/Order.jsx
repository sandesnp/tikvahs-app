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
  ListGroup,
  ListGroupItem,
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
    <Container className='order'>
      <div className='order__main-container'>
        <div className='order__heading'>
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
        </div>
        <div className='order__left-section'>
          <Card>
            <ListGroup>
              <CardTitle tag='h5'>Order summary</CardTitle>
              {order.orderDetails.map((item, index) => (
                <ListGroupItem key={index}>
                  <div className='order__product'>
                    <figure>
                      <img
                        src={`${
                          window.location.host === 'localhost:3000'
                            ? '//localhost:5010'
                            : ''
                        }/api/image/${item.product.imageUrl}`}
                        alt='tikvahs '
                      />
                    </figure>

                    <h1>{item.product.name}</h1>
                    <h2>Qty: {item.quantity}</h2>

                    <h3>${item.product.price}</h3>
                  </div>
                </ListGroupItem>
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
            </ListGroup>
          </Card>
        </div>
        <div className='order__right-section'>
          <Card>
            <CardBody>
              <CardTitle tag='h5'>{USER.data.email}</CardTitle>
              <CardText>{order.user.name}</CardText>
              <CardText>{order.user.email}</CardText>
              <CardText>{formatAddress(order.shippingAddress)}</CardText>
            </CardBody>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default OrderSummary;
