import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'
import sharp from 'sharp'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024

// Allowed image types
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const salonId = formData.get('salonId') as string

    if (!file || !salonId) {
      return NextResponse.json(
        { error: 'File and salon ID are required' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      )
    }

    // Get user from auth header or session
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify salon ownership
    const { data: salon, error: salonError } = await supabase
      .from('salons')
      .select('id, photo_limit, photo_count, tier_id')
      .eq('id', salonId)
      .single()

    if (salonError || !salon) {
      return NextResponse.json(
        { error: 'Salon not found or access denied' },
        { status: 404 }
      )
    }

    // Check photo limit
    if (salon.photo_count >= salon.photo_limit) {
      return NextResponse.json(
        { error: `Photo limit reached. Maximum ${salon.photo_limit} photos allowed for your tier.` },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const photoId = uuidv4()
    const extension = file.name.split('.').pop() || 'jpg'
    const filename = `${photoId}.${extension}`
    
    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public/uploads/photos')
    await mkdir(uploadDir, { recursive: true })
    
    const filePath = join(uploadDir, filename)
    const relativePath = `/uploads/photos/${filename}`

    // Process image with Sharp for optimization
    let processedBuffer = buffer
    let width = 0
    let height = 0

    try {
      const image = sharp(buffer)
      const metadata = await image.metadata()
      width = metadata.width || 0
      height = metadata.height || 0

      // Resize if too large (max 1920px width)
      if (width > 1920) {
        processedBuffer = await image
          .resize(1920, null, { 
            withoutEnlargement: true,
            fit: 'inside'
          })
          .jpeg({ quality: 85 })
          .toBuffer()
      } else {
        // Just optimize quality
        processedBuffer = await image
          .jpeg({ quality: 90 })
          .toBuffer()
      }
    } catch (sharpError) {
      console.warn('Sharp processing failed, using original file:', sharpError)
    }

    // Save file to disk
    await writeFile(filePath, processedBuffer)

    // Check if this is the first photo (should be primary)
    const isFirstPhoto = salon.photo_count === 0

    // Save to database
    const { data: photo, error: photoError } = await supabase
      .from('salon_photos')
      .insert({
        id: photoId,
        salon_id: salonId,
        filename: filename,
        original_filename: file.name,
        file_path: relativePath,
        file_size: processedBuffer.length,
        mime_type: file.type,
        width: width,
        height: height,
        description: '',
        is_primary: isFirstPhoto,
        sort_order: salon.photo_count + 1
      })
      .select()
      .single()

    if (photoError) {
      console.error('Database error:', photoError)
      // Clean up uploaded file on database error
      try {
        await import('fs/promises').then(fs => fs.unlink(filePath))
      } catch (unlinkError) {
        console.error('Failed to clean up file:', unlinkError)
      }
      
      return NextResponse.json(
        { error: 'Failed to save photo metadata' },
        { status: 500 }
      )
    }

    // Return photo data
    return NextResponse.json({
      id: photo.id,
      url: relativePath,
      filename: photo.filename,
      originalFilename: photo.original_filename,
      size: photo.file_size,
      width: photo.width,
      height: photo.height,
      isPrimary: photo.is_primary,
      description: photo.description,
      uploadedAt: photo.created_at
    })

  } catch (error) {
    console.error('Photo upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { photoId: string } }
) {
  try {
    const photoId = params.photoId

    if (!photoId) {
      return NextResponse.json(
        { error: 'Photo ID is required' },
        { status: 400 }
      )
    }

    // Get user from auth header or session
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get photo details and verify ownership
    const { data: photo, error: photoError } = await supabase
      .from('salon_photos')
      .select(`
        id,
        file_path,
        salon_id,
        salons!inner(owner_id)
      `)
      .eq('id', photoId)
      .single()

    if (photoError || !photo) {
      return NextResponse.json(
        { error: 'Photo not found or access denied' },
        { status: 404 }
      )
    }

    // Delete file from filesystem
    try {
      const fullPath = join(process.cwd(), 'public', photo.file_path)
      await import('fs/promises').then(fs => fs.unlink(fullPath))
    } catch (fileError) {
      console.warn('Failed to delete file from filesystem:', fileError)
      // Continue with database deletion even if file deletion fails
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from('salon_photos')
      .delete()
      .eq('id', photoId)

    if (deleteError) {
      console.error('Database deletion error:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete photo from database' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Photo deletion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve photos for a salon
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const salonId = searchParams.get('salonId')

    if (!salonId) {
      return NextResponse.json(
        { error: 'Salon ID is required' },
        { status: 400 }
      )
    }

    const { data: photos, error } = await supabase
      .from('salon_photos')
      .select('*')
      .eq('salon_id', salonId)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Failed to fetch photos:', error)
      return NextResponse.json(
        { error: 'Failed to fetch photos' },
        { status: 500 }
      )
    }

    const formattedPhotos = photos.map(photo => ({
      id: photo.id,
      url: photo.file_path,
      filename: photo.filename,
      originalFilename: photo.original_filename,
      size: photo.file_size,
      width: photo.width,
      height: photo.height,
      isPrimary: photo.is_primary,
      description: photo.description || '',
      uploadedAt: photo.created_at
    }))

    return NextResponse.json({ photos: formattedPhotos })

  } catch (error) {
    console.error('Photo fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}