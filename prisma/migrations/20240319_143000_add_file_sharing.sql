-- Create file_shares table
CREATE TABLE file_shares (
    id TEXT PRIMARY KEY,
    file_id TEXT NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    access_code TEXT,
    max_downloads INTEGER,
    downloads INTEGER NOT NULL DEFAULT 0,
    url TEXT NOT NULL,
    CONSTRAINT file_shares_downloads_check CHECK (downloads >= 0),
    CONSTRAINT file_shares_max_downloads_check CHECK (max_downloads IS NULL OR max_downloads > 0)
);

-- Add indexes for better query performance
CREATE INDEX idx_file_shares_file_id ON file_shares(file_id);
CREATE INDEX idx_file_shares_user_id ON file_shares(user_id);
CREATE INDEX idx_file_shares_expires_at ON file_shares(expires_at);

-- Add RLS policies for file_shares table
ALTER TABLE file_shares ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view their own shares
CREATE POLICY "Users can view their own shares"
    ON file_shares FOR SELECT
    USING (auth.uid() = user_id);

-- Policy to allow users to create shares for their own files
CREATE POLICY "Users can create shares for their own files"
    ON file_shares FOR INSERT
    WITH CHECK (
        auth.uid() = user_id
        AND EXISTS (
            SELECT 1 FROM files
            WHERE files.id = file_id
            AND files.user_id = auth.uid()
        )
    );

-- Policy to allow users to delete their own shares
CREATE POLICY "Users can delete their own shares"
    ON file_shares FOR DELETE
    USING (auth.uid() = user_id);

-- Policy to allow users to update their own shares
CREATE POLICY "Users can update their own shares"
    ON file_shares FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Function to clean up expired shares
CREATE OR REPLACE FUNCTION cleanup_expired_shares()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    DELETE FROM file_shares
    WHERE expires_at < NOW()
    OR (max_downloads IS NOT NULL AND downloads >= max_downloads);
END;
$$;
