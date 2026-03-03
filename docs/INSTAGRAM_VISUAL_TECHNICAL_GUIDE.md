# Instagram Integration - Visual & Technical Guide

## 🎨 Component Preview

### Desktop Layout (4 columns)
```
┌─────────────────────────────────────────────────────────────┐
│ On The Gram                                  [Follow Me]    │
│ Instagram Moments                                            │
│ Behind-the-scenes snapshots and daily inspiration.          │
│                                                              │
│ ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│ │          │  │          │  │          │  │          │    │
│ │ Post 1   │  │ Post 2   │  │ Post 3   │  │ Post 4   │    │
│ │          │  │          │  │          │  │          │    │
│ └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
│ ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│ │          │  │          │  │          │  │          │    │
│ │ Post 5   │  │ Post 6   │  │ Post 7   │  │ Post 8   │    │
│ │          │  │          │  │          │  │          │    │
│ └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Tablet Layout (2 columns)
```
┌─────────────────────────┐
│ On The Gram             │
│ Instagram Moments       │
│ Behind-the-scenes...    │
│                         │
│ ┌─────────┐ ┌─────────┐│
│ │ Post 1  │ │ Post 2  ││
│ └─────────┘ └─────────┘│
│ ┌─────────┐ ┌─────────┐│
│ │ Post 3  │ │ Post 4  ││
│ └─────────┘ └─────────┘│
│ ┌─────────┐ ┌─────────┐│
│ │ Post 5  │ │ Post 6  ││
│ └─────────┘ └─────────┘│
│ ┌─────────┐ ┌─────────┐│
│ │ Post 7  │ │ Post 8  ││
│ └─────────┘ └─────────┘│
│    [Follow Me]          │
└─────────────────────────┘
```

### Mobile Layout (1 column)
```
┌──────────────────┐
│ On The Gram      │
│ Instagram        │
│ Moments          │
│ Behind-the...    │
│                  │
│ ┌──────────────┐ │
│ │  Post 1      │ │
│ └──────────────┘ │
│ ┌──────────────┐ │
│ │  Post 2      │ │
│ └──────────────┘ │
│ ┌──────────────┐ │
│ │  Post 3      │ │
│ └──────────────┘ │
│ ┌──────────────┐ │
│ │  Post 4      │ │
│ └──────────────┘ │
│ [Follow Me]      │
└──────────────────┘
```

---

## 🔄 Data Flow Diagram

```
┌─────────────────┐
│  Homepage User  │
│  (Browser)      │
└────────┬────────┘
         │ Visits http://localhost:3000
         ↓
┌─────────────────────────────┐
│  Next.js App (App Router)   │
│  /app/page.tsx              │
│  └─ <InstagramSection />    │
└────────┬────────────────────┘
         │ Server Component renders
         ↓
┌──────────────────────────────────┐
│  InstagramSection Component      │
│  └─ getInstagramPosts()          │
└────────┬─────────────────────────┘
         │ Async fetch
         ↓
┌──────────────────────────────────┐
│  GET /api/instagram              │
│  (API Route Handler)             │
│  └─ route.ts                     │
└────────┬─────────────────────────┘
         │ Fetch data
         ↓
┌──────────────────────────────────┐
│  Instagram Graph API             │
│  https://graph.instagram.com/... │
│  + INSTAGRAM_ACCESS_TOKEN        │
└────────┬─────────────────────────┘
         │ Returns 8 latest posts
         ↓
┌──────────────────────────────────┐
│  Cache Layer (1 hour ISR)        │
│  Stores response                 │
└────────┬─────────────────────────┘
         │ Return transformed data
         ↓
┌──────────────────────────────────┐
│  InstagramSection renders        │
│  8 posts in responsive grid      │
└────────┬─────────────────────────┘
         │ HTML delivered to browser
         ↓
┌─────────────────┐
│  User sees      │
│  Instagram      │
│  posts on page  │
└─────────────────┘
```

---

## 📡 API Route Execution Flow

```
GET /api/instagram
    ↓
