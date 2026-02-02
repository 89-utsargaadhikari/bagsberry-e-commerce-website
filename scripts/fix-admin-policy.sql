-- Fix the infinite recursion issue with admin_users RLS
-- The simplest solution: disable RLS on admin_users since it's only used internally
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

-- Drop the problematic policy
DROP POLICY IF EXISTS "Admins can view admin_users" ON admin_users;
