import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY!,
  },
})

export async function POST(
  request: Request,
  { params }: { params: { shareId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { accessCode } = await request.json()

    // Get share details
    const { data: share, error: shareError } = await supabase
      .from('file_shares')
      .select('*, files(*)')
      .eq('id', params.shareId)
      .single()

    if (shareError || !share) {
      return NextResponse.json(
        { error: 'Share not found' },
        { status: 404 }
      )
    }

    // Check if share has expired
    if (share.expires_at && new Date(share.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Share has expired' },
        { status: 403 }
      )
    }

    // Check if download limit has been reached
    if (share.max_downloads && share.downloads >= share.max_downloads) {
      return NextResponse.json(
        { error: 'Download limit reached' },
        { status: 403 }
      )
    }

    // Verify access code if required
    if (share.access_code && share.access_code !== accessCode) {
      return NextResponse.json(
        { error: 'Invalid access code' },
        { status: 403 }
      )
    }

    // Generate signed URL for file download
    const command = new GetObjectCommand({
      Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
      Key: share.files.storage_path,
    })

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600, // URL expires in 1 hour
    })

    // Increment download count
    const { error: updateError } = await supabase
      .from('file_shares')
      .update({ downloads: share.downloads + 1 })
      .eq('id', params.shareId)

    if (updateError) {
      console.error('Error updating download count:', updateError)
    }

    return NextResponse.json({
      url: signedUrl,
      fileName: share.files.name,
      contentType: share.files.content_type,
    })
  } catch (error) {
    console.error('Share download error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