├─ Check: Is INSTAGRAM_ACCESS_TOKEN set?
│  ├─ No → Return 500 error "Token not configured"
│  └─ Yes → Continue
│
├─ Fetch from Instagram Graph API
│  ├─ URL: https://graph.instagram.com/me/media
│  ├─ Fields: id, caption, media_type, media_url, permalink, thumbnail_url
│  ├─ Limit: 8 posts
│  └─ Token: process.env.INSTAGRAM_ACCESS_TOKEN
│
├─ Response received?
│  ├─ No → Return 500 error "Failed to fetch"
│  └─ Yes → Continue
│
├─ Transform data
│  └─ For each post:
│     ├─ if media_type === 'VIDEO' → use thumbnail_url
│     ├─ else → use media_url
│     └─ Extract: id, caption, media_type, image_url, permalink
│
└─ Return JSON
   {
     "success": true,
     "data": [...8 posts...],
     "count": 8
   }
```

---

## 🔌 Component Props & Data Types

### InstagramPost Type
```typescript
interface InstagramPost {
  id: string;              // Instagram post ID
  caption: string;         // Post caption text
  media_type: 'IMAGE'      // 'IMAGE', 'VIDEO', or 'CAROUSEL_ALBUM'
               | 'VIDEO'
               | 'CAROUSEL_ALBUM';
  image_url: string;       // URL to image (or video thumbnail)
  permalink: string;       // URL to Instagram post
}
```

### getInstagramPosts() Return
```typescript
Promise<InstagramPost[]>  // Array of up to 8 posts
```

### Rendering Each Post
```typescript
{instagramPosts.map((post) => (
  <a href={post.permalink} key={post.id}>
    <Image 
      src={post.image_url}
      alt={post.caption}
    />
    {post.media_type === 'VIDEO' && <PlayIcon />}
    {post.media_type === 'CAROUSEL_ALBUM' && <CarouselIcon />}
  </a>
))}
```

---

## 🔐 Security Architecture

```
┌─────────────────────────────────────┐
│  Instagram Access Token             │
│  (Long-Lived, 60-day expiry)        │
└────────┬────────────────────────────┘
         │ Stored in
         ↓
┌─────────────────────────────────────┐
│  .env.local (Development)           │
│  OR                                 │
│  Vercel Env Variables (Production)  │
└────────┬────────────────────────────┘
         │ Loaded as
         ↓
┌─────────────────────────────────────┐
│  process.env.INSTAGRAM_ACCESS_TOKEN │
│  (Server-side only)                 │
└────────┬────────────────────────────┘
         │ Used in
         ↓
┌─────────────────────────────────────┐
│  API Route Handler (/api/instagram) │
│  (Runs on server, never exposed)    │
└────────┬────────────────────────────┘
         │ Calls
         ↓
┌─────────────────────────────────────┐
│  Instagram Graph API (HTTPS)        │
│  Returns public post data           │
└────────┬────────────────────────────┘
         │ Transformed and cached
         ↓
┌─────────────────────────────────────┐
│  Browser receives JSON              │
│  (Token NOT included)               │
│  (Only post data)                   │
└─────────────────────────────────────┘
```

---

## ⚙️ Configuration Flow

```
Development Setup:
├─ 1. Get token from Instagram Developer App
├─ 2. Create .env.local file
├─ 3. Add: INSTAGRAM_ACCESS_TOKEN=...
├─ 4. Restart dev server
├─ 5. Component reads env var
└─ 6. API route uses it

Production Setup (Vercel):
├─ 1. Go to Vercel Project Settings
├─ 2. Environment Variables
├─ 3. Add INSTAGRAM_ACCESS_TOKEN
├─ 4. Deploy
├─ 5. Vercel injects env var
└─ 6. API route uses it
```

---

## 🎯 Responsive Breakpoints

```
Mobile (0px - 767px)
└─ grid-cols-1
   └─ 1 column, full width
      └─ Good for: phones, small screens

Tablet (768px - 1023px)
└─ md:grid-cols-2
   └─ 2 columns, 50% width each
      └─ Good for: tablets, large phones

Desktop (1024px+)
└─ lg:grid-cols-4
   └─ 4 columns, 25% width each
      └─ Good for: desktop, large monitors
