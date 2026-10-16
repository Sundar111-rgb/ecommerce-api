import express from 'express';

import {
  addUser,
  changePassword,
  deleteUser,
  getUsers,
  updateUserRole,
  updateProfile
} from '../controllers/userController.js';

import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
import userUpload from '../middleware/userUpload.js';

const router = express.Router();

router.patch(
  '/:userId/role',
  authMiddleware,
  adminMiddleware,
  updateUserRole,
);

router.get(
  '/',
  authMiddleware,
  adminMiddleware,
  getUsers,
);

router.delete(
  '/:userId',
  authMiddleware,
  adminMiddleware,
  deleteUser,
);

router.put('/change-password',
  authMiddleware,
  changePassword
);

router.post('/addUser',
  authMiddleware,
  adminMiddleware,
  addUser
)

router.put(
  '/profile',
  authMiddleware,
  userUpload.single('profileImage'),
  updateProfile,
);

export default router;