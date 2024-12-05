import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { uploadFile } from '@/lib/cloudflare/storage'

export async function POST(request: Request) {
  try {
    // Initialize Supabase client
    const supabase = createRouteHandlerClient({ cookies })
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get file from request
    const formData = await request.formData()
    const file = formData.get('file') as File
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Generate unique file key
    const timestamp = new Date().getTime()
    const fileKey = `${session.user.id}/${timestamp}-${file.name}`

    // Upload to Cloudflare R2
    const buffer = Buffer.from(await file.arrayBuffer())
    const uploadResult = await uploadFile(fileKey, buffer, file.type)

    if (!uploadResult.success) {
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      )
    }

    // Store file metadata in Supabase
    const { data: fileData, error: dbError } = await supabase
      .from('files')
      .insert({
        user_id: session.user.id,
        file_key: fileKey,
        file_name: file.name,
        content_type: file.type,
        size: file.size,
      })
      .select()
      .single()

    if (dbError) {
      return NextResponse.json(
        { error: 'Failed to store file metadata' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      file: fileData
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