```

---

## 🖼️ Post UI States

### Image Post
```
┌──────────────┐
│  Instagram   │
│  Post Image  │
│  (No icon)   │
└──────────────┘
  ↓ Click
  Opens on Instagram
```

### Video Post
```
┌──────────────┐
│  Instagram   │
│  Video       │
│  Thumbnail   │ ← Uses thumbnail_url
│              │
│    ▶ Play    │ ← Indicator overlay
│              │
└──────────────┘
  ↓ Click
  Opens on Instagram
```

### Carousel Post
```
┌──────────────┐
│  Instagram   │
│  Carousel    │
│  First Image │
│              │
│    [⊞]       │ ← Multi-image icon
│              │
└──────────────┘
  ↓ Click
  Opens on Instagram (shows all images)
```

---

## 📊 Cache & Revalidation

```
First Request (t=0:00)
├─ API Route Handler executes
├─ Fetches from Instagram API
├─ Response cached
└─ Browser receives data
   ↓ (display)
   Instagram feed shows

Requests (t=0:01 to t=59:59)
├─ All requests use cached data
├─ No API calls made
└─ Instant response (<100ms)
   ↓ (display)
   Same Instagram feed

Next Revalidation (t=60:00)
├─ Next request triggers revalidation
├─ Fresh fetch from Instagram API
├─ Cache updated
└─ Browser receives new data
   ↓ (display)
   Updated Instagram feed

This repeats every 1 hour...
```

---

## 🧪 Testing Checklist

### Local Testing
```
✓ npm run dev
✓ Visit http://localhost:3000
✓ Scroll to "On The Gram" section
✓ Verify 8 posts appear
✓ Check grid layout:
  - Mobile: 1 column ✓
  - Tablet: 2 columns ✓
  - Desktop: 4 columns ✓
✓ Click a post → opens Instagram
✓ Check video indicators show ✓
✓ Check carousel indicators show ✓
✓ No errors in console ✓
```

### Production Testing
```
✓ Deploy to production
✓ Verify env var set in Vercel
✓ Visit production URL
✓ Repeat above checks
✓ Check performance (Lighthouse)
✓ Monitor in Google Analytics
```

---

## 📈 Performance Optimization

```
Image Optimization:
├─ Next.js Image component
├─ Lazy loading
├─ Responsive sizing
└─ ~50KB per image (compressed)

Data Caching:
├─ ISR (1-hour cache)
├─ 1 API call per hour
├─ Instant response for 59 minutes
└─ Automatic background updates

Bundle Impact:
├─ Component: ~2KB
├─ API Route: ~1KB
├─ Total impact: minimal
└─ No performance hit
```

---

## 🚀 Deployment Checklist

```
Before Deployment:
├─ Token generated ✓
├─ .env.local created ✓
├─ Local testing done ✓
├─ No errors in console ✓
└─ Component renders ✓

During Deployment:
├─ Git add/commit ✓
├─ Push to repository ✓
├─ Vercel auto-deploys ✓
└─ Builds successfully ✓

After Deployment:
├─ Add env var to Vercel ✓
├─ Redeploy (or auto-redeployed) ✓
├─ Visit production URL ✓
├─ Verify posts appear ✓
├─ Check no errors ✓
└─ Monitor performance ✓
```

---

## 🎨 Styling Reference

```
Colors Used:
├─ Background: #FAF0E6 (cream)
├─ Text: #3B241A (dark brown)
├─ Accent: #DC7C7C (dusty rose)
├─ Muted: #A68B7E (taupe)
└─ Border: #3B241A/5 to #3B241A/10

Responsive Classes:
├─ Mobile: grid-cols-1
├─ Tablet: md:grid-cols-2 (768px+)
├─ Desktop: lg:grid-cols-4 (1024px+)
├─ Padding: px-6 (horizontal)
├─ Spacing: gap-6 (between items)
└─ Rounded: rounded-2xl (images)

Interactive Elements:
├─ Buttons: px-8 py-3 rounded-full
├─ Links: text-[#3B241A] hover:text-[#FAF0E6]
├─ Transitions: duration-300
└─ Shadows: hover:shadow-xl
```

---

This visual guide should help you understand exactly how everything works together! 🎉

**Created**: March 3, 2026  
**Status**: ✅ Complete Reference

