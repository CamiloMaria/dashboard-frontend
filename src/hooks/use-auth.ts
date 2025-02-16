import { jwtDecode } from "jwt-decode";
import { getAuthToken } from '@/lib/auth';
import { BASE_PATH } from "@/constants/routes";

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

    const pathWithoutBase = path.replace(BASE_PATH, '');
    return decoded.allowedPages.some(allowedPath => {
      const regex = new RegExp(`^${allowedPath.replace('*', '.*')}$`);
      return regex.test(pathWithoutBase);
    });
  };

  return { hasAccess };
} 