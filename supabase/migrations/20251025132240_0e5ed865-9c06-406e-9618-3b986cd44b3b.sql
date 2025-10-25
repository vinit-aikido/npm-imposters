-- Allow all authenticated users to view all profiles (for leaderboard)
CREATE POLICY "Anyone can view profiles for leaderboard"
ON public.profiles
FOR SELECT
USING (true);

-- Drop the old restrictive policy
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;