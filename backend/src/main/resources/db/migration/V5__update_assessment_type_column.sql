-- Convert assessment_type column from enum to VARCHAR(20)
ALTER TABLE assessments 
ALTER COLUMN assessment_type TYPE VARCHAR(20) 
USING assessment_type::TEXT;
