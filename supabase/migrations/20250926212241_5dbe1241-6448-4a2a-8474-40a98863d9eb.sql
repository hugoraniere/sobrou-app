-- Add cta_action column to release_notes table
ALTER TABLE release_notes 
ADD COLUMN cta_action TEXT CHECK (cta_action IN ('open_link', 'close')) DEFAULT 'open_link';