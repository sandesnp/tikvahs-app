import React from 'react';
import { Container, Row, Col, Button, Card, CardBody } from 'reactstrap';
import { useLocation } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const OrderConfirmation = () => {
  let query = useQuery();
  let email = query.get('email');

  return (
    <Container
      className='d-flex justify-content-center align-items-center'
      style={{ minHeight: '100vh' }}
    >
      <Row>
        <Col lg='6' md='8' sm='10' xs='12'>
          <Card className='text-center'>
            <CardBody>
              <div className='mb-4'>
                {/* You can replace this with an SVG or an image */}
                <div className='text-success' style={{ fontSize: '2.5rem' }}>
                  <i className='fas fa-check-circle'></i>
                </div>
              </div>
              <h2>Hey {email}</h2>
              <h3 className='text-success'>Your Order is Confirmed!</h3>
              <p>
                We'll send you a shipping confirmation email as soon as your
                order ships.
              </p>
              <Button color='pink' className='mt-4'>
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
