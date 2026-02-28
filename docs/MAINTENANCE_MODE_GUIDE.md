# Maintenance Mode Implementation Guide

## Overview
A complete maintenance mode system for your admin panel with easy toggle between live and maintenance modes.

## Files Created

### 1. **API Route** (`/app/api/admin/maintenance/route.ts`)
- **GET**: Fetches current maintenance mode status and custom message
- **POST**: Updates maintenance mode (requires admin authentication)
- Stores settings in MongoDB `settings` collection with key `maintenance_mode`

### 2. **Admin Settings Page** (`/app/admin/settings/page.tsx`)
- Beautiful toggle UI to switch between Live Mode and Maintenance Mode
- Custom maintenance message editor (only shown when maintenance mode is active)
- Real-time feedback with success/error messages
- Responsive design with Framer Motion animations

### 3. **Middleware** (`/middleware.ts`)
- Checks maintenance mode status on every request
- Caches status for 1 minute to reduce DB queries
- Bypasses maintenance mode for:
  - Admin routes (`/admin/*`)
  - Auth pages (`/auth/*`)
  - API routes (`/api/*`)
  - Static files
- Redirects non-admin users to `/maintenance` page

### 4. **Maintenance Page** (`/app/maintenance/page.tsx`)
- Beautiful, professional maintenance page shown to visitors
- Displays custom message from admin settings
- Animated background and UI elements
- Server-side rendered with proper metadata for SEO

## How It Works

### Enabling Maintenance Mode
1. Go to Admin Panel → Settings
2. Click the toggle button to enable Maintenance Mode
3. (Optional) Update the maintenance message
4. All non-admin visitors will see the maintenance page
5. Admin users can still access the full site

### Disabling Maintenance Mode
1. Click the toggle button again to go Live
2. Site is immediately accessible to all visitors

## Database Schema

Settings document structure:
```javascript
{
  key: "maintenance_mode",
  enabled: boolean,
  message: string,
  updatedAt: Date,
  updatedBy: string (admin uid)
}
```

## Key Features

✅ **Easy Toggle**: One-click switch between modes
✅ **Custom Messages**: Set custom maintenance message
✅ **Admin Access**: Admins can still use the site during maintenance
✅ **Caching**: 1-minute cache to minimize DB queries
✅ **Beautiful UI**: Professional maintenance page design
✅ **Fast Feedback**: Real-time success/error notifications
✅ **SEO Friendly**: Proper metadata on maintenance page
✅ **Production Ready**: Includes error handling and validation

## Usage Tips

- Use maintenance mode when:
  - Deploying major updates
  - Running database migrations
  - Performing critical security patches
  - Doing server maintenance

- Admin users can:
  - Still access all admin panels
  - View the site as it will appear to visitors
  - Edit the maintenance message in real-time

- Message best practices:
  - Keep it short and professional
  - Include estimated return time if known
  - Provide contact info for urgent matters
  - Add a personal touch with emojis

## Security Notes

- Maintenance mode check requires valid admin token
- Only admins can toggle maintenance mode
- Non-admin access is blocked at middleware level
- All changes are logged with admin UID and timestamp

---

**Status**: ✅ Fully Implemented and Ready to Use

