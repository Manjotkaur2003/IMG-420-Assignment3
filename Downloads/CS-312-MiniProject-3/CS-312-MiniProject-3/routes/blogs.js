import express from 'express';
import { pool } from '../db/pool.js';
import { ensureAuth } from '../middleware/auth.js';

const router = express.Router();

// New post form
router.get('/new', ensureAuth, (req, res) => {
  res.render('new');
});

// Create
router.post('/', ensureAuth, async (req, res) => {
  const { title, body } = req.body;
  if (!title || !body) {
    req.flash('error', 'Title and body are required.');
    return res.redirect('/posts/new');
  }
  try {
    await pool.query(
      `INSERT INTO blogs (creator_user_id, title, body, date_created)
       VALUES ($1, $2, $3, NOW())`,
      [req.session.user.user_id, title, body]
    );
    req.flash('success', 'Post created!');
    res.redirect('/');
  } catch (e) {
    console.error(e);
    req.flash('error', 'Failed to create post.');
    res.redirect('/posts/new');
  }
});

// View single post
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT b.*, u.name as creator_name
       FROM blogs b JOIN users u ON u.user_id = b.creator_user_id
       WHERE blog_id = $1`, [req.params.id]);
    if (rows.length === 0) return res.status(404).render('404');
    const post = rows[0];
    res.render('show', { post });
  } catch (e) {
    console.error(e);
    res.status(500).send('Error fetching post.');
  }
});

// Edit form
router.get('/:id/edit', ensureAuth, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM blogs WHERE blog_id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).render('404');
    const post = rows[0];
    if (post.creator_user_id !== req.session.user.user_id) {
      req.flash('error', 'You can only edit your own posts.');
      return res.redirect(`/posts/${post.blog_id}`);
    }
    res.render('edit', { post });
  } catch (e) {
    console.error(e);
    res.status(500).send('Error loading edit form.');
  }
});

// Update
router.put('/:id', ensureAuth, async (req, res) => {
  const { title, body } = req.body;
  try {
    // Ensure ownership
    const { rows } = await pool.query('SELECT creator_user_id FROM blogs WHERE blog_id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).render('404');
    if (rows[0].creator_user_id !== req.session.user.user_id) {
      req.flash('error', 'You can only update your own posts.');
      return res.redirect(`/posts/${req.params.id}`);
    }
    await pool.query('UPDATE blogs SET title=$1, body=$2 WHERE blog_id=$3', [title, body, req.params.id]);
    req.flash('success', 'Post updated.');
    res.redirect(`/posts/${req.params.id}`);
  } catch (e) {
    console.error(e);
    req.flash('error', 'Failed to update post.');
    res.redirect(`/posts/${req.params.id}/edit`);
  }
});

// Delete
router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT creator_user_id FROM blogs WHERE blog_id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).render('404');
    if (rows[0].creator_user_id !== req.session.user.user_id) {
      req.flash('error', 'You can only delete your own posts.');
      return res.redirect(`/posts/${req.params.id}`);
    }
    await pool.query('DELETE FROM blogs WHERE blog_id = $1', [req.params.id]);
    req.flash('success', 'Post deleted.');
    res.redirect('/');
  } catch (e) {
    console.error(e);
    req.flash('error', 'Failed to delete post.');
    res.redirect(`/posts/${req.params.id}`);
  }
});

export default router;
