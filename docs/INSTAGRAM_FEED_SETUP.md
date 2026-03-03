# Instagram Feed Integration - Setup Instructions

## Overview
This integration uses the official Instagram Basic Display API to fetch your latest Instagram posts and display them on your homepage.

## Prerequisites
- Instagram Business Account (or Creator Account)
- Facebook Developer Account
- Instagram Graph API Access

## Step 1: Get Your Instagram Access Token

### Option A: Quick Setup (Development)
1. Go to [Facebook Developers](https://developers.facebook.com)
2. Create an app (or use existing)
3. Add Instagram Basic Display product
4. Get your **Long-Lived Access Token** from Instagram Settings
5. Token looks like: `IGQVJXa...` (very long string)

### Option B: Production Setup (Recommended)
Follow [Instagram's Official Token Generation Guide](https://developers.facebook.com/docs/instagram-basic-display/get-started)

**Important**: 
- Long-lived tokens expire after ~60 days
- Refresh tokens periodically or implement auto-refresh
- Keep token secure (environment variable only, never in code)

## Step 2: Add Environment Variables

Add to `.env.local` in your project root:

```env
# Instagram API
INSTAGRAM_ACCESS_TOKEN=your_very_long_access_token_here
NEXT_PUBLIC_SITE_URL=https://www.isharani.in
```

**Note**: 
- `INSTAGRAM_ACCESS_TOKEN` is **private** (server-side only)
- `NEXT_PUBLIC_SITE_URL` is **public** (used in frontend)

## Step 3: Import Component into Homepage

Open `/app/page.tsx` and add the import:

```typescript
import InstagramSection from '@/components/sections/InstagramSection';
```

Then add the component to your page (usually before Footer):

```tsx
export default async function Home() {
  // ... existing code ...
  
  return (
    <div className="bg-[#FAF0E6]">
      <Navbar />
      <main>
        <HeroSection heroData={heroData} />
        <AboutSection aboutData={aboutData as unknown as any} />
        <ServicesSection servicesData={servicesData as unknown as any} />
        <ExpertiseSection />
        <FeaturedBlogs />
        <Testimonials />
        <InstagramSection />  {/* ADD THIS LINE */}
        <QuotesPreviewSection />
        <ContactSection />
        <Footer />
      </main>
    </div>
  );
}
```

## How It Works

### Data Flow
```
1. InstagramSection.tsx (Server Component)
   ↓
2. getInstagramPosts() function
   ↓
3. Fetch from /api/instagram (GET)
   ↓
4. API Route Handler (/app/api/instagram/route.ts)
   ↓
5. Instagram Graph API (Official)
   ↓
6. Response: Latest 8 posts with images
```

### Files Created
- **`/app/api/instagram/route.ts`** - API Route Handler
  - Fetches from official Instagram Graph API
  - Handles video/carousel detection
  - Uses thumbnail for videos
  - Caches for 1 hour (ISR)

- **`/components/sections/InstagramSection.tsx`** - Frontend Component
  - Server Component (data fetching)
  - Responsive grid (4-col desktop, 2-col mobile)
  - Indicators for videos and carousels
  - Follow button
  - Graceful fallback for no data

### Caching Strategy
- **API Cache**: 1 hour (revalidate: 3600)
- **ISR**: Content updates automatically after 1 hour
- **On-demand**: Use `revalidatePath('/api/instagram')` in admin to force refresh

## Features

✅ **Official API**: Uses Instagram Basic Display API  
✅ **Real Data**: No mock data, live posts  
✅ **Responsive**: 4-col (desktop), 2-col (tablet), 1-col (mobile)  
✅ **Video Support**: Shows video thumbnail with play indicator  
✅ **Carousel Support**: Shows carousel indicator  
✅ **Optimized Images**: Uses Next.js Image component  
✅ **Error Handling**: Graceful fallback if API fails  
✅ **ISR Caching**: Updates every hour automatically  
✅ **Security**: Token kept private (env var)  

## Troubleshooting

### Issue: "Instagram token not configured"
**Solution**: 
- Add `INSTAGRAM_ACCESS_TOKEN` to `.env.local`
- Restart dev server
- Check token format (should be very long)

### Issue: Empty feed
**Solution**:
- Verify access token is valid
- Check Instagram account has posts
- Token might be expired (refresh it)
- Check API response in Network tab

### Issue: Images not loading
**Solution**:
- Verify `NEXT_PUBLIC_SITE_URL` is correct
- Check Image domain in `next.config.ts` (already configured to accept **)
- Verify post's media_url is valid

### Issue: Slow loading
**Solution**:
- Cache is working (check revalidate time)
- Images are optimized via Next.js
- Consider reducing limit from 8 to 4 posts

## Customization

### Change Number of Posts
In `InstagramSection.tsx`, line ~32:
```typescript
return data.data.slice(0, 8); // Change 8 to desired number
```

Also update API route limit if needed (line ~33 in route.ts):
```typescript
&limit=8&  // Change to your desired limit
```

### Update Instagram Handle
In `InstagramSection.tsx`, update all instances of:
```typescript
https://instagram.com/isharani
```
to:
```typescript
https://instagram.com/moreofisha._
```

### Update Section Title/Subtitle
In `InstagramSection.tsx`, lines ~70-78:
```typescript
<h3 className="text-4xl md:text-5xl font-bold text-[#3B241A] leading-tight">
  Instagram <span className="text-[#DC7C7C] italic">Moments</span>
</h3>
<p className="mt-4 text-[#A68B7E] text-lg">
  Behind-the-scenes snapshots and daily inspiration.
</p>
```

## API Endpoints

### GET `/api/instagram`
Fetches latest Instagram posts.

**Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "post_id",
      "caption": "Post caption",
      "media_type": "IMAGE",
      "image_url": "https://...",
      "permalink": "https://instagram.com/p/..."
    }
  ],
  "count": 8
}
```

**Error Response**:
```json
{
  "error": "Failed to fetch Instagram data"
}
```

## Security Best Practices

1. **Never expose access token in code**
   - ✅ Use `.env.local` (private)
   - ❌ Don't hardcode token

2. **Keep token secure**
   - Rotate token every 60 days
   - Use secrets manager in production
   - Don't commit `.env.local`

3. **Use HTTPS only**
   - API calls use HTTPS
   - Never send token over HTTP

4. **Monitor token usage**
   - Check Instagram Developer Dashboard
   - Monitor API rate limits (200 calls/hour)

## Rate Limits
- Instagram API: 200 calls per hour per token
- Our implementation: 1 call per hour (due to ISR cache)
- Safe to use on production sites

## Next Steps

1. ✅ Create `.env.local` with `INSTAGRAM_ACCESS_TOKEN`
2. ✅ Add `InstagramSection` import to `/app/page.tsx`
3. ✅ Add `<InstagramSection />` to page JSX
4. ✅ Test locally: `npm run dev`
5. ✅ Deploy to production
6. ✅ Monitor in Google Analytics

## Support

For issues with:
- **Instagram API**: Check [Instagram Developer Docs](https://developers.facebook.com/docs/instagram-basic-display)
- **Next.js**: Check [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- **Token refresh**: Implement manual refresh or use [token refresh endpoint](https://developers.facebook.com/docs/instagram-basic-display/get-started)

---

**Last Updated**: March 3, 2026  
**Status**: ✅ Ready to use  
**Framework**: Next.js 16 (App Router)

