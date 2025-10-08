# Email Confirmation Fix Guide

## Problem
Email confirmation links are being sent to `localhost:3000` but need to go to the sandbox URL.

## Solutions Implemented

### 1. Universal Email Confirmation Handler
Created `/auth/confirm` route that handles both:
- Old localhost URLs (redirected manually) 
- New proper URLs (when Supabase is configured correctly)

### 2. Multiple URL Formats Supported
The confirmation handler supports:
- Query parameters: `/auth/confirm?token=xxx&type=signup`
- Hash parameters: `/auth/confirm#access_token=xxx&type=signup` 
- Token exchange: For newer Supabase setups

### 3. Smart Redirects
After confirmation, automatically detects:
- Admin users → redirects to `/admin/dashboard`
- Regular vendors → redirects to `/vendor/dashboard`

## How to Use

### For Existing Broken Links
If you have a broken confirmation link like:
```
http://localhost:3000/#access_token=eyJ...&refresh_token=abc...&type=signup
```

Replace `localhost:3000` with the sandbox URL:
```
https://3000-i39lv5760p8w8ozqnpzp4-6532622b.e2b.dev/auth/confirm#access_token=eyJ...&refresh_token=abc...&type=signup
```

### For New Registrations
New users will receive properly formatted confirmation emails once Supabase is configured.

## Testing the Fix

1. **Test the confirmation handler directly:**
   - Visit: https://3000-i39lv5760p8w8ozqnpzp4-6532622b.e2b.dev/auth/confirm
   - Should show "Confirmation Failed" with helpful error message

2. **Test with a real broken link:**
   - Take your broken localhost link
   - Replace the domain with the sandbox URL
   - Add `/auth/confirm` to the path if needed

## Supabase Configuration (To Fix Future Emails)

To fix future confirmation emails, update Supabase settings:

1. Go to Supabase Dashboard → Authentication → Settings
2. Update Site URL to: `https://3000-i39lv5760p8w8ozqnpzp4-6532622b.e2b.dev`
3. Add Redirect URLs:
   - `https://3000-i39lv5760p8w8ozqnpzp4-6532622b.e2b.dev/auth/confirm`
   - `https://3000-i39lv5760p8w8ozqnpzp4-6532622b.e2b.dev/auth/verify`
   - `https://3000-i39lv5760p8w8ozqnpzp4-6532622b.e2b.dev/**`

## Available Confirmation Routes

1. `/auth/confirm` - Universal handler (NEW, recommended)
2. `/auth/verify` - Hash-based handler (existing)
3. Manual token verification (via scripts)

All routes now support instant redirects (no delays) and smart admin/vendor detection.