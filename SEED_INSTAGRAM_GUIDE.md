# 🌱 How to Seed Your Instagram Database

## Method 1: Admin Panel (Easiest) ✅ **RECOMMENDED**

### Steps:
1. **Start your development server**
   ```bash
   npm run dev
   ```

2. **Navigate to seed page**
   - Open: `http://localhost:3000/admin/seed`
   - Or use global search: `Cmd+K` → type "seed"

3. **Click "Seed Database" button**
   - One-click seeding
   - Instant success feedback
   - No environment variables needed

4. **Done!** Your Instagram data is now in MongoDB

---

## Method 2: Command Line Script

### Prerequisites:
1. **Ensure `.env.local` exists** with:
   ```
   MONGODB_URI=your_mongodb_connection_string_here
   ```

2. **Run the seed script:**
   ```bash
   npm run seed-instagram
   ```

3. **Expected output:**
   ```
   🌱 Starting Instagram database seed...
   📡 Connecting to MongoDB...
   ✅ Connected to MongoDB
   📝 Seeding Instagram data...
   ✅ Instagram data seeded successfully!
   ```

### Troubleshooting:
- **"MONGODB_URI is not set"**
  - Add `MONGODB_URI` to your `.env.local` file
  - Or use the admin panel method instead

- **"Cannot connect to MongoDB"**
  - Verify your MongoDB URI is correct
  - Check MongoDB is running
  - Try the admin panel method instead

---

## Method 3: Manual API Call

If you have an API client (like Postman or curl):

```bash
curl -X PUT http://localhost:3000/api/admin/instagram \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "profileUrl": "https://www.instagram.com/moreofisha._/",
    "profileHandle": "moreofisha._",
    "posts": [
      { "id": "post1", "url": "https://www.instagram.com/p/DRpYFwQDyXb/" },
      { "id": "post2", "url": "https://www.instagram.com/p/DUBGMakE2s5/" }
    ]
  }'
```

---

## 🎯 Recommended: Use Admin Panel

**The easiest and most reliable method is using the admin panel:**

1. Go to: `http://localhost:3000/admin/seed`
2. Click: "Seed Database"
3. Done! ✨

No environment variables needed. No terminal commands. Just one click!

---

## ✅ After Seeding

### Your Instagram data is now:
- ✅ Stored in MongoDB
- ✅ Accessible via admin panel (`/admin/instagram`)
- ✅ Displayed on your frontend
- ✅ Ready to manage

### Next: Manage Your Data
Go to: `http://localhost:3000/admin/instagram`
- Edit profile handle
- Update profile URL
- Add/remove posts
- Save changes

---

## 📚 Documentation

| Document | Location |
|----------|----------|
| Database Seeding Guide | `/docs/INSTAGRAM_DATABASE_SEEDING.md` |
| Admin Panel Guide | `/docs/INSTAGRAM_ADMIN_PANEL.md` |
| Quick Reference | `/docs/INSTAGRAM_QUICK_REFERENCE.md` |

---

## 💡 The Best Way: Admin Panel

```
http://localhost:3000/admin/seed
         ↓
    Review Data
         ↓
   Click Button
         ↓
  Success! ✨
```

**Try it now!** 🚀

