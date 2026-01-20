# 🔧 Cloudinary Upload - Debugging Guide

## Issue: Images uploading but not showing preview

### 🔍 What to Check

#### **1. Open Browser Console**
When you upload an image, you should see these logs:
```
Upload response: { success: true, url: "https://...", ... }
Upload successful, URL: https://...
```

If you see an error instead, it will show:
```
Upload error: [error message]
```

#### **2. Check Network Tab**
1. Open DevTools → Network tab
2. Upload an image
3. Look for request to `/api/upload/cloudinary`
4. Check the response:
   - Should see: `{ success: true, url: "..." }`
   - If error: `{ success: false, error: "..." }`

#### **3. Verify Image URL**
The URL should look like:
```
https://res.cloudinary.com/dplr6ix16/image/upload/...
```

#### **4. Check Image Load**
If image URL is correct but still not showing:
- Right-click image URL → Open in new tab
- Should display the image
- If not, there's a CORS or URL issue

---

### ⚠️ Common Issues & Fixes

#### **Issue: "Upload failed" error**

**Possible causes:**
1. **Missing environment variables** - Check `.env.local`:
   ```
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dplr6ix16
   NEXT_PUBLIC_CLOUDINARY_API_KEY=468949168991438
   CLOUDINARY_API_SECRET=Gu8WZUeEStYS13ceQfIqjmoXc_A
   ```

2. **API Server Error (500)** - Check server logs:
   - Look for "Cloudinary upload error:" messages
   - Verify credentials in `.env.local`
   - Restart dev server: `npm run dev`

3. **Invalid file** - Ensure:
   - File is actually an image (JPG, PNG, GIF)
   - File size < 10MB
   - File is not corrupted

#### **Issue: Image URL correct but not displaying**

**Possible causes:**
1. **CORS issue** - Test URL directly in browser
2. **Invalid preview state** - Check browser console
3. **Image still loading** - Wait a moment, it's async

#### **Issue: Form not saving with image**

Make sure you're calling:
```typescript
onUploadComplete={(url) => setFormData({...formData, image: url})}
```

---

### 🧪 Quick Test

1. **Upload test image** to `/admin/blogs/create`
2. **Open DevTools** (F12)
3. **Go to Console tab**
4. **Look for these logs:**
   - ✅ `Upload response: { success: true, ... }`
   - ✅ `Upload successful, URL: https://...`
   - ✅ Image preview appears

If you see errors, share the console output.

---

### 📋 Step-by-Step Upload Process

1. User selects image
2. ↓ Component converts to Base64
3. ↓ Sends to `/api/upload/cloudinary`
4. ↓ Server uploads to Cloudinary
5. ↓ Cloudinary returns CDN URL
6. ↓ Response: `{ success: true, url: "..." }`
7. ↓ Preview displays image
8. ↓ `onUploadComplete` called with URL
9. ↓ Form data updated

---

### 🎯 Next Steps

1. **Try uploading an image** and check browser console
2. **Share any error messages** you see
3. **Check Network tab** for response details
4. **Restart dev server** if needed: `npm run dev`

Once you provide the console errors, I can fix the exact issue!

---

### ✅ If Working Correctly

You should see:
1. File picker opens on click ✅
2. Select image ✅
3. Console shows "Upload response" ✅
4. Image preview appears ✅
5. "Change Image" button shows ✅
6. Form data has image URL ✅

---

**Important:** Always check browser console (F12 → Console tab) for error details!

