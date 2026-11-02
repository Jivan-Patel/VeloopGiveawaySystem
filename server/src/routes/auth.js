import { Router } from 'express';
import { signup, login } from '../services/authService.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { User } from '../models/User.js';
import { Wallet } from '../models/Wallet.js';

const router = Router();

router.post('/signup', async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        code: 'VALIDATION_ERROR',
        message: 'Email and password are required.'
      });
    }

    const result = await signup({ email, password, role });
    res.status(201).json({
      status: 'success',
      data: result
    });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        code: 'VALIDATION_ERROR',
        message: 'Email and password are required.'
      });
    }

    const result = await login({ email, password });
    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (err) {
    next(err);
  }
});

router.get('/me', authMiddleware, async (req, res, next) => {
  try {
    const user = await User.findOne({ userId: req.user.userId }).lean();
    if (!user) {
      return res.status(404).json({
        code: 'USER_NOT_FOUND',
        message: 'User account not found.'
      });
    }

    const wallet = (await Wallet.findOne({ userId: req.user.userId }).lean()) || {
      ves: 0,
      sves: 0,
      tokens: 0
    };

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          userId: user.userId,
          email: user.email,
          role: user.role,
          status: user.status
        },
        wallet: {
          ves: wallet.ves,
          sves: wallet.sves,
          tokens: wallet.tokens
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

export default router;
