# How to Get Your Instagram Access Token - Complete Step-by-Step Guide

## 📌 What You Need

Based on Facebook's documentation, for your Instagram feed integration you need:
- **Type**: User Access Token (converted to Long-Lived)
- **Duration**: 60 days
- **Use**: Server-side API calls in your Next.js backend

---

## 🎯 Step-by-Step Process

### Phase 1: Facebook Developer Setup (10 minutes)

#### Step 1.1: Create/Login to Facebook Developer Account
1. Go to: https://developers.facebook.com
2. Click "Get Started" or sign in
3. Verify your email if prompted

#### Step 1.2: Create a New App
1. Click "My Apps" (top right)
2. Click "Create App"
3. Select app type: **Business** (or Consumer)
4. Fill in details:
   - **App Name**: "IshaRani Instagram Feed" (or similar)
   - **App Purpose**: Choose relevant category
   - Click "Create App"

#### Step 1.3: Add Instagram Basic Display Product
1. Once app created, go to your app dashboard
2. Click "Add Product"
3. Find "Instagram Basic Display"
4. Click "Set Up"
5. Accept the terms

#### Step 1.4: Save Your App Credentials
1. Go to **Settings → Basic** (left sidebar)
2. **Copy and save**:
   - **App ID** (you'll need this)
   - **App Secret** (keep this safe, never share!)

**Important**: Store these safely in a text file temporarily.

---

### Phase 2: Generate Short-Lived Token (5 minutes)

#### Step 2.1: Use Graph API Explorer
1. Go to: https://developers.facebook.com/tools/explorer
2. In the top dropdown, **select your app** you just created
3. In the dropdown next to it, click "Get Access Token"
4. A popup appears → Click "Instagram Basic Display"
5. Select your Instagram account (the one managing the website)
6. Click "Authorize"
7. A **short-lived token** appears in the text field

**This token looks like**:
```
IGQVJXa1k4WW9DdWtLak5jRzBrX0JYNV...very long string...
```

**⚠️ Important**: This token **expires in ~2 hours**. Don't use this directly in production.

---

### Phase 3: Convert to Long-Lived Token (5 minutes)

According to Facebook docs, you need to convert this to a 60-day token using a server call.

#### Step 3.1: Make API Call to Get Long-Lived Token

Use this command in your terminal (replace the values):

```bash
curl -i -X GET "https://graph.instagram.com/access_token?grant_type=ig_refresh_token&access_token=YOUR_SHORT_LIVED_TOKEN&client_secret=YOUR_APP_SECRET"
```

**Replace**:
- `YOUR_SHORT_LIVED_TOKEN`: The token you got from Step 2.1
- `YOUR_APP_SECRET`: Your App Secret from Step 1.4

**Example** (don't use this):
```bash
curl -i -X GET "https://graph.instagram.com/access_token?grant_type=ig_refresh_token&access_token=IGQVJXa1k4WW9...&client_secret=abc123def456..."
```

#### Step 3.2: Copy the Long-Lived Token

The response will look like:
```json
{
  "access_token": "IGQVJXa1k4WW9CdWtLak5jRzBrX0JYNV...THIS_IS_YOUR_LONG_LIVED_TOKEN...",
  "token_type": "bearer"
}
```

**Copy** the `access_token` value (this is your **60-day token**)

---

### Phase 4: Add to Your Project (2 minutes)

#### Step 4.1: Update `.env.local`

1. Open your project root
2. Create or edit `.env.local`
3. Add:

```env
INSTAGRAM_ACCESS_TOKEN=IGQVJXa1k4WW9CdWtLak5jRzBrX0JYNV...paste_your_long_lived_token_here...
NEXT_PUBLIC_SITE_URL=https://www.isharani.in
```

**Important**:
- Replace the token value with YOUR actual token
- Keep `.env.local` in `.gitignore` (already done)
- Never commit this file
- Never share the token

#### Step 4.2: Verify Setup

```bash
# Check file exists
ls -la .env.local

# You should see the file listed
```

---

### Phase 5: Test Locally (5 minutes)

#### Step 5.1: Restart Development Server

```bash
npm run dev
```

#### Step 5.2: Visit Homepage

1. Open: http://localhost:3000
2. Scroll down to "On The Gram" section
3. **You should see your Instagram posts!**

If posts appear:
- ✅ Token is valid
- ✅ API integration works
- ✅ Ready to deploy

If posts don't appear:
- Check browser console for errors
- Check server logs
- Verify token in `.env.local`
- Verify token hasn't expired

---

### Phase 6: Deploy to Production (3 minutes)

#### Step 6.1: Add Environment Variable to Vercel

1. Go to Vercel Dashboard
2. Select your project
3. Go to **Settings → Environment Variables**
4. Add new variable:
   - **Name**: `INSTAGRAM_ACCESS_TOKEN`
   - **Value**: Your long-lived token
   - **Environments**: Select all (Production, Preview, Development)
5. Click "Save"

#### Step 6.2: Deploy

```bash
git add .
git commit -m "Add Instagram feed integration"
git push
```

Vercel auto-deploys. Once live, your Instagram feed should show on the production site.

---

## 📊 Token Comparison

| Aspect | Short-Lived | Long-Lived |
|--------|------------|-----------|
| Duration | ~2 hours | ~60 days |
| Generation | Graph API Explorer | Manual API call |
| Use | Testing only | Production |
| Your case | Skip ✓ | **Use this** ✓ |

---

## 🔄 Token Refresh (When It Expires)

After 60 days, your token expires. To refresh:

1. Follow **Phase 2** again (get short-lived token)
2. Follow **Phase 3** again (convert to long-lived)
3. Update `.env.local` or Vercel env variable
4. Redeploy

**Tip**: Set a calendar reminder at day 55 to refresh before expiration.

---

## ✅ Checklist

- [ ] Created Facebook Developer Account
- [ ] Created App
- [ ] Added Instagram Basic Display Product
- [ ] Saved App ID and App Secret
- [ ] Generated Short-Lived Token
- [ ] Converted to Long-Lived Token (60-day)
- [ ] Added to `.env.local`
- [ ] Tested locally (`npm run dev`)
- [ ] Saw Instagram posts on homepage ✓
- [ ] Deployed to production
- [ ] Added token to Vercel environment variables
- [ ] Verified posts show on production site

---

## 🚨 Troubleshooting

### Issue: "Instagram feed not available"
**Cause**: Token is invalid or expired  
**Fix**:
1. Check token in `.env.local` is correct
2. Check token hasn't expired (max 60 days)
3. Regenerate token from Step 2-3

### Issue: 401 Unauthorized Error
**Cause**: Token is invalid or account doesn't have permission  
**Fix**:
1. Verify token is correct
2. Verify account is authorized
3. Regenerate fresh token

### Issue: No Instagram posts appear
**Cause**: Account has no public posts  
**Fix**:
1. Ensure your Instagram account has public posts
2. Make sure posts aren't archived
3. Wait a few seconds for cache to update

### Issue: "Token not configured"
**Cause**: `.env.local` not set up  
**Fix**:
1. Create `.env.local` file in project root
2. Add `INSTAGRAM_ACCESS_TOKEN=your_token`
3. Restart dev server

---

## 🔐 Security Best Practices

✅ **DO**:
- Store token in `.env.local` (development)
- Store token in Vercel secrets (production)
- Use HTTPS for all API calls
- Rotate token every 60 days
- Keep App Secret safe

❌ **DON'T**:
- Hardcode token in code
- Commit `.env.local` to git
- Share token with anyone
- Use same token across multiple apps
- Log token in error messages

---

## 📱 After You Get Your Token

1. Add to `.env.local`
2. Run `npm run dev`
3. Visit http://localhost:3000
4. Scroll to "On The Gram" section
5. See your Instagram posts!
6. Deploy and celebrate! 🎉

---

## 📞 Need Help?

If you get stuck:
1. Check Facebook Docs: https://developers.facebook.com/docs/instagram-basic-display/get-started
2. Check error messages in browser console
3. Check server logs in terminal
4. Verify token in `.env.local`

---

**Ready to proceed?** Follow the steps above and let me know when you have your token! 📸

---

**Status**: Guide Complete  
**Time Required**: ~30 minutes total  
**Complexity**: Low (follow steps exactly)

