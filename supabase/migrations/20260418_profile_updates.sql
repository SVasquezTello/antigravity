-- 1. Add avatar_url column to users if it doesn't exist
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS avatar_url text;

-- 2. Create the avatars bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES ('avatars', 'avatars', true, 1048576, ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- 3. Set up Storage RLS for avatars bucket
DROP POLICY IF EXISTS "Avatar images are publicly accessible." ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatars." ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatars." ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatars." ON storage.objects;

-- Allow public viewing
CREATE POLICY "Avatar images are publicly accessible."
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );

-- Allow authenticated users to upload
CREATE POLICY "Users can upload their own avatars."
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1] );

-- Allow users to update their own avatars
CREATE POLICY "Users can update their own avatars."
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1] );

-- Allow users to delete their own avatars
CREATE POLICY "Users can delete their own avatars."
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1] );

-- Notify about schema change
NOTIFY pgrst, 'reload schema';
