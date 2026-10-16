import User from '../models/User.js';

import bcrypt from 'bcryptjs';

export const changePassword = async (req, res) => {
  try {
    const {currentPassword, newPassword} = req.body;

    // 1. Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: 'Current password and new password are required',
      });
    }

    // 2. Find logged-in user
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    // 3. Check current password
    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isMatch) {
      return res.status(401).json({
        message: 'Current password is incorrect',
      });
    }

    // 4. Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 5. Update password
    user.password = hashedPassword;

    // 6. Record password change time
    user.passwordChangedAt = new Date();

    await user.save();

    res.status(200).json({
      message: 'Password changed successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};

export const updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        const allowedRoles = ['user', 'admin'];

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                message: 'Invalid role',
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        if (user._id.toString() === req.user.id && role !== 'admin') {
            return res.status(400).json({
                message: 'Admin cannot remove their own admin role',
            });
        }

        user.role = role;

        await user.save();

        res.status(200).json({
            message: 'User role updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId === req.user.id) {
      return res.status(400).json({
        message: 'Admin cannot delete their own account',
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    await User.findByIdAndDelete(userId);

   // 3. Delete associated image from uploads folder
        if (user.image) {
          const imagePath = path.join(process.cwd(), user.image);
           console.log(imagePath);
           
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        }

    res.status(200).json({
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const addUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // 1. Check required fields
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, password and role are required',
            });
        }

        // 2. Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User already exists',
            });
        }

        // 3. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        // 5. Send response
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateProfile = async (req, res) => {
  console.log("Update Profile");
  
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const {name, phone, address} = req.body;

    if (name !== undefined) {
      user.name = name;
    }

    if (phone !== undefined) {
      user.phone = phone;
    }

    if (address !== undefined) {
      user.address = address;
    }

    if (req.file) {
      user.profileImage = `/uploads/${req.file.filename}`;
    }

  //  3. Delete associated image from uploads folder
        if (user.image) {
          const profileImagePath = path.join(process.cwd(), user.image);
           console.log(profileImagePath);
           
          if (fs.existsSync(profileImagePath)) {
            fs.unlinkSync(profileImagePath);
          }
        }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
    });
  }
};