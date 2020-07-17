const express = require('express');
const stripe = require('stripe')('pk_test_51H35S2AynYEVSQm64YFHx8sCBRWpdMCteKVW66pQZyK5yq9UG1SWSr9uPQgV1TXeGu5f6BUzY5CFEt3sJj9b0vrO00YFHXHVTT'); // stripe needs configuration
const { v4: uuidv4} = require('uuid');

const cors = require('cors');


const app = express();


// inject middlewares
app.use(express.json());
app.use(cors());

// routes
app.get('/', (req, res) => {
  res.send('hello World');
});

// payment route
app.post('/payment', (req, res) => {
  const { product, token } = req.body;
  console.log('PRODUCT', product);
  console.log('PRICE', product.price);
  const idempontencyKey = uuid();

  return stripe.customers.create({
    email: token.email,
    source: token.id,
  }).then(customer => {
    stripe.charges.create({
      amount: product.price * 100,
      currency: 'usd',
      customer: customer.id,
      receipt_email: token.email,
      description: `purchase of: ${product.name}`
      })
    }, { idempotencyKey })

  })
    .then(result => res.status(200).json(result))
    .catch(err => console.log(err));
});

// listen
app.listen(3000, () => console.log('Listening at PORT: 3000'));

