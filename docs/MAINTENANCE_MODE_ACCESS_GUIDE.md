# 🎛️ How to Access Maintenance Mode in Admin UI

## Quick Navigation

### Step 1: Go to Admin Dashboard
```
https://yoursite.com/admin
```

### Step 2: Find "Settings" Card
In the **System** section at the bottom of the admin dashboard, you'll see a card labeled:
- **Title**: "Settings"
- **Description**: "Site Config"
- **Icon**: ⚙️ (gear icon)
- **Color**: Dark brown (#3B241A)

### Step 3: Click on Settings
Click the Settings card to navigate to `/admin/settings`

### Step 4: Access Maintenance Mode Toggle
On the Settings page, you'll see:

```
┌─────────────────────────────────────────────┐
│  🔧 Maintenance Mode                        │
├─────────────────────────────────────────────┤
│                                             │
│  Status: ✅ Live Mode                      │
│  "Your site is live and accessible..."     │
│                                 [Toggle] ←─ Click here
│                                             │
│  Or: 🔧 Maintenance Mode Active            │
│  "Your site is under maintenance..."       │
│                                 [Toggle] ←─ Click here
│                                             │
│  ─────────────────────────────────────────  │
│  Maintenance Message (if enabled):          │
│  [Text area to edit message]                │
│  [Update Message button]                    │
│                                             │
└─────────────────────────────────────────────┘
```

## Complete Path

**Admin Dashboard** → **System Section** → **Settings Card** → **Maintenance Mode Toggle**

or directly:
```
https://yoursite.com/admin/settings
```

## What You Can Do:

### 🔴 Enable Maintenance Mode
1. Click the toggle button
2. Site becomes inaccessible to visitors
3. Non-admin users see maintenance page
4. Admins can still access everything

### 📝 Custom Message (Optional)
1. When maintenance mode is ON, an editable message field appears
2. Write your custom message
3. Click "Update Message" button

### 🟢 Go Back to Live
1. Click the toggle button again
2. Site is immediately live for all visitors

## Tips
- Use **Cmd+K** (Mac) or **Ctrl+K** (Windows) from admin dashboard to search and jump directly to Settings
- Search for "Settings" in the spotlight search for quick access
- The toggle provides instant feedback (success/error notifications)

---

**That's it!** 🎉 Settings page has everything you need for maintenance mode.

