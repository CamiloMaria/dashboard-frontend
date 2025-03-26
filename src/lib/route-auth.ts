import { redirect } from '@tanstack/react-router';
import { ROUTES, BASE_PATH } from '@/constants/routes';
import { authApi } from '@/api/auth';

// Cache for user permissions to avoid multiple API calls
let userPermissionsCache: string[] | null = null;
let permissionsCacheTimestamp: number = 0;
const CACHE_LIFETIME_MS = 60 * 1000; // 1 minute cache lifetime

// Helper function to get user permissions from API
async function getUserPermissions(): Promise<string[] | null> {
  // Check if we have valid cached permissions
  const now = Date.now();
  if (userPermissionsCache && (now - permissionsCacheTimestamp) < CACHE_LIFETIME_MS) {
    return userPermissionsCache;
  }

  try {
    const response = await authApi.getUser();
    userPermissionsCache = response.data.user.allowedPages;
    permissionsCacheTimestamp = now;
    return userPermissionsCache;
  } catch {
    // API request failed, likely due to invalid/missing authentication
    userPermissionsCache = null;
    return null;
  }
}

export async function requireAuth(allowedPath: string) {
  // Get user permissions from API
  const permissions = await getUserPermissions();
  
  // If no permissions, redirect to login
  if (!permissions) {
    throw redirect({ to: ROUTES.AUTH.LOGIN });
  }

  // Check if user has access to the requested path
  const allowedPathWithoutBase = allowedPath.replace(BASE_PATH, '');
  
  // Check if any permission matches the requested path (exact match or using wildcards or path parameters)
  const hasPermission = permissions.some(path => {
    // Convert glob-style pattern to regex
    // First handle * wildcards
    let pattern = path.replace(/\*/g, '.*');
    
    // Handle route parameters (e.g., $productId) - replace with pattern that matches any value
    pattern = pattern.replace(/\$\w+/g, '[^/]+');
    
    const regex = new RegExp(`^${pattern}$`);
    return regex.test(allowedPathWithoutBase);
  });

  if (!hasPermission) {
    throw redirect({ to: ROUTES.AUTH.LOGIN });
  }
} 