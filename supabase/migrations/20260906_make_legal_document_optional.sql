-- Make legal_document_path column optional and set a default value in seeker_profiles
ALTER TABLE public.seeker_profiles ALTER COLUMN legal_document_path DROP NOT NULL;
ALTER TABLE public.seeker_profiles ALTER COLUMN legal_document_path SET DEFAULT 'not_required';
