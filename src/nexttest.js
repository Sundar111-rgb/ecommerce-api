import express from 'express';

const app = express();

const firstMiddleware = (req, res, next) => {
  console.log('1. First middleware');

  next();
};

const secondMiddleware = (req, res, next) => {
  console.log('2. Second middleware');

  next();
};

const controller = (req, res) => {
  console.log('3. Controller');

  res.json({
    message: 'Request completed',
  });
};

app.get(
  '/test',
  firstMiddleware,
  secondMiddleware,
  controller,
);

app.listen(5000, () => {
  console.log('Server running on 5000');
});