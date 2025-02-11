import { jwtDecode } from "jwt-decode";
import { getAuthToken } from '@/lib/auth';

interface JWTPayload {
  sub: string;
  username: string;
  allowedPages: string[];
}

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
    
    return decoded.allowedPages.some(allowedPath => {
      const regex = new RegExp(`^${allowedPath.replace('*', '.*')}$`);
      return regex.test(path);
    });
  };

  return { hasAccess };
} 