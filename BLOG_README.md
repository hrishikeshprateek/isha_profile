# Blog System Documentation

## Overview
The blog system is now JSON-based, making it easy to add, edit, and manage blog posts without modifying code.

## File Structure
```
data/
  └── blogs.json          # All blog post data
app/
  └── blogs/
      ├── page.tsx        # Blog listing page
      └── [id]/
          └── page.tsx    # Individual blog post page
```

## Adding a New Blog Post

### 1. Edit `data/blogs.json`
Add a new object to the JSON array with the following structure:

```json
{
  "id": "7",                    // Unique ID (string)
  "title": "Your Blog Title",
  "excerpt": "A short description that appears in the listing...",
  "category": "Travel",         // One of: Travel, Content Creation, Food & Culture, Photography
  "date": "January 13, 2026",
  "readTime": "8 min read",
  "author": "Isha Rani",
  "image": "https://images.unsplash.com/...",  // Hero image URL
  "content": "<p>Your HTML content here...</p>",
  "tags": ["Tag1", "Tag2", "Tag3"]
}
```

### 2. Content Formatting
The `content` field accepts HTML. Use these tags for formatting:

#### Available HTML Tags:
- `<p>` - Paragraphs
- `<h2>` - Main headings
- `<h3>` - Subheadings
- `<ul>` and `<li>` - Bullet lists
- `<ol>` and `<li>` - Numbered lists
- `<strong>` - Bold text
- `<blockquote>` - Quotes (styled with pink border)

#### Example Content:
```html
"<p>Introduction paragraph...</p><h2>Main Section</h2><p>Content here...</p><h3>Subsection</h3><ul><li>Point 1</li><li>Point 2</li></ul><blockquote>\"A quote here\"</blockquote>"
```

### 3. Image Requirements
- **Hero Image**: 1200x600px minimum
- **Format**: JPG or PNG
- **Recommended source**: Unsplash, Pexels, or your own images
- Use Unsplash URLs like: `https://images.unsplash.com/photo-[ID]?w=1200&h=600&fit=crop`

### 4. Categories
Ensure your category matches one of these exactly:
- `Travel`
- `Content Creation`
- `Food & Culture`
- `Photography`

## Testing Your New Post

1. Save `blogs.json`
2. The dev server will hot-reload automatically
3. Visit `/blogs` to see your post in the listing
4. Click on it to view the full post at `/blogs/[your-id]`

## Future Backend Integration

When ready to connect a backend:

1. Replace this line in both pages:
   ```typescript
   const blogPosts: BlogPost[] = require('@/data/blogs.json');
   ```

2. With an API call:
   ```typescript
   const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
   
   useEffect(() => {
     fetch('/api/blogs')
       .then(res => res.json())
       .then(data => setBlogPosts(data));
   }, []);
   ```

3. The `BlogPost` interface is already defined and typed properly
4. Your CMS/backend should return data in the same JSON structure

## Tips

- Keep excerpts under 150 characters for best display
- Use high-quality images with consistent aspect ratios
- Keep read times honest (average reading speed is ~200 words/minute)
- Test on mobile to ensure content displays well
- HTML content should be properly escaped (use `\"` for quotes inside strings)

## Current Blog Posts

The system currently includes 6 sample posts:
1. Hidden Gems of Southeast Asia
2. Content Creation Tips for Beginners
3. A Week in the Himalayas
4. Building an Authentic Brand
5. Street Food Adventures in India
6. Photography Essentials for Travel

Feel free to edit or replace any of these!

