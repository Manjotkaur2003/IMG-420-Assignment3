-- Seed users (plaintext passwords for base requirement)
INSERT INTO users (user_id, password, name) VALUES
  ('alice', 'alice123', 'Alice Johnson'),
  ('bob',   'bob123',   'Bob Smith'),
  ('manjot','nau312',   'Manjot Kaur')
ON CONFLICT (user_id) DO NOTHING;

-- Seed blogs
INSERT INTO blogs (creator_user_id, title, body, date_created) VALUES
  ('alice', 'Welcome to the Blog', 'This is the very first post on our Mini-Project-3 blog!', NOW() - INTERVAL '3 days'),
  ('bob',   'Node + Postgres FTW', 'Hooked up Express, EJS, and PostgreSQL for persistence.', NOW() - INTERVAL '2 days'),
  ('alice', 'EJS Tips', 'Partials, layouts, and helpers make templating a breeze.', NOW() - INTERVAL '36 hours'),
  ('manjot','My CS-312 Journey', 'Building full-stack web apps with friends. Go Jacks!', NOW() - INTERVAL '20 hours'),
  ('bob',   'Auth & Sessions', 'Sessions keep users signed in; only owners can edit/delete.', NOW() - INTERVAL '2 hours');
