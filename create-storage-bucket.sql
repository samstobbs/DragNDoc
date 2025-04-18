-- Create a storage bucket for API specs if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('api-specs', 'api-specs', false)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies
CREATE POLICY "Users can upload their own API specs" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'api-specs' AND (storage.foldername(name))[1] = auth.uid());

CREATE POLICY "Users can view their own API specs" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'api-specs' AND (storage.foldername(name))[1] = auth.uid());

CREATE POLICY "Users can update their own API specs" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'api-specs' AND (storage.foldername(name))[1] = auth.uid());

CREATE POLICY "Users can delete their own API specs" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'api-specs' AND (storage.foldername(name))[1] = auth.uid());
