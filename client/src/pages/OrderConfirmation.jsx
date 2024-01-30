import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card, CardBody } from 'reactstrap';
import { useLocation } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const OrderConfirmation = () => {
  const USER = useSelector((state) => state.User);
  const query = useQuery();
  const email = query.get('email');
  const orderId = query.get('orderId');

  if (USER.data.email !== email) {
    return <Navigate to='/' replace={true} />;
  }

  if (!USER.isLoggedIn) {
    return <Navigate to='/user/login' replace={true} />;
  }

  return (
    <Container className='d-flex justify-content-center align-items-center'>
      <Row>
        <Col>
          <Card className='order-confirmation-card text-center'>
            <CardBody>
              <div className='mb-4 order-confirmation-icon'>
                {/* You can replace this with an SVG or an image */}
                <i className='fas fa-check-circle'></i>
              </div>
              <h2 className='order-confirmation-heading'>Hey {email}</h2>
              <h3 className='text-success'>Your Order is Confirmed!</h3>
              <p className='order-confirmation-message'>
                Thank you for your order from our bakery! We're currently
                preparing your delicious baked goods with care.
              </p>
              <Button
                tag='a'
                href={`/order/${orderId}`}
                color='primary'
                className='mt-4 order-confirmation-button'
              >
                Check Status
              </Button>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderConfirmation;
