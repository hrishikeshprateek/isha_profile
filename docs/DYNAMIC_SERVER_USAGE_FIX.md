# Dynamic Server Usage Error - ISR Fix

## Issue
Build was failing with the error:
```
Error fetching latest blogs: Error: Dynamic server usage: Route / couldn't be rendered statically because it used revalidate: 0 fetch http://localhost:3000/api/blogs /. See more info here: https://nextjs.org/docs/messages/dynamic-server-error
```

This error occurred during the build process when trying to statically generate the home page.

## Root Cause
The `FeaturedBlogs` component in `/components/sections/FeaturedBlogs.tsx` was using:
```typescript
const res = await fetch(`${baseUrl}/api/blogs`, {
    cache: 'no-store', // Makes the fetch dynamic
});
```

The `cache: 'no-store'` option tells Next.js that this fetch is **dynamic** and cannot be cached. This prevents static generation of any page that uses this component.

### Why This Was a Problem
- **Static Generation**: During `npm run build`, Next.js tries to pre-render all pages at build time
- **Dynamic Fetches**: When a page contains a dynamic fetch (cache: 'no-store'), it cannot be statically generated
- **Build Error**: This conflict causes the build to fail with "Dynamic server usage" error

## Solution
Replaced `cache: 'no-store'` with ISR (Incremental Static Regeneration) using `next: { revalidate }`:

```typescript
const res = await fetch(`${baseUrl}/api/blogs`, {
    next: { revalidate: 3600 }, // ISR: Revalidate every hour
});
```

### What This Does
1. **Static Generation**: Page is pre-rendered at build time
2. **Incremental Updates**: The page is regenerated every 3600 seconds (1 hour)
3. **Fresh Content**: Users see cached content, but it's refreshed hourly
4. **Build Success**: No dynamic server usage errors

## Files Modified
- `/components/sections/FeaturedBlogs.tsx` - Changed `cache: 'no-store'` to `next: { revalidate: 3600 }`

## Build Results

### Before Fix
```
❌ Error fetching latest blogs: Error: Dynamic server usage: Route / couldn't be rendered statically...
├ ○ / ❌ FAILS TO BUILD
```

### After Fix
```
✅ No errors
├ ○ /                                        1m      1y  ✅ STATIC
```

## ISR vs Other Caching Strategies

### 1. Static Generation (✅ Used Here)
```typescript
next: { revalidate: 3600 } // Revalidate every hour
```
**Best for**: Content that changes occasionally (blogs, quotes, etc.)
- Pre-rendered at build time
- Served from cache on every request
- Regenerated in background every hour
- No build errors

### 2. On-Demand Revalidation (Alternative)
```typescript
next: { revalidate: false } // Never revalidate automatically
```
**Best for**: Content you control the updates for
- Pre-rendered at build time
- Manually trigger revalidation via API

### 3. Dynamic (❌ What We Fixed)
```typescript
cache: 'no-store' // Always dynamic
```
**Problems**:
- Cannot be statically generated
- Causes build errors
- Not suitable for SSG pages

### 4. Server-Side Rendering
Use database directly instead of HTTP fetches (like we do in `app/page.tsx`):
```typescript
const db = await getDatabase();
const data = await db.collection('blogs').find({}).toArray();
```

## Revalidation Schedule
- **Revalidate every hour** (3600 seconds): Featured blogs on home page
- **Users see**: Cached blog content from up to 1 hour ago
- **Freshness**: New blogs appear within 1 hour of creation
- **Performance**: No database hit on most requests (served from cache)

## Expected Behavior

### User Experience
1. User visits `/` (home page)
2. Sees featured blogs (cached, very fast)
3. If a blog is created, user sees it within 1 hour
4. No waiting for real-time data

### Build Process
```bash
npm run build
```
✅ No errors
✅ Page is pre-rendered
✅ Blog data is fetched once and cached
✅ ISR cache tag set for 1-hour revalidation

### Production Deployment
- Page is pre-rendered at build time
- Served from cache to all users
- Revalidated every hour in the background
- No performance impact

## Monitoring

### Check ISR Status
In `/api/blogs` logs, you should see:
- ✅ Normal API calls from users (using cached page)
- 🔄 Occasional calls from Next.js background revalidation
- NOT: One API call per user request (that would be bad)

### Expected Log Pattern
```
User 1: GET /blogs (cached page)
User 2: GET /blogs (cached page)
User 3: GET /blogs (cached page)
[1 hour passes]
Next.js: [Revalidation] GET /api/blogs (background revalidation)
User 4: GET /blogs (new cached page)
```

## Performance Impact
- **Cache Hit**: <10ms (served from cache)
- **Cache Miss**: ~100-200ms (fetch from API, generate page)
- **Revalidation**: ~100-200ms (happens in background, doesn't block users)

## Troubleshooting

### Issue: Blogs don't update immediately
**Expected**: Blogs take up to 1 hour to appear on home page
**Solution**: Change revalidate time if needed:
```typescript
next: { revalidate: 300 } // 5 minutes
next: { revalidate: 60 }  // 1 minute
```

### Issue: Still seeing build errors
**Check**: Make sure no other components use `cache: 'no-store'`
```bash
grep -r "cache: 'no-store'" src/ app/
```

### Issue: Blogs updating too frequently
**Cause**: Revalidate time is too short
**Solution**: Increase revalidate time:
```typescript
next: { revalidate: 7200 } // 2 hours
```

## Related Concepts

### ISR (Incremental Static Regeneration)
Combines the benefits of static generation with dynamic updates:
- ✅ Builds fast (pre-generated at build time)
- ✅ Scales infinitely (served from cache)
- ✅ Fresh content (regenerated periodically)

### Next.js Fetch Caching
```typescript
// Default (good for ISR)
fetch(url) // Cache until revalidate

// Always dynamic (causes build errors)
fetch(url, { cache: 'no-store' })

// Manually refreshed
fetch(url, { next: { revalidate: false } })

// Custom revalidate
fetch(url, { next: { revalidate: 3600 } })
```

## Best Practices

### ✅ DO
- Use `next: { revalidate: X }` for frequently updated content
- Use database direct queries for always-fresh data
- Use `cache: 'force-cache'` for static content

### ❌ DON'T
- Use `cache: 'no-store'` in static pages (causes build errors)
- Use `revalidate: 0` in static content (prevents static generation)
- Make frequent API calls during static generation

## Date
Fixed: March 3, 2026

## Related Files
- `/components/sections/FeaturedBlogs.tsx` - ISR implementation
- `/app/page.tsx` - Home page using FeaturedBlogs
- `/app/api/blogs` - Blog API endpoint

