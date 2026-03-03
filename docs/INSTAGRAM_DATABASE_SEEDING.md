# Instagram Database Seeding Guide

## 🌱 What is Database Seeding?

Database seeding is the process of populating your MongoDB database with initial data. This is useful for:
- Setting up initial Instagram configuration
- Resetting data to defaults
- Migrating data between environments

## 📍 Access the Seed Page

### Method 1: Direct URL
Navigate to: `/admin/seed`

### Method 2: Global Search
1. Press **Cmd+K** (Mac) or **Ctrl+K** (Windows)
2. Search: **"seed"** or **"database"**
3. Click **"Seed Database"**

## 🚀 How to Seed the Database

### Step 1: Navigate to Seed Page
Use any of the access methods above

### Step 2: Review Data
The page displays all data that will be seeded:
- **Profile Handle:** moreofisha._
- **Profile URL:** https://www.instagram.com/moreofisha._/
- **Post 1:** https://www.instagram.com/p/DRpYFwQDyXb/
- **Post 2:** https://www.instagram.com/p/DUBGMakE2s5/

### Step 3: Click "Seed Database"
A single button click populates all data

### Step 4: Confirm Success
You'll see:
- ✅ Success message
- Profile name displayed
- Number of posts seeded

## 💾 What Gets Seeded?

The MongoDB `instagram` collection receives:

```json
{
  "profileUrl": "https://www.instagram.com/moreofisha._/",
  "profileHandle": "moreofisha._",
  "posts": [
    {
      "id": "post1",
      "url": "https://www.instagram.com/p/DRpYFwQDyXb/"
    },
    {
      "id": "post2",
      "url": "https://www.instagram.com/p/DUBGMakE2s5/"
    }
  ],
  "createdAt": "2024-01-01T...",
  "updatedAt": "2024-01-01T..."
}
```

## 🔄 Update vs Seed

| Action | Result |
|--------|--------|
| **Seed** | Creates new document or updates existing one |
| **Update** | Modifies specific fields via admin panel |
| **Delete** | Removes document (not available) |

## ⚠️ Important Notes

- **Non-Destructive:** Seeding won't delete existing data, it will update/merge
- **Admin Only:** Requires admin authentication
- **Instant Effect:** Changes appear immediately in database
- **One-Time Only:** You typically seed once, then edit via admin panel

## 🐛 Troubleshooting

### "Not authorized" error
- Ensure you're logged in as admin
- Check Firebase authentication
- Verify admin claims

### "Failed to seed database" error
- Check internet connection
- Verify MongoDB connection in your backend
- Check browser console for details

### Changes not reflecting on site
- Clear browser cache
- Refresh the page
- Wait a few seconds for database sync

## 📚 Related Files

- Seed Component: `/components/InstagramSeedComponent.tsx`
- Seed Page: `/app/admin/seed/page.tsx`
- Admin Instagram: `/app/admin/instagram/page.tsx`
- API Route: `/api/admin/instagram/route.ts`

## 🔒 Security

- ✅ Admin-only access
- ✅ Firebase authentication required
- ✅ Token-based API calls
- ✅ Server-side verification

## 💡 Best Practices

1. **First Time Setup:** Use seed page to initialize data
2. **Regular Updates:** Use admin panel to manage data
3. **Backup:** Keep a note of important URLs before seeding
4. **Testing:** Verify on frontend after seeding

## 🎯 After Seeding

1. Instagram admin page is ready at `/admin/instagram`
2. Frontend component will display seeded data
3. You can now manage data via admin panel
4. All changes are saved to MongoDB

## 📞 Quick Links

- **Instagram Admin:** `/admin/instagram`
- **Seed Database:** `/admin/seed`
- **Global Search:** Cmd+K / Ctrl+K
- **API Endpoint:** `/api/admin/instagram`

---

**Ready to seed? Navigate to `/admin/seed` and click the button!** 🌱✨

