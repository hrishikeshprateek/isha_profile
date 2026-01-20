# Cloudinary Integration Guide

## Overview
Cloudinary has been integrated into the blog system for seamless image uploads. This allows you to upload images directly from the blog editor or via a dedicated upload widget.

## Configuration

### Environment Variables
Add the following to your `.env.local` file:

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dplr6ix16
NEXT_PUBLIC_CLOUDINARY_API_KEY=468949168991438
CLOUDINARY_API_SECRET=YOUR_API_SECRET_HERE
```

⚠️ **Important**: Replace `YOUR_API_SECRET_HERE` with your actual Cloudinary API secret.

## Features

### 1. Cover Image Upload Widget
- Located in the blog create/edit page sidebar
- Click to upload or drag & drop
- Shows live preview
- Validates file size (max 10MB)
- Supports JPG, PNG, GIF formats

### 2. In-Editor Image Upload
- Click the image icon in the Quill editor toolbar
- Select an image from your computer
- Image is automatically uploaded to Cloudinary
- Shows "Uploading image..." text while processing
- Image is inserted at cursor position

### 3. Manual URL Input
- Alternative option to paste image URLs directly
- Accessible via expandable section in the sidebar

## Usage

### Uploading Cover Images

1. **Navigate to Blog Create/Edit Page**
   - Create: `/admin/blogs/create`
   - Edit: `/admin/blogs/edit/[id]`

2. **Upload Image**
   - Click the upload area in the "Cover Image" section
   - Select an image file (JPG, PNG, or GIF)
   - Wait for upload to complete
   - Image preview appears automatically

3. **Change/Remove Image**
   - Hover over the preview image
   - Click the X button to remove
   - Click "Change Image" to upload a different one

### Uploading Images Within Content

1. **Position Cursor**
   - Click where you want the image in your content

2. **Click Image Button**
   - Find the image icon in the editor toolbar
   - Click it to open file picker

3. **Select Image**
   - Choose an image file
   - Wait for "Uploading image..." message
   - Image appears automatically when upload completes

## API Endpoints

### POST `/api/upload/cloudinary`
Uploads an image to Cloudinary.

**Request Body:**
```json
{
  "file": "data:image/jpeg;base64,...",
  "folder": "blogs"
}
```

**Response:**
```json
{
  "success": true,
  "url": "https://res.cloudinary.com/...",
  "publicId": "isha-portfolio/blogs/...",
  "format": "jpg",
  "width": 1920,
  "height": 1080
}
```

### GET `/api/upload/cloudinary?folder=blogs`
Generates a signature for secure uploads (for future widget integration).

## File Structure

```
app/
  api/
    upload/
      cloudinary/
        route.ts          # API endpoint for uploads

components/
  CloudinaryUpload.tsx    # Reusable upload widget component

lib/
  cloudinary-helpers.ts   # Helper functions for Quill integration
```

## Components

### CloudinaryUpload Component

```tsx
import CloudinaryUpload from '@/components/CloudinaryUpload';

<CloudinaryUpload
  currentImage={imageUrl}
  onUploadComplete={(url) => setImageUrl(url)}
  folder="blogs"  // Optional, defaults to "blogs"
/>
```

**Props:**
- `currentImage` (string, optional): Current image URL to display
- `onUploadComplete` (function): Callback with uploaded image URL
- `folder` (string, optional): Cloudinary folder path

## Best Practices

1. **Image Optimization**
   - Cloudinary automatically optimizes images
   - Uses `quality: auto` and `fetch_format: auto`
   - Reduces file sizes without quality loss

2. **Folder Organization**
   - Blog images: `isha-portfolio/blogs/`
   - Quotes images: `isha-portfolio/quotes/`
   - VCard images: `isha-portfolio/vcard/`

3. **Error Handling**
   - File size validation (max 10MB)
   - File type validation (images only)
   - Network error handling
   - User-friendly error messages

4. **Security**
   - API secret stored server-side only
   - Client-side validation before upload
   - Secure signature generation for uploads

## Troubleshooting

### Upload Fails
- Check file size (must be < 10MB)
- Verify file type (JPG, PNG, or GIF)
- Check Cloudinary API credentials
- Verify network connection

### Images Don't Display
- Check Cloudinary URL format
- Verify public read access in Cloudinary settings
- Check browser console for errors

### Slow Uploads
- Large file sizes take longer
- Consider resizing images before upload
- Check internet connection speed

## Future Enhancements

1. **Upload Progress Bar**
   - Show upload percentage
   - Estimated time remaining

2. **Image Cropping**
   - Allow in-browser image cropping
   - Set aspect ratios for cover images

3. **Multiple Upload**
   - Upload multiple images at once
   - Batch processing

4. **Image Library**
   - Browse previously uploaded images
   - Reuse images across posts

5. **Advanced Transformations**
   - Filters and effects
   - Automatic resize for different devices
   - Lazy loading optimization

## Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [React Quill](https://github.com/zenoamaro/react-quill)
- [Next.js Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)

