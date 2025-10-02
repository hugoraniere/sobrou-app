-- Add display_behavior column to release_notes table
ALTER TABLE public.release_notes 
ADD COLUMN display_behavior TEXT DEFAULT 'once' CHECK (display_behavior IN ('once', 'every_login', 'on_dismiss'));

-- Update existing records to have the default value
UPDATE public.release_notes SET display_behavior = 'once' WHERE display_behavior IS NULL;