# Collage Maker Feature - Documentation

## Overview
A fully-featured collage maker has been added to your portfolio at `/collage` route. This provides users with an Instagram-like collage creation experience with advanced customization options.

## Features

### 1. **Image Upload**
- Support for multiple image uploads simultaneously
- Drag & drop support through file input
- Image validation and preview
- Maximum flexibility - upload as many images as needed

### 2. **Grid Templates** (10 Pre-designed Layouts)
- **2x2 Grid**: 4 equal square images
- **3x3 Grid**: 9 equal square images
- **2x3 Grid**: 6 equal images in 2 rows
- **Classic Story**: Large featured image with 3 smaller ones
- **Feature Focus**: 1 large feature image + 5 smaller images
- **Triptych**: 3 horizontal images
- **Vertical Stack**: 4 vertically stacked images
- **Diamond**: Diamond-shaped 5-image layout
- **Instagram Story**: Wide top image + 3 bottom images
- **Mosaic**: Dynamic 4-image layout with varied sizes

### 3. **Advanced Customization Settings**

#### Layout Controls
- **Gap Size** (0-50px): Adjust spacing between images
- **Background Color**: Choose any color for the collage background
- **Border Radius** (0-50px): Round the corners of the entire collage
- **Border**: Add custom borders with width and color control
- **Shadow**: Add drop shadows with adjustable blur and color

#### Image Effects
- **Opacity** (0-100%): Control overall collage transparency
- **Image Filters**:
  - Grayscale (0-100%)
  - Sepia (0-100%)
  - Blur (0-50px)
  - Brightness (-100 to +100%)
  - Contrast (-100 to +100%)
  - Saturation (-100 to +100%)
  - Hue Rotate (0-360°)

### 4. **Preview & Download**
- **Real-time Preview**: See changes instantly
- **Toggle Preview**: Hide/show preview to save screen space
- **High-Quality Download**: Download collage as PNG at 2x scale
- **PNG Format**: Preserves transparency and quality

## File Structure

```
app/
  collage/
    page.tsx                 # Collage page route with metadata

components/
  CollageBuilder.tsx         # Main collage builder component
```

## Component Details

### `/app/collage/page.tsx`
- Server component with Next.js metadata
- Includes SEO optimization
- Wraps CollageBuilder with Navbar and Footer

### `/components/CollageBuilder.tsx`
Client component with full features:
- **State Management**: Images, grid selection, advanced settings
- **Image Upload Handler**: Multiple file support
- **Grid Rendering**: Dynamic CSS Grid layout
- **Filter Application**: Real-time image filters
- **Download Functionality**: Uses html2canvas for high-quality exports

## Usage

1. Navigate to `/collage` route
2. Click "Add Images" to upload photos
3. Select a grid template from the left panel
4. (Optional) Configure advanced settings by expanding "Advanced" section
5. Preview the collage in real-time
6. Click "Download Collage" to save as PNG

## Technical Stack

- **Next.js**: Framework
- **React 19**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Lucide Icons**: UI icons
- **html2canvas**: Collage export functionality
- **CSS Grid**: Layout engine

## Advanced Settings Explained

### Gap
The spacing between images in pixels. Default: 8px

### Background Color
The fill color of the gaps and overall collage background.

### Border Radius
Rounds the corners of the collage for a modern look.

### Border
Optional border around the entire collage with customizable width and color.

### Shadow
Adds depth with a drop shadow effect.

### Opacity
Controls the transparency of the entire collage (not individual images).

### Image Filters
Apply effects uniformly to all images in the collage:
- **Grayscale**: Convert to black and white
- **Sepia**: Vintage/warm tone effect
- **Blur**: Soften image details
- **Brightness**: Lighten or darken
- **Contrast**: Increase or decrease color intensity
- **Saturation**: Make colors more or less vibrant
- **Hue Rotate**: Shift color spectrum

## Reset Settings
All settings can be reset to defaults with a single click in the Advanced Settings panel.

## Performance Considerations

- Images are stored as base64 data URLs (client-side only)
- Preview updates in real-time using CSS transforms
- High-quality export (2x scale) may take 1-2 seconds
- Suitable for images up to 10MB each

## Browser Support

Works on all modern browsers supporting:
- HTML5 Canvas
- CSS Grid
- FileReader API
- ES6+ JavaScript

## Future Enhancements (Optional)

- [ ] Drag & drop image reordering
- [ ] Image cropping/zoom
- [ ] Text overlays
- [ ] Sticker library
- [ ] Social media sharing directly
- [ ] Preset themes/styles
- [ ] Undo/Redo functionality
- [ ] Custom grid creation
- [ ] Image rotation and flip
- [ ] Cloud storage integration

## API Dependencies

None - this is a completely frontend-based feature with no backend requirements.

## Environment Variables

None required for this feature.

## Testing

To test the feature:
```bash
npm run dev
# Navigate to http://localhost:3000/collage
```

Try:
1. Upload 4 images and create a 2x2 grid
2. Add gap, background color, and border radius
3. Apply a filter
4. Download and verify quality

## Troubleshooting

**Images not uploading**: Check file size and format. Supported: JPG, PNG, GIF, WebP

**Download not working**: Ensure html2canvas is installed: `npm install html2canvas`

**Preview not updating**: Try toggling the preview off and on

**Browser freezes with large images**: Use images under 5MB for best performance

---

**Created**: 2026-04-02
**Component Version**: 1.0
**Status**: Production Ready

