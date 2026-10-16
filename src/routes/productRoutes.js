import express from 'express';

import {
  createProduct,
  getProducts,
  getProductById, 
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import upload from '../middleware/uploadMiddleware.js';

import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);

router.post('/', authMiddleware, adminMiddleware,   upload.single('image'), createProduct);
router.put('/:id', authMiddleware, adminMiddleware, upload.single('image'), updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct);

export default router;