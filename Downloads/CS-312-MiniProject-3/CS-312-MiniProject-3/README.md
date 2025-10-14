# CS-312-MiniProject-3 — Blog with Node.js, Express, EJS, PostgreSQL

## Quick Start
1. **Create DB** in pgAdmin named `BlogDB`.
2. Run `db/schema.sql` then `db/seed.sql` in the `BlogDB` query tool.
3. Copy `.env.example` to `.env` and set `DATABASE_URL` + `SESSION_SECRET`.
4. Install deps:
   ```bash
   npm install
   npm run start
   # visit http://localhost:3000
   ```

### Credentials (seeded)
- alice / alice123
- bob / bob123
- manjot / nau312

## Features
- Create, read, update, delete (CRUD) blog posts
- EJS templates, responsive CSS
- Session-based auth (sign up / sign in / sign out)
- Ownership checks: edit/delete only your own posts
- PostgreSQL persistence via `pg`

## Bonus (optional): Hashed Passwords
- App already stores both plaintext (`password`) and bcrypt hash (`password_hash`) on signup.
- During **signin**, either plaintext match OR bcrypt match is accepted.
- To fully switch to hashed-only:
  - Remove `password` column from `users` and migrate existing users with:
    ```sql
    ALTER TABLE users DROP COLUMN password;
    ```
  - Re-sign-up users (or write a script) to populate `password_hash`.
  - In `routes/auth.js`, keep only the bcrypt comparison branch.

## Scripts
- `db/schema.sql`: tables & indices
- `db/seed.sql`: sample users & posts

---
_Generated on 2025-10-13_
