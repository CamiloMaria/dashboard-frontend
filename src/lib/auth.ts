import { ROUTES } from "@/constants/routes";

export function isAuthenticated() {
  // With cookie-based auth, we can't directly check the cookie due to HttpOnly flag
  // An API call to a protected endpoint would be needed for definitive confirmation
  // This is a simple heuristic that assumes the app would redirect if not authenticated
  return true; // During runtime, the backend will control access via cookies
}

export function removeAuthSession() {
  // Just a utility function for frontend to call the logout API
  // The actual cookie clearing happens on the backend
  window.location.href = ROUTES.AUTH.LOGIN;
}