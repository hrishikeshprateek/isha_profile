# Instagram Token Generation - Fixed Method (No Errors!)

## ❌ Why You Got Error 190

The error `"Access token does not contain a valid app ID"` happens when:
1. Token doesn't belong to your app
2. Token generation process had an issue
3. Short-lived token wasn't properly converted
4. Using wrong app ID/secret pair

**Let's fix it with a clean, step-by-step approach.**

---

## ✅ Correct Method (Foolproof)

### Step 1: Verify Your App Credentials

1. Go to: https://developers.facebook.com
2. Click "My Apps" 
3. Select "Ishra Website" app
4. Go to **Settings → Basic**
5. You'll see:
   - **App ID**: A number (save this)
   - **App Secret**: A long string (save this, keep safe!)

**Write these down temporarily** (we'll use them in next step)

---

### Step 2: Generate Token Using This Exact Method

Use the **Access Token Tool** (easiest way):

1. Go to: https://developers.facebook.com/tools/accesstoken/
2. In dropdown at top, **select your app "Ishra Website"**
3. A token appears automatically below
4. **Copy the full token** (very long string starting with `IGQ...`)

**This is your short-lived token** (expires in ~2 hours)

---

### Step 3: Convert to 60-Day Token (MOST IMPORTANT)

Open your **terminal** and run this command **exactly**:

```bash
curl -X GET "https://graph.instagram.com/access_token?grant_type=ig_refresh_token&access_token=YOUR_SHORT_LIVED_TOKEN&client_secret=YOUR_APP_SECRET"
```

**Replace these two values**:
1. `YOUR_SHORT_LIVED_TOKEN` → The token from Step 2
2. `YOUR_APP_SECRET` → The App Secret from Step 1

**Example** (don't use this, use your real values):
```bash
curl -X GET "https://graph.instagram.com/access_token?grant_type=ig_refresh_token&access_token=IGQVJXa1k4WW9CdWtLak5jRzBrX0JYNV0R2lVMGdsQTVpd2ZAWVJydkZAhLUWRMLUFCVGFrWUlaSFJrbWFqV2Z0YlhxTDAwcUJ3b3VLd0NDU1ptRVpMaWlpRTBmVkJyNEZAhbGZ3TTJudDMxLVdzd&client_secret=abc123xyz456789"
```

---

### Step 4: Get Your Long-Lived Token from Response

After running the curl command, you'll get a response that looks like:

```json
{
  "access_token": "IGQVJXa1k4WW9CdWtLak5jRzBrX0JYNV...THIS_IS_YOUR_LONG_LIVED_TOKEN...",
  "token_type": "bearer"
}
```

**Copy the value of `access_token`** (this is your 60-day token)

---

### Step 5: Add to `.env.local`

1. In your project root, create/edit `.env.local`
2. Add:

```env
INSTAGRAM_ACCESS_TOKEN=IGQVJXa1k4WW9CdWtLak5jRzBrX0JYNV...paste_your_60_day_token_here...
NEXT_PUBLIC_SITE_URL=https://www.isharani.in
```

3. Save the file

---

### Step 6: Test Locally

```bash
# Restart dev server
npm run dev
```

Visit: http://localhost:3000

Scroll to "On The Gram" section and verify you see your Instagram posts! ✅

---

## 🛠️ If You Still Get Error 190

This means the token generation failed. Try this **alternative method**:

### Alternative: Use Web-Based Token Debugger

1. Go to: https://developers.facebook.com/tools/debug/
2. Paste your short-lived token
3. Check "User Token?" section
4. See if it shows your app ID matches

If it doesn't match, **regenerate the token from Step 2**.

---

## 📋 Checklist to Do Now

- [ ] Step 1: Get App ID and App Secret (5 min)
- [ ] Step 2: Generate short-lived token (2 min)
- [ ] Step 3: Run curl command to convert (1 min)
- [ ] Step 4: Copy long-lived token from response (1 min)
- [ ] Step 5: Add to `.env.local` (1 min)
- [ ] Step 6: Test with `npm run dev` (2 min)

**Total: ~12 minutes**

---

## ❓ Common Questions

**Q: Where do I run the curl command?**  
A: In your terminal/command prompt on your computer (same place you run `npm run dev`)

**Q: Is it safe to share these tokens?**  
A: **NO!** Keep them private. Never share in chat, commits, or public places.

**Q: How long does the 60-day token last?**  
A: Exactly 60 days from generation. After that, regenerate using the same steps.

**Q: Do I need to use App Secret in production?**  
A: No, once you have the 60-day token, only the token goes in `.env.local` / Vercel

---

## 🚀 Ready?

Follow the **6 steps above** and let me know:
1. When you have your short-lived token (Step 2)
2. If the curl command works (Step 3)
3. If you see posts on localhost (Step 6)

I'll help troubleshoot any issues! 📸

---

**Status**: Updated & Simplified  
**Error Fixed**: Token generation method improved  
**Time**: ~12 minutes to working Instagram feed

