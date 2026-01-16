// Centralized session cookie utilities
const COOKIE_NAME = 'token';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function buildSessionCookie(token: string) {
  const secureFlag = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; Max-Age=${MAX_AGE}; SameSite=Strict${secureFlag}`;
}

export function clearSessionCookie() {
  const secureFlag = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Max-Age=0; SameSite=Strict${secureFlag}`;
}

