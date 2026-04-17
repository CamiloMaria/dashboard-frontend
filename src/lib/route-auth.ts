// Auth disabled: login flow removed from this project.
// Kept as a no-op so existing `beforeLoad` calls in app routes keep compiling
// without changes. Restore this file to re-enable permission-based gating.

// import { redirect } from '@tanstack/react-router';
// import { ROUTES, BASE_PATH } from '@/constants/routes';
// import { authApi } from '@/api/auth';

// // Cache for user permissions to avoid multiple API calls
// let userPermissionsCache: string[] | null = null;
// let permissionsCacheTimestamp: number = 0;
// const CACHE_LIFETIME_MS = 60 * 1000; // 1 minute cache lifetime

// // Helper function to get user permissions from API
// async function getUserPermissions(): Promise<string[] | null> {
//   // Check if we have valid cached permissions
//   const now = Date.now();
//   if (userPermissionsCache && (now - permissionsCacheTimestamp) < CACHE_LIFETIME_MS) {
//     return userPermissionsCache;
//   }

//   try {
//     const response = await authApi.getUser();
//     userPermissionsCache = response.data.user.allowedPages;
//     permissionsCacheTimestamp = now;
//     return userPermissionsCache;
//   } catch {
//     // API request failed, likely due to invalid/missing authentication
//     userPermissionsCache = null;
//     return null;
//   }
// }

export async function requireAuth(allowedPath: string): Promise<void> {
  // No-op: authentication is disabled for this demo deployment.
  void allowedPath;
  return;
}
