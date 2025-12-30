-- Add initial_screening_completed field to profiles table
ALTER TABLE public.profiles 
ADD COLUMN initial_screening_completed BOOLEAN DEFAULT FALSE;

-- Update existing users who have completed initial screening
-- (check if they have an assessment with assessment_type = 'phq9' that was created as initial screening)
-- This is a one-time update for existing data
UPDATE public.profiles
SET initial_screening_completed = TRUE
WHERE id IN (
  SELECT DISTINCT user_id 
  FROM public.assessments 
  WHERE assessment_type = 'phq9'
  AND created_at < NOW()
);

