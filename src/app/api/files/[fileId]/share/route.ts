import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { nanoid } from 'nanoid'

export async function POST(
  request: Request,
  { params }: { params: { fileId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get file details and verify ownership
    const { data: file, error: fileError } = await supabase
      .from('files')
      .select('*')
      .eq('id', params.fileId)
      .single()

    if (fileError || !file || file.user_id !== user.id) {
      return NextResponse.json(
        { error: 'File not found or access denied' },
        { status: 404 }
      )
    }

    // Get share settings from request
    const { expiresAt, maxDownloads, accessCode } = await request.json()

    // Generate unique share ID
    const shareId = nanoid()

    // Create share record
    const { error: shareError } = await supabase
      .from('file_shares')
      .insert({
        id: shareId,
        file_id: params.fileId,
        user_id: user.id,
        expires_at: expiresAt,
        max_downloads: maxDownloads,
        access_code: accessCode,
        downloads: 0,
        url: `${process.env.NEXT_PUBLIC_APP_URL}/share/${shareId}`
      })

    if (shareError) {
      console.error('Share creation error:', shareError)
      return NextResponse.json(
        { error: 'Failed to create share' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Share creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: Request,
  { params }: { params: { fileId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get all shares for the file
    const { data: shares, error: sharesError } = await supabase
      .from('file_shares')
      .select('*')
      .eq('file_id', params.fileId)
      .eq('user_id', user.id)

    if (sharesError) {
      console.error('Error fetching shares:', sharesError)
      return NextResponse.json(
        { error: 'Failed to fetch shares' },
        { status: 500 }
      )
    }

    return NextResponse.json({ shares })
  } catch (error) {
    console.error('Share fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { fileId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const url = new URL(request.url)
    const shareId = url.searchParams.get('shareId')

    if (!shareId) {
      return NextResponse.json(
        { error: 'Share ID is required' },
        { status: 400 }
      )
    }

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Delete the share
    const { error: deleteError } = await supabase
      .from('file_shares')
      .delete()
      .eq('id', shareId)
      .eq('user_id', user.id)
      .eq('file_id', params.fileId)

    if (deleteError) {
      console.error('Share deletion error:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete share' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Share deletion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
