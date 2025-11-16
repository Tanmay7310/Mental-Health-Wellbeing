-- Make profile fields nullable so users can complete them later
ALTER TABLE public.profiles 
ALTER COLUMN home_address DROP NOT NULL,
ALTER COLUMN country DROP NOT NULL,
ALTER COLUMN pincode DROP NOT NULL;