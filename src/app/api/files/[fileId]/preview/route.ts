import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getSignedDownloadUrl } from '@/lib/cloudflare/storage'

export async function GET(
  request: Request,
  { params }: { params: { fileId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get file metadata from Supabase
    const { data: file, error: dbError } = await supabase
      .from('files')
      .select('*')
      .eq('id', params.fileId)
      .single()

    if (dbError || !file) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    // Check if user has access to this file
    if (file.user_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Only generate preview URLs for images
    if (!file.content_type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File is not an image' },
        { status: 400 }
      )
    }

    // Generate signed URL with short expiration for preview
    const { success, url, error } = await getSignedDownloadUrl(file.file_key, 300) // 5 minutes
    
    if (!success || !url) {
      return NextResponse.json(
        { error: error || 'Failed to generate preview URL' },
        { status: 500 }
      )
    }

    // Redirect to the signed URL
    return NextResponse.redirect(url)

  } catch (error) {
    console.error('Preview generation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
