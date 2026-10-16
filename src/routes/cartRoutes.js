import express from 'express';
import {
    addToCart,
    getCart,
    removeFromCart,
    updateCartQuantity,     
    clearCart
} from '../controllers/cartController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, addToCart);
router.get('/', authMiddleware, getCart);
router.delete('/:productId',authMiddleware,removeFromCart);
router.put('/:productId',authMiddleware, updateCartQuantity);
router.delete('/', authMiddleware, clearCart);

export default router;