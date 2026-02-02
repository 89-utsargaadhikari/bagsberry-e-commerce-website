-- Verify admin user was created
SELECT * FROM admin_users;

-- Also check auth users
SELECT id, email FROM auth.users;
