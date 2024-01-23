const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Product Routes', () => {
  // Test for POST /api/product
  describe('POST /api/product', () => {
    it('should create a new product', (done) => {
      chai
        .request(app)
        .post('/api/product')
        .send({
          name: 'Test Product',
          description: 'This is a test product',
          price: 100,
          imageUrl: 'http://unsplash.it/200/200',
          category: 'Test Category',
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('name', 'Test Product');
          done();
        });
    });
  });

  // Test for GET /api/product
  describe('GET /api/product', () => {
    it('should retrieve all products', (done) => {
      chai
        .request(app)
        .get('/api/product')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          done();
        });
    });
  });

  // Test for DELETE /api/product
  //   describe('DELETE /api/product', () => {
  //     it('should delete all products', (done) => {
  //       chai
  //         .request(app)
  //         .delete('/api/product')
  //         .end((err, res) => {
  //           expect(err).to.be.null;
  //           expect(res).to.have.status(200);
  //           expect(res.body).to.have.property('message', 'All products deleted');
  //           done();
  //         });
  //     });
  //   });
});
