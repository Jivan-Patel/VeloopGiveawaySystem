import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Wallet } from '../models/Wallet.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret-replace-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Generates next sequential or timestamped user ID in format VE10025.
 */
export async function generateUserId() {
  const count = await User.countDocuments();
  return `VE${10000 + count + 1}`;
}

/**
 * Registers a new user and provisions their associated multi-currency wallet.
 */
export async function signup({ email, password, role = 'USER', initialWallet = { ves: 2500, sves: 1000, tokens: 5000 } }) {
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    const error = new Error('Email already registered');
    error.statusCode = 409;
    error.code = 'EMAIL_EXISTS';
    throw error;
  }

  const userId = await generateUserId();
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    userId,
    email: email.toLowerCase(),
    passwordHash,
    role,
    status: 'ACTIVE'
  });

  const wallet = await Wallet.create({
    userId,
    ves: initialWallet.ves || 0,
    sves: initialWallet.sves || 0,
    tokens: initialWallet.tokens || 0
  });

  const token = jwt.sign(
    { userId: user.userId, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return {
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
    },
    token
  };
}

/**
 * Authenticates user credentials and issues a signed JWT.
 */
export async function login({ email, password }) {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  const wallet = (await Wallet.findOne({ userId: user.userId })) || {
    ves: 0,
    sves: 0,
    tokens: 0
  };

  const token = jwt.sign(
    { userId: user.userId, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return {
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
    },
    token
  };
}

/**
 * Validates a JWT string and returns the decoded payload.
 */
export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}
