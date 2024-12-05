-- CreateTable
CREATE TABLE "files" (
    "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    "created_at" TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    "user_id" UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    "file_key" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "content_type" TEXT NOT NULL,
    "size" BIGINT NOT NULL
);

-- Create indexes
CREATE INDEX idx_files_user_id ON public.files(user_id);
CREATE INDEX idx_files_created_at ON public.files(created_at);

-- Enable RLS
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own files"
    ON public.files FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can upload their own files"
    ON public.files FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own files"
    ON public.files FOR DELETE
    USING (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON public.files TO authenticated;
GRANT USAGE ON SEQUENCE public.files_id_seq TO authenticated;
