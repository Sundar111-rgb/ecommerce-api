import express from 'express';
import {
    createOrder,
    getOrders,
    getOrderById,
    cancelOrder,
    updateOrderStatus,
    getAllOrders,
    updatePaymentStatus
} from '../controllers/orderController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createOrder);
router.get('/', authMiddleware, getOrders);
router.get('/:orderId',authMiddleware,getOrderById);

router.patch(
    '/:orderId/cancel',
    authMiddleware,
    cancelOrder,
);

router.patch(
    '/:orderId/status',
    authMiddleware,
    adminMiddleware,
    updateOrderStatus,
);

router.get(
  '/admin/all',
  authMiddleware,
  adminMiddleware,
  getAllOrders,
);

router.patch(
  '/:orderId/payment-status',
  authMiddleware,
  adminMiddleware,
  updatePaymentStatus,
);

export default router;