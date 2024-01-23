const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Order Routes', () => {
  const testUser = {
    _id: { $oid: '65af72d0816cc6d034ad1cd0' },
    userType: 'normal',
    email: 'averagenp@gmail.com',
    payment: [],
    __v: { $numberInt: '0' },
    password: '$2a$10$y/QihFA7.NwBLVy4ansK1.EmHBA9yyt3ATjSGFyCPp6OUbVXAnh9y',
  };
  const testProduct = {
    _id: { $oid: '65af7226816cc6d034ad1cce' },
    name: 'Banana Cake',
    description:
      'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatibus sit corporis blanditiis eligendi, non officiis praesentium nobis dolorad optio aut repellat explicabo incidunt deserunt eius id quo solutanisi unde.',
    price: { $numberDouble: '25.99' },
    imageUrl: 'image-1705902243719.jpeg',
    __v: { $numberInt: '0' },
    category: 'Cake',
  };

  // Test for POST /api/order
  describe('POST /api/order', () => {
    it('should create a new order', (done) => {
      const newOrder = {
        user: testUser._id,
        orderDetails: [
          {
            product: testProduct._id,
            quantity: 2,
          },
        ],
        shippingAddress: {
          line1: '123 Test St',
          city: 'Testville',
          state: 'Test',
          postal_code: '12345',
          country: 'Testland',
        },
      };

      chai
        .request(app)
        .post('/api/order')
        .send(newOrder)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('_id');
          done();
        });
    });
  });

  // Test for GET /api/order
  describe('GET /api/order', () => {
    it('should retrieve all orders', (done) => {
      chai
        .request(app)
        .get('/api/order')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          done();
        });
    });
  });
});
