-- Create database in pgAdmin first: BlogDB
-- Then run this schema in BlogDB query tool.

CREATE TABLE IF NOT EXISTS users (
  user_id VARCHAR(255) PRIMARY KEY,
  password VARCHAR(255),          -- Base requirement: plaintext allowed
  password_hash VARCHAR(255),     -- Bonus: bcrypt hash (used if present)
  name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS blogs (
  blog_id SERIAL PRIMARY KEY,
  creator_user_id VARCHAR(255) NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  date_created TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blogs_date ON blogs(date_created DESC);
