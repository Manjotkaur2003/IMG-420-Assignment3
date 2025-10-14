import express from 'express';
import { pool } from '../db/pool.js';
import bcrypt from 'bcrypt';
const router = express.Router();

router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.post('/signup', async (req, res) => {
  const { user_id, password, name } = req.body;
  if (!user_id || !password || !name) {
    req.flash('error', 'All fields are required.');
    return res.redirect('/signup');
  }
  try {
    const existing = await pool.query('SELECT 1 FROM users WHERE user_id = $1', [user_id]);
    if (existing.rowCount > 0) {
      req.flash('error', 'User ID already taken. Choose another.');
      return res.redirect('/signup');
    }
    // Base requirement: store plaintext (password) to match instructions.
    // Bonus: also store bcrypt hash in password_hash (used if present).
    const password_hash = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO users (user_id, password, password_hash, name) VALUES ($1, $2, $3, $4)',
      [user_id, password, password_hash, name]
    );
    req.flash('success', 'Signup successful! Please sign in.');
    res.redirect('/signin');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error during signup.');
    res.redirect('/signup');
  }
});

router.get('/signin', (req, res) => {
  res.render('auth/signin');
});

router.post('/signin', async (req, res) => {
  const { user_id, password } = req.body;
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE user_id = $1', [user_id]);
    if (rows.length === 0) {
      req.flash('error', 'Invalid credentials.');
      return res.redirect('/signin');
    }
    const user = rows[0];
    const okPlain = user.password && user.password === password;
    let okHash = false;
    if (user.password_hash) {
      okHash = await bcrypt.compare(password, user.password_hash);
    }
    if (!okPlain && !okHash) {
      req.flash('error', 'Invalid credentials.');
      return res.redirect('/signin');
    }
    // set session
    req.session.user = { user_id: user.user_id, name: user.name };
    req.flash('success', `Welcome, ${user.name}!`);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error during sign in.');
    res.redirect('/signin');
  }
});

router.post('/signout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

export default router;
