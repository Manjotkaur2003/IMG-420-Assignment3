import express from 'express';
import session from 'express-session';
import flash from 'connect-flash';
import methodOverride from 'method-override';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { pool } from './db/pool.js';
import authRoutes from './routes/auth.js';
import blogRoutes from './routes/blogs.js';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

app.use(session({
  secret: process.env.SESSION_SECRET || 'devsecret',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());

// Static & View engine
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Locals for EJS
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT b.*, u.name as creator_name
       FROM blogs b
       JOIN users u ON u.user_id = b.creator_user_id
       ORDER BY date_created DESC`
    );
    res.render('index', { posts: rows });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error fetching posts.');
  }
});

app.use('/', authRoutes);
app.use('/posts', blogRoutes);

// 404
app.use((req, res) => {
  res.status(404).render('404');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
