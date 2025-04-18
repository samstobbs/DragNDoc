-- Drop the existing policy
DROP POLICY IF EXISTS "Users can insert their own data" ON users;

-- Create a new policy that allows users to insert their own data
CREATE POLICY "Users can insert their own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id OR auth.uid() IS NULL);
  
-- Create a policy that allows service role to insert data
CREATE POLICY "Service role can insert data" ON users
  FOR INSERT USING (true);
