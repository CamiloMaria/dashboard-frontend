import { jwtDecode } from "jwt-decode";
import { getAuthToken } from '@/lib/auth';
import { ROUTES } from '@/constants/routes';

interface JWTPayload {
  sub: string;
  username: string;
  allowedPages: string[];
}

// Map child routes to their parent routes
const PARENT_ROUTES: Record<string, string> = {
  [ROUTES.INVENTORY.PRODUCTS.LIST]: ROUTES.INVENTORY.ROOT,
  [ROUTES.INVENTORY.PRODUCTS.NEW]: ROUTES.INVENTORY.ROOT,
  [ROUTES.INVENTORY.PROMOTIONS]: ROUTES.INVENTORY.ROOT,
  [ROUTES.INVENTORY.PRODUCT_SETS.LIST]: ROUTES.INVENTORY.ROOT,
  [ROUTES.INVENTORY.PRODUCT_SETS.NEW]: ROUTES.INVENTORY.ROOT,
};

export function useAuth() {
  const getDecodedToken = (): JWTPayload | null => {
    const token = getAuthToken();
    if (!token) return null;
    try {
      return jwtDecode<JWTPayload>(token);
    } catch {
      return null;
    }
  };

  const hasAccess = (path: string): boolean => {
    const decoded = getDecodedToken();
    if (!decoded || !decoded.allowedPages) return false;

    // Direct access check
    const hasDirectAccess = decoded.allowedPages.some(allowedPath => {
      const regex = new RegExp(`^${allowedPath.replace('*', '.*')}$`);
      return regex.test(path);
    });

    if (hasDirectAccess) return true;

    // Check if any child routes grant access to this parent route
    if (Object.values(PARENT_ROUTES).includes(path)) {
      return decoded.allowedPages.some(allowedPath => 
        Object.entries(PARENT_ROUTES).some(([childPath, parentPath]) => 
          parentPath === path && allowedPath === childPath
        )
      );
    }

    return false;
  };

  return { hasAccess };
} 