# Bug Fixes Applied

## 1. Profile Edit Button Not Working
**Issue**: Clicking Edit button on profile page did nothing.
**Root cause**: `startEditProfile()` was async and conditionally fetched profile, sometimes failing silently.
**Fix**: Made function synchronous — always opens edit form, populates from profile or empty defaults.
**File**: `ecommerce-client/src/app/account/page.tsx`

## 2. Profile Save Not Persisting (Zod Validation)
**Issue**: Saving profile changes appeared to work but data wasn't saved.
**Root cause**: Zod validation rejected empty strings:
- `gender: z.enum(["male","female","other"])` rejected `""` (the "Optional" default)
- `name: z.string().min(1)` rejected `""` when name was cleared
**Fix**:
- Backend: Changed to `z.enum([...]).or(z.literal("")).optional()`
- Backend: Controller converts `""` → `null` for all nullable fields
- Frontend: Filters payload to only send non-empty values
- Frontend: Shows error message on failure instead of silently catching
**Files**: `user.routes.ts`, `user.controller.ts`, `account/page.tsx`

## 3. Photo Upload Fails (URL Validation)
**Issue**: Uploading profile photo via file input failed silently.
**Root cause**: `avatar: z.string().url()` rejected base64 data URLs (`data:image/...`).
**Fix**: Changed to `z.string().optional().or(z.literal(""))` — accepts any string.
**File**: `user.routes.ts`

## 4. Request Too Large (413 Error)
**Issue**: Uploading photos resulted in 413 Payload Too Large error.
**Root cause**: `express.json({ limit: "1mb" })` — a 2MB image becomes ~2.7MB after base64 encoding.
**Fix**: Increased limit to `3mb`.
**File**: `ecommerce-api/src/app.ts`

## 5. SSR Document Error
**Issue**: `document is not defined` error when using `createPortal` for search backdrop.
**Root cause**: `document.body` accessed during server-side rendering.
**Fix**: Added `mounted` state, gate portal rendering with `mounted && createPortal(...)`.
**File**: `site-header.tsx`

## 6. Search Bar Not Functional
**Issue**: Search input was static, didn't actually search.
**Fix**: Wrapped in `<form onSubmit>`, navigates to `/search?q=...` on Enter.
**File**: `site-header.tsx`
