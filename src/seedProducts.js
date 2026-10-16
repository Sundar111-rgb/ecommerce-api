import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config({ path: '../.env' });

const products = [
  {
    name: 'iPhone 15',
    price: 50000,
    description: 'Apple smartphone',
    category: 'Electronics',
    image: '/uploads/iphone15.jpg',
  },
  {
    name: 'Samsung Galaxy S24',
    price: 60000,
    description: 'Samsung flagship smartphone',
    category: 'Electronics',
    image: '/uploads/iphone15.jpg',
  },
  {
    name: 'OnePlus 12',
    price: 55000,
    description: 'OnePlus smartphone',
    category: 'Electronics',
    image: '/uploads/iphone15.jpg',
  },
  {
    name: 'Google Pixel 9',
    price: 65000,
    description: 'Google Pixel smartphone',
    category: 'Electronics',
    image: '/uploads/iphone15.jpg',
  },
  {
    name: 'MacBook Air M4',
    price: 100000,
    description: 'Apple laptop',
    category: 'Laptops',
    image: '/uploads/iphone15.jpg',
  },
  {
    name: 'Dell Inspiron',
    price: 70000,
    description: 'Dell laptop',
    category: 'Laptops',
    image: '/uploads/iphone15.jpg',
  },
  {
    name: 'HP Pavilion',
    price: 60000,
    description: 'HP laptop',
    category: 'Laptops',
    image: '/uploads/iphone15.jpg',
  },
  {
    name: 'Sony Headphones',
    price: 15000,
    description: 'Wireless headphones',
    category: 'Audio',
    image: '/uploads/iphone15.jpg',
  },
  {
    name: 'Apple AirPods',
    price: 20000,
    description: 'Wireless earbuds',
    category: 'Audio',
    image: '/uploads/iphone15.jpg',
  },
  {
    name: 'Samsung Galaxy Buds',
    price: 10000,
    description: 'Wireless earbuds',
    category: 'Audio',
    image: '/uploads/iphone15.jpg',
  },
  {
    name: 'Logitech Mouse',
    price: 3000,
    description: 'Wireless mouse',
    category: 'Accessories',
    image: '/uploads/iphone15.jpg',
  },
  {
    name: 'Mechanical Keyboard',
    price: 5000,
    description: 'Mechanical keyboard',
    category: 'Accessories',
    image: '/uploads/iphone15.jpg',
  },
  {
    name: 'Dell Monitor',
    price: 25000,
    description: '27 inch monitor',
    category: 'Accessories',
    image: '/uploads/iphone15.jpg',
  },
  {
    name: 'Sony Camera',
    price: 80000,
    description: 'Digital camera',
    category: 'Cameras',
    image: '/uploads/iphone15.jpg',
  },
  {
    name: 'JBL Speaker',
    price: 8000,
    description: 'Bluetooth speaker',
    category: 'Audio',
    image: '/uploads/iphone15.jpg',
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log('MongoDB connected');

    await Product.deleteMany();

    await Product.insertMany(products);

    console.log(`${products.length} products inserted successfully`);

    await mongoose.disconnect();

    console.log('MongoDB disconnected');
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedProducts();