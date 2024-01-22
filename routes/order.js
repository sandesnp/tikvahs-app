const express = require('express');
const route = express.Router();
const PRODUCT = require('../models/product');
const ORDER = require('../models/order');
const queryString = require('querystring');
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
const { checkAuthenticated } = require('./auth-middleware');

// POST - Create a new order
route.post('/', async (req, res) => {
  try {
    const newOrder = new ORDER(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET - Retrieve all orders
route.get('/', async (req, res) => {
  try {
    const orders = await ORDER.find()
      .populate('orderDetails.product', [
        'name',
        'description',
        'price',
        'imageUrl',
      ])
      .populate('deliveryPerson', ['email', 'userType']);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

route.get('/success', async (req, res) => {
  try {
    // Retrieve the Stripe session using the session ID
    const session = await stripe.checkout.sessions.retrieve(
      req.query.session_id
    );

    const shippingDetails = session.shipping_details;
    // Parse the query parameters
    const items = JSON.parse(req.query.items);

    // Create order details from the items
    const orderDetails = items.map((item) => ({
      product: item.id,
      quantity: item.quantity,
    }));

    // Create a new Order document
    const newOrder = new ORDER({
      user: req.user._id,
      orderDetails: orderDetails,
      orderStatus: false,
      shippingAddress: shippingDetails.address,
      paymentStatus: true,
    });

    // Save the order
    const savedOrder = await newOrder.save();

    // Redirect or respond as needed
    res.redirect(
      `${process.env.CLIENT_LINK}/order/success?email=${req.user.email}&orderId=${savedOrder._id}`
    ); // Adjust the redirect as necessary
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

route.get('/cancel', (req, res) => {
  res.redirect(process.env.CLIENT_LINK + '/');
});
route.post(
  '/create-checkout-session',
  checkAuthenticated,
  async (req, res, next) => {
    // Assuming req.user is set by PassportJS after successful authentication
    const user = req.user || { email: 'default_email@example.com' }; // Fallback for testing

    const frontendItems = req.body.items; // Items sent from frontend

    try {
      const itemLists = await Promise.all(
        frontendItems.map(async (item) => {
          const product = await PRODUCT.findById(item.id);
          if (!product) {
            throw new Error(`Product with ID ${item.id} not found`);
          }

          // Convert price to cents if stored in a different format in MongoDB
          const priceInCents = parseInt(product.price * 100);

          return {
            price_data: {
              currency: 'aud', // Assuming all products use the same currency
              product_data: {
                name: product.name,
                description: product.description,
              },
              unit_amount: priceInCents,
            },
            quantity: item.quantity,
          };
        })
      );

      // Inside the Stripe checkout session creation logic
      const queryData = queryString.stringify({
        items: JSON.stringify(
          frontendItems.map((item) => ({
            id: item.id,
            quantity: item.quantity,
          }))
        ),
      });
      //In cloud service we use env variable to let stripe know return location.
      const successUrl = `${process.env.SERVER_LINK}/api/order/success?session_id={CHECKOUT_SESSION_ID}&${queryData}`;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        customer_email: user.email, // Email from authenticated user
        line_items: itemLists,
        shipping_address_collection: {
          allowed_countries: ['AU'], // Modify as per your requirement
        },
        success_url: successUrl,
        cancel_url: `${process.env.SERVER_LINK}/api/order/cancel`,
      });

      res.json({ success: true, url: session.url });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  }
);

// GET - Retrieve all orders for the logged-in user with details
route.get('/my-purchase', checkAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id; // Assuming req.user is populated by Passport after login

    const orders = await ORDER.find({ user: userId }).lean(); // Use lean() for performance if you only need plain objects

    // Transform the orders to include total items and total quantity
    const transformedOrders = orders.map((order) => {
      const totalItems = order.orderDetails.length;
      const totalQuantity = order.orderDetails.reduce(
        (acc, item) => acc + item.quantity,
        0
      );
      return {
        orderId: order._id,
        totalItems,
        totalQuantity,
        timestamp: order.createdAt, // Assuming createdAt is a field added by timestamps in your schema
        orderStatus: order.orderStatus, // Assuming this is a string that reflects the current delivery status
      };
    });

    res.json(transformedOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET - Retrieve a single order by ID
route.get('/:id', async (req, res) => {
  try {
    const order = await ORDER.findById(req.params.id).populate(
      'orderDetails.product',
      ['name', 'description', 'price', 'imageUrl']
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH or PUT - Update an existing order
route.patch('/:id', async (req, res) => {
  try {
    const updatedOrder = await ORDER.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE - Delete an order
route.delete('/:id', async (req, res) => {
  try {
    const deletedOrder = await ORDER.findByIdAndDelete(req.params.id);
    if (!deletedOrder)
      return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = route;
