import express from 'express';
import UserModel from '../../models/user.js';
const router = express.Router();

router.get('/users', async (req, res) => {
  try {
    const users = await UserModel.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

// PATCH update user role (Admin only)
router.patch('/users/:userId/role', async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    // Prevent last admin from being demoted
    const adminCount = await UserModel.countDocuments({ role: 'admin' });
    if (adminCount <= 1 && role === 'user') {
      return res.status(400).json({ message: 'Cannot demote the last admin' });
    }

    const user = await UserModel.findByIdAndUpdate(
      userId, 
      { role }, 
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating user role' });
  }
});

// DELETE user (Admin only)
router.delete('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Prevent deleting last admin
    const adminCount = await UserModel.countDocuments({ role: 'admin' });
    if (adminCount <= 1) {
      return res.status(400).json({ message: 'Cannot delete the last admin' });
    }

    const user = await UserModel.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting user' });
  }
});

export default router;