import { cookies } from 'next/headers';
import crypto from 'crypto';

export const SESSION_COOKIE_NAME = 'map_admin_session';

export type AdminRole = 'admin' | 'editor' | 'coordinator';

export interface AdminSessionUser {
  username: string;
  name: string;
  role: AdminRole;
}

export interface AdminAccount {
  password: string | undefined;
  name: string;
  role: AdminRole;
  description: string;
}

/**
 * Predefined accounts with role-based access control (RBAC).
 * Passwords MUST be set via environment variables — no hardcoded fallbacks.
 * If an env variable is missing, the account is disabled (login will fail).
 */
function getAccounts(): Record<string, AdminAccount> {
  return {
    admin: {
      password: process.env.ADMIN_PASSWORD,
      name: 'Головний адміністратор',
      role: 'admin',
      description: 'Повний доступ до всіх розділів, налаштувань та фінансів',
    },
    map_admin: {
      password: process.env.ADMIN_PASSWORD,
      name: 'Головний адміністратор MAP',
      role: 'admin',
      description: 'Повний доступ до всіх розділів, налаштувань та фінансів',
    },
    editor: {
      password: process.env.EDITOR_PASSWORD,
      name: 'Редактор контенту',
      role: 'editor',
      description: 'Створення та редагування новин, проєктів та команди',
    },
    coordinator: {
      password: process.env.COORDINATOR_PASSWORD,
      name: 'Координатор програм',
      role: 'coordinator',
      description: 'Робота із заявками волонтерів та вхідними зверненнями',
    },
  };
}

function getSecretKey(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'CRITICAL: SESSION_SECRET environment variable is not set. ' +
        'Set a cryptographically strong secret (≥32 characters) before deploying to production.'
      );
    }
    // Development fallback — warn loudly
    console.warn(
      '⚠️  SESSION_SECRET is not set — using insecure development fallback. ' +
      'Set SESSION_SECRET in .env.local for proper security.'
    );
    return 'dev-only-insecure-fallback-key-do-not-use-in-prod';
  }
  return secret;
}

/**
 * Verify username & password credentials and return user object if valid
 */
export function verifyCredentials(username: string, password: string): AdminSessionUser | null {
  if (!username || !password) return null;
  const cleanUsername = username.trim().toLowerCase();
  const accounts = getAccounts();
  const account = accounts[cleanUsername];
  if (!account || !account.password) return null; // Account disabled if no password in env

  try {
    const isMatch = crypto.timingSafeEqual(
      Buffer.from(password),
      Buffer.from(account.password)
    );
    if (isMatch) {
      return {
        username: cleanUsername,
        name: account.name,
        role: account.role,
      };
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Generate a cryptographically secure HMAC-signed session token containing user details
 */
export function generateSessionToken(user: AdminSessionUser): string {
  const secret = getSecretKey();
  const payload = {
    u: user.username,
    n: user.name,
    r: user.role,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', secret)
    .update(payloadStr)
    .digest('base64url');

  return `${payloadStr}.${signature}`;
}

/**
 * Verify incoming signed token and return the user session
 */
export function verifyToken(token: string): AdminSessionUser | null {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadStr, signature] = parts;
  const secret = getSecretKey();

  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(payloadStr)
    .digest('base64url');

  try {
    const isSigValid = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSig)
    );
    if (!isSigValid) return null;

    const payload = JSON.parse(Buffer.from(payloadStr, 'base64url').toString('utf8'));
    if (Date.now() > payload.exp) return null; // Expired

    return {
      username: payload.u,
      name: payload.n,
      role: payload.r as AdminRole,
    };
  } catch {
    return null;
  }
}

/**
 * Get current session user on server side
 */
export async function getAdminSession(): Promise<AdminSessionUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    if (!sessionCookie || !sessionCookie.value) return null;
    return verifyToken(sessionCookie.value);
  } catch (err) {
    console.error('getAdminSession error:', err);
    return null;
  }
}

/**
 * Check admin session on server side, optionally checking allowed roles
 */
export async function verifyAdminSession(allowedRoles?: AdminRole[]): Promise<boolean> {
  const user = await getAdminSession();
  if (!user) return false;
  if (!allowedRoles || allowedRoles.length === 0) return true;
  return allowedRoles.includes(user.role);
}

/**
 * Set session cookie
 */
export async function setAdminSessionCookie(user: AdminSessionUser): Promise<void> {
  const cookieStore = await cookies();
  const token = generateSessionToken(user);
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

/**
 * Clear session cookie
 */
export async function clearAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
