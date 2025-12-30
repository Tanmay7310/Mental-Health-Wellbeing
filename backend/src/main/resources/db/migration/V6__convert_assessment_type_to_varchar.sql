-- First, drop any constraints that reference the column
ALTER TABLE assessments DROP CONSTRAINT IF EXISTS assessments_assessment_type_check;

-- Then alter the column type to VARCHAR
ALTER TABLE assessments 
ALTER COLUMN assessment_type TYPE VARCHAR(20) 
USING assessment_type::TEXT;
