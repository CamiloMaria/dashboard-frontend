import { useState, useEffect } from "react";
import { BASE_PATH } from "@/constants/routes";
import { authApi } from "@/api/auth";

interface UserInfo {
  sub: string;
  username: string;
  allowedPages: string[];
}

export function useAuth() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await authApi.getUser();
        setUserInfo(response.data.user);
      } catch {
        setUserInfo(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const hasAccess = (path: string): boolean => {
    if (!userInfo || !userInfo.allowedPages) return false;

    const pathWithoutBase = path.replace(BASE_PATH, '');
    return userInfo.allowedPages.some(allowedPath => {
      const regex = new RegExp(`^${allowedPath.replace('*', '.*')}$`);
      return regex.test(pathWithoutBase);
    });
  };

  return { hasAccess, userInfo, isLoading };
} 