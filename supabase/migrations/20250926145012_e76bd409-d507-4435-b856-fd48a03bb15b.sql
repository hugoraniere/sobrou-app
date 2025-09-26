-- Create release_notes table for admin-managed notes
CREATE TABLE public.release_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  size TEXT NOT NULL DEFAULT 'medium' CHECK (size IN ('small', 'medium', 'large')),
  cta_text TEXT,
  cta_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT false,
  version TEXT NOT NULL DEFAULT '1.0',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create release_note_dismissals table to track user dismissals
CREATE TABLE public.release_note_dismissals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  release_note_id UUID NOT NULL REFERENCES public.release_notes(id) ON DELETE CASCADE,
  dismissed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, release_note_id)
);

-- Enable RLS
ALTER TABLE public.release_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.release_note_dismissals ENABLE ROW LEVEL SECURITY;

-- RLS policies for release_notes
CREATE POLICY "Admins can manage release notes" 
ON public.release_notes 
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Anyone can view active release notes" 
ON public.release_notes 
FOR SELECT 
USING (is_active = true);

-- RLS policies for release_note_dismissals
CREATE POLICY "Users can manage their own dismissals" 
ON public.release_note_dismissals 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all dismissals" 
ON public.release_note_dismissals 
FOR SELECT 
USING (is_admin());

-- Create storage bucket for release notes images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('release-notes', 'release-notes', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for release notes bucket
CREATE POLICY "Anyone can view release notes images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'release-notes');

CREATE POLICY "Admins can upload release notes images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'release-notes' AND is_admin());

CREATE POLICY "Admins can update release notes images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'release-notes' AND is_admin());

CREATE POLICY "Admins can delete release notes images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'release-notes' AND is_admin());

-- Create trigger for updated_at
CREATE TRIGGER update_release_notes_updated_at
  BEFORE UPDATE ON public.release_notes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();