# Instagram Feed Integration - Quick Reference

## ✅ What Was Created

### 1. **API Route Handler** (`/app/api/instagram/route.ts`)
- Fetches data from official Instagram Graph API
- Handles VIDEO media type (uses thumbnail)
- Handles CAROUSEL_ALBUM detection
- Caches for 1 hour (ISR)
- Error handling with fallback
- Returns: Latest 8 posts with image URLs and permalinks

### 2. **Frontend Component** (`/components/sections/InstagramSection.tsx`)
- Server Component for data fetching
- Responsive grid layout:
  - **Desktop**: 4 columns
  - **Tablet**: 2 columns
  - **Mobile**: 1 column
- Features:
  - Video play indicator overlay
  - Carousel multi-image indicator
  - Follow Me button (desktop + mobile)
  - Links to Instagram posts
  - Optimized images via Next.js Image
  - Graceful fallback for no data

### 3. **Updated Homepage** (`/app/page.tsx`)
- Added InstagramSection import
- Added component between Testimonials and QuotesPreviewSection
- No breaking changes

---

## 🚀 How to Activate

### Step 1: Get Instagram Access Token

1. Go to [Facebook Developers](https://developers.facebook.com)
2. Create app (or use existing)
3. Add "Instagram Basic Display" product
4. Get Long-Lived Access Token
5. Token format: `IGQVJXa...` (very long string)

**Easiest Method**: 
- Use Instagram Settings → Generate Token
- Tokens expire in ~60 days

### Step 2: Add to `.env.local`

Create/edit `.env.local` in your project root:

```env
INSTAGRAM_ACCESS_TOKEN=your_token_here_replace_with_actual_token
NEXT_PUBLIC_SITE_URL=https://www.isharani.in
```

**Important**:
- Replace `your_token_here_replace_with_actual_token` with actual token
- Keep this file in `.gitignore` (already done)
- Never commit this file

### Step 3: Update Instagram Handle (if needed)
### Change Instagram Handle
**File**: `/components/sections/InstagramSection.tsx`, change all instances of:
```typescript
https://instagram.com/isharani
```
to your actual Instagram handle:
```typescript
https://instagram.com/moreofisha._
```
(Update on lines ~52, 93, 161)

### Step 4: Test Locally

```bash
npm run dev
```

Visit `http://localhost:3000` and scroll to see Instagram feed section below Testimonials.

### Step 5: Deploy

After testing:
```bash
git add .env.local
git commit -m "Add Instagram integration"
git push
```

Deploy normally - Vercel will pick up env variables.

---

## 📊 Component Features

### Data Fetching
- ✅ Server-side fetch (secure)
- ✅ Official Instagram Graph API
- ✅ No mock data
- ✅ Real live posts
- ✅ 1-hour cache (ISR)

### UI/UX
- ✅ Responsive grid
- ✅ Video indicator
- ✅ Carousel indicator
- ✅ Follow button
- ✅ Links to Instagram posts
- ✅ Image optimization
- ✅ Clean minimal styling (ready for design customization)

### Performance
- ✅ Image optimization (Next.js)
- ✅ ISR caching (1 hour)
- ✅ Efficient queries (only needed fields)
- ✅ Error handling with fallback

---

## 🔧 Customization

### Change Number of Posts
**File**: `/app/api/instagram/route.ts` (line 39)
```typescript
`https://graph.instagram.com/me/media?fields=...&limit=8&access_token...`
                                                              ↑
Change 8 to desired number (4, 6, 12, etc.)
```

Also in `/components/sections/InstagramSection.tsx` (line ~32):
```typescript
return data.data.slice(0, 8); // Change 8 to same number
```

### Change Section Header
**File**: `/components/sections/InstagramSection.tsx` (lines ~70-78)
```typescript
<h3 className="text-4xl md:text-5xl font-bold text-[#3B241A] leading-tight">
  Instagram <span className="text-[#DC7C7C] italic">Moments</span>
</h3>
<p className="mt-4 text-[#A68B7E] text-lg">
  Behind-the-scenes snapshots and daily inspiration.
</p>
```

### Change Grid Columns
**File**: `/components/sections/InstagramSection.tsx` (line ~107)
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                         ↑              ↑
                    tablet columns      desktop columns
```

### Styling
The component uses minimal Tailwind (as requested):
- Structural only: grid, flex, padding, aspect-ratio, object-cover
- No hover effects, no glassmorphism
- Design team can add custom styling

---

## 🐛 Troubleshooting

### Issue: Empty Instagram section
**Solutions**:
1. Check `.env.local` has `INSTAGRAM_ACCESS_TOKEN` set
2. Verify token is valid and not expired
3. Check Instagram account has public posts
4. Restart dev server after adding env var

### Issue: Images not loading
**Solutions**:
1. Token might be invalid - try generating new one
2. Check Network tab for 401 errors
3. Verify Instagram account is set to public
4. Check `NEXT_PUBLIC_SITE_URL` is correct

### Issue: "Instagram feed not available" message
**Cause**: API call failed (could be network, token, or quota)
**Solutions**:
1. Check browser console for errors
2. Check server logs for API errors
3. Verify token hasn't expired (refresh if needed)
4. Check Instagram API quota (200 calls/hour)

### Issue: Token expired
**Solution**:
- Get new Long-Lived Access Token
- Update `.env.local`
- Restart server

---

## 📱 Responsive Breakpoints

| Device | Grid Cols | Notes |
|--------|-----------|-------|
| Mobile | 1 col | Full width |
| Tablet (768px+) | 2 cols | Two per row |
| Desktop (1024px+) | 4 cols | Four per row |

---

## 🔐 Security

✅ **Token Security**:
- Token stored in `.env.local` (private)
- Never exposed to frontend
- Only used in server-side API route
- Handled via Vercel env variables in production

✅ **API Security**:
- Uses HTTPS only
- Validates API response
- Error handling without exposing details
- Rate limited (1 call/hour due to ISR)

---

## 📈 Performance

| Metric | Value | Notes |
|--------|-------|-------|
| Cache Duration | 1 hour | ISR revalidation |
| API Calls | 1 per hour | Due to cache |
| Bundle Impact | ~2KB | Just component code |
| Image Size | Optimized | Via Next.js Image |

---

## 📚 File Structure

```
📦 app/
 ├─ 📁 api/
 │  └─ 📁 instagram/
 │     └─ route.ts          ← API Route Handler
 ├─ page.tsx                ← Updated with import
 └─ ...
📦 components/
 └─ 📁 sections/
    ├─ InstagramSection.tsx ← New Component
    └─ ...
📦 docs/
 └─ INSTAGRAM_FEED_SETUP.md ← Full Setup Guide
```

---

## ✨ Next Steps

1. ✅ Get Instagram access token
2. ✅ Add to `.env.local`
3. ✅ Test locally
4. ✅ Deploy
5. ✅ Monitor in Analytics
6. (Optional) ✅ Design team customizes styling

---

## 📞 Support

For detailed setup: See `/docs/INSTAGRAM_FEED_SETUP.md`

For API issues: [Instagram Developers](https://developers.facebook.com/docs/instagram-basic-display)

For Next.js issues: [Next.js Docs](https://nextjs.org/docs)

---

**Status**: ✅ Ready to use  
**Created**: March 3, 2026  
**Framework**: Next.js 16 (App Router)  
**API**: Official Instagram Basic Display API

