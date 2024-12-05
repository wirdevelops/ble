-- Create file_shares table
CREATE TABLE "file_shares" (
    "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    "file_id" UUID NOT NULL REFERENCES "files"(id) ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    "expires_at" TIMESTAMPTZ,
    "access_code" TEXT,
    "downloads" INTEGER DEFAULT 0 NOT NULL,
    "max_downloads" INTEGER
);

-- Create indexes
CREATE INDEX idx_file_shares_file_id ON public.file_shares(file_id);
CREATE INDEX idx_file_shares_access_code ON public.file_shares(access_code);

-- Enable RLS
ALTER TABLE public.file_shares ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own shared files"
    ON public.file_shares FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM files
            WHERE files.id = file_shares.file_id
            AND files.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create shares for their own files"
    ON public.file_shares FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM files
            WHERE files.id = file_shares.file_id
            AND files.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their own shares"
    ON public.file_shares FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM files
            WHERE files.id = file_shares.file_id
            AND files.user_id = auth.uid()
        )
    );

-- Grant permissions
GRANT ALL ON public.file_shares TO authenticated;
