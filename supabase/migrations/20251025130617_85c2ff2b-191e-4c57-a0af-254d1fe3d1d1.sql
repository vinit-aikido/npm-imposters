-- Add score and time_taken columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN score integer,
ADD COLUMN time_taken integer;

COMMENT ON COLUMN public.profiles.score IS 'Game score (0-1000)';
COMMENT ON COLUMN public.profiles.time_taken IS 'Time taken to complete game in seconds';