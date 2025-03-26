import { ROUTES } from "@/constants/routes";
import { router } from '@/router'

export function removeAuthSession() {
  // Just a utility function for frontend to call the logout API
  // The actual cookie clearing happens on the backend
  router.navigate({ to: ROUTES.AUTH.LOGIN });
}